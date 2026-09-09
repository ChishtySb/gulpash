import { 
  Product, Category, Collection, Order, OrderStatus, OrderPaymentProof, HomepageCMS, SiteSettings, 
  CartItem, Review, CustomerSummary 
} from '../types';
import { 
  INITIAL_CATEGORIES, INITIAL_COLLECTIONS, INITIAL_PRODUCTS, 
  INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_CMS, INITIAL_SETTINGS 
} from '../data/initialData';

const KEYS = {
  PRODUCTS: 'gulpash_products_v3_ref_aligned',
  CATEGORIES: 'gulpash_categories_v2_migrated',
  COLLECTIONS: 'gulpash_collections_v4_merchandised',
  ORDERS: 'gulpash_orders_v2_migrated',
  REVIEWS: 'gulpash_reviews_v2_migrated',
  CMS: 'gulpash_cms_v2_migrated',
  SETTINGS: 'gulpash_settings_v2_migrated',
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
      if (!list || list.length < 68 || list.some(p => p.id === 'gp-001')) {
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
          p.title?.toLowerCase().includes('co-ord') || 
          p.title?.toLowerCase().includes('coord')
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
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const serverSettings = await res.json();
        if (serverSettings && serverSettings.payments) {
          localStorage.setItem(KEYS.SETTINGS, JSON.stringify(serverSettings));
          notifyChange('settings');
          return serverSettings;
        }
      }
    } catch (err) {
      console.warn('Could not fetch server settings, using cached:', err);
    }
    return this.getSettings();
  },

  saveSettings(settings: SiteSettings): void {
    if (settings.payments && settings.shipping) {
      settings.shipping.codEnabled = settings.payments.cod.enabled;
      settings.shipping.bankTransferEnabled = settings.payments.bankTransfer.enabled;
    }
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    notifyChange('settings');

    // Sync with server persistent storage (Req 5, 14)
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).catch(err => console.error('Failed to sync settings with server:', err));
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

