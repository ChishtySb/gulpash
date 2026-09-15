import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Supabase backend configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://alzqexevrhcmzcluvatc.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServer = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false }
    })
  : null;

// Limit to 50mb for receipt screenshot uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initial fallback settings if not loaded yet
const DEFAULT_SETTINGS = {
  brandName: 'GulPash',
  tagline: 'Luxury Pakistani Women Fashion & Haute Couture',
  domain: 'gulpash.online',
  logoUrl: '',
  faviconUrl: '',
  contactEmail: 'care@gulpash.online',
  whatsappNumber: '03006392025',
  whatsappDefaultMessage: 'Assalam o Alaikum GulPash, I am inquiring about your luxury collection on gulpash.online',
  whatsappAssistance: {
    enabled: true,
    number: '03006392025',
    destinationNumber: '923006392025',
    displayLabel: 'WhatsApp Assistance',
    defaultMessage: 'Assalam o Alaikum GulPash, I am inquiring about your luxury collection on gulpash.online',
    showFloatingButton: true,
    showInHeader: true,
    showInFooter: true,
    showOnProductPages: true,
    showInOrderAssistance: true
  },
  supportPhone: '+92 42 3578 9922',
  address: 'Flagship Studio: 14-L, Mini Market, Gulberg II, Lahore, Pakistan',
  city: 'Lahore',
  country: 'Pakistan',
  socialLinks: {
    instagram: 'https://instagram.com/gulpash.online',
    facebook: 'https://facebook.com/gulpash.online',
    tiktok: 'https://tiktok.com/@gulpash.online',
    youtube: 'https://youtube.com/@gulpashofficial',
    pinterest: 'https://pinterest.com/gulpashonline'
  },
  shipping: {
    standardFee: 250,
    freeShippingThreshold: 5000,
    freeCodEnabled: false,
    codAnnouncementText: 'FREE NATIONWIDE CASH ON DELIVERY ON ALL ORDERS ABOVE PKR {amount}',
    estimatedDeliveryDays: '2 - 4 Working Days (Nationwide)',
    codEnabled: true,
    bankTransferEnabled: true,
    bankDetails: 'Bank: Meezan Bank Ltd\nAccount Title: GulPash Luxury Apparel\nIBAN: PK45MEZN0001892019283746\nBranch: Gulberg Lahore\n(Please send transfer receipt screenshot to our WhatsApp Concierge)'
  },
  payments: {
    cod: {
      enabled: true
    },
    jazzCash: {
      enabled: true,
      accountTitle: 'GulPash Luxury Apparel',
      accountNumber: '03218489999',
      instructions: 'Please transfer total order amount to our official JazzCash account. Enter the 12-digit TID and upload payment receipt screenshot.'
    },
    easypaisa: {
      enabled: true,
      accountTitle: 'GulPash Luxury Apparel',
      accountNumber: '03218489999',
      instructions: 'Please transfer total order amount to our official Easypaisa account. Enter the TRX ID and upload payment receipt screenshot.'
    },
    bankTransfer: {
      enabled: true,
      bankName: 'Meezan Bank Ltd',
      accountTitle: 'GulPash Luxury Apparel',
      accountNumber: '01082019283746',
      iban: 'PK45MEZN0001892019283746',
      branchName: 'Gulberg Lahore Branch (0108)',
      instructions: 'Transfer through online banking app or ATM. Enter transfer reference number and upload receipt screenshot.'
    }
  },
  seo: {
    siteTitle: 'GulPash | Luxury Pakistani Fashion | Unstitched & Stitched Ensembles',
    metaDescription: 'Shop GulPash for authentic Pakistani luxury women fashion. Unstitched & Stitched collections delivered nationwide with Cash on Delivery.',
    ogImage: ''
  }
};

// ---------------- IN-MEMORY DURABLE RUNTIME STATE ----------------
// Production target: VERCEL RUNTIME FILESYSTEM BUSINESS DATA = ZERO
// All dynamic business data is served from memory and synchronized directly with Supabase Postgres & Storage.
let serverSettings: any = { ...DEFAULT_SETTINGS };
let serverOrders: any[] = [];
let serverProducts: any[] = [];
let serverCollections: any[] = [];
let serverCategories: any[] = [];
let serverCMS: any = null;
let serverMediaAssets: any[] = [];
let serverNotifications: any[] = [];
const serverPaymentProofs = new Map<string, { buffer: Buffer; mimeType: string; extension: string }>();
const serverMediaFiles = new Map<string, { buffer: Buffer; mimeType: string }>();

