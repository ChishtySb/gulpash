import { 
  Product, Category, Collection, Order, OrderStatus, OrderPaymentProof, HomepageCMS, SiteSettings, 
  CartItem, Review, CustomerSummary, MediaAsset 
} from '../types';
import { 
  INITIAL_CATEGORIES, INITIAL_COLLECTIONS, INITIAL_PRODUCTS, 
  INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_CMS, INITIAL_SETTINGS 
} from '../data/initialData';
import { NotificationService } from './notifications';
import { 
  resolveWhatsAppSettings, 
  syncWhatsAppToSupabase, 
  fetchWhatsAppFromSupabase,
  DEFAULT_WHATSAPP_NUMBER_VISIBLE 
} from './whatsapp';

const KEYS = {
  PRODUCTS: 'gulpash_products_v4_anabya',
  CATEGORIES: 'gulpash_categories_v3_anabya',
  COLLECTIONS: 'gulpash_collections_v5_anabya',
  ORDERS: 'gulpash_orders_v2_migrated',
  REVIEWS: 'gulpash_reviews_v2_migrated',
  CMS: 'gulpash_cms_v2_migrated',
  SETTINGS: 'gulpash_settings_v2_migrated',
  MEDIA_ASSETS: 'gulpash_media_assets_v1',
  CART: 'gulpash_cart_v2',
  WISHLIST: 'gulpash_wishlist_v2',
  ADMIN_AUTH: 'gulpash_admin_auth_v2',
  CURRENCY: 'gulpash_currency_v2'
};

// Dispatch storage change event for components listening
const notifyChange = (key: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gulpash_data_changed', { detail: { key } }));
  }
};

