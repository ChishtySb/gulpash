import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, AlertTriangle, RefreshCw, X, Bell,
  ShieldCheck, ArrowRight, ExternalLink, Sparkles
} from 'lucide-react';
import { Product, Order, SiteSettings, CMSConfig, Collection, Category } from '../../types';
import { StorageService } from '../../lib/storage';
import { NotificationService } from '../../lib/notifications';

// Layout shell components
import { AdminSidebar, AdminMainSection } from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';
import { AdminErrorBoundary } from './AdminErrorBoundary';

// Section views
import { DashboardSection } from './sections/DashboardSection';
import { ProductsSection } from './sections/ProductsSection';
import { OrdersSection } from './sections/OrdersSection';
import { CustomersSection } from './sections/CustomersSection';
import { StorefrontSection, StorefrontSubview } from './sections/StorefrontSection';
import { MarketingSeoSection } from './sections/MarketingSeoSection';
import { MediaLibrarySection } from './sections/MediaLibrarySection';
import { SettingsSection } from './sections/SettingsSection';
import { StorefrontControlAuditSection } from './sections/StorefrontControlAuditSection';
import { ActivityLogSection } from './sections/ActivityLogSection';
import { CatalogSyncSection } from './sections/CatalogSyncSection';
import { MigrationReportView } from './MigrationReportView';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onNavigateToStoreProduct?: (slug: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitAdmin,
  onNavigateToStoreProduct
}) => {
  // 1. DYNAMIC DATABASE & STORAGE STATE
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts(true));
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [settings, setSettings] = useState<SiteSettings>(() => StorageService.getSettings());
  const [cms, setCms] = useState<CMSConfig>(() => StorageService.getCMS());
  const [collections, setCollections] = useState<Collection[]>(() => StorageService.getCollections());
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());

  // 2. NAVIGATION & WORKSPACE STATE
  const [activeSection, setActiveSection] = useState<AdminMainSection>('dashboard');
  const [activeSubview, setActiveSubview] = useState<string>('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 3. RESPONSIVE SHELL CONTROLS
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState<boolean>(() => {
    try {
      return localStorage.getItem('gulpash_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  // 4. NOTIFICATION & STATUS FEEDBACK
  const [unreadCount, setUnreadCount] = useState<number>(() => NotificationService.getUnreadCount());
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Toggle desktop sidebar collapse & persist
  const handleToggleCollapseDesktop = () => {
    setIsCollapsedDesktop(prev => {
      const next = !prev;
      try {
        localStorage.setItem('gulpash_admin_sidebar_collapsed', String(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  // Reload all application data
  const reloadData = useCallback(() => {
    setProducts(StorageService.getProducts(true));
    setOrders(StorageService.getOrders());
    setSettings(StorageService.getSettings());
    setCms(StorageService.getCMS());
    setCollections(StorageService.getCollections());
    setCategories(StorageService.getCategories());
    setUnreadCount(NotificationService.getUnreadCount());
  }, []);

  // Listen for storage change events to keep UI synchronized
  useEffect(() => {
    const handleDataChange = () => {
      reloadData();
    };

    window.addEventListener('gulpash_data_changed', handleDataChange);
    window.addEventListener('storage', handleDataChange);

    return () => {
      window.removeEventListener('gulpash_data_changed', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
    };
  }, [reloadData]);

  // Operational notification / save feedback trigger
  const triggerNotification = useCallback((message: string, status: 'saving' | 'saved' | 'failed' = 'saved') => {
    setStatusMessage(message);
    setSaveStatus(status);

    if (status === 'saving') {
      // Safety auto-release after 15 seconds if any asynchronous operation hangs
      const safetyTimer = setTimeout(() => {
        setSaveStatus(prev => (prev === 'saving' ? 'idle' : prev));
        setStatusMessage(prev => (prev === message ? null : prev));
      }, 15000);
      return () => clearTimeout(safetyTimer);
    } else {
      const timer = setTimeout(() => {
        setStatusMessage(null);
        setSaveStatus('idle');
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Master navigation handler
  const handleNavigate = (section: AdminMainSection | string, subview?: string) => {
    const targetSection = (section === 'products' ? 'catalog' : section) as AdminMainSection;
    setActiveSection(targetSection);

    // Default subview mappings if none provided
    if (subview) {
      setActiveSubview(subview);
    } else {
      if (targetSection === 'dashboard') setActiveSubview('overview');
      else if (targetSection === 'catalog') setActiveSubview('products');
      else if (targetSection === 'orders') setActiveSubview('all');
      else if (targetSection === 'customers') setActiveSubview('all');
      else if (targetSection === 'storefront') setActiveSubview('homepage');
      else if (targetSection === 'marketing') setActiveSubview('seo');
      else if (targetSection === 'notifications') setActiveSubview('all');
      else if (targetSection === 'settings') setActiveSubview('store');
      else if (targetSection === 'system') setActiveSubview('audit');
      else setActiveSubview('overview');
    }

    // Reset modals if switching away
    if (targetSection !== 'catalog' || subview !== 'add') {
      setEditingProduct(null);
    }
    if (targetSection !== 'orders') {
      setSelectedOrder(null);
    }

    // Scroll main window to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quick action: Add new product
  const handleQuickAddProduct = () => {
    setEditingProduct(null);
    setActiveSection('catalog');
    setActiveSubview('add');
  };

  // Quick action: Select product to edit
  const handleSelectProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveSection('catalog');
    setActiveSubview('add');
  };

  // Quick action: Select order to inspect
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setActiveSection('orders');
    setActiveSubview('all');
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] text-stone-900 font-sans antialiased flex flex-col">
      {/* 1. LEFT SIDEBAR (COLLAPSIBLE DESKTOP + MOBILE DRAWER) */}
      <AdminSidebar
        activeSection={activeSection}
        activeSubview={activeSubview}
        onNavigate={handleNavigate}
        orders={orders}
        products={products}
        unreadNotificationCount={unreadCount}
        onExitAdmin={onExitAdmin}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        isCollapsedDesktop={isCollapsedDesktop}
        onToggleCollapseDesktop={handleToggleCollapseDesktop}
      />

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsedDesktop ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* TOP ADMIN BAR */}
        <AdminTopNav
          onToggleMobileMenu={() => setIsOpenMobile(true)}
          currentSection={activeSection}
          currentSubview={activeSubview}
          onExitAdmin={onExitAdmin}
          onQuickAddProduct={handleQuickAddProduct}
          onSelectProduct={handleSelectProduct}
          onSelectOrder={handleSelectOrder}
          products={products}
          orders={orders}
          onNavigateTab={handleNavigate}
        />

        {/* SAVE / STATUS FLOATING BANNER */}
        {statusMessage && (
          <div className="sticky top-16 z-20 px-4 sm:px-6 lg:px-8 pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className={`p-3 rounded-lg border shadow-sm flex items-center justify-between text-xs font-medium ${
              saveStatus === 'saving' ? 'bg-amber-50 border-amber-300 text-amber-900' :
              saveStatus === 'failed' ? 'bg-rose-50 border-rose-300 text-rose-900' :
              'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              <div className="flex items-center gap-2">
                {saveStatus === 'saving' && <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-700" />}
                {saveStatus === 'saved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                {saveStatus === 'failed' && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                <span>{statusMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                className="p-1 hover:bg-black/5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* WORKSPACE CONTENT WRAPPED IN REACT ERROR BOUNDARY */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AdminErrorBoundary 
            key={`${activeSection}-${activeSubview}`}
            moduleName={`${activeSection.toUpperCase()} View`}
            onReset={() => handleNavigate('dashboard', 'overview')}
          >
            {/* 1. DASHBOARD */}
            {activeSection === 'dashboard' && (
              <DashboardSection
                products={products}
                orders={orders}
                settings={settings}
                onNavigate={handleNavigate}
                onSelectOrder={handleSelectOrder}
                onEditProduct={(p) => {
                  setEditingProduct(p);
                  setActiveSection('catalog');
                  setActiveSubview('add');
                }}
              />
            )}

            {/* 2. CATALOG & PRODUCTS */}
            {(activeSection === 'catalog' || activeSection === 'products') && (
              <>
                {activeSubview === 'sync' ? (
                  <CatalogSyncSection products={products} onNotify={triggerNotification} />
                ) : (
                  <ProductsSection
                    products={products}
                    categories={categories}
                    collections={collections}
                    subview={activeSubview as any}
                    editingProduct={editingProduct}
                    onSelectProductToEdit={setEditingProduct}
                    onNavigateSub={(sub) => setActiveSubview(sub)}
                    onNotify={triggerNotification}
                  />
                )}
              </>
            )}

            {/* 3. ORDERS & PAYMENTS */}
            {activeSection === 'orders' && (
              <OrdersSection
                orders={orders}
                settings={settings}
                subview={activeSubview as any}
                selectedOrder={selectedOrder}
                onSelectOrder={setSelectedOrder}
                onNavigateSub={(sub) => setActiveSubview(sub)}
                onNotify={triggerNotification}
              />
            )}

            {/* 4. CUSTOMERS */}
            {activeSection === 'customers' && (
              <CustomersSection
                orders={orders}
                subview={(activeSubview as any) === 'repeat' || (activeSubview as any) === 'high_value' ? (activeSubview as any) : 'all'}
                onNavigateSub={(sub) => setActiveSubview(sub)}
                onSelectOrder={(orderId) => {
                  const found = orders.find(o => o.id === orderId);
                  if (found) handleSelectOrder(found);
                }}
                onNotify={triggerNotification}
              />
            )}

            {/* 5. STOREFRONT CMS */}
            {activeSection === 'storefront' && (
              <>
                {activeSubview === 'media' ? (
                  <MediaLibrarySection onNotify={triggerNotification} />
                ) : (
                  <StorefrontSection
                    collections={collections}
                    cms={cms}
                    settings={settings}
                    subview={activeSubview as StorefrontSubview}
                    onNavigateSub={(sub) => setActiveSubview(sub)}
                    onNotify={triggerNotification}
                  />
                )}
              </>
            )}

            {/* 6. MARKETING & SEO */}
            {activeSection === 'marketing' && (
              <MarketingSeoSection
                settings={settings}
                subview={(activeSubview as any) === 'promotions' ? 'promotions' : 'seo'}
                onNavigateSub={(sub) => setActiveSubview(sub)}
                onNotify={triggerNotification}
              />
            )}

            {/* 7. NOTIFICATIONS */}
            {activeSection === 'notifications' && (
              <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Admin Notification History</h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Audit log of customer order placements, advance payment screenshots, and inventory alerts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      NotificationService.markAllAsRead();
                      setUnreadCount(0);
                      triggerNotification('All notifications marked as read.');
                    }}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    Mark All Read
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {NotificationService.getNotifications().length === 0 ? (
                    <div className="py-12 text-center text-stone-400 text-xs">
                      <Bell className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                      <p>No notifications recorded yet.</p>
                    </div>
                  ) : (
                    NotificationService.getNotifications().map(n => (
                      <div key={n.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <div>
                            <h4 className="font-semibold text-stone-900">{n.title}</h4>
                            <p className="text-stone-600 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                              {new Date(n.timestamp).toLocaleString('en-PK')}
                            </span>
                          </div>
                        </div>
                        {n.orderId && (
                          <button
                            type="button"
                            onClick={() => {
                              const found = orders.find(o => o.id === n.orderId);
                              if (found) handleSelectOrder(found);
                              else handleNavigate('orders', 'all');
                            }}
                            className="text-[11px] text-amber-800 font-bold hover:underline shrink-0"
                          >
                            Open Order
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 8. SETTINGS */}
            {activeSection === 'settings' && (
              <SettingsSection
                settings={settings}
                subview={activeSubview as any}
                onNavigateSub={(sub) => setActiveSubview(sub)}
                onNotify={triggerNotification}
              />
            )}

            {/* 9. SYSTEM AUDIT & CATALOG REPORTS */}
            {activeSection === 'system' && (
              <>
                {activeSubview === 'catalog_audit' ? (
                  <MigrationReportView onNavigateToProduct={onNavigateToStoreProduct} />
                ) : activeSubview === 'activity' ? (
                  <ActivityLogSection onNotify={triggerNotification} />
                ) : (
                  <StorefrontControlAuditSection
                    onNavigateToSection={(s, sub) => handleNavigate(s, sub)}
                    onNotify={triggerNotification}
                  />
                )}
              </>
            )}
          </AdminErrorBoundary>
        </main>
      </div>
    </div>
  );
};
