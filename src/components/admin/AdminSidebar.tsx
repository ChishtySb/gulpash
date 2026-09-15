import React from 'react';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Store, 
  Megaphone, Bell, Settings, ShieldCheck, ExternalLink, 
  LogOut, ChevronRight, RefreshCw, Layers, Sparkles, 
  FileCheck, History, Image as ImageIcon, Plus, Truck,
  CreditCard, Smartphone, CheckCircle2, ChevronDown
} from 'lucide-react';
import { Order, Product } from '../../types';

export type AdminMainSection = 
  | 'dashboard' 
  | 'products' 
  | 'orders' 
  | 'customers' 
  | 'storefront' 
  | 'marketing' 
  | 'notifications' 
  | 'settings' 
  | 'system';

interface AdminSidebarProps {
  activeSection: AdminMainSection;
  activeSubview: string;
  onNavigate: (section: AdminMainSection, subview?: string) => void;
  orders: Order[];
  products: Product[];
  unreadNotificationCount: number;
  onExitAdmin: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  activeSubview,
  onNavigate,
  orders,
  products,
  unreadNotificationCount,
  onExitAdmin,
  isOpenMobile,
  onCloseMobile
}) => {
  // Metric badge counts
  const pendingOrdersCount = orders.filter(
    o => o.status === 'Pending' || o.status === 'Payment Verification Pending'
  ).length;

  const lowStockCount = products.filter(
    p => (p.stock !== undefined && p.stock <= 5) || (p.variants && p.variants.some(v => (v.stock || 0) <= 3))
  ).length;

  interface NavItem {
    id: AdminMainSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
    subviews?: Array<{ id: string; label: string; badge?: number }>;
  }

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-500 text-black',
      subviews: [
        { id: 'all', label: 'All Products' },
        { id: 'add', label: 'Add Product' },
        { id: 'inventory', label: 'Inventory & Stock', badge: lowStockCount > 0 ? lowStockCount : undefined },
        { id: 'collections', label: 'Collections' },
        { id: 'sync', label: 'Catalog Sync' }
      ]
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
      subviews: [
        { id: 'all', label: 'All Orders' },
        { id: 'proof_verification', label: 'Payment Verification', badge: orders.filter(o => o.status === 'Payment Verification Pending').length || undefined },
        { id: 'pending_advance', label: 'Pending Advance' },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'dispatched', label: 'Ready to Dispatch' },
        { id: 'delivered', label: 'Delivered' },
        { id: 'returns', label: 'Cancelled / Returns' }
      ]
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      subviews: [
        { id: 'all', label: 'All Customers' },
        { id: 'repeat', label: 'Repeat Buyers' },
        { id: 'high_value', label: 'High Value (VIP)' }
      ]
    },
    {
      id: 'storefront',
      label: 'Storefront',
      icon: Store,
      subviews: [
        { id: 'homepage', label: 'Homepage CMS' },
        { id: 'hero', label: 'Hero Slides (Video/Img)' },
        { id: 'collections', label: 'Collections & Banners' },
        { id: 'navigation', label: 'Header & Navigation' },
        { id: 'announcement', label: 'Announcement Bar' },
        { id: 'footer', label: 'Footer & Links' },
        { id: 'media', label: 'Media Library' }
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing / SEO',
      icon: Megaphone,
      subviews: [
        { id: 'seo', label: 'SEO Metadata' },
        { id: 'promotions', label: 'Promotional Banners' }
      ]
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      subviews: [
        { id: 'store', label: 'Store & Branding' },
        { id: 'shipping', label: 'Shipping & Delivery' },
        { id: 'payments', label: 'Payment Methods' },
        { id: 'whatsapp', label: 'WhatsApp & Contact' },
        { id: 'social', label: 'Social Media' },
        { id: 'roles', label: 'Security & Admin' }
      ]
    },
    {
      id: 'system',
      label: 'System',
      icon: ShieldCheck,
      subviews: [
        { id: 'audit', label: 'Store Control Audit' },
        { id: 'activity', label: 'Activity Log' }
      ]
    }
  ];

  const handleNavClick = (section: AdminMainSection, subview?: string) => {
    onNavigate(section, subview);
    if (window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#141414] text-stone-300 flex flex-col border-r border-[#262626] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* BRAND HEADER */}
        <div className="p-5 border-b border-[#262626] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-rush-driver text-xl tracking-wider text-white font-bold">
                GULPASH
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded font-mono font-bold">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-stone-400 tracking-wider uppercase block mt-0.5 font-medium">
              Store Control Center
            </span>
          </div>

          <button
            onClick={onExitAdmin}
            title="View Storefront"
            className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-white bg-stone-900 hover:bg-stone-800 px-2.5 py-1.5 rounded border border-stone-800 transition-colors"
          >
            <span>Store</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* NAVIGATION LIST */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSectionActive = activeSection === item.id;
            const hasSubviews = item.subviews && item.subviews.length > 0;

            return (
              <div key={item.id} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id, item.subviews ? item.subviews[0].id : undefined)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md font-medium transition-colors cursor-pointer group ${
                    isSectionActive
                      ? 'bg-stone-800/90 text-white shadow-xs font-semibold'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isSectionActive ? 'text-amber-400' : 'text-stone-400 group-hover:text-stone-200'
                    }`} />
                    <span className="tracking-wide text-xs">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        item.badgeColor || 'bg-stone-700 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {hasSubviews && (
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 text-stone-400 ${
                        isSectionActive ? 'rotate-90 text-stone-300' : ''
                      }`} />
                    )}
                  </div>
                </button>

                {/* Subviews */}
                {isSectionActive && hasSubviews && (
                  <div className="pl-6 pr-2 py-1 space-y-0.5 border-l border-stone-800 ml-5 my-1 animate-in fade-in slide-in-from-top-1">
                    {item.subviews!.map((sub) => {
                      const isSubActive = activeSubview === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleNavClick(item.id, sub.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[11px] transition-colors cursor-pointer text-left ${
                            isSubActive
                              ? 'bg-stone-800 text-amber-300 font-bold'
                              : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'
                          }`}
                        >
                          <span className="truncate">{sub.label}</span>
                          {sub.badge !== undefined && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-stone-700 text-white font-mono font-bold">
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* FOOTER & STATUS */}
        <div className="p-3.5 border-t border-[#262626] bg-[#0e0e0e] space-y-3 text-xs">
          {/* Live System Indicator */}
          <div className="flex items-center justify-between px-2 py-1.5 bg-stone-900/60 rounded border border-stone-800/60 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-stone-300 font-mono text-[10px]">Production Sync</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">LIVE (38/38)</span>
          </div>

          {/* Admin User Info */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-bold text-xs shadow-xs">
                GP
              </div>
              <div className="leading-tight">
                <span className="font-medium text-stone-200 block text-[11px]">Admin Concierge</span>
                <span className="text-[10px] text-stone-400">admin@gulpash.online</span>
              </div>
            </div>

            <button
              onClick={onExitAdmin}
              title="Exit Admin Panel"
              className="p-1.5 text-stone-400 hover:text-rose-400 rounded hover:bg-stone-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
