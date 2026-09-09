import React from 'react';
import { 
  DollarSign, ShoppingBag, Package, AlertTriangle, 
  CreditCard, TrendingUp, CheckCircle2, Truck, ArrowRight,
  Sparkles, ShieldCheck, Eye, Plus, ArrowUpRight
} from 'lucide-react';
import { Order, Product, SiteSettings } from '../../../types';
import { formatPrice } from '../../../lib/currency';

interface DashboardSectionProps {
  products: Product[];
  orders: Order[];
  settings: SiteSettings;
  onNavigate: (section: string, subview?: string) => void;
  onSelectOrder: (order: Order) => void;
  onEditProduct: (product: Product | null) => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  products,
  orders,
  settings,
  onNavigate,
  onSelectOrder,
  onEditProduct
}) => {
  // Calculations
  const totalRevenue = orders.reduce((sum, o) => {
    // Only count non-cancelled orders
    if (o.status !== 'Cancelled') {
      return sum + (o.total || 0);
    }
    return sum;
  }, 0);

  const pendingProofs = orders.filter(
    o => o.status === 'Payment Verification Pending' || (o.paymentProof && o.paymentStatus === 'Under Verification')
  );

  const advanceOrders = orders.filter(o => o.paymentMethod !== 'Cash on Delivery (COD)');
  const codOrders = orders.filter(o => o.paymentMethod === 'Cash on Delivery (COD)');

  const lowStockThreshold = settings.notifications?.lowStockThreshold || 5;
  const lowStockProducts = products.filter(p => (p.stock || 0) <= lowStockThreshold && p.status === 'Active');

  const pendingShipments = orders.filter(o => o.status === 'Confirmed' || o.status === 'In Production');
  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Shortcuts */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 block mb-1">
            GulPash Store Control
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-light text-stone-900">
            Welcome to Store Operations
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xl">
            Live overview of store revenue, advance payment verifications, dispatch pipeline, and inventory status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onEditProduct(null)}
            className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium uppercase tracking-wider px-3.5 py-2.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('storefront', 'collections')}
            className="border border-stone-300 hover:border-stone-900 bg-white text-stone-800 text-xs font-medium uppercase tracking-wider px-3 py-2.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Manage Collections</span>
          </button>
        </div>
      </div>

      {/* Urgent Action Alerts */}
      {pendingProofs.length > 0 && (
        <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-lg flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-200/70 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                {pendingProofs.length} Advance Payment {pendingProofs.length === 1 ? 'Proof' : 'Proofs'} Awaiting Verification
              </h4>
              <p className="text-[11px] text-amber-800">
                Customers submitted JazzCash / Easypaisa / Bank screenshots that need approval before production.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('orders', 'proof_verification')}
            className="text-xs font-bold uppercase tracking-wider bg-amber-900 text-white px-3 py-1.5 rounded hover:bg-amber-950 transition-colors shrink-0 cursor-pointer"
          >
            Verify Now
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white border border-stone-200 rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">Gross Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-light text-stone-900 font-mono">
            {formatPrice(totalRevenue, 'PKR')}
          </div>
          <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span>{orders.length} lifetime orders</span>
          </div>
        </div>

        {/* Orders Pipeline */}
        <div className="bg-white border border-stone-200 rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">To Dispatch</span>
            <Truck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-light text-stone-900">
            {pendingShipments.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Confirmed & in production
          </div>
        </div>

        {/* Advance vs COD Split */}
        <div className="bg-white border border-stone-200 rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">Payment Ratio</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-light text-stone-900">
            {advanceOrders.length} <span className="text-xs text-stone-400 font-sans">Advance</span> / {codOrders.length} <span className="text-xs text-stone-400 font-sans">COD</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {orders.length > 0 ? Math.round((advanceOrders.length / orders.length) * 100) : 0}% prepaid orders
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-stone-200 rounded-lg p-4 sm:p-5">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-stone-500">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-light text-stone-900">
            {lowStockProducts.length}
          </div>
          <div className="text-[11px] text-rose-600 mt-1">
            {lowStockProducts.length > 0 ? 'Requires restocking' : 'Inventory healthy'}
          </div>
        </div>
      </div>

      {/* Main Row: Recent Orders & Quick Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-lg overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Recent Customer Orders
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Real-time stream of incoming customer purchases
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('orders', 'all')}
              className="text-xs text-stone-700 hover:text-stone-900 font-medium flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-xs">
                No orders placed yet.
              </div>
            ) : (
              recentOrders.map((order) => {
                const isAdvance = order.paymentMethod !== 'Cash on Delivery (COD)';
                const hasProof = !!order.paymentProof?.screenshotUrl;

                return (
                  <div
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-900">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs text-stone-700 font-medium truncate">
                          {order.customer.fullName}
                        </span>
                        {isAdvance && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider rounded">
                            Advance Free Delivery
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-2">
                        <span>{order.customer.city}</span>
                        <span>&bull;</span>
                        <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                        <span>&bull;</span>
                        <span>{new Date(order.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-stone-900">
                        {formatPrice(order.total, 'PKR')}
                      </div>
                      <div className="mt-1 flex items-center justify-end gap-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                          order.status === 'Dispatched' ? 'bg-indigo-50 text-indigo-700' :
                          order.status === 'Payment Verification Pending' ? 'bg-amber-50 text-amber-800 font-bold' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Operational Shortcuts (1 Col) */}
        <div className="space-y-4">
          {/* Quick Tasks Card */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2">
              Management Hub
            </h4>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onNavigate('products', 'add')}
                className="w-full text-left p-2.5 rounded hover:bg-stone-50 border border-stone-200 transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-stone-700" />
                  <div>
                    <strong className="block text-stone-900">New Product</strong>
                    <span className="text-[11px] text-stone-500 font-light">Add luxury attire & upload PC photos</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('storefront', 'collections')}
                className="w-full text-left p-2.5 rounded hover:bg-stone-50 border border-stone-200 transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <div>
                    <strong className="block text-stone-900">Storefront Collections</strong>
                    <span className="text-[11px] text-stone-500 font-light">Manage the 6 signature lines & banners</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('media', 'all')}
                className="w-full text-left p-2.5 rounded hover:bg-stone-50 border border-stone-200 transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  <div>
                    <strong className="block text-stone-900">Media Library</strong>
                    <span className="text-[11px] text-stone-500 font-light">PC asset uploads & image URLs</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('settings', 'shipping')}
                className="w-full text-left p-2.5 rounded hover:bg-stone-50 border border-stone-200 transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <div>
                    <strong className="block text-stone-900">Advance Free Delivery</strong>
                    <span className="text-[11px] text-stone-500 font-light">Configure shipping incentives & rules</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>
          </div>

          {/* Catalog Snapshot */}
          <div className="bg-stone-900 text-white rounded-lg p-5 space-y-3">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
              Active Inventory
            </span>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-serif font-light">{products.length}</div>
                <span className="text-[11px] text-stone-400">Total Live Ensembles</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('products', 'all')}
                className="px-3 py-1.5 bg-white text-stone-900 text-[11px] font-bold uppercase tracking-wider rounded hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Catalog
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
