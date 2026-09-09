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

// Orders: Store-wide persistent orders
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
    const idx = orders.findIndex(o => o.id === newOrder.id || o.orderNumber === newOrder.orderNumber);
    if (idx >= 0) {
      orders[idx] = { ...orders[idx], ...newOrder, updatedAt: new Date().toISOString() };
    } else {
      orders.unshift({
        ...newOrder,
        createdAt: newOrder.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    writeOrders(orders);
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