export const StorageService = {
  // PRODUCTS
  getProducts(includeHidden = false): Product[] {
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      let list: Product[] = data ? JSON.parse(data) : INITIAL_PRODUCTS;
      
      // Auto-heal if older dummy data exists or catalog size doesn't match migrated size
      if (!list || list.length !== 38 || list.some(p => p.id === 'gp-001' || p.sku?.startsWith('TAW-') || p.sku?.includes('10523493630267'))) {
        list = INITIAL_PRODUCTS;
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(list));
      }

      return includeHidden ? list : list.filter(p => p.isVisible);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts(true);
    return products.find(p => p.slug === slug);
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts(true);
    return products.find(p => p.id === id);
  },

  saveProduct(product: Product): void {
    const products = this.getProducts(true);
    const existingIndex = products.findIndex(p => p.id === product.id);
    
    if (existingIndex >= 0) {
      products[existingIndex] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      products.unshift({
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    notifyChange('products');
    this.syncCollectionsWithProducts();
  },

  deleteProduct(id: string, softDelete = true): void {
    const products = this.getProducts(true);
    if (softDelete) {
      const updated = products.map(p => p.id === id ? { ...p, isVisible: false } : p);
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
    } else {
      const filtered = products.filter(p => p.id !== id);
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(filtered));
    }
    notifyChange('products');
  },

  duplicateProduct(id: string): Product | null {
    const products = this.getProducts(true);
    const original = products.find(p => p.id === id);
    if (!original) return null;

    const newId = `gp-${Date.now()}`;
    const randSuffix = Math.floor(100 + Math.random() * 900);
    const newSlug = `${original.slug}-copy-${randSuffix}`;
    const newSku = original.sku ? `${original.sku}-COPY-${randSuffix}` : `GP-COPY-${randSuffix}`;

    const duplicated: Product = {
      ...JSON.parse(JSON.stringify(original)),
      id: newId,
      title: `${original.title} (Copy)`,
      slug: newSlug,
      sku: newSku,
      status: 'Draft',
      isVisible: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveProduct(duplicated);
    return duplicated;
  },

  bulkUpdateProductStatus(productIds: string[], status: 'Draft' | 'Active' | 'Archived', isVisible?: boolean): void {
    const products = this.getProducts(true);
    const updated = products.map(p => {
      if (productIds.includes(p.id)) {
        return {
          ...p,
          status,
          isVisible: isVisible !== undefined ? isVisible : (status === 'Active'),
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
    notifyChange('products');
    this.syncCollectionsWithProducts();
  },

  bulkUpdateCollections(productIds: string[], addCollectionSlugs: string[], removeCollectionSlugs: string[] = []): void {
    const products = this.getProducts(true);
    const allCollections = this.getCollections();
    
    // Map slugs to names
    const slugToNameMap: Record<string, string> = {};
    allCollections.forEach(c => {
      slugToNameMap[c.slug] = c.name;
    });

    const updated = products.map(p => {
      if (!productIds.includes(p.id)) return p;

      let currentNames = Array.isArray(p.collectionNames) ? [...p.collectionNames] : [];
      let currentTags = Array.isArray(p.tags) ? [...p.tags] : [];

      // Add
      addCollectionSlugs.forEach(slug => {
        const name = slugToNameMap[slug] || slug.toUpperCase();
        if (!currentNames.includes(name)) currentNames.push(name);
        if (!currentTags.includes(slug)) currentTags.push(slug);
      });

      // Remove
      removeCollectionSlugs.forEach(slug => {
        const name = slugToNameMap[slug] || slug.toUpperCase();
        currentNames = currentNames.filter(n => n !== name);
        currentTags = currentTags.filter(t => t !== slug);
      });

      return {
        ...p,
        collectionNames: currentNames,
        tags: currentTags,
        updatedAt: new Date().toISOString()
      };
    });

    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
    notifyChange('products');
    this.syncCollectionsWithProducts();
  },

  // CATEGORIES
  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(KEYS.CATEGORIES);
      let list: Category[] = data ? JSON.parse(data) : INITIAL_CATEGORIES;
      // Auto-heal if older dummy data exists, categories count doesn't match 5, imageUrl is missing, or legacy mock categories exist
      if (
        !list || 
        list.length !== 5 || 
        list.some(c => (!c.imageUrl && !c.image) || c.name === 'Ready to Wear' || c.name === 'Lawn' || c.name === 'Shawls')
      ) {
        list = INITIAL_CATEGORIES;
        localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(list));
      } else {
        // Ensure visibleInNav and visibleOnHomepage exist
        let changed = false;
        list = list.map(c => {
          if (c.visibleInNav === undefined || c.visibleOnHomepage === undefined) {
            changed = true;
            return {
              ...c,
              visibleInNav: c.visibleInNav !== undefined ? c.visibleInNav : (c.slug === 'unstitched-stitched' || c.slug === 'stitched'),
              visibleOnHomepage: c.visibleOnHomepage !== undefined ? c.visibleOnHomepage : (c.slug === 'unstitched-stitched' || c.slug === 'stitched')
            };
          }
          return c;
        });
        if (changed) {
          localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(list));
        }
      }
      return list;
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategories(categories: Category[]): void {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    notifyChange('categories');
  },

  saveCategory(category: Category): void {
    const categories = this.getCategories();
    const idx = categories.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      categories[idx] = category;
    } else {
      categories.push(category);
    }
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    notifyChange('categories');
  },

  deleteCategory(id: string): void {
    const categories = this.getCategories().filter(c => c.id !== id);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    notifyChange('categories');
  },

  // COLLECTIONS
  getCollections(): Collection[] {
    try {
      const data = localStorage.getItem(KEYS.COLLECTIONS);
      let list: Collection[] = data ? JSON.parse(data) : INITIAL_COLLECTIONS;
      const requiredSlugs = ['new-arrivals', 'best-selling', 'winter-collection', 'co-ords', 'short-length-article', 'all'];
      // Auto-heal if collections count doesn't match 6 or slugs/images don't align with reference
      if (
        !list || 
        list.length !== 6 || 
        !requiredSlugs.every(slug => list.some(c => c.slug === slug)) ||
        list.some(c => (!c.imageUrl && !c.image))
      ) {
        list = INITIAL_COLLECTIONS;
        localStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(list));
      }
      return list;
    } catch {
      return INITIAL_COLLECTIONS;
    }
  },

  saveCollection(col: Collection): void {
    const collections = this.getCollections();
    const idx = collections.findIndex(c => c.id === col.id);
    if (idx >= 0) {
      collections[idx] = col;
    } else {
      collections.push(col);
    }
    localStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(collections));
    notifyChange('collections');
  },

  saveCollections(collections: Collection[]): void {
    localStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(collections));
    notifyChange('collections');
  },

  syncCollectionsWithProducts(): void {
    const products = this.getProducts(false);
    const collections = this.getCollections();
    const updated = collections.map(col => {
      let count = 0;
      let pIds: string[] = [];
      if (col.slug === 'all') {
        count = products.length;
        pIds = products.map(p => p.id);
      } else if (col.slug === 'new-arrivals') {
        const matches = products.filter(p => 
          p.isNewArrival || 
          p.collectionNames?.includes('NEW ARRIVALS') || 
          p.collection === 'NEW ARRIVALS' ||
          p.collectionIds?.includes(col.id) ||
          p.tags?.includes('new-arrivals')
        );
        count = matches.length;
        pIds = matches.map(p => p.id);
      } else if (col.slug === 'best-selling') {
        const matches = products.filter(p => 
          p.isBestSeller || 
          p.collectionNames?.includes('BEST SELLING') || 
          p.collectionNames?.includes('TRENDING') || 
          p.collection === 'BEST SELLING' ||
          p.collection === 'TRENDING' ||
          p.collectionIds?.includes(col.id) ||
          p.tags?.includes('best-selling')
        );
        count = matches.length;
        pIds = matches.map(p => p.id);
      } else if (col.slug === 'winter-collection') {
        const matches = products.filter(p => 
          p.collectionNames?.includes('WINTER COLLECTION') || 
          p.collection === 'WINTER COLLECTION' ||
          p.collectionIds?.includes(col.id) ||
          p.tags?.includes('winter-collection') ||
          p.tags?.includes('wintercollection') ||
          p.fabric?.toLowerCase().includes('dhank') ||
          p.fabric?.toLowerCase().includes('linen') ||
          p.fabric?.toLowerCase().includes('winter') || 
          p.fabric?.toLowerCase().includes('velvet')
        );
        count = matches.length;
        pIds = matches.map(p => p.id);
      } else if (col.slug === 'co-ords') {
        const matches = products.filter(p => 
          p.collectionNames?.includes('CO-ORDS') || 
          p.collection === 'CO-ORDS' ||
          p.collectionIds?.includes(col.id) ||
          p.tags?.includes('co-ords') ||
          p.tags?.includes('coords-collection') ||
          p.title?.toLowerCase().includes('co-ord') || 
          p.title?.toLowerCase().includes('coord') ||
          p.title?.toLowerCase().includes('2 pc') ||
          p.title?.toLowerCase().includes('2-piece')
        );
        count = matches.length;
        pIds = matches.map(p => p.id);
      } else if (col.slug === 'short-length-article') {
        const matches = products.filter(p => 
          p.collectionNames?.includes('SHORT LENGTH') || 
          p.collection === 'SHORT LENGTH' ||
          p.collectionIds?.includes(col.id) ||
          p.tags?.includes('short-length-article') ||
          p.title?.toLowerCase().includes('short')
        );
        count = matches.length;
        pIds = matches.map(p => p.id);
      }
      return {
        ...col,
        productCount: count,
        productIds: pIds
      };
    });
    localStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(updated));
    notifyChange('collections');
  },

  deleteCollection(id: string): void {
    const collections = this.getCollections().filter(c => c.id !== id);
    localStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(collections));
    notifyChange('collections');
  },

  updateCollection(id: string, updates: Partial<Collection>): void {
    const collections = this.getCollections();
    const idx = collections.findIndex(c => c.id === id);
    if (idx >= 0) {
      collections[idx] = { ...collections[idx], ...updates };
      localStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(collections));
      notifyChange('collections');
    }
  },

  // ORDERS
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(KEYS.ORDERS);
      return data ? JSON.parse(data) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  },

  async fetchOrdersAsync(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const serverOrders = await res.json();
        if (Array.isArray(serverOrders) && serverOrders.length > 0) {
          localStorage.setItem(KEYS.ORDERS, JSON.stringify(serverOrders));
          notifyChange('orders');
          return serverOrders;
        }
      }
    } catch (err) {
      console.warn('Could not fetch server orders, using cached:', err);
    }
    return this.getOrders();
  },

  getOrderByNumber(orderNumber: string): Order | undefined {
    const orders = this.getOrders();
    return orders.find(o => o.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase());
  },

  getOrdersByPhone(phone: string): Order[] {
    const orders = this.getOrders();
    const clean = phone.replace(/\D/g, '');
    return orders.filter(o => o.customer.phone.replace(/\D/g, '').includes(clean));
  },

  saveOrder(order: Order): void {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === order.id);
    if (idx >= 0) {
      orders[idx] = { ...order, updatedAt: new Date().toISOString() };
    } else {
      orders.unshift({ ...order, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    notifyChange('orders');

    // Sync with server persistent storage
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    }).catch(err => console.error('Failed to sync order with server:', err));
  },

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      orders[idx].status = status;
      orders[idx].updatedAt = new Date().toISOString();
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
      notifyChange('orders');

      // Sync with server
      fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }).catch(err => console.error('Failed to sync order status with server:', err));
    }
  },

  verifyOrderPayment(orderId: string, verifiedBy: string = 'Admin Concierge'): void {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      // Verified payment moves to Ready to Dispatch (NOT Dispatched or Shipped!)
      orders[idx].status = 'Ready to Dispatch';
      orders[idx].paymentStatus = 'Paid';
      orders[idx].paymentProof = {
        ...(orders[idx].paymentProof || {}),
        verifiedAt: new Date().toISOString(),
        verifiedBy,
        rejectionReason: undefined
      };
      orders[idx].updatedAt = new Date().toISOString();
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
      notifyChange('orders');

      // Sync with server
      fetch(`/api/orders/${orderId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifiedBy })
      }).catch(err => console.error('Failed to sync verify payment with server:', err));
    }
  },

  rejectOrderPayment(orderId: string, reason: string): void {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      // ORDER MUST NOT BE CANCELLED! (Req 1)
      // Order status remains active with 'Payment Action Required'
      orders[idx].status = 'Payment Action Required';
      orders[idx].paymentStatus = 'Rejected';
      orders[idx].paymentProof = {
        ...(orders[idx].paymentProof || {}),
        rejectionReason: reason || 'Payment proof could not be verified'
      };
      orders[idx].updatedAt = new Date().toISOString();
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
      notifyChange('orders');

      // Sync with server
      fetch(`/api/orders/${orderId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      }).catch(err => console.error('Failed to sync reject payment with server:', err));
    }
  },

  attachOrderPaymentProof(orderId: string, proof: Partial<OrderPaymentProof>): void {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      orders[idx].paymentProof = {
        ...(orders[idx].paymentProof || {}),
        ...proof,
        submittedAt: proof.submittedAt || new Date().toISOString(),
        rejectionReason: undefined // Clear rejection reason on new submission
      };
      // Returns to Under Verification and Payment Verification Pending
      orders[idx].paymentStatus = 'Under Verification';
      orders[idx].status = 'Payment Verification Pending';
      orders[idx].updatedAt = new Date().toISOString();
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
      notifyChange('orders');

      // Sync with server
      fetch(`/api/orders/${orderId}/proof`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proof)
      }).catch(err => console.error('Failed to sync payment proof with server:', err));
    }
  },

  // Upload payment proof screenshot to server persistent storage (Req 3, 4)
  async uploadPaymentProof(fileOrDataUrl: string | File): Promise<string> {
    try {
      let dataUrl: string;
      if (typeof fileOrDataUrl !== 'string') {
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(fileOrDataUrl);
        });
      } else {
        dataUrl = fileOrDataUrl;
      }

      // If already a server URL, return as-is
      if (dataUrl.startsWith('/api/payment-proof/')) {
        return dataUrl;
      }

      const res = await fetch('/api/payment-proof/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataUrl })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          return json.url;
        }
      }
    } catch (err) {
      console.error('Error uploading payment proof to server:', err);
    }
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '';
  },

  // REVIEWS
  getReviews(): Review[] {
    try {
      const data = localStorage.getItem(KEYS.REVIEWS);
      return data ? JSON.parse(data) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  },

  addReview(review: Review): void {
    const reviews = this.getReviews();
    reviews.unshift(review);
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
    notifyChange('reviews');
  },

  // CMS
  getCMS(): HomepageCMS {
    try {
      const data = localStorage.getItem(KEYS.CMS);
      if (!data) return INITIAL_CMS;
      const cms: HomepageCMS = JSON.parse(data);
      let changed = false;
      if (cms.hero?.buttonText === 'EXPLORE BEST SELLERS') {
        cms.hero.buttonText = 'EXPLORE TRENDING';
        cms.hero.buttonUrl = '/collections/best-selling';
        cms.hero.secondaryButtonText = 'SHOP ALL';
        cms.hero.secondaryButtonUrl = '/shop';
        changed = true;
      }
      if (cms.hero?.heading === 'GulPash Haute Couture') {
        cms.hero.heading = 'GulPash Luxury Collection';
        changed = true;
      }
      if (cms.announcements) {
        cms.announcements = cms.announcements.map(a => {
          if (a.text.includes('8489999')) {
            changed = true;
            return { ...a, text: 'NEED SIZING ASSISTANCE? CHAT WITH OUR LUXURY STYLISTS', link: '/shop' };
          }
          return a;
        });
      }
      if (changed) {
        localStorage.setItem(KEYS.CMS, JSON.stringify(cms));
      }
      return cms;
    } catch {
      return INITIAL_CMS;
    }
  },

  saveCMS(cms: HomepageCMS): void {
    localStorage.setItem(KEYS.CMS, JSON.stringify(cms));
    notifyChange('cms');
  },

  // SETTINGS
  getSettings(): SiteSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (!data) return INITIAL_SETTINGS;
      const settings: SiteSettings = JSON.parse(data);
      let changed = false;
      if (settings.shipping?.bankDetails?.includes('8489999')) {
        settings.shipping.bankDetails = settings.shipping.bankDetails.replace('+92 321 8489999', 'our WhatsApp Concierge');
        changed = true;
      }

      // WhatsApp assistance single source of truth & migration of legacy numbers
      if (!settings.whatsappNumber || settings.whatsappNumber.includes('8489999')) {
        settings.whatsappNumber = DEFAULT_WHATSAPP_NUMBER_VISIBLE;
        changed = true;
      }
      if (!settings.whatsappAssistance || settings.whatsappAssistance.number?.includes('8489999')) {
        settings.whatsappAssistance = resolveWhatsAppSettings(settings);
        changed = true;
      }

      if (settings.shipping) {
        if (settings.shipping.freeCodEnabled === undefined) {
          settings.shipping.freeCodEnabled = false;
          changed = true;
        }
        if (!settings.shipping.codAnnouncementText) {
          settings.shipping.codAnnouncementText = 'FREE NATIONWIDE CASH ON DELIVERY ON ALL ORDERS ABOVE PKR {amount}';
          changed = true;
        }
      }

      // Ensure payment gateways settings exist and are fully populated
      if (!settings.payments) {
        settings.payments = INITIAL_SETTINGS.payments;
        changed = true;
      } else {
        if (!settings.payments.cod) {
          settings.payments.cod = { enabled: settings.shipping?.codEnabled !== undefined ? settings.shipping.codEnabled : true };
          changed = true;
        }
        if (!settings.payments.jazzCash) {
          settings.payments.jazzCash = INITIAL_SETTINGS.payments.jazzCash;
          changed = true;
        }
        if (!settings.payments.easypaisa) {
          settings.payments.easypaisa = INITIAL_SETTINGS.payments.easypaisa;
          changed = true;
        }
        if (!settings.payments.bankTransfer) {
          settings.payments.bankTransfer = INITIAL_SETTINGS.payments.bankTransfer;
          changed = true;
        }
      }

      // Sync codEnabled and bankTransferEnabled between shipping and payments
      if (settings.shipping && settings.payments) {
        if (settings.shipping.codEnabled !== settings.payments.cod.enabled) {
          settings.shipping.codEnabled = settings.payments.cod.enabled;
          changed = true;
        }
        if (settings.shipping.bankTransferEnabled !== settings.payments.bankTransfer.enabled) {
          settings.shipping.bankTransferEnabled = settings.payments.bankTransfer.enabled;
          changed = true;
        }
      }

      if (changed) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
      }
      return settings;
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  async fetchSettingsAsync(): Promise<SiteSettings> {
    let settings = this.getSettings();

    // 1. Attempt to fetch WhatsApp configuration from Supabase store settings
    try {
      const supabaseWhatsApp = await fetchWhatsAppFromSupabase();
      if (supabaseWhatsApp) {
        settings.whatsappAssistance = supabaseWhatsApp;
        settings.whatsappNumber = supabaseWhatsApp.number;
        settings.whatsappDefaultMessage = supabaseWhatsApp.defaultMessage;
      }
    } catch {
      // Supabase fetch is resilient
    }

    // 2. Fetch authoritative settings from server
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const serverSettings = await res.json();
        if (serverSettings && serverSettings.payments) {
          // If server had settings, merge with WhatsApp configuration
          settings = {
            ...settings,
            ...serverSettings,
            whatsappNumber: serverSettings.whatsappNumber?.includes('8489999')
              ? DEFAULT_WHATSAPP_NUMBER_VISIBLE 
              : (serverSettings.whatsappNumber || DEFAULT_WHATSAPP_NUMBER_VISIBLE),
            whatsappAssistance: resolveWhatsAppSettings(serverSettings)
          };
          localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
          notifyChange('settings');
          return settings;
        }
      }
    } catch (err) {
      console.warn('Could not fetch server settings, using cached:', err);
    }
    return settings;
  },

  saveSettings(settings: SiteSettings): void {
    if (settings.payments && settings.shipping) {
      settings.shipping.codEnabled = settings.payments.cod.enabled;
      settings.shipping.bankTransferEnabled = settings.payments.bankTransfer.enabled;
    }

    // Ensure whatsappAssistance is resolved and synchronized with whatsappNumber
    const waConfig = resolveWhatsAppSettings(settings);
    settings.whatsappAssistance = waConfig;
    settings.whatsappNumber = waConfig.number;
    settings.whatsappDefaultMessage = waConfig.defaultMessage;

    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    notifyChange('settings');

    // 1. Sync with server persistent storage
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).catch(err => console.error('Failed to sync settings with server:', err));

    // 2. Persist to Supabase site_settings table
    syncWhatsAppToSupabase(waConfig).catch(err => {
      console.warn('Supabase WhatsApp sync note:', err);
    });
  },

  // CART
  getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCart(items: CartItem[]): void {
    localStorage.setItem(KEYS.CART, JSON.stringify(items));
    notifyChange('cart');
  },

  // WISHLIST
  getWishlist(): string[] {
    try {
      const data = localStorage.getItem(KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleWishlist(productId: string): boolean {
    const wishlist = this.getWishlist();
    const index = wishlist.indexOf(productId);
    let isAdded = false;
    if (index >= 0) {
      wishlist.splice(index, 1);
      isAdded = false;
    } else {
      wishlist.push(productId);
      isAdded = true;
    }
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify(wishlist));
    notifyChange('wishlist');
    return isAdded;
  },

  // CUSTOMERS DERIVED
  getCustomers(): CustomerSummary[] {
    const orders = this.getOrders();
    const map = new Map<string, CustomerSummary>();

    orders.forEach(o => {
      const key = o.customer.email.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          id: `cust-${key.replace(/[^a-z0-9]/g, '')}`,
          name: o.customer.fullName,
          email: o.customer.email,
          phone: o.customer.phone,
          city: o.customer.city,
          totalOrders: 1,
          totalSpent: o.total,
          lastOrderDate: o.createdAt
        });
      } else {
        const item = map.get(key)!;
        item.totalOrders += 1;
        item.totalSpent += o.total;
        if (new Date(o.createdAt) > new Date(item.lastOrderDate)) {
          item.lastOrderDate = o.createdAt;
        }
      }
    });

    return Array.from(map.values());
  },

  // ADMIN AUTH
  isAdminAuthenticated(): boolean {
    return localStorage.getItem(KEYS.ADMIN_AUTH) === 'true';
  },

  setAdminAuthenticated(val: boolean): void {
    if (val) {
      localStorage.setItem(KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(KEYS.ADMIN_AUTH);
    }
    notifyChange('auth');
  },

  // RESET TO ORIGINAL FACTORY DEFAULTS
  resetFactoryData(): void {
    localStorage.removeItem(KEYS.PRODUCTS);
    localStorage.removeItem(KEYS.CATEGORIES);
    localStorage.removeItem(KEYS.COLLECTIONS);
    localStorage.removeItem(KEYS.ORDERS);
    localStorage.removeItem(KEYS.REVIEWS);
    localStorage.removeItem(KEYS.CMS);
    localStorage.removeItem(KEYS.SETTINGS);
    notifyChange('all');
  },

  // MEDIA ASSETS (Req 9)
  getMediaAssets(): MediaAsset[] {
    try {
      const data = localStorage.getItem(KEYS.MEDIA_ASSETS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}

    // Seed default authentic media library from products and collections
    const seedAssets: MediaAsset[] = [];
    const products = this.getProducts(true);
    const collections = this.getCollections();

    // Add hero and collection banners
    collections.forEach(c => {
      if (c.imageUrl) {
        seedAssets.push({
          id: `media-col-${c.id}`,
          url: c.imageUrl,
          fileName: `${c.slug}-collection-card.jpg`,
          dimensions: '800 × 1000 px',
          aspectRatio: '4:5',
          fileSize: '320 KB',
          uploadedAt: new Date(Date.now() - 3600 * 1000 * 24 * 7).toISOString(),
          mediaType: 'image',
          category: 'collection-image',
          usedIn: [`Collection Card: ${c.name}`]
        });
      }
      if (c.bannerUrl) {
        seedAssets.push({
          id: `media-banner-${c.id}`,
          url: c.bannerUrl,
          fileName: `${c.slug}-collection-banner.jpg`,
          dimensions: '1920 × 800 px',
          aspectRatio: '16:9',
          fileSize: '680 KB',
          uploadedAt: new Date(Date.now() - 3600 * 1000 * 24 * 7).toISOString(),
          mediaType: 'image',
          category: 'collection-banner',
          usedIn: [`Collection Header: ${c.name}`]
        });
      }
    });

    // Add top 15 product images and videos
    products.slice(0, 15).forEach((p, idx) => {
      if (p.images && p.images[0]) {
        seedAssets.push({
          id: `media-prod-${p.id}-1`,
          url: p.images[0],
          fileName: `${p.slug}-front.jpg`,
          dimensions: '1200 × 1500 px',
          aspectRatio: '4:5',
          fileSize: '450 KB',
          uploadedAt: new Date(Date.now() - 3600 * 1000 * 24 * (idx + 1)).toISOString(),
          mediaType: 'image',
          category: 'product-image',
          usedIn: [`Product: ${p.title}`]
        });
      }
      if (p.images && p.images[1]) {
        seedAssets.push({
          id: `media-prod-${p.id}-2`,
          url: p.images[1],
          fileName: `${p.slug}-detail.jpg`,
          dimensions: '1200 × 1500 px',
          aspectRatio: '4:5',
          fileSize: '420 KB',
          uploadedAt: new Date(Date.now() - 3600 * 1000 * 24 * (idx + 1)).toISOString(),
          mediaType: 'image',
          category: 'product-image',
          usedIn: [`Product: ${p.title}`]
        });
      }
      if (p.videoUrl) {
        seedAssets.push({
          id: `media-prod-vid-${p.id}`,
          url: p.videoUrl,
          fileName: `${p.slug}-runway-preview.mp4`,
          dimensions: '1080 × 1350 px',
          aspectRatio: '4:5',
          fileSize: '2.4 MB',
          uploadedAt: new Date(Date.now() - 3600 * 1000 * 24 * (idx + 1)).toISOString(),
          mediaType: 'video',
          category: 'product-video',
          usedIn: [`Product Video: ${p.title}`]
        });
      }
    });

    try {
      localStorage.setItem(KEYS.MEDIA_ASSETS, JSON.stringify(seedAssets));
    } catch {}

    return seedAssets;
  },

  saveMediaAsset(asset: MediaAsset): void {
    const list = this.getMediaAssets();
    const idx = list.findIndex(a => a.id === asset.id);
    if (idx >= 0) {
      list[idx] = asset;
    } else {
      list.unshift(asset);
    }
    try {
      localStorage.setItem(KEYS.MEDIA_ASSETS, JSON.stringify(list));
    } catch {}
    notifyChange('media');
  },

  deleteMediaAsset(id: string): void {
    const list = this.getMediaAssets().filter(a => a.id !== id);
    try {
      localStorage.setItem(KEYS.MEDIA_ASSETS, JSON.stringify(list));
    } catch {}
    notifyChange('media');

    if (typeof fetch !== 'undefined') {
      fetch(`/api/media/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  },

  async uploadMediaFile(
    file: File, 
    category: MediaAsset['category'] = 'product-image', 
    usedIn: string[] = []
  ): Promise<{ url: string; asset?: MediaAsset }> {
    return new Promise((resolve, reject) => {
      const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm');
      const reader = new FileReader();

      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch('/api/media/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: base64Data,
              fileName: file.name,
              category,
              usedIn,
              fileSize: `${Math.round(file.size / 1024)} KB`,
              mediaType: isVideo ? 'video' : 'image',
              dimensions: isVideo ? '1080 × 1350 px' : '1200 × 1500 px',
              aspectRatio: '4:5'
            })
          });

          if (res.ok) {
            const json = await res.json();
            if (json.asset) {
              this.saveMediaAsset(json.asset);
            }
            resolve({ url: json.url || base64Data, asset: json.asset });
            return;
          }
        } catch (e) {
          console.warn('Server media upload failed, fallback to local storage:', e);
        }

        // Fallback to local Data URL
        const localAsset: MediaAsset = {
          id: `media_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
          url: base64Data,
          fileName: file.name,
          dimensions: isVideo ? '1080 × 1350 px' : '1200 × 1500 px',
          aspectRatio: '4:5',
          fileSize: `${Math.round(file.size / 1024)} KB`,
          uploadedAt: new Date().toISOString(),
          mediaType: isVideo ? 'video' : 'image',
          category,
          usedIn
        };
        this.saveMediaAsset(localAsset);
        resolve({ url: base64Data, asset: localAsset });
      };

      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsDataURL(file);
    });
  },

  // SUPABASE STORAGE UPLOADER
  async uploadMedia(bucket: 'product-images' | 'hero-images' | 'hero-videos', file: File, pathPrefix = ''): Promise<{ url: string | null; error: string | null }> {
    const { getSupabaseClient } = await import('./supabaseClient');
    const supabase = getSupabaseClient();
    
    if (!supabase) {
      // Create a local object URL for preview if Supabase remote credentials are not set
      const localUrl = URL.createObjectURL(file);
      return { url: localUrl, error: null };
    }

    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const cleanName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const fullPath = pathPrefix ? `${pathPrefix.replace(/\/$/, '')}/${cleanName}` : cleanName;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fullPath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        return { url: null, error: error.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return { url: publicUrlData.publicUrl, error: null };
    } catch (err: any) {
      return { url: null, error: err.message || 'Upload failed' };
    }
  }
};

// Automatic background hydration from server to synchronize store-wide settings and orders
if (typeof window !== 'undefined') {
  fetch('/api/settings')
    .then(r => r.ok ? r.json() : null)
    .then(s => {
      if (s && s.payments) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s));
        notifyChange('settings');
      }
    })
    .catch(() => {});

  fetch('/api/orders')
    .then(r => r.ok ? r.json() : null)
    .then(o => {
      if (Array.isArray(o) && o.length > 0) {
        localStorage.setItem(KEYS.ORDERS, JSON.stringify(o));
        notifyChange('orders');
      }
    })
    .catch(() => {});
}