// Read static baseline catalogues once at startup into memory
try {
  const pPath = path.join(process.cwd(), 'src', 'data', 'migratedProducts.json');
  if (fs.existsSync(pPath)) {
    serverProducts = JSON.parse(fs.readFileSync(pPath, 'utf-8'));
  }
} catch (e) {}

try {
  const cPath = path.join(process.cwd(), 'src', 'data', 'migratedCollections.json');
  if (fs.existsSync(cPath)) {
    serverCollections = JSON.parse(fs.readFileSync(cPath, 'utf-8'));
  }
} catch (e) {}

try {
  const catPath = path.join(process.cwd(), 'src', 'data', 'migratedCategories.json');
  if (fs.existsSync(catPath)) {
    serverCategories = JSON.parse(fs.readFileSync(catPath, 'utf-8'));
  }
} catch (e) {}

// Hydrate from Supabase Postgres on boot (Supabase as Canonical Source of Truth)
if (supabaseServer) {
  (async () => {
    try {
      const { data: dbSettings } = await supabaseServer.from('site_settings').select('*').eq('setting_key', 'general_settings').single();
      if (dbSettings?.setting_value) {
        serverSettings = { ...serverSettings, ...dbSettings.setting_value };
      }
    } catch (e) {}

    try {
      const { data: dbProducts } = await supabaseServer.from('products').select('*, product_variants(*), product_images(*)');
      if (dbProducts && dbProducts.length > 0) {
        serverProducts = dbProducts.map((p: any) => {
          const sortedImgs = (p.product_images || []).sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0));
          const images = sortedImgs.map((img: any) => img.image_url);
          const variants = (p.product_variants || []).sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
          return {
            id: p.id,
            title: p.title,
            slug: p.slug,
            description: p.description,
            shortDescription: p.short_description,
            sku: p.sku,
            category: p.category_name,
            categoryId: p.category_id,
            collection: p.collection_name,
            collectionId: p.collection_id,
            price: Number(p.price),
            compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : null,
            costPrice: p.cost_price ? Number(p.cost_price) : undefined,
            stock: Number(p.stock),
            sizes: p.sizes || ['Unstitched', 'S', 'M', 'L', 'XL'],
            fabric: p.fabric,
            colors: p.colors || [],
            tags: p.tags || [],
            images: images.length > 0 ? images : ['https://cdn.shopify.com/s/files/1/0935/5368/8891/files/17_22ba13c3-6eda-4dde-a515-e01030c718f6.png?v=1787217341'],
            variants: variants.map((v: any) => ({
              id: v.id,
              title: v.title,
              size: v.size,
              color: v.color,
              fabric: v.fabric,
              sku: v.sku,
              price: Number(v.price),
              compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : null,
              available: v.available,
              stock: Number(v.stock),
              position: v.position
            })),
            status: p.is_visible ? 'Active' : 'Archived',
            isVisible: p.is_visible,
            isFeatured: p.is_featured,
            isBestSeller: p.is_best_seller,
            isNewArrival: p.is_new_arrival,
            isSoldOut: p.is_sold_out,
            rating: Number(p.rating) || 5,
            reviewCount: Number(p.review_count) || 0,
            details: p.details || {},
            createdAt: p.created_at,
            updatedAt: p.updated_at
          };
        });
        console.log(`[Supabase Boot] Loaded & mapped ${serverProducts.length} products from Supabase Postgres`);
      }
    } catch (e) {}

    try {
      const { data: dbCollections } = await supabaseServer.from('collections').select('*').order('display_order', { ascending: true });
      if (dbCollections && dbCollections.length > 0) {
        serverCollections = dbCollections.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || '',
          imageUrl: c.image_url || '',
          bannerUrl: c.banner_url || '',
          displayOrder: c.display_order,
          isVisible: c.is_visible
        }));
      }
    } catch (e) {}

    try {
      const { data: dbCategories } = await supabaseServer.from('categories').select('*').order('display_order', { ascending: true });
      if (dbCategories && dbCategories.length > 0) {
        serverCategories = dbCategories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description || '',
          imageUrl: cat.image_url || '',
          displayOrder: cat.display_order,
          isVisible: cat.is_visible
        }));
      }
    } catch (e) {}

    try {
      const { data: dbOrders } = await supabaseServer.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
      if (dbOrders && dbOrders.length > 0) {
        serverOrders = dbOrders.map((o: any) => ({
          id: o.id,
          orderNumber: o.order_number,
          customer: {
            fullName: o.customer_name,
            email: o.customer_email,
            phone: o.customer_phone,
            whatsapp: o.customer_whatsapp,
            address: o.address,
            apartment: o.apartment,
            city: o.city,
            province: o.province,
            postalCode: o.postal_code
          },
          items: (o.order_items || []).map((it: any) => ({
            productId: it.product_id,
            productTitle: it.product_title,
            size: it.size,
            color: it.color,
            quantity: it.quantity,
            price: Number(it.price),
            subtotal: Number(it.subtotal),
            sku: it.sku,
            imageUrl: it.image_url
          })),
          subtotal: Number(o.subtotal),
          shippingFee: Number(o.shipping_fee),
          discount: Number(o.discount || 0),
          total: Number(o.total),
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          status: o.order_status,
          createdAt: o.created_at,
          updatedAt: o.updated_at
        }));
      }
    } catch (e) {}
  })();
}

