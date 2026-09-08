/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageService } from './lib/storage';
import { Product, CartItem, CurrencyCode, ProductSize, CMSConfig } from './types';

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
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(StorageService.isAdminAuthenticated());

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

  // Synchronize initial URL & popstate
  useEffect(() => {
    try {
      const route = resolveRouteFromPath(window.location.pathname);
      if (route.view === 'admin' && !StorageService.isAdminAuthenticated()) {
        setIsAdminAuthModalOpen(true);
        setCurrentView('home');
      } else {
        setCurrentView(route.view);
        setViewParam(route.param);
      }
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
      if (!StorageService.isAdminAuthenticated()) {
        setIsAdminAuthModalOpen(true);
        return;
      }
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
    const updated = StorageService.toggleWishlist(productId);
    setWishlistIds(updated);
  };

  // Current product for PDP
  const currentProduct = currentView === 'product' && viewParam
    ? products.find(p => p.slug === viewParam) || products[0]
    : null;

  const categories = StorageService.getCategories();
  const collections = StorageService.getCollections();
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  // If viewing Admin Panel, render dedicated admin layout
  if (currentView === 'admin') {
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
            {/* HERO: Phase 6 Feature - Supports Option A (Image) & Option B (Video) */}
            <HeroSection
              config={cms.hero}
              onNavigate={navigate}
            />

            {/* EDITORIAL SECTIONS */}
            <HomeSections
              products={products}
              categories={categories}
              collections={collections}
              currency={currency}
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
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
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
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
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
          setIsAdminAuthenticated(true);
          setCurrentView('admin');
        }}
        onCancel={() => {
          setIsAdminAuthModalOpen(false);
        }}
      />

    </div>
  );
}
