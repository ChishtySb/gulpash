import { 
  Product, Category, Collection, Order, OrderStatus, HomepageCMS, SiteSettings, 
  CartItem, Review, CustomerSummary 
} from '../types';
import { 
  INITIAL_CATEGORIES, INITIAL_COLLECTIONS, INITIAL_PRODUCTS, 
  INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_CMS, INITIAL_SETTINGS 
} from '../data/initialData';

const KEYS = {
  PRODUCTS: 'gulpash_products_v2_migrated',
  CATEGORIES: 'gulpash_categories_v2_migrated',
  COLLECTIONS: 'gulpash_collections_v2_migrated',
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
      }
      return list;
    } catch {
      return INITIAL_CATEGORIES;
    }
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
      // Auto-heal if collections count doesn't match 6 or customer-facing display name BEST SELLING hasn't been updated to TRENDING
      if (
        !list || 
        list.length !== 6 || 
        list.some(c => c.name === 'BEST SELLING') || 
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
  },

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      orders[idx].status = status;
      orders[idx].updatedAt = new Date().toISOString();
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
      notifyChange('orders');
    }
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
      return data ? JSON.parse(data) : INITIAL_CMS;
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
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: SiteSettings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    notifyChange('settings');
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
