import React, { useState, useMemo } from 'react';
import { 
  DollarSign, ShoppingBag, Package, AlertTriangle, 
  CreditCard, TrendingUp, CheckCircle2, Truck, ArrowRight,
  Sparkles, ShieldCheck, Eye, Plus, ArrowUpRight, Calendar,
  Layers, Clock, Filter, AlertCircle, RefreshCw, ChevronRight
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

type DateFilterOption = 'today' | '7d' | '30d' | 'all' | 'custom';

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  products,
  orders,
  settings,
  onNavigate,
  onSelectOrder,
  onEditProduct
}) => {
  // Date filter state
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // 1. FILTER ORDERS BY DATE RANGE
  const filteredOrders = useMemo(() => {
    const now = new Date();
    
    if (dateFilter === 'today') {
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      return orders.filter(o => new Date(o.createdAt).getTime() >= startOfToday);
    }
    
    if (dateFilter === '7d') {
      const sevenDaysAgo = now.getTime() - (7 * 24 * 60 * 60 * 1000);
      return orders.filter(o => new Date(o.createdAt).getTime() >= sevenDaysAgo);
    }
    
    if (dateFilter === '30d') {
      const thirtyDaysAgo = now.getTime() - (30 * 24 * 60 * 60 * 1000);
      return orders.filter(o => new Date(o.createdAt).getTime() >= thirtyDaysAgo);
    }
    
    if (dateFilter === 'custom' && customStartDate) {
      const start = new Date(customStartDate).getTime();
      const end = customEndDate ? new Date(customEndDate).getTime() + (24 * 60 * 60 * 1000) : now.getTime();
      return orders.filter(o => {
        const time = new Date(o.createdAt).getTime();
        return time >= start && time <= end;
      });
    }
    
    return orders;
  }, [orders, dateFilter, customStartDate, customEndDate]);

  // 2. FINANCIAL & OPERATIONAL KPIS (Calculated from filtered orders)
  const periodRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => {
      if (o.status !== 'Cancelled') {
        return sum + (o.total || 0);
      }
      return sum;
    }, 0);
  }, [filteredOrders]);

  const totalAllTimeRevenue = useMemo(() => {
    return orders.reduce((sum, o) => {
      if (o.status !== 'Cancelled') {
        return sum + (o.total || 0);
      }
      return sum;
    }, 0);
  }, [orders]);

  // Today Sales specifically
  const todaySales = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return orders
      .filter(o => o.status !== 'Cancelled' && new Date(o.createdAt).getTime() >= startOfToday.getTime())
      .reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  // Pending advance proof verifications
  const pendingProofs = useMemo(() => {
    return orders.filter(
      o => o.status === 'Payment Verification Pending' || (o.paymentProof && o.paymentStatus === 'Under Verification')
    );
  }, [orders]);

  // New / Pending Orders
  const pendingOrders = useMemo(() => {
    return orders.filter(o => o.status === 'Pending' || o.status === 'Payment Verification Pending');
  }, [orders]);

  // Ready to dispatch / confirmed pipeline
  const readyToDispatch = useMemo(() => {
    return orders.filter(o => o.status === 'Confirmed' || o.status === 'In Production');
  }, [orders]);

  // 3. INVENTORY METRICS SEPARATION
  // Active storefront baseline
  const activeProducts = useMemo(() => {
    return products.filter(p => p.status === 'Active' && p.isVisible !== false);
  }, [products]);

  const lowStockThreshold = settings.notifications?.lowStockThreshold || 5;

  const lowStockProducts = useMemo(() => {
    return products.filter(p => {
      const stock = p.stock ?? 0;
      return stock > 0 && stock <= lowStockThreshold;
    });
  }, [products, lowStockThreshold]);

  const outOfStockProducts = useMemo(() => {
    return products.filter(p => (p.stock ?? 0) === 0);
  }, [products]);

  // Total inventory units = sum of all physical stock units across all items and variants
  const totalInventoryUnits = useMemo(() => {
    return products.reduce((total, p) => {
      if (p.variants && p.variants.length > 0) {
        const variantSum = p.variants.reduce((vSum, v) => vSum + (v.stock || 0), 0);
        return total + (variantSum > 0 ? variantSum : (p.stock || 0));
      }
      return total + (p.stock || 0);
    }, 0);
  }, [products]);

  // Payment split
  const advanceOrders = useMemo(() => orders.filter(o => o.paymentMethod !== 'Cash on Delivery (COD)'), [orders]);
  const codOrders = useMemo(() => orders.filter(o => o.paymentMethod === 'Cash on Delivery (COD)'), [orders]);

  // Recent 8 orders
  const recentOrders = useMemo(() => orders.slice(0, 8), [orders]);

  return (
    <div className="space-y-6 font-sans">
      {/* 1. WELCOME HEADER & QUICK ACTIONS */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono">
                Store Operations
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Catalog Baseline: {activeProducts.length} Active / 6 Collections
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-light text-stone-900 mt-1">
              GulPash Admin Control Center
            </h1>
            <p className="text-xs text-stone-500 mt-0.5 max-w-xl">
              Real-time monitoring of live sales, advance payment screenshots, dispatch pipeline, and inventory status.
            </p>
          </div>

          {/* SIMPLIFIED QUICK ACTIONS */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onEditProduct(null)}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('catalog', 'inventory')}
              className="border border-stone-300 hover:border-stone-900 hover:bg-stone-50 text-stone-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Package className="w-4 h-4 text-stone-600" />
              <span>Update Stock</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('orders', 'all')}
              className="border border-stone-300 hover:border-stone-900 hover:bg-stone-50 text-stone-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-stone-600" />
              <span>View Orders</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('orders', 'proof_verification')}
              className="border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-900 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-amber-700" />
              <span>Verify Payments</span>
              {pendingProofs.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-amber-600 text-white rounded-full text-[10px] font-mono font-bold">
                  {pendingProofs.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('storefront', 'homepage')}
              className="border border-stone-300 hover:border-stone-900 hover:bg-stone-50 text-stone-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Edit Homepage</span>
            </button>
          </div>
        </div>

        {/* DATE RANGE FILTER BAR */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>Filter Period:</span>
            </span>
            <div className="inline-flex bg-stone-100 p-0.5 rounded-lg border border-stone-200">
              <button
                type="button"
                onClick={() => setDateFilter('today')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  dateFilter === 'today' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDateFilter('7d')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  dateFilter === '7d' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => setDateFilter('30d')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  dateFilter === '30d' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => setDateFilter('all')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  dateFilter === 'all' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Time
              </button>
              <button
                type="button"
                onClick={() => setDateFilter('custom')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  dateFilter === 'custom' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Custom Range
              </button>
            </div>
          </div>

          {/* Custom Date Inputs */}
          {dateFilter === 'custom' && (
            <div className="flex items-center gap-2 animate-in fade-in">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2.5 py-1 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 focus:outline-hidden"
              />
              <span className="text-stone-400">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2.5 py-1 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-stone-900 focus:outline-hidden"
              />
            </div>
          )}

          <div className="text-[11px] text-stone-400 font-mono">
            Showing <strong className="text-stone-700">{filteredOrders.length}</strong> orders for selected window
          </div>
        </div>
      </div>

      {/* 2. URGENT ADVANCE PAYMENT PROOF BANNER */}
      {pendingProofs.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-3 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-200/80 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                <span>{pendingProofs.length} Advance Payment {pendingProofs.length === 1 ? 'Proof' : 'Proofs'} Awaiting Verification</span>
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
              </h4>
              <p className="text-[11px] text-amber-800">
                Customers submitted JazzCash, Easypaisa, or Bank screenshots requiring concierge review before processing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('orders', 'proof_verification')}
            className="text-xs font-bold uppercase tracking-wider bg-amber-900 text-white px-3.5 py-2 rounded-lg hover:bg-amber-950 transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            Review Queue
          </button>
        </div>
      )}

      {/* 3. PRIMARY SALES & ORDERS KPI GRID */}
      <div>
        <div className="flex items-center justify-between mb-2 px-0.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Sales & Orders Performance
          </h2>
          <span className="text-[11px] text-stone-400">
            Currency: PKR
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Today Sales */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Today Sales</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-light text-stone-900 font-mono">
              {formatPrice(todaySales, 'PKR')}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Live orders placed today
            </div>
          </div>

          {/* Period / Total Revenue */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                {dateFilter === 'all' ? 'Total Revenue' : 'Period Revenue'}
              </span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-light text-stone-900 font-mono">
              {formatPrice(periodRevenue, 'PKR')}
            </div>
            <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
              <span>{filteredOrders.length} orders in view</span>
              {dateFilter !== 'all' && (
                <span className="text-[10px] text-stone-400">All-time: {formatPrice(totalAllTimeRevenue, 'PKR')}</span>
              )}
            </div>
          </div>

          {/* New / Pending Orders */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Pending Orders</span>
              <Clock className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-light text-stone-900">
              {pendingOrders.length}
            </div>
            <div className="text-[11px] text-rose-600 font-medium mt-1">
              {pendingOrders.length > 0 ? 'Requires processing' : 'Queue cleared'}
            </div>
          </div>

          {/* Ready to Dispatch */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Ready to Dispatch</span>
              <Truck className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-light text-stone-900">
              {readyToDispatch.length}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Confirmed & in packaging
            </div>
          </div>
        </div>
      </div>

      {/* 4. INVENTORY SEPARATION & CATALOG CONTROL */}
      <div>
        <div className="flex items-center justify-between mb-2 px-0.5">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Catalog & Inventory Status
            </h2>
            <p className="text-[11px] text-stone-400">
              Explicit separation between catalog styles, unit quantities, and stock alerts
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('catalog', 'inventory')}
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Manage Stock</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Active Storefront Products */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Active Products</span>
              <Package className="w-4 h-4 text-stone-700" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-light text-stone-900">
              {activeProducts.length}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Visible on Storefront</span>
            </div>
          </div>

          {/* Total Inventory Units */}
          <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Total Stock Units</span>
              <Layers className="w-4 h-4 text-stone-700" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-light text-stone-900 font-mono">
              {totalInventoryUnits.toLocaleString()}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Combined variant quantities
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className={`rounded-xl p-4 sm:p-5 border shadow-xs ${
            lowStockProducts.length > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-stone-200'
          }`}>
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-900">Low Stock</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-light text-stone-900">
              {lowStockProducts.length}
            </div>
            <div className="text-[11px] text-amber-800 font-medium mt-1">
              {lowStockProducts.length > 0 ? `≤ ${lowStockThreshold} units remaining` : 'No low-stock items'}
            </div>
          </div>

          {/* Out of Stock */}
          <div className={`rounded-xl p-4 sm:p-5 border shadow-xs ${
            outOfStockProducts.length > 0 ? 'bg-rose-50/70 border-rose-300' : 'bg-white border-stone-200'
          }`}>
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-900">Out of Stock</span>
              <AlertCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl sm:text-2xl font-serif font-light text-stone-900">
              {outOfStockProducts.length}
            </div>
            <div className="text-[11px] text-rose-800 font-medium mt-1">
              {outOfStockProducts.length > 0 ? 'Urgent restocking needed' : 'All items in stock'}
            </div>
          </div>
        </div>
      </div>

      {/* 5. OPERATIONAL RECENT ORDERS TABLE */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Operational Orders Stream
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Live incoming customer orders with direct action dispatch
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('orders', 'all')}
              className="text-xs text-stone-700 hover:text-stone-900 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs">
            <ShoppingBag className="w-8 h-8 mx-auto text-stone-300 mb-2" />
            <p>No customer orders recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {recentOrders.map((order) => {
                  const isAdvance = order.paymentMethod !== 'Cash on Delivery (COD)';
                  const hasProof = !!order.paymentProof?.screenshotUrl;

                  let statusBadgeStyle = 'bg-stone-100 text-stone-700 border-stone-200';
                  if (order.status === 'Delivered') {
                    statusBadgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold';
                  } else if (order.status === 'Dispatched') {
                    statusBadgeStyle = 'bg-indigo-50 text-indigo-800 border-indigo-200 font-semibold';
                  } else if (order.status === 'Confirmed' || order.status === 'In Production') {
                    statusBadgeStyle = 'bg-blue-50 text-blue-800 border-blue-200 font-semibold';
                  } else if (order.status === 'Payment Verification Pending') {
                    statusBadgeStyle = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                  } else if (order.status === 'Cancelled') {
                    statusBadgeStyle = 'bg-rose-50 text-rose-700 border-rose-200';
                  }

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                      onClick={() => onSelectOrder(order)}
                    >
                      {/* Order Number */}
                      <td className="py-3 px-4 font-mono font-bold text-stone-900 group-hover:text-amber-700">
                        #{order.orderNumber}
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-900">{order.customer.fullName}</div>
                        <div className="text-[11px] text-stone-400 font-mono">{order.customer.phone}</div>
                      </td>

                      {/* City */}
                      <td className="py-3 px-4 text-stone-600">
                        {order.customer.city || 'Pakistan'}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-stone-700">{order.paymentMethod}</span>
                          {isAdvance && (
                            <span className="text-[9px] px-1 py-0.2 bg-emerald-100 text-emerald-800 rounded font-semibold uppercase">
                              Advance
                            </span>
                          )}
                        </div>
                        {hasProof && (
                          <span className="text-[10px] text-amber-700 font-medium block mt-0.5">
                            Proof Attached
                          </span>
                        )}
                      </td>

                      {/* Total */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-stone-900">
                        {formatPrice(order.total, 'PKR')}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border ${statusBadgeStyle}`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-stone-500 text-[11px]">
                        {new Date(order.createdAt).toLocaleDateString('en-PK', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectOrder(order);
                          }}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-700 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