function readSettings() {
  return serverSettings;
}

function writeSettings(settings: any) {
  serverSettings = { ...serverSettings, ...settings };
  if (supabaseServer) {
    Promise.resolve(supabaseServer.from('site_settings').upsert({
      setting_key: 'general_settings',
      setting_value: serverSettings,
      updated_at: new Date().toISOString()
    })).catch((err: any) => console.warn('Supabase settings sync error:', err?.message));
  }
}

function readOrders(): any[] {
  return serverOrders;
}

function writeOrders(orders: any[]) {
  serverOrders = orders;
}

function readProducts(): any[] {
  return serverProducts;
}

function writeProducts(products: any[]) {
  serverProducts = products;
}

function readCollections(): any[] {
  return serverCollections;
}

function writeCollections(collections: any[]) {
  serverCollections = collections;
}

function readCategories(): any[] {
  return serverCategories;
}

function writeCategories(categories: any[]) {
  serverCategories = categories;
}

function readCMS(): any {
  return serverCMS;
}

function writeCMS(cms: any) {
  serverCMS = cms;
}

function readMediaAssets(): any[] {
  return serverMediaAssets;
}

function writeMediaAssets(assets: any[]) {
  serverMediaAssets = assets;
}

function readNotifications(): any[] {
  return serverNotifications;
}

function writeNotifications(notifs: any[]) {
  serverNotifications = notifs.slice(0, 150);
}

