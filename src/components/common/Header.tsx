import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingBag, Heart, Menu, X, ChevronDown, 
  Phone, Globe, ShieldCheck, Truck, Sparkles, User
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { CurrencyCode, SiteSettings, HomepageCMS } from '../../types';
import { CURRENCY_RATES } from '../../lib/currency';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  currency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenTrackOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  currency,
  onCurrencyChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  onOpenWishlist,
  onOpenTrackOrder
}) => {
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [cms, setCms] = useState<HomepageCMS>(StorageService.getCMS());
  const [activeAnnouncementIdx, setActiveAnnouncementIdx] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleDataChange = () => {
      setSettings(StorageService.getSettings());
      setCms(StorageService.getCMS());
    };
    window.addEventListener('gulpash_data_changed', handleDataChange);
    return () => window.removeEventListener('gulpash_data_changed', handleDataChange);
  }, []);

  // Header background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle announcements
  const activeAnnouncements = cms.announcements.filter(a => a.isActive);
  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;
    const interval = setInterval(() => {
      setActiveAnnouncementIdx(prev => (prev + 1) % activeAnnouncements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeAnnouncements.length]);

  const categories = StorageService.getCategories().filter(c => c.isVisible);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* 1. ANNOUNCEMENT BAR */}
      {cms.announcementBarActive && activeAnnouncements.length > 0 && (
        <div className="bg-[#1A1A1A] text-[#FAF9F6] text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-medium py-2 px-4 sm:px-8 border-b border-stone-800 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="hidden lg:flex items-center gap-4 text-stone-400 text-[10px] tracking-[0.15em] uppercase">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-300" /> Delivery Nationwide
              </span>
              <span className="text-stone-600">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-300" /> 100% Original Brand Guarantee
              </span>
            </div>

            <div className="flex-1 text-center truncate px-2 font-sans">
              <span className="inline-block transition-all duration-500 transform tracking-[0.2em]">
                {activeAnnouncements[activeAnnouncementIdx]?.text}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-[10px] tracking-[0.15em] uppercase">
              <button 
                id="header-track-order-top"
                onClick={onOpenTrackOrder}
                className="text-stone-300 hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-white pb-0.5"
              >
                Track Order
              </button>
              <span className="text-stone-600">•</span>
              <a 
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-300 hover:text-white transition-colors flex items-center gap-1"
              >
                <Phone className="w-3 h-3 text-[#25D366]" /> WhatsApp Concierge
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN HEADER BAR */}
      <div className={`w-full transition-colors duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-stone-200' : 'bg-[#FAF9F6] border-b border-stone-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between">
          
          {/* Left: Mobile Menu Toggle & Desktop Quick Links */}
          <div className="flex items-center gap-3 lg:w-1/3">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1A1A1A] hover:text-stone-600 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Currency Switcher */}
            <div className="relative">
              <button
                id="currency-selector-button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 text-[10px] font-medium text-stone-700 hover:text-black uppercase tracking-widest py-1.5 px-2.5 border border-stone-300 bg-transparent hover:bg-white transition-all cursor-pointer"
              >
                <Globe className="w-3 h-3 text-stone-500" />
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute left-0 mt-1 w-32 bg-white shadow-md border border-stone-200 py-1 z-50 animate-in fade-in">
                  {(Object.keys(CURRENCY_RATES) as CurrencyCode[]).map(code => (
                    <button
                      key={code}
                      id={`currency-opt-${code}`}
                      onClick={() => {
                        onCurrencyChange(code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-[11px] uppercase tracking-wider flex items-center justify-between transition-colors ${
                        currency === code ? 'bg-stone-100 text-stone-900 font-semibold' : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span>{code}</span>
                      <span className="text-stone-400 font-normal">{CURRENCY_RATES[code].symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Desktop Category Links */}
            <nav className="hidden lg:flex items-center gap-6 ml-4">
              <button
                id="nav-link-shop"
                onClick={() => onNavigate('shop')}
                className={`text-[11px] uppercase tracking-widest font-medium transition-colors ${
                  currentView === 'shop' ? 'text-[#1A1A1A] border-b border-black pb-0.5' : 'text-stone-600 hover:text-black'
                }`}
              >
                Shop All
              </button>
              <button
                id="nav-link-lawn"
                onClick={() => onNavigate('category', 'unstitched-luxury-lawn')}
                className="text-[11px] uppercase tracking-widest font-medium text-stone-600 hover:text-black transition-colors"
              >
                Luxury Lawn
              </button>
              <button
                id="nav-link-pret"
                onClick={() => onNavigate('category', 'ready-to-wear-pret')}
                className="text-[11px] uppercase tracking-widest font-medium text-stone-600 hover:text-black transition-colors"
              >
                Pret
              </button>
            </nav>
          </div>

          {/* Center: BRAND LOGO */}
          <div className="flex flex-col items-center justify-center lg:w-1/3 text-center cursor-pointer" onClick={() => onNavigate('home')}>
            {settings.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.brandName || 'GulPash'} 
                className="h-9 sm:h-12 w-auto object-contain max-w-[180px]"
              />
            ) : (
              <>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-4xl tracking-[0.16em] font-semibold tracking-wider leading-none text-[#111111]">
                  {settings.brandName || 'GULPASH'}
                </h1>
                <span className="text-[9px] uppercase tracking-[0.45em] mt-1.5 text-stone-500 font-semibold">
                  Luxury Apparel &bull; Official
                </span>
              </>
            )}
          </div>

          {/* Right: Actions (Search, Wishlist, Cart, Admin/Account) */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 lg:w-1/3">
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              className="p-2 text-stone-700 hover:text-black transition-colors cursor-pointer"
              title="Search Catalog"
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5 stroke-stone-700" />
            </button>

            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2 text-stone-700 hover:text-black transition-colors cursor-pointer"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4.5 h-4.5 stroke-stone-700" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-stone-900 text-white text-[9px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 text-stone-700 hover:text-black transition-colors cursor-pointer flex items-center gap-1.5"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4.5 h-4.5 stroke-stone-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-stone-900 text-white text-[9px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-[10px] font-medium tracking-widest uppercase text-stone-800">
                BAG
              </span>
            </button>

            {/* Admin Portal Portal Button */}
            <button
              id="header-admin-btn"
              onClick={() => onNavigate('admin')}
              className="hidden sm:flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest text-stone-500 hover:text-black py-1.5 px-2.5 border border-stone-200 hover:border-stone-800 transition-all ml-1"
              title="Admin Portal"
            >
              <User className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>

        </div>

        {/* 3. DESKTOP SECONDARY NAVIGATION STRIP */}
        <div className="hidden lg:block border-t border-stone-200 bg-[#FAF9F6]">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center space-x-10 h-10">
            <button
              onClick={() => onNavigate('home')}
              className={`text-[10px] uppercase tracking-[0.25em] font-medium transition-colors hover:text-black ${
                currentView === 'home' ? 'text-black border-b border-black py-2 font-semibold' : 'text-stone-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('collection', 'nur-jahan-festive-lawn')}
              className="text-[10px] uppercase tracking-[0.25em] font-medium text-stone-800 hover:text-black flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-stone-500" /> Nur Jahan Lawn '26
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onNavigate('category', cat.slug)}
                className="text-[10px] uppercase tracking-[0.25em] font-medium text-stone-600 hover:text-black transition-colors"
              >
                {cat.name}
              </button>
            ))}
            <button
              onClick={() => onNavigate('shop', 'sale')}
              className="text-[10px] uppercase tracking-[0.25em] font-medium text-stone-800 hover:text-black transition-colors border-b border-transparent hover:border-stone-400"
            >
              Special Offers
            </button>
          </div>
        </div>
      </div>

      {/* 4. MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FAF9F6] h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-stone-200 p-6 z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-stone-200">
                <div>
                  <span className="font-serif text-2xl font-light italic tracking-[0.15em] text-[#1A1A1A]">
                    GULPASH
                  </span>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-stone-400">Pakistani Haute Couture</p>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-stone-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 flex flex-col space-y-4">
                <button
                  onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
                  className="text-left text-xs uppercase tracking-widest font-medium text-stone-800 hover:text-black py-2 border-b border-stone-200"
                >
                  Home
                </button>
                <button
                  onClick={() => { onNavigate('shop'); setMobileMenuOpen(false); }}
                  className="text-left text-xs uppercase tracking-widest font-medium text-stone-800 hover:text-black py-2 border-b border-stone-200"
                >
                  Shop All Products
                </button>
                <button
                  onClick={() => { onNavigate('collection', 'nur-jahan-festive-lawn'); setMobileMenuOpen(false); }}
                  className="text-left text-xs uppercase tracking-widest font-medium text-stone-900 flex items-center justify-between py-2 border-b border-stone-200"
                >
                  <span>Nur Jahan Lawn '26</span>
                  <span className="text-[9px] bg-stone-900 text-white px-2 py-0.5 tracking-wider">NEW</span>
                </button>

                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { onNavigate('category', cat.slug); setMobileMenuOpen(false); }}
                    className="text-left text-xs uppercase tracking-widest font-medium text-stone-600 hover:text-black py-2 border-b border-stone-200"
                  >
                    {cat.name}
                  </button>
                ))}

                <button
                  onClick={() => { onOpenTrackOrder(); setMobileMenuOpen(false); }}
                  className="text-left text-xs uppercase tracking-widest font-medium text-stone-700 hover:text-black py-2 border-b border-stone-200"
                >
                  Track My Order
                </button>

                <button
                  onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                  className="text-left text-xs uppercase tracking-widest font-medium text-stone-500 py-2"
                >
                  Admin Portal Login
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-stone-200 space-y-3">
              <a 
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white text-[11px] font-semibold py-3 px-4 tracking-widest uppercase"
              >
                <Phone className="w-3.5 h-3.5" /> WhatsApp Assistance
              </a>
              <p className="text-center text-[10px] uppercase tracking-wider text-stone-400">
                Nationwide Delivery &bull; Cash on Delivery
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
