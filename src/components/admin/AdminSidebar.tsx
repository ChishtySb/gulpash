import React from 'react';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Store, 
  Megaphone, Bell, Settings, ShieldCheck, ExternalLink, 
  LogOut, ChevronRight, RefreshCw, Layers, Sparkles, 
  FileCheck, History, Image as ImageIcon, Plus, Truck,
  CreditCard, Smartphone, CheckCircle2, ChevronDown,
  PanelLeftClose, PanelLeftOpen, Database, Sliders
} from 'lucide-react';
import { Order, Product } from '../../types';

export type AdminMainSection = 
  | 'dashboard' 
  | 'catalog' 
  | 'products' // alias for catalog
  | 'orders' 
  | 'customers' 
  | 'storefront' 
  | 'marketing' 
  | 'notifications' 
  | 'settings' 
  | 'system';

interface AdminSidebarProps {
  activeSection: string;
  activeSubview: string;
  onNavigate: (section: AdminMainSection, subview?: string) => void;
  orders: Order[];
  products: Product[];
  unreadNotificationCount: number;
  onExitAdmin: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsedDesktop?: boolean;
  onToggleCollapseDesktop?: () => void;
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
  onCloseMobile,
  isCollapsedDesktop = false,
  onToggleCollapseDesktop
}) => {
  // Normalize active section (catalog/products compatibility)
  const normalizedSection = activeSection === 'products' ? 'catalog' : activeSection;

  // Metric badge counts
  const pendingOrdersCount = orders.filter(
    o => o.status === 'Pending' || o.status === 'Payment Verification Pending'
  ).length;

  const pendingProofCount = orders.filter(
    o => o.status === 'Payment Verification Pending' || (o.paymentProof && o.paymentStatus === 'Under Verification')
  ).length;

  const lowStockThreshold = 5;
  const lowStockCount = products.filter(
    p => (p.stock !== undefined && p.stock <= lowStockThreshold && p.stock > 0) || 
         (p.variants && p.variants.some(v => (v.stock || 0) <= 3 && (v.stock || 0) > 0))
  ).length;

  interface NavItem {
    id: AdminMainSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
    subviews?: Array<{ id: string; label: string; badge?: number }>;
  }

  // EXACT STRUCTURE REQUESTED BY USER
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      subviews: [
        { id: 'overview', label: 'Overview' }
      ]
    },
    {
      id: 'catalog',
      label: 'Catalog',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-500 text-black',
      subviews: [
        { id: 'products', label: 'Products' },
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
        { id: 'proof_verification', label: 'Payment Verification', badge: pendingProofCount > 0 ? pendingProofCount : undefined },
        { id: 'ready_dispatch', label: 'Ready to Dispatch' }
      ]
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      subviews: [
        { id: 'all', label: 'Customers' }
      ]
    },
    {
      id: 'storefront',
      label: 'Storefront',
      icon: Store,
      subviews: [
        { id: 'homepage', label: 'Homepage' },
        { id: 'hero', label: 'Hero & Media' },
        { id: 'campaign', label: 'Editorial Campaign' },
        { id: 'collections', label: 'Collections' },
        { id: 'banners', label: 'Banners' },
        { id: 'navigation', label: 'Header & Navigation' },
        { id: 'announcement', label: 'Announcement Bar' },
        { id: 'footer', label: 'Footer' },
        { id: 'media', label: 'Media Library' }
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: Megaphone,
      subviews: [
        { id: 'seo', label: 'SEO' }
      ]
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
      subviews: [
        { id: 'all', label: 'All Notifications' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      subviews: [
        { id: 'store', label: 'Store & Branding' },
        { id: 'shipping', label: 'Shipping' },
        { id: 'payments', label: 'Payments' },
        { id: 'whatsapp', label: 'WhatsApp & Contact' },
        { id: 'social', label: 'Social Links' },
        { id: 'notifications', label: 'Notifications' }
      ]
    },
    {
      id: 'system',
      label: 'System',
      icon: ShieldCheck,
      subviews: [
        { id: 'audit', label: 'Control Audit' },
        { id: 'catalog_audit', label: 'Catalog Audit' },
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
        className={`fixed top-0 left-0 bottom-0 z-50 bg-[#121212] text-stone-300 flex flex-col border-r border-[#242424] transition-all duration-300 ease-in-out ${
          isOpenMobile 
            ? 'translate-x-0 w-72 shadow-2xl' 
            : '-translate-x-full lg:translate-x-0'
        } ${
          isCollapsedDesktop ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        {/* BRAND & HEADER */}
        <div className="p-4 border-b border-[#242424] flex items-center justify-between min-h-16">
          {!isCollapsedDesktop ? (
            <div className="animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <span className="font-rush-driver text-lg tracking-wider text-white font-bold">
                  GULPASH
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] bg-stone-800 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] text-stone-400 tracking-wider uppercase block mt-0.5 font-medium">
                Control Center
              </span>
            </div>
          ) : (
            <div className="mx-auto text-amber-400 font-bold font-rush-driver text-lg">
              GP
            </div>
          )}

          {/* Desktop Collapse Toggle Button */}
          {onToggleCollapseDesktop && (
            <button
              type="button"
              onClick={onToggleCollapseDesktop}
              title={isCollapsedDesktop ? "Expand Sidebar" : "Collapse Sidebar"}
              className="hidden lg:flex p-1.5 text-stone-400 hover:text-white rounded hover:bg-stone-800 transition-colors"
            >
              {isCollapsedDesktop ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* NAVIGATION LIST */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSectionActive = normalizedSection === item.id;
            const hasSubviews = item.subviews && item.subviews.length > 0;

            return (
              <div key={item.id} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id, item.subviews ? item.subviews[0].id : undefined)}
                  title={isCollapsedDesktop ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isCollapsedDesktop ? 'justify-center px-2 py-3' : 'justify-between px-3 py-2.5'
                  } rounded-lg font-medium transition-all cursor-pointer group ${
                    isSectionActive
                      ? 'bg-stone-800/95 text-white shadow-xs font-semibold border-l-2 border-amber-400'
                      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isSectionActive ? 'text-amber-400' : 'text-stone-400 group-hover:text-stone-200'
                    }`} />
                    {!isCollapsedDesktop && (
                      <span className="tracking-wide text-xs truncate">{item.label}</span>
                    )}
                  </div>

                  {!isCollapsedDesktop && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          item.badgeColor || 'bg-stone-700 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {hasSubviews && item.subviews!.length > 1 && (
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 text-stone-500 ${
                          isSectionActive ? 'rotate-90 text-stone-300' : ''
                        }`} />
                      )}
                    </div>
                  )}
                </button>

                {/* Subviews (Visible when section is active and sidebar is expanded) */}
                {!isCollapsedDesktop && isSectionActive && hasSubviews && (
                  <div className="pl-6 pr-2 py-1 space-y-0.5 border-l border-stone-800 ml-5 my-1 animate-in fade-in duration-150">
                    {item.subviews!.map((sub) => {
                      const isSubActive = activeSubview === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleNavClick(item.id, sub.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors cursor-pointer text-left ${
                            isSubActive
                              ? 'bg-stone-800/90 text-amber-300 font-semibold'
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
        <div className="p-3 border-t border-[#242424] bg-[#0c0c0c] space-y-2 text-xs">
          {!isCollapsedDesktop ? (
            <>
              {/* Live Baseline Indicator */}
              <div className="flex items-center justify-between px-2.5 py-1.5 bg-stone-900/70 rounded border border-stone-800/70 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-stone-300 font-mono">Catalog Baseline</span>
                </div>
                <span className="text-emerald-400 font-bold font-mono">38 ACTIVE</span>
              </div>

              {/* Admin User Info & Exit */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-bold text-xs shrink-0 shadow-xs">
                    GP
                  </div>
                  <div className="leading-tight truncate">
                    <span className="font-semibold text-stone-200 block text-[11px] truncate">Admin Concierge</span>
                    <span className="text-[9px] text-stone-500 font-mono">admin@gulpash.online</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onExitAdmin}
                  title="Return to Storefront"
                  className="p-1.5 text-stone-400 hover:text-rose-400 rounded hover:bg-stone-900 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <button
                type="button"
                onClick={onExitAdmin}
                title="Return to Storefront"
                className="p-2 text-stone-400 hover:text-rose-400 rounded hover:bg-stone-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
