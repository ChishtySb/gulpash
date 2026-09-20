/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageService } from './lib/storage';
import { adminAuthService, AdminAuthState } from './lib/adminAuth';
import { Product, CartItem, CurrencyCode, ProductSize, CMSConfig } from './types';
import { ShieldAlert, Loader2 } from 'lucide-react';

// Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { SearchModal } from './components/common/SearchModal';
import { SizeGuideModal } from './components/common/SizeGuideModal';

import { HeroSection } from './components/storefront/HeroSection';
import { HomeSections } from './components/home/HomeSections';
import { ShopPage } from './components/storefront/ShopPage';
import { ProductDetailPage } from './components/storefront/ProductDetailPage';
import { CheckoutPage } from './components/storefront/CheckoutPage';
import { CartDrawer } from './components/storefront/CartDrawer';
import { QuickViewModal } from './components/storefront/QuickViewModal';
import { OrderTrackingModal } from './components/storefront/OrderTrackingModal';
import { WishlistModal } from './components/storefront/WishlistModal';
import { PolicyPage } from './components/storefront/PolicyPage';

import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAuthModal } from './components/admin/AdminAuthModal';

export default function App() {
  // Navigation
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'product' | 'checkout' | 'admin' | 'policy'>('home');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [adminAuthState, setAdminAuthState] = useState<AdminAuthState>(() => adminAuthService.getState());

  // Global State
  const [currency, setCurrency] = useState<CurrencyCode>('PKR');
  const [cartItems, setCartItems] = useState<CartItem[]>(StorageService.getCart());
  const [wishlistIds, setWishlistIds] = useState<string[]>(StorageService.getWishlist());
  const [cms, setCms] = useState<CMSConfig>(StorageService.getCMS());
  const [products, setProducts] = useState<Product[]>(StorageService.getProducts(false));

  // Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideProduct, setSizeGuideProduct] = useState<Product | null>(null);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // URL Routing Helper
  const resolveRouteFromPath = (path: string): { view: 'home' | 'shop' | 'product' | 'checkout' | 'admin' | 'policy'; param?: string } => {
    const cleanPath = path.trim().replace(/\/$/, '') || '/';
    if (cleanPath === '/' || cleanPath === '') {
      return { view: 'home' };
    }
    if (cleanPath === '/checkout') {
      return { view: 'checkout' };
    }
    if (cleanPath === '/admin') {
      return { view: 'admin' };
    }
    if (cleanPath === '/shop') {
      return { view: 'shop', param: 'all' };
    }
    if (cleanPath.startsWith('/collections/')) {
      const slug = cleanPath.replace('/collections/', '');
      const normalizedSlug = slug === 'trending' ? 'best-selling' : (slug === 'short-length' ? 'short-length-article' : (slug === 'ready-to-wear' ? 'all' : slug));
      return { view: 'shop', param: normalizedSlug };
    }
    if (cleanPath.startsWith('/categories/')) {
      const slug = cleanPath.replace('/categories/', '');
      return { view: 'shop', param: slug };
    }
    if (cleanPath.startsWith('/products/')) {
      const slug = cleanPath.replace('/products/', '');
      return { view: 'product', param: slug };
    }
    const policyMatch = ['shipping-policy', 'exchange-policy', 'privacy-policy', 'about'].find(p => cleanPath === `/${p}` || cleanPath === `/policies/${p}`);
    if (policyMatch) {
      return { view: 'policy', param: policyMatch };
    }
    return { view: 'home' };
  };

  // Initialize and synchronize authoritative Supabase Admin Auth
  useEffect(() => {
    adminAuthService.initialize();
    const unsubscribe = adminAuthService.subscribe((state) => {
      setAdminAuthState(state);
    });
    return () => unsubscribe();
  }, []);

  // Synchronize initial URL & popstate
  useEffect(() => {
    try {
      const route = resolveRouteFromPath(window.location.pathname);
      setCurrentView(route.view);
      setViewParam(route.param);
    } catch {
      // Ignore if window.location isn't readable
    }

    const handlePopState = () => {
      try {
        const popRoute = resolveRouteFromPath(window.location.pathname);
        setCurrentView(popRoute.view);
        setViewParam(popRoute.param);
      } catch {
        // Fallback
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Reactive state listener for storage changes
  useEffect(() => {
    const handleStorageUpdate = () => {
      setCartItems(StorageService.getCart());
      setWishlistIds(StorageService.getWishlist());
      setCms(StorageService.getCMS());
      setProducts(StorageService.getProducts(false));
    };

    window.addEventListener('gulpash_data_changed', handleStorageUpdate);
    return () => window.removeEventListener('gulpash_data_changed', handleStorageUpdate);
  }, []);

  // Navigation helper with history pushState
  const navigate = (view: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let newPath = '/';
    if (view === 'home') {
      setCurrentView('home');
      setViewParam(undefined);
      newPath = '/';
    } else if (view === 'shop') {
      setCurrentView('shop');
      setViewParam('all');
      newPath = '/collections/all';
    } else if (view === 'category') {
      setCurrentView('shop');
      setViewParam(param);
      newPath = param ? `/categories/${param}` : '/collections/all';
    } else if (view === 'collection') {
      const normalizedParam = param === 'trending' 
        ? 'best-selling' 
        : (param === 'short-length' ? 'short-length-article' : (param === 'ready-to-wear' ? 'all' : (param || 'all')));
      setCurrentView('shop');
      setViewParam(normalizedParam);
      newPath = `/collections/${normalizedParam}`;
    } else if (view === 'product') {
      setCurrentView('product');
      setViewParam(param);
      newPath = `/products/${param}`;
    } else if (view === 'checkout') {
      setCurrentView('checkout');
      setViewParam(undefined);
      newPath = '/checkout';
    } else if (view === 'admin') {
      setCurrentView('admin');
      setViewParam(undefined);
      newPath = '/admin';
    } else if (['shipping-policy', 'exchange-policy', 'privacy-policy', 'about'].includes(view)) {
      setCurrentView('policy');
      setViewParam(view);
      newPath = `/policies/${view}`;
    } else {
      setCurrentView('home');
      setViewParam(undefined);
      newPath = '/';
    }

    try {
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath);
      }
    } catch {
      // pushState may be restricted in sandbox iframe; state-based navigation still succeeds
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: ProductSize, quantity: number = 1) => {
    const existingIndex = cartItems.findIndex(
      i => i.productId === product.id && i.size === size
    );

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        product,
        size,
        quantity,
        price: product.price
      };
      updatedCart = [...cartItems, newItem];
    }

    StorageService.saveCart(updatedCart);
    setCartItems(updatedCart);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, quantity: number) => {
    let updatedCart: CartItem[];
    if (quantity <= 0) {
      updatedCart = cartItems.filter(i => i.id !== id);
    } else {
      updatedCart = cartItems.map(i => i.id === id ? { ...i, quantity } : i);
    }
    StorageService.saveCart(updatedCart);
    setCartItems(updatedCart);
  };

  const handleRemoveCartItem = (id: string) => {
    const updated = cartItems.filter(i => i.id !== id);
    StorageService.saveCart(updated);
    setCartItems(updated);
  };

  const handleClearCart = () => {
    StorageService.saveCart([]);
    setCartItems([]);
  };

  // Buy Now: Adds to cart & immediately routes to checkout
  const handleBuyNow = (product: Product, size: ProductSize, quantity: number) => {
    handleAddToCart(product, size, quantity);
    setIsCartOpen(false);
    navigate('checkout');
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    StorageService.toggleWishlist(productId);
    setWishlistIds(StorageService.getWishlist());
  };

  // Current product for PDP
  const currentProduct = currentView === 'product' && viewParam
    ? products.find(p => p.slug === viewParam) || products[0]
    : null;

  const categories = StorageService.getCategories();
  const collections = StorageService.getCollections();
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  // If viewing Admin Panel, enforce genuine Supabase Auth
  if (currentView === 'admin') {
    if (adminAuthState.status === 'loading') {
      return (
        <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-stone-300 animate-spin mb-4" />
          <p className="text-xs uppercase tracking-widest text-stone-400 font-mono">Verifying GulPash Admin Session...</p>
        </div>
      );
    }

    if (adminAuthState.status === 'offline') {
      return (
        <div className="min-h-screen bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <AdminAuthModal
            isOpen={true}
            onSuccess={() => {
              // adminAuthService will transition to active
            }}
            onCancel={() => navigate('home')}
          />
        </div>
      );
    }

    if (adminAuthState.status === 'unauthorized') {
      return (
        <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-lg border border-red-200 shadow-xl text-center">
            <div className="w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-serif font-bold text-stone-900 mb-2">Access Denied (Role: Admin Required)</h2>
            <p className="text-xs text-stone-600 mb-6 leading-relaxed">
              Your account ({adminAuthState.user?.email || 'User'}) is authenticated, but does not have administrator privileges.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => adminAuthService.signOut()}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
              >
                Sign In with Different Account
              </button>
              <button
                type="button"
                onClick={() => navigate('home')}
                className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-black rounded-md transition-colors cursor-pointer"
              >
                Back to Storefront
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <AdminDashboard
        onExitAdmin={() => navigate('home')}
        onNavigateToStoreProduct={(slug) => navigate('product', slug)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1A1A] selection:bg-stone-900 selection:text-white overflow-x-hidden w-full">
      
      {/* 1. SITE HEADER & NAVIGATION */}
      <Header
        currentView={currentView}
        currentParam={viewParam}
        currency={currency}
        onCurrencyChange={setCurrency}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onNavigate={navigate}
      />

      {/* 2. MAIN STOREFRONT VIEWS */}
      <main className="flex-1">
        
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <div>
            {/* HERO: Luxury Multi-Slide Hero Carousel with Exact 16:7 Canvas */}
            <HeroSection
              config={cms.hero}
              slides={cms.heroSlides}
              settings={cms.heroSliderSettings}
              onNavigate={navigate}
            />

            {/* EDITORIAL SECTIONS */}
            <HomeSections
              products={products}
              categories={categories}
              collections={collections}
              currency={currency}
              cms={cms}
              onSelectProduct={(slug) => navigate('product', slug)}
              onQuickView={(p) => setQuickViewProduct(p)}
              onQuickAddToCart={(p, size) => handleAddToCart(p, size, 1)}
              isWishlisted={(id) => wishlistIds.includes(id)}
              onToggleWishlist={handleToggleWishlist}
              onNavigate={navigate}
            />
          </div>
        )}

        {/* VIEW: SHOP / CATEGORY / COLLECTION */}
        {currentView === 'shop' && (
          <ShopPage
            initialCategory={categories.some(c => c.slug === viewParam) ? viewParam : undefined}
            initialCollection={
              collections.some(c => c.slug === viewParam)
                ? viewParam
                : (viewParam === 'trending'
                    ? 'best-selling'
                    : (viewParam === 'short-length'
                        ? 'short-length-article'
                        : (viewParam === 'ready-to-wear' || viewParam === 'all' ? 'all' : undefined)))
            }
            currency={currency}
            onSelectProduct={(slug) => navigate('product', slug)}
            onQuickView={(p) => setQuickViewProduct(p)}
            onQuickAddToCart={(p, size) => handleAddToCart(p, size, 1)}
            isWishlisted={(id) => wishlistIds.includes(id)}
            onToggleWishlist={handleToggleWishlist}
            onNavigate={navigate}
          />
        )}

        {/* VIEW: PRODUCT DETAIL PAGE */}
        {currentView === 'product' && currentProduct && (
          <ProductDetailPage
            product={currentProduct}
            currency={currency}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onSelectProduct={(slug) => navigate('product', slug)}
            onOpenQuickView={(p) => setQuickViewProduct(p)}
            onQuickAddToCart={(p, size) => handleAddToCart(p, size, 1)}
            onOpenSizeGuide={() => {
              setSizeGuideProduct(currentProduct);
              setIsSizeGuideOpen(true);
            }}
            isWishlisted={wishlistIds.includes(currentProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            onNavigate={navigate}
          />
        )}

        {/* VIEW: CHECKOUT */}
        {currentView === 'checkout' && (
          <CheckoutPage
            items={cartItems}
            currency={currency}
            onClearCart={handleClearCart}
            onNavigate={navigate}
          />
        )}

        {/* VIEW: POLICIES & ABOUT */}
        {currentView === 'policy' && (
          <PolicyPage
            type={(viewParam as any) || 'about'}
            onNavigate={navigate}
          />
        )}

      </main>

      {/* 3. FOOTER */}
      <Footer
        onNavigate={navigate}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* 4. FLOATING DYNAMIC WHATSAPP BUTTON */}
      <WhatsAppButton />

      {/* 5. SLIDE-OUT CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        currency={currency}
        onProceedToCheckout={() => navigate('checkout')}
        onNavigate={navigate}
      />

      {/* 6. INSTANT SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(slug) => navigate('product', slug)}
        currency={currency}
      />

      {/* 7. PAKISTANI MEASUREMENTS SIZE GUIDE MODAL */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        product={sizeGuideProduct}
      />

      {/* 8. QUICK VIEW MODAL */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        currency={currency}
        onAddToCart={handleAddToCart}
        onViewFullDetails={(slug) => navigate('product', slug)}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onOpenSizeGuide={() => {
          setSizeGuideProduct(quickViewProduct);
          setIsSizeGuideOpen(true);
        }}
      />

      {/* 9. ORDER TRACKING LOOKUP MODAL */}
      <OrderTrackingModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        currency={currency}
      />

      {/* 10. WISHLIST MODAL */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemove={handleToggleWishlist}
        onSelectProduct={(slug) => navigate('product', slug)}
        currency={currency}
      />

      {/* 11. SUPABASE ADMIN AUTHENTICATION GUARD MODAL */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onSuccess={() => {
          setIsAdminAuthModalOpen(false);
          setCurrentView('admin');
        }}
        onCancel={() => {
          setIsAdminAuthModalOpen(false);
        }}
      />

    </div>
  );
}