function addServerNotification(item: any) {
  try {
    const id = `notif-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newNotif = {
      id,
      ...item,
      timestamp: new Date().toISOString(),
      read: false
    };
    serverNotifications.unshift(newNotif);
    if (serverNotifications.length > 150) {
      serverNotifications = serverNotifications.slice(0, 150);
    }
    return newNotif;
  } catch (e) {
    return null;
  }
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Settings: Store-wide persistent settings
app.get('/api/settings', async (req, res) => {
  const settings = readSettings();
  // Ensure legacy numbers are replaced
  if (!settings.whatsappNumber || settings.whatsappNumber.includes('8489999')) {
    settings.whatsappNumber = '03006392025';
  }
  if (!settings.whatsappAssistance) {
    settings.whatsappAssistance = {
      enabled: true,
      number: '03006392025',
      destinationNumber: '923006392025',
      displayLabel: 'WhatsApp Assistance',
      defaultMessage: settings.whatsappDefaultMessage || 'Assalam o Alaikum GulPash, I am inquiring about your luxury collection on gulpash.online',
      showFloatingButton: true,
      showInHeader: true,
      showInFooter: true,
      showOnProductPages: true,
      showInOrderAssistance: true
    };
  }

  res.json(settings);
});

app.put('/api/settings', (req, res) => {
  try {
    const current = readSettings();
    const updated = { ...current, ...req.body, updatedAt: new Date().toISOString() };
    
    // Normalization of WhatsApp number
    if (updated.whatsappAssistance?.number) {
      const cleanDigits = updated.whatsappAssistance.number.replace(/\D/g, '');
      let dest = cleanDigits;
      if (cleanDigits.startsWith('03') && cleanDigits.length === 11) {
        dest = '92' + cleanDigits.slice(1);
      } else if (cleanDigits.startsWith('9203') && cleanDigits.length === 13) {
        dest = '92' + cleanDigits.slice(3);
      } else if (cleanDigits.startsWith('3') && cleanDigits.length === 10) {
        dest = '92' + cleanDigits;
      }
      updated.whatsappAssistance.destinationNumber = dest;
    }

    writeSettings(updated);

    // Asynchronously synchronize with Supabase site_settings
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://alzqexevrhcmzcluvatc.supabase.co';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    if (supabaseKey && updated.whatsappAssistance) {
      import('@supabase/supabase-js').then(({ createClient }) => {
        const supabase = createClient(supabaseUrl, supabaseKey);
        Promise.resolve(supabase.from('site_settings').upsert({
          setting_key: 'whatsapp_assistance',
          setting_value: updated.whatsappAssistance,
          updated_at: new Date().toISOString()
        }, { onConflict: 'setting_key' })).catch(() => {});
      }).catch(() => {});
    }

    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Products: Authoritative GulPash Anabya Catalog
app.get('/api/products', (req, res) => {
  try {
    const list = readProducts();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const products = readProducts();
    const product = req.body;
    if (!product.id) {
      product.id = `gp-${Date.now()}`;
    }
    product.createdAt = product.createdAt || new Date().toISOString();
    product.updatedAt = new Date().toISOString();
    
    products.unshift(product);
    writeProducts(products);
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const products = readProducts();
    const idx = products.findIndex((p: any) => p.id === id);
    if (idx >= 0) {
      products[idx] = { ...products[idx], ...req.body, updatedAt: new Date().toISOString() };
      writeProducts(products);
      res.json({ success: true, product: products[idx] });
    } else {
      const newProduct = { ...req.body, id, updatedAt: new Date().toISOString() };
      products.unshift(newProduct);
      writeProducts(products);
      res.json({ success: true, product: newProduct });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const hard = req.query.hard === 'true';
    let products = readProducts();
    if (hard) {
      products = products.filter((p: any) => p.id !== id);
    } else {
      products = products.map((p: any) => p.id === id ? { ...p, isVisible: false, status: 'Archived', updatedAt: new Date().toISOString() } : p);
    }
    writeProducts(products);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Categories API
app.get('/api/categories', (req, res) => {
  try {
    const categories = readCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories', (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      writeCategories(req.body);
      res.json({ success: true, categories: req.body });
    } else {
      res.status(400).json({ error: 'Expected array of categories' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Collections API
app.get('/api/collections', (req, res) => {
  try {
    const collections = readCollections();
    res.json(collections);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/collections', (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      writeCollections(req.body);
      res.json({ success: true, collections: req.body });
    } else {
      res.status(400).json({ error: 'Expected array of collections' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/collections/:id', (req, res) => {
  try {
    const { id } = req.params;
    const collections = readCollections();
    const idx = collections.findIndex((c: any) => c.id === id);
    if (idx >= 0) {
      collections[idx] = { ...collections[idx], ...req.body, updatedAt: new Date().toISOString() };
      writeCollections(collections);
      res.json({ success: true, collection: collections[idx] });
    } else {
      res.status(404).json({ error: 'Collection not found' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// CMS API
app.get('/api/cms', (req, res) => {
  try {
    const cms = readCMS();
    res.json(cms || {});
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/cms', (req, res) => {
  try {
    writeCMS(req.body);
    res.json({ success: true, cms: req.body });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Orders: Store-wide persistent orders with authoritative shipping calculation
app.get('/api/orders', (req, res) => {
  const orders = readOrders();
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  try {
    const orders = readOrders();
    const newOrder = req.body;
    if (!newOrder.id) {
      newOrder.id = `ord-${Date.now()}`;
    }

    // Authoritative Server-Side Shipping & Advance Payment Free Delivery Calculation (Req 35-44)
    const settings = readSettings();
    const subtotal = Number(newOrder.subtotal) || 0;
    const standardFee = Number(settings.shipping?.standardFee) || 250;
    const freeShippingThreshold = Number(settings.shipping?.freeShippingThreshold) || 5000;
    const freeCodEnabled = settings.shipping?.freeCodEnabled === true;
    const advanceOffer = settings.shipping?.advanceFreeDelivery;

    const eligibleAdvanceMethods = advanceOffer?.eligiblePaymentMethods || ['JazzCash', 'Easypaisa', 'Direct Bank Transfer'];
    const isEligibleAdvanceMethod = eligibleAdvanceMethods.includes(newOrder.paymentMethod);
    const minAdvanceAmount = Number(advanceOffer?.minimumOrderAmount) || 0;
    const qualifiesForAdvanceFree = (advanceOffer?.enabled !== false) && isEligibleAdvanceMethod && (subtotal >= minAdvanceAmount);
    const qualifiesForCodFree = freeCodEnabled && (subtotal >= freeShippingThreshold);

    if (qualifiesForAdvanceFree) {
      newOrder.shippingFee = 0;
      newOrder.shippingDiscount = standardFee;
      newOrder.shippingDiscountReason = 'FULL_ADVANCE_PAYMENT';
      newOrder.paymentType = 'Full Advance';
    } else if (qualifiesForCodFree) {
      newOrder.shippingFee = 0;
      newOrder.shippingDiscount = standardFee;
      newOrder.shippingDiscountReason = 'FREE_SHIPPING_THRESHOLD';
      newOrder.paymentType = isEligibleAdvanceMethod ? 'Full Advance' : 'Cash on Delivery';
    } else {
      newOrder.shippingFee = standardFee;
      newOrder.shippingDiscount = 0;
      newOrder.paymentType = isEligibleAdvanceMethod ? 'Full Advance' : 'Cash on Delivery';
    }

    const discount = Number(newOrder.discount) || 0;
    newOrder.total = Math.max(0, subtotal + newOrder.shippingFee - discount);

    const idx = orders.findIndex(o => o.id === newOrder.id || o.orderNumber === newOrder.orderNumber);
    if (idx >= 0) {
      orders[idx] = { ...orders[idx], ...newOrder, updatedAt: new Date().toISOString() };
    } else {
      orders.unshift({
        ...newOrder,
        createdAt: newOrder.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      // Notify admin of new order
      addServerNotification({
        type: 'NEW_ORDER',
        title: `New Order Placed: #${newOrder.orderNumber}`,
        message: `${newOrder.customer?.fullName || 'Customer'} ordered ${newOrder.items?.length || 1} item(s) totaling PKR ${newOrder.total.toLocaleString()} via ${newOrder.paymentMethod}.`,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        orderTotal: newOrder.total,
        customerName: newOrder.customer?.fullName,
        paymentMethod: newOrder.paymentMethod
      });
    }
    writeOrders(orders);

    // Synchronize asynchronously with Supabase Postgres
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://alzqexevrhcmzcluvatc.supabase.co';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    if (supabaseKey) {
      import('@supabase/supabase-js').then(({ createClient }) => {
        const supabase = createClient(supabaseUrl, supabaseKey);
        Promise.resolve(supabase.from('orders').insert({
          order_number: newOrder.orderNumber,
          customer_name: newOrder.customer?.fullName || 'Customer',
          customer_email: newOrder.customer?.email || 'care@gulpash.online',
          customer_phone: newOrder.customer?.phone || '',
          address: newOrder.customer?.address || '',
          city: newOrder.customer?.city || 'Pakistan',
          province: newOrder.customer?.province || 'Punjab',
          subtotal: newOrder.subtotal,
          shipping_fee: newOrder.shippingFee,
          total: newOrder.total,
          payment_method: newOrder.paymentMethod,
          payment_status: newOrder.paymentStatus || 'Unpaid',
          order_status: newOrder.status || 'Pending'
        })).catch(() => {});
      }).catch(() => {});
    }

    res.json({ success: true, order: idx >= 0 ? orders[idx] : orders[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Order status update (e.g. Cancel Order, Confirmed, Shipped, Delivered)
app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const orders = readOrders();
    const idx = orders.findIndex(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    orders[idx].status = status;
    orders[idx].updatedAt = new Date().toISOString();
    writeOrders(orders);
    res.json({ success: true, order: orders[idx] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Payment Proof: VERIFY payment
app.put('/api/orders/:id/verify', (req, res) => {
  try {
    const { verifiedBy } = req.body;
    const orders = readOrders();
    const idx = orders.findIndex(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    orders[idx].status = 'Ready to Dispatch';
    orders[idx].paymentStatus = 'Paid';
    orders[idx].paymentProof = {
      ...(orders[idx].paymentProof || {}),
      verifiedAt: new Date().toISOString(),
      verifiedBy: verifiedBy || 'Admin Concierge',
      rejectionReason: undefined
    };
    orders[idx].updatedAt = new Date().toISOString();
    writeOrders(orders);

    addServerNotification({
      type: 'PAYMENT_VERIFIED',
      title: `Payment Verified: #${orders[idx].orderNumber}`,
      message: `Payment confirmed by ${verifiedBy || 'Admin'}. Order marked Ready to Dispatch.`,
      orderId: orders[idx].id,
      orderNumber: orders[idx].orderNumber,
      orderTotal: orders[idx].total,
      customerName: orders[idx].customer?.fullName,
      paymentMethod: orders[idx].paymentMethod
    });

    res.json({ success: true, order: orders[idx] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Payment Proof: REJECT payment (Order remains ACTIVE with 'Payment Action Required' - Req 1)
app.put('/api/orders/:id/reject', (req, res) => {
  try {
    const { reason } = req.body;
    const orders = readOrders();
    const idx = orders.findIndex(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    // KEEP ORDER ACTIVE! Status moves to 'Payment Action Required'
    orders[idx].status = 'Payment Action Required';
    orders[idx].paymentStatus = 'Rejected';
    orders[idx].paymentProof = {
      ...(orders[idx].paymentProof || {}),
      rejectionReason: reason || 'Payment could not be verified'
    };
    orders[idx].updatedAt = new Date().toISOString();
    writeOrders(orders);

    addServerNotification({
      type: 'PAYMENT_ACTION_REQUIRED',
      title: `Payment Action Required: #${orders[idx].orderNumber}`,
      message: `Proof rejected: "${reason || 'Payment could not be verified'}". Order remains active.`,
      orderId: orders[idx].id,
      orderNumber: orders[idx].orderNumber,
      orderTotal: orders[idx].total,
      customerName: orders[idx].customer?.fullName,
      paymentMethod: orders[idx].paymentMethod
    });

    res.json({ success: true, order: orders[idx] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Payment Proof: RESUBMIT / ATTACH payment proof (Req 2 & 9)
app.put('/api/orders/:id/proof', (req, res) => {
  try {
    const { screenshotUrl, transactionReference } = req.body;
    const orders = readOrders();
    const idx = orders.findIndex(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const hadProof = !!orders[idx].paymentProof?.submittedAt;
    orders[idx].paymentProof = {
      ...(orders[idx].paymentProof || {}),
      screenshotUrl: screenshotUrl || orders[idx].paymentProof?.screenshotUrl,
      transactionReference: transactionReference || orders[idx].paymentProof?.transactionReference,
      submittedAt: new Date().toISOString(),
      rejectionReason: undefined
    };
    orders[idx].paymentStatus = 'Under Verification';
    orders[idx].status = 'Payment Verification Pending';
    orders[idx].updatedAt = new Date().toISOString();
    writeOrders(orders);

    addServerNotification({
      type: hadProof ? 'PAYMENT_PROOF_RESUBMITTED' : 'NEW_PAYMENT_PROOF',
      title: hadProof ? `Proof Resubmitted: #${orders[idx].orderNumber}` : `New Payment Receipt: #${orders[idx].orderNumber}`,
      message: `TID: ${transactionReference || 'Attached'}. Ready for merchant review.`,
      orderId: orders[idx].id,
      orderNumber: orders[idx].orderNumber,
      orderTotal: orders[idx].total,
      customerName: orders[idx].customer?.fullName,
      paymentMethod: orders[idx].paymentMethod
    });

    res.json({ success: true, order: orders[idx] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Payment Proof UPLOAD: Direct upload to Supabase Storage private bucket 'payment-proofs' + in-memory store (ZERO filesystem writes)
app.post('/api/payment-proof/upload', async (req, res) => {
  try {
    const { data, mimeType, orderNumber } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    let base64Data = data;
    let extension = 'png';
    let detectedMime = mimeType || 'image/png';

    if (data.startsWith('data:')) {
      const match = data.match(/^data:([a-zA-Z0-9/+-]+);base64,(.+)$/);
      if (match) {
        detectedMime = match[1];
        extension = detectedMime.includes('jpeg') ? 'jpg' : detectedMime.includes('png') ? 'png' : 'jpg';
        base64Data = match[2];
      }
    }

    const proofBuffer = Buffer.from(base64Data, 'base64');
    const proofId = `proof-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const filename = `${proofId}.${extension}`;
    const objectPath = `proofs/${(orderNumber || 'order').replace(/[^a-zA-Z0-9_-]/g, '_')}_${filename}`;

    // Store in-memory map for fast ephemeral retrieval (Zero filesystem writes)
    serverPaymentProofs.set(proofId, { buffer: proofBuffer, mimeType: detectedMime, extension });

    let storagePath = objectPath;
    let signedUrl = `/api/payment-proof/${proofId}`;

    // Upload directly to Supabase Storage private bucket 'payment-proofs'
    if (supabaseServer) {
      try {
        const { data: uploadData, error: uploadErr } = await supabaseServer.storage
          .from('payment-proofs')
          .upload(objectPath, proofBuffer, {
            contentType: detectedMime,
            cacheControl: '3600',
            upsert: true
          });

        if (!uploadErr && uploadData) {
          storagePath = uploadData.path;
          const { data: signedData } = await supabaseServer.storage
            .from('payment-proofs')
            .createSignedUrl(uploadData.path, 3600);
          if (signedData?.signedUrl) {
            signedUrl = signedData.signedUrl;
          }
          console.log('Payment proof uploaded to Supabase Storage payment-proofs:', storagePath);
        } else {
          console.warn('Supabase storage upload fallback:', uploadErr?.message);
        }
      } catch (err: any) {
        console.warn('Supabase storage upload error:', err?.message);
      }
    }

    res.json({
      success: true,
      proofId,
      filename,
      storagePath,
      bucket: 'payment-proofs',
      url: signedUrl
    });
  } catch (err: any) {
    console.error('Failed saving payment proof:', err);
    res.status(500).json({ error: 'Failed to process payment proof' });
  }
});

// Payment Proof PRIVACY & ACCESS CONTROL
// Serves from in-memory store or creates fresh signed URL from Supabase Storage
app.get('/api/payment-proof/:proofId', async (req, res) => {
  try {
    const { proofId } = req.params;
    if (!/^[a-zA-Z0-9_-]+$/.test(proofId)) {
      return res.status(400).json({ error: 'Invalid proof identifier' });
    }

    const proof = serverPaymentProofs.get(proofId);
    if (proof) {
      res.setHeader('Content-Type', proof.mimeType);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'private, no-transform, max-age=3600');
      return res.end(proof.buffer);
    }

    // Attempt retrieval from Supabase Storage if not in memory
    if (supabaseServer) {
      try {
        const { data: listData } = await supabaseServer.storage.from('payment-proofs').list('proofs');
        const match = listData?.find(f => f.name.includes(proofId));
        if (match) {
          const { data: signedData } = await supabaseServer.storage.from('payment-proofs').createSignedUrl(`proofs/${match.name}`, 300);
          if (signedData?.signedUrl) {
            return res.redirect(signedData.signedUrl);
          }
        }
      } catch (e) {}
    }

    return res.status(404).json({ error: 'Payment proof not found or expired' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed retrieving payment proof' });
  }
});

// Payment Proof signed-url endpoint for admin viewers
app.post('/api/payment-proof/signed-url', async (req, res) => {
  try {
    const { storagePath, expiresIn = 3600 } = req.body;
    if (!storagePath) {
      return res.status(400).json({ error: 'Missing storagePath' });
    }
    if (supabaseServer) {
      const cleanPath = storagePath.replace(/^payment-proofs:/, '');
      const { data, error } = await supabaseServer.storage
        .from('payment-proofs')
        .createSignedUrl(cleanPath, expiresIn);
      if (!error && data?.signedUrl) {
        return res.json({ success: true, signedUrl: data.signedUrl });
      }
    }
    return res.status(404).json({ error: 'Could not generate signed URL' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- MEDIA LIBRARY ENDPOINTS (Req 9) ----------------
app.get('/api/media/list', (req, res) => {
  const assets = readMediaAssets();
  res.json(assets);
});

app.post('/api/media/upload', (req, res) => {
  try {
    const { data, fileName, category, usedIn, dimensions, aspectRatio, fileSize, mediaType } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'No media data provided' });
    }

    let base64Data = data;
    let extension = mediaType === 'video' ? 'mp4' : 'jpg';
    let detectedMime = 'image/jpeg';

    if (data.startsWith('data:')) {
      const match = data.match(/^data:([a-zA-Z0-9/+-]+);base64,(.+)$/);
      if (match) {
        detectedMime = match[1];
        base64Data = match[2];
        if (detectedMime.includes('png')) extension = 'png';
        else if (detectedMime.includes('webp')) extension = 'webp';
        else if (detectedMime.includes('mp4')) extension = 'mp4';
        else if (detectedMime.includes('webm')) extension = 'webm';
        else extension = 'jpg';
      }
    }

    const cleanBaseName = (fileName || 'media').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const mediaId = `media_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const savedFilename = `${mediaId}_${cleanBaseName}.${extension}`;

    // Store in-memory map (Zero filesystem writes)
    serverMediaFiles.set(savedFilename, { buffer: Buffer.from(base64Data, 'base64'), mimeType: detectedMime });

    const publicUrl = `/api/media/uploads/${savedFilename}`;
    const isVid = mediaType === 'video' || extension === 'mp4' || extension === 'webm';
    const asset = {
      id: mediaId,
      url: publicUrl,
      fileName: fileName || savedFilename,
      dimensions: dimensions || (isVid ? '1080 × 1350 px' : '1200 × 1500 px'),
      aspectRatio: aspectRatio || (isVid ? '4:5' : '4:5'),
      fileSize: fileSize || `${Math.round(base64Data.length * 0.75 / 1024)} KB`,
      uploadedAt: new Date().toISOString(),
      mediaType: isVid ? 'video' : 'image',
      category: category || (isVid ? 'product-video' : 'product-image'),
      usedIn: Array.isArray(usedIn) ? usedIn : []
    };

    serverMediaAssets.unshift(asset);
    res.json({ success: true, url: publicUrl, asset });
  } catch (err: any) {
    console.error('Failed media upload:', err);
    res.status(500).json({ error: 'Failed to upload media asset' });
  }
});

app.get('/api/media/uploads/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    if (!/^[a-zA-Z0-9_.-]+$/.test(filename)) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    const item = serverMediaFiles.get(filename);
    if (!item) {
      return res.status(404).json({ error: 'Media file not found' });
    }

    res.setHeader('Content-Type', item.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.end(item.buffer);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed serving media' });
  }
});

app.delete('/api/media/:id', (req, res) => {
  try {
    const { id } = req.params;
    serverMediaAssets = serverMediaAssets.filter(a => a.id !== id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- NOTIFICATIONS ENDPOINTS (Req 26-34) ----------------
app.get('/api/notifications', (req, res) => {
  const notifs = readNotifications();
  res.json(notifs);
});

app.post('/api/notifications', (req, res) => {
  try {
    const created = addServerNotification(req.body);
    res.json({ success: true, notification: created });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/:id/read', (req, res) => {
  try {
    const notifs = readNotifications().map(n => n.id === req.params.id ? { ...n, read: true } : n);
    writeNotifications(notifs);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notifications/read-all', (req, res) => {
  try {
    const notifs = readNotifications().map(n => ({ ...n, read: true }));
    writeNotifications(notifs);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- DEV & PROD SETUP ----------------
async function start() {
  // Direct local product image serving
  app.use('/products', express.static(path.join(process.cwd(), 'public', 'products')));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`GulPash Server running on http://${HOST}:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
});
