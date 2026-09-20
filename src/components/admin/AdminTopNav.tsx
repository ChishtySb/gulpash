import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, Search, ExternalLink, Plus, RefreshCw, 
  ChevronRight, X, Package, ShoppingBag, ArrowUpRight
} from 'lucide-react';
import { Product, Order } from '../../types';
import { AdminNotificationCenter } from './AdminNotificationCenter';
import { adminAuthService, AdminAuthState } from '../../lib/adminAuth';

interface AdminTopNavProps {
  onToggleMobileMenu: () => void;
  currentSection: string;
  currentSubview: string;
  onExitAdmin: () => void;
  onQuickAddProduct: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectOrder: (order: Order) => void;
  products: Product[];
  orders: Order[];
  onNavigateTab: (section: string, subview?: string) => void;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({
  onToggleMobileMenu,
  currentSection,
  currentSubview,
  onExitAdmin,
  onQuickAddProduct,
  onSelectProduct,
  onSelectOrder,
  products,
  orders,
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [authState, setAuthState] = useState<AdminAuthState>(() => adminAuthService.getState());
  const searchRef = useRef<HTMLDivElement>(null);

  // Monitor authoritative Supabase Auth status
  useEffect(() => {
    const unsubscribe = adminAuthService.subscribe((state) => {
      setAuthState(state);
    });
    return () => unsubscribe();
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products and orders for universal quick search
  const cleanQuery = searchQuery.trim().toLowerCase();
  const matchedProducts = cleanQuery.length >= 2
    ? products.filter(p => 
        p.title.toLowerCase().includes(cleanQuery) || 
        p.sku?.toLowerCase().includes(cleanQuery) ||
        p.slug.toLowerCase().includes(cleanQuery)
      ).slice(0, 5)
    : [];

  const matchedOrders = cleanQuery.length >= 2
    ? orders.filter(o => 
        o.orderNumber.toLowerCase().includes(cleanQuery) ||
        o.customer.fullName.toLowerCase().includes(cleanQuery) ||
        o.customer.phone.includes(cleanQuery) ||
        o.customer.city.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  const hasResults = matchedProducts.length > 0 || matchedOrders.length > 0;

  // Format section title for breadcrumbs
  const formatTitle = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-stone-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 font-sans shadow-2xs">
      {/* LEFT: Mobile Menu Button & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-100 lg:hidden cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
          <span className="text-stone-900 font-bold uppercase tracking-wider">
            {formatTitle(currentSection)}
          </span>
          {currentSubview && currentSubview !== currentSection && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-600 font-normal">
                {formatTitle(currentSubview)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* CENTER: Universal Search Bar */}
      <div ref={searchRef} className="relative flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search products by SKU/title, orders by customer/ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-stone-50 border border-stone-200 rounded-full focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Instant Search Results Dropdown */}
        {isSearchOpen && cleanQuery.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-stone-200 shadow-xl overflow-hidden z-50 text-xs animate-in fade-in">
            {!hasResults ? (
              <div className="p-4 text-center text-stone-400 text-xs">
                No matching products or orders found for "{searchQuery}".
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto divide-y divide-stone-100">
                {/* Matched Products */}
                {matchedProducts.length > 0 && (
                  <div className="p-2">
                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Products ({matchedProducts.length})
                    </span>
                    {matchedProducts.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          onSelectProduct(p);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-stone-50 rounded text-left transition-colors cursor-pointer group"
                      >
                        <img
                          src={p.images[0] || 'https://via.placeholder.com/60'}
                          alt={p.title}
                          className="w-8 h-10 object-cover rounded bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-stone-900 truncate group-hover:text-amber-700">
                            {p.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                            <span>{p.sku}</span>
                            <span>•</span>
                            <span className="text-stone-800 font-bold">Rs. {p.price.toLocaleString()}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 group-hover:text-stone-800 shrink-0">
                          Edit
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Matched Orders */}
                {matchedOrders.length > 0 && (
                  <div className="p-2">
                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Orders ({matchedOrders.length})
                    </span>
                    {matchedOrders.map(o => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => {
                          onSelectOrder(o);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center justify-between p-2 hover:bg-stone-50 rounded text-left transition-colors cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-stone-900 group-hover:text-amber-700">
                              {o.orderNumber}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {o.customer.fullName} ({o.customer.city})
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {o.customer.phone} • Rs. {o.total.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium">
                          {o.status}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: Actions, Notifications & Store Link */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Supabase Auth Session Indicator */}
        {authState.status === 'active' && (
          <div 
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-md font-medium"
            title={`Supabase Auth session active: ${authState.user?.email || 'Admin'} (role: admin)`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Auth: Active</span>
            <button
              type="button"
              onClick={() => adminAuthService.signOut()}
              className="ml-1 text-[10px] text-emerald-700 hover:text-emerald-950 underline cursor-pointer"
              title="Sign out of Supabase Admin"
            >
              Sign Out
            </button>
          </div>
        )}

        {authState.status === 'offline' && (
          <div 
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded-md font-medium"
            title="No active Supabase session"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Auth: Offline</span>
          </div>
        )}

        {authState.status === 'unauthorized' && (
          <div 
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 text-red-800 text-[11px] rounded-md font-medium"
            title="User authenticated but lacks admin role"
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Auth: Unauthorized</span>
            <button
              type="button"
              onClick={() => adminAuthService.signOut()}
              className="ml-1 text-[10px] text-red-700 hover:text-red-950 underline cursor-pointer"
            >
              Switch
            </button>
          </div>
        )}

        {/* Quick Add Product Button */}
        <button
          type="button"
          onClick={onQuickAddProduct}
          className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium px-3 py-2 rounded-md shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Product</span>
        </button>

        {/* Notifications Center */}
        <AdminNotificationCenter 
          onSelectOrder={(orderId) => {
            const found = orders.find(o => o.id === orderId);
            if (found) onSelectOrder(found);
          }}
          onNavigateTab={onNavigateTab}
        />

        {/* View Live Storefront Button */}
        <button
          type="button"
          onClick={onExitAdmin}
          className="flex items-center gap-1 text-xs text-stone-700 hover:text-stone-950 font-medium px-2.5 py-1.5 rounded-md hover:bg-stone-100 transition-colors border border-stone-200"
          title="Open customer-facing storefront"
        >
          <span className="hidden sm:inline">Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
