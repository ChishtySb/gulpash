import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Limit to 50mb for receipt screenshot uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure data directories exist
const DATA_DIR = path.join(process.cwd(), 'data');
const PROOFS_DIR = path.join(DATA_DIR, 'proofs');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PROOFS_DIR)) {
  fs.mkdirSync(PROOFS_DIR, { recursive: true });
}

// Initial fallback settings if file doesn't exist yet
const DEFAULT_SETTINGS = {
  brandName: 'GulPash',
  tagline: 'Luxury Pakistani Women Fashion & Haute Couture',
  domain: 'gulpash.online',
  logoUrl: '',
  faviconUrl: '',
  contactEmail: 'care@gulpash.online',
  whatsappNumber: '923218489999',
  whatsappDefaultMessage: 'Assalam o Alaikum GulPash, I am inquiring about your luxury collection on gulpash.online',
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

// Helper read/write functions
function readSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed reading settings.json:', err);
  }
  // Initialize file
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
  } catch (e) {}
  return DEFAULT_SETTINGS;
}

function writeSettings(settings: any) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

function readOrders(): any[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed reading orders.json:', err);
  }
  return [];
}

function writeOrders(orders: any[]) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

// Media Assets management
const MEDIA_DIR = path.join(DATA_DIR, 'media');
const MEDIA_FILE = path.join(DATA_DIR, 'media_assets.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

function readMediaAssets(): any[] {
  try {
    if (fs.existsSync(MEDIA_FILE)) {
      return JSON.parse(fs.readFileSync(MEDIA_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

function writeMediaAssets(assets: any[]) {
  try {
    fs.writeFileSync(MEDIA_FILE, JSON.stringify(assets, null, 2), 'utf-8');
  } catch (e) {}
}

function readNotifications(): any[] {
  try {
    if (fs.existsSync(NOTIFICATIONS_FILE)) {
      return JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

function writeNotifications(notifs: any[]) {
  try {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifs.slice(0, 150), null, 2), 'utf-8');
  } catch (e) {}
}

function addServerNotification(item: any) {
  try {
    const list = readNotifications();
    const id = `notif-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newNotif = {
      id,
      ...item,
      timestamp: new Date().toISOString(),
      read: false
    };
    list.unshift(newNotif);
    writeNotifications(list);
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
app.get('/api/settings', (req, res) => {
  const settings = readSettings();
  res.json(settings);
});

app.put('/api/settings', (req, res) => {
  try {
    const current = readSettings();
    const updated = { ...current, ...req.body, updatedAt: new Date().toISOString() };
    writeSettings(updated);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
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
        supabase.from('orders').insert({
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
        }).then(() => {}).catch(() => {});
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

// Payment Proof UPLOAD: Stores file persistently in ./data/proofs/
app.post('/api/payment-proof/upload', (req, res) => {
  try {
    const { data, mimeType } = req.body;
    if (!data) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    let base64Data = data;
    let extension = 'png';

    if (data.startsWith('data:')) {
      const match = data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (match) {
        extension = match[1] === 'jpeg' ? 'jpg' : match[1];
        base64Data = match[2];
      }
    } else if (mimeType) {
      extension = mimeType.includes('jpeg') ? 'jpg' : 'png';
    }

    const proofId = `proof-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const filename = `${proofId}.${extension}`;
    const filePath = path.join(PROOFS_DIR, filename);

    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const proofUrl = `/api/payment-proof/${proofId}`;
    res.json({
      success: true,
      proofId,
      filename,
      url: proofUrl
    });
  } catch (err: any) {
    console.error('Failed saving proof:', err);
    res.status(500).json({ error: 'Failed to save payment proof' });
  }
});

// Payment Proof PRIVACY & ACCESS CONTROL (Req 4)
// Private, authenticated endpoint: No public directory listing!
app.get('/api/payment-proof/:proofId', (req, res) => {
  try {
    const { proofId } = req.params;
    // Prevent path traversal
    if (!/^[a-zA-Z0-9_-]+$/.test(proofId)) {
      return res.status(400).json({ error: 'Invalid proof identifier' });
    }

    // Find file matching proofId
    const files = fs.readdirSync(PROOFS_DIR);
    const matchedFile = files.find(f => f.startsWith(`${proofId}.`));

    if (!matchedFile) {
      return res.status(404).json({ error: 'Payment proof not found' });
    }

    const filePath = path.join(PROOFS_DIR, matchedFile);
    const ext = path.extname(matchedFile).toLowerCase();
    const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';

    // Set privacy and security headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'private, no-transform, max-age=3600');
    
    fs.createReadStream(filePath).pipe(res);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed retrieving payment proof' });
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

    if (data.startsWith('data:')) {
      const match = data.match(/^data:([a-zA-Z0-9/+-]+);base64,(.+)$/);
      if (match) {
        const mime = match[1];
        base64Data = match[2];
        if (mime.includes('png')) extension = 'png';
        else if (mime.includes('webp')) extension = 'webp';
        else if (mime.includes('mp4')) extension = 'mp4';
        else if (mime.includes('webm')) extension = 'webm';
        else extension = 'jpg';
      }
    }

    const cleanBaseName = (fileName || 'media').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const mediaId = `media_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const savedFilename = `${mediaId}_${cleanBaseName}.${extension}`;
    const filePath = path.join(MEDIA_DIR, savedFilename);

    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

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

    const currentAssets = readMediaAssets();
    currentAssets.unshift(asset);
    writeMediaAssets(currentAssets);

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
    const filePath = path.join(MEDIA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Media file not found' });
    }

    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.webm') contentType = 'video/webm';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    fs.createReadStream(filePath).pipe(res);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed serving media' });
  }
});

app.delete('/api/media/:id', (req, res) => {
  try {
    const { id } = req.params;
    const assets = readMediaAssets().filter(a => a.id !== id);
    writeMediaAssets(assets);
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
