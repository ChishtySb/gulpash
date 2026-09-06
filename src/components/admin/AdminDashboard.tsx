import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Package, Settings, Sliders, DollarSign, 
  TrendingUp, Users, Truck, CheckCircle2, AlertTriangle, 
  Plus, Edit, Trash2, Search, ArrowLeft, Save, Play, 
  Image as ImageIcon, RefreshCw, X, ShieldAlert, Eye
} from 'lucide-react';
import { Product, Order, CMSConfig, SiteSettings, ProductSize, OrderStatus } from '../../types';
import { StorageService } from '../../lib/storage';
import { formatPrice } from '../../lib/currency';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onNavigateToStoreProduct?: (slug: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin, onNavigateToStoreProduct }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'cms' | 'settings'>('analytics');
  
  // Data states
  const [products, setProducts] = useState<Product[]>(StorageService.getProducts(true));
  const [orders, setOrders] = useState<Order[]>(StorageService.getOrders());
  const [cms, setCms] = useState<CMSConfig>(StorageService.getCMS());
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Product Editing Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Reload data on storage events
  useEffect(() => {
    const handleSync = () => {
      setProducts(StorageService.getProducts(true));
      setOrders(StorageService.getOrders());
      setCms(StorageService.getCMS());
      setSettings(StorageService.getSettings());
    };
    window.addEventListener('gulpash_data_changed', handleSync);
    return () => window.removeEventListener('gulpash_data_changed', handleSync);
  }, []);

  const triggerNotice = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // 1. CALCULATE ANALYTICS
  const totalSalesPKR = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const processingOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Confirmed').length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalSalesPKR / totalOrdersCount) : 0;
  const lowStockCount = products.filter(p => p.stock <= 5 && !p.isSoldOut).length;

  // 2. PRODUCT ACTIONS
  const handleOpenNewProduct = () => {
    const fresh: Product = {
      id: `prod-${Date.now()}`,
      title: '',
      slug: '',
      sku: `GP-${Math.floor(1000 + Math.random() * 9000)}`,
      price: 12500,
      compareAtPrice: 15000,
      category: 'Luxury Pret',
      collection: 'Spring Pret',
      fabric: 'Pure Raw Silk with Organza Border',
      shortDescription: '',
      description: '',
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: '',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Ivory', 'Gold'],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      isSoldOut: false,
      isVisible: true,
      stock: 15,
      rating: 5.0,
      reviewCount: 0,
      tags: ['New In', 'Pret', 'Silk'],
      details: {
        shirt: 'Raw silk with pearl buttons',
        dupatta: 'Pure silk digital dupatta',
        trouser: 'Matching cigarette pants',
        careInstructions: 'Dry clean only'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEditingProduct(fresh);
    setIsNewProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Generate slug from title if empty
    const slug = editingProduct.slug || editingProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const toSave: Product = {
      ...editingProduct,
      slug,
      updatedAt: new Date().toISOString()
    };

    StorageService.saveProduct(toSave);
    setEditingProduct(null);
    setIsNewProduct(false);
    triggerNotice('Product catalog saved successfully!');
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      StorageService.deleteProduct(id);
      triggerNotice('Product removed from catalog.');
    }
  };

  const handleToggleSoldOut = (product: Product) => {
    const updated = { ...product, isSoldOut: !product.isSoldOut };
    StorageService.saveProduct(updated);
    triggerNotice(`Product marked as ${updated.isSoldOut ? 'Sold Out' : 'Available'}`);
  };

  // 3. ORDER ACTIONS
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    StorageService.updateOrderStatus(orderId, status);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status, updatedAt: new Date().toISOString() });
    }
    triggerNotice(`Order status updated to ${status}`);
  };

  // 4. CMS ACTIONS (Hero Option A / Option B)
  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveCMS(cms);
    triggerNotice('Homepage Hero & CMS configurations updated!');
  };

  // 5. SETTINGS ACTIONS
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(settings);
    triggerNotice('Store & WhatsApp configurations saved!');
  };

  // Filtered lists
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.includes(orderSearch);
    if (!matchSearch) return false;
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f7f5f2] font-sans flex flex-col">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-[#141414] text-white border-b border-[#262626] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl font-bold tracking-[0.2em] text-white uppercase">
            GulPash
          </span>
          <span className="bg-[#aa814d] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs">
            Admin Console
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 text-xs text-[#bbb] hover:text-white bg-[#222] hover:bg-[#333] px-3 py-1.5 rounded-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Live Store</span>
          </button>
        </div>
      </header>

      {/* Notice Toast */}
      {saveSuccessNotice && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-800 text-white text-xs px-4 py-3 rounded-md shadow-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccessNotice}</span>
        </div>
      )}

      {/* Main Admin Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#ddd] pb-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'analytics' ? 'bg-[#181818] text-white' : 'bg-white text-[#555] hover:text-black'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#c59b66]" />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'products' ? 'bg-[#181818] text-white' : 'bg-white text-[#555] hover:text-black'
            }`}
          >
            <Package className="w-4 h-4 text-[#c59b66]" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'orders' ? 'bg-[#181818] text-white' : 'bg-white text-[#555] hover:text-black'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#c59b66]" />
            <span>Orders ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'cms' ? 'bg-[#181818] text-white' : 'bg-white text-[#555] hover:text-black'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#c59b66]" />
            <span>Hero & CMS (Video/Image)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'settings' ? 'bg-[#181818] text-white' : 'bg-white text-[#555] hover:text-black'
            }`}
          >
            <Settings className="w-4 h-4 text-[#c59b66]" />
            <span>Store & WhatsApp Settings</span>
          </button>
        </div>

        {/* 1. OVERVIEW & ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-sm border border-[#e8e3dc] shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#888]">Total Revenue</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#111] mt-1">{formatPrice(totalSalesPKR, 'PKR')}</h3>
                  <span className="text-[10px] text-emerald-700 font-semibold">Live orders total</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#fdf8f2] flex items-center justify-center text-[#c59b66]">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-sm border border-[#e8e3dc] shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#888]">Total Orders</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#111] mt-1">{totalOrdersCount}</h3>
                  <span className="text-[10px] text-[#666]">Avg {formatPrice(averageOrderValue, 'PKR')} / order</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#fdf8f2] flex items-center justify-center text-[#c59b66]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-sm border border-[#e8e3dc] shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#888]">Pending Dispatch</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#111] mt-1">{pendingOrdersCount}</h3>
                  <span className="text-[10px] text-amber-700 font-semibold">{processingOrdersCount} in packaging</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <Truck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-sm border border-[#e8e3dc] shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#888]">Active Inventory</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#111] mt-1">{products.length} Designs</h3>
                  <span className="text-[10px] text-red-600 font-semibold">{lowStockCount} low on stock</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#fdf8f2] flex items-center justify-center text-[#c59b66]">
                  <Package className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Quick action shortcuts */}
            <div className="bg-white p-6 rounded-sm border border-[#e8e3dc] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#111]">Quick Administrative Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleOpenNewProduct}
                  className="bg-[#181818] hover:bg-[#c59b66] text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Pakistani Design
                </button>
                <button
                  onClick={() => setActiveTab('cms')}
                  className="bg-white border border-[#ccc] hover:border-black text-[#222] text-xs font-semibold py-2.5 px-4 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-[#c59b66]" /> Edit Video/Image Hero CMS
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="bg-white border border-[#ccc] hover:border-black text-[#222] text-xs font-semibold py-2.5 px-4 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#c59b66]" /> Process Incoming Orders
                </button>
              </div>
            </div>

            {/* Recent Orders table preview */}
            <div className="bg-white p-6 rounded-sm border border-[#e8e3dc] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#111]">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#c59b66] hover:underline font-semibold"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#faf8f5] text-[#333] border-b border-[#eee] uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Order #</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">City</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee]">
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className="hover:bg-[#fcfbf9]">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#aa814d]">{o.orderNumber}</td>
                        <td className="py-2.5 px-3 font-medium text-[#111]">{o.customer.fullName}</td>
                        <td className="py-2.5 px-3 text-[#666]">{o.customer.city}</td>
                        <td className="py-2.5 px-3 text-[#555]">{o.paymentMethod}</td>
                        <td className="py-2.5 px-3 font-bold text-[#111]">{formatPrice(o.total, 'PKR')}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-xs font-semibold text-[10px] ${
                            o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            o.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            o.status === 'Processing' ? 'bg-purple-100 text-purple-800' :
                            o.status === 'Confirmed' ? 'bg-teal-100 text-teal-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCT MANAGEMENT TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Product Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-sm border border-[#e8e3dc]">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#999] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by title, SKU, fabric..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-[#ddd] text-xs rounded-xs focus:outline-hidden"
                />
              </div>

              <button
                onClick={handleOpenNewProduct}
                className="w-full sm:w-auto bg-[#181818] hover:bg-[#c59b66] text-white text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Product Table */}
            <div className="bg-white border border-[#e8e3dc] rounded-sm overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#faf8f5] text-[#333] border-b border-[#eee] uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Fabric</th>
                      <th className="py-3 px-3">Price</th>
                      <th className="py-3 px-3">Stock</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee]">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-[#fcfbf9]">
                        {/* Thumbnail & Title */}
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt=""
                            className="w-10 h-14 object-cover border border-[#ddd] rounded-xs shrink-0"
                          />
                          <div>
                            <span className="font-bold text-[#111] block line-clamp-1">{p.title}</span>
                            <span className="text-[10px] font-mono text-[#888]">SKU: {p.sku}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-[#555] font-medium">{p.category}</td>
                        <td className="py-3 px-3 text-[#666] italic font-serif">{p.fabric}</td>
                        <td className="py-3 px-3 font-bold text-[#111]">{formatPrice(p.price, 'PKR')}</td>
                        
                        <td className="py-3 px-3">
                          <span className={`font-semibold ${p.stock <= 5 ? 'text-red-600' : 'text-[#333]'}`}>
                            {p.stock} pcs
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleSoldOut(p)}
                            className={`px-2 py-0.5 rounded-xs font-semibold text-[10px] cursor-pointer ${
                              p.isSoldOut ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}
                            title="Click to toggle availability"
                          >
                            {p.isSoldOut ? 'Sold Out' : 'In Stock'}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsNewProduct(false);
                            }}
                            className="p-1.5 text-[#555] hover:text-[#aa814d] hover:bg-[#faf8f5] rounded-xs"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-[#888] hover:text-red-600 hover:bg-[#faf8f5] rounded-xs"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDER MANAGEMENT TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-sm border border-[#e8e3dc]">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#999] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order #, customer phone, name..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-[#ddd] text-xs rounded-xs focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-[#777]">Filter:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="border border-[#ddd] bg-white p-2 text-xs rounded-xs focus:outline-hidden"
                >
                  <option value="all">All Orders</option>
                  <option value="Pending">Pending Verification</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing / Tailoring</option>
                  <option value="Shipped">Shipped (TCS)</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Order Table */}
            <div className="bg-white border border-[#e8e3dc] rounded-sm overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#faf8f5] text-[#333] border-b border-[#eee] uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">City</th>
                      <th className="py-3 px-3">Payment</th>
                      <th className="py-3 px-3">Total</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee]">
                    {filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-[#fcfbf9]">
                        <td className="py-3 px-4 font-mono font-bold text-[#aa814d]">{o.orderNumber}</td>
                        <td className="py-3 px-3 text-[#777]">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-[#111]">{o.customer.fullName}</div>
                          <div className="text-[10px] text-[#888] font-mono">{o.customer.phone}</div>
                        </td>
                        <td className="py-3 px-3 text-[#555]">{o.customer.city}</td>
                        <td className="py-3 px-3 text-[#666]">{o.paymentMethod}</td>
                        <td className="py-3 px-3 font-bold text-[#111]">{formatPrice(o.total, 'PKR')}</td>
                        
                        {/* Status Select */}
                        <td className="py-3 px-3">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                            className="bg-[#faf8f5] border border-[#ddd] p-1 text-[11px] font-semibold rounded-xs"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="px-2.5 py-1 bg-[#181818] hover:bg-[#c59b66] text-white text-[10px] font-bold uppercase rounded-xs transition-colors"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. HERO CMS CONFIGURATION TAB (OPTION A & OPTION B VIDEO/IMAGE) */}
        {activeTab === 'cms' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#e8e3dc] space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#aa814d] block">
                  HERO CMS MANAGEMENT (PHASE 6)
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#111] mt-1">
                  Configure Homepage Hero Experience
                </h2>
                <p className="text-xs text-[#777] mt-1">
                  Seamlessly toggle between <strong>Option A (Luxury Image Hero)</strong> and <strong>Option B (Full-Motion Fashion Video Hero)</strong>.
                </p>
              </div>

              <form onSubmit={handleSaveCMS} className="space-y-6">
                
                {/* Hero Type Switcher */}
                <div className="p-4 bg-[#faf8f5] border border-[#e8e3dc] rounded-sm">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111] mb-2">
                    Hero Media Display Type *
                  </label>
                  <div className="flex gap-4">
                    <label className={`flex items-center gap-2 p-3 rounded border flex-1 cursor-pointer transition-all ${
                      cms.hero.type === 'image' ? 'border-[#c59b66] bg-white shadow-xs font-bold text-[#aa814d]' : 'border-[#ddd] text-[#555]'
                    }`}>
                      <input
                        type="radio"
                        name="heroType"
                        checked={cms.hero.type === 'image'}
                        onChange={() => setCms({ ...cms, hero: { ...cms.hero, type: 'image' } })}
                        className="accent-[#c59b66]"
                      />
                      <ImageIcon className="w-4 h-4" />
                      <span>Option A: Editorial Image Hero</span>
                    </label>

                    <label className={`flex items-center gap-2 p-3 rounded border flex-1 cursor-pointer transition-all ${
                      cms.hero.type === 'video' ? 'border-[#c59b66] bg-white shadow-xs font-bold text-[#aa814d]' : 'border-[#ddd] text-[#555]'
                    }`}>
                      <input
                        type="radio"
                        name="heroType"
                        checked={cms.hero.type === 'video'}
                        onChange={() => setCms({ ...cms, hero: { ...cms.hero, type: 'video' } })}
                        className="accent-[#c59b66]"
                      />
                      <Play className="w-4 h-4" />
                      <span>Option B: Autoplay Video Hero (MP4/WebM)</span>
                    </label>
                  </div>
                </div>

                {/* Media URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cms.hero.type === 'video' && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#333] mb-1">
                        Video Media URL (MP4 / WebM with HTTPS) *
                      </label>
                      <input
                        type="url"
                        required
                        value={cms.hero.videoUrl || ''}
                        onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, videoUrl: e.target.value } })}
                        placeholder="https://assets.mixkit.co/videos/preview/mixkit-girl-in-fashion-dress-posing-41793-large.mp4"
                        className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs font-mono focus:outline-hidden focus:border-[#c59b66]"
                      />
                      <span className="text-[10px] text-[#777] mt-1 block">
                        Will automatically play muted and loop continuously on all browsers with fallback poster.
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1">
                      Desktop Poster / Hero Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={cms.hero.desktopImageUrl}
                      onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, desktopImageUrl: e.target.value } })}
                      className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs font-mono focus:outline-hidden focus:border-[#c59b66]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1">
                      Mobile Poster / Image URL
                    </label>
                    <input
                      type="url"
                      value={cms.hero.mobileImageUrl || ''}
                      onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, mobileImageUrl: e.target.value } })}
                      className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs font-mono focus:outline-hidden focus:border-[#c59b66]"
                    />
                  </div>
                </div>

                {/* Overlay Darkness Slider */}
                <div className="p-4 bg-[#faf8f5] border border-[#e8e3dc] rounded-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#333]">
                      Black Overlay Opacity (Enhance Text Contrast)
                    </label>
                    <span className="text-xs font-mono font-bold text-[#aa814d]">{cms.hero.overlayOpacity || 35}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={85}
                    value={cms.hero.overlayOpacity || 35}
                    onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, overlayOpacity: Number(e.target.value) } })}
                    className="w-full accent-[#c59b66] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#888]">
                    <span>0% (Raw Media)</span>
                    <span>35% (Recommended)</span>
                    <span>85% (High Contrast)</span>
                  </div>
                </div>

                {/* Typography & Copy */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1">Badge Text (Top Pill)</label>
                    <input
                      type="text"
                      value={cms.hero.badge || ''}
                      onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, badge: e.target.value } })}
                      className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1">Hero Main Heading *</label>
                    <input
                      type="text"
                      required
                      value={cms.hero.heading}
                      onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, heading: e.target.value } })}
                      className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs font-serif text-sm focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1">Subheading / Description</label>
                    <textarea
                      rows={2}
                      value={cms.hero.subheading}
                      onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, subheading: e.target.value } })}
                      className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#333] mb-1">Primary Button Text</label>
                      <input
                        type="text"
                        value={cms.hero.buttonText}
                        onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, buttonText: e.target.value } })}
                        className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#333] mb-1">Secondary Button Text</label>
                      <input
                        type="text"
                        value={cms.hero.secondaryButtonText || ''}
                        onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, secondaryButtonText: e.target.value } })}
                        className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#eee]">
                  <button
                    type="submit"
                    className="bg-[#181818] hover:bg-[#c59b66] text-white text-xs font-bold uppercase tracking-[0.2em] py-3.5 px-8 rounded-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Homepage Hero Settings</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* 5. STORE & WHATSAPP SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#e8e3dc] space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#aa814d] block">
                  BRAND & STORE CONFIGURATIONS
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#111] mt-1">
                  General GulPash Settings
                </h2>
                <p className="text-xs text-[#777] mt-1">
                  Configure WhatsApp floating button, support numbers, delivery charges, and bank credentials.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* Brand and Domain */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1">Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={settings.brandName}
                      onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                      className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1">Official Domain</label>
                    <input
                      type="text"
                      value={settings.domain}
                      onChange={(e) => setSettings({ ...settings, domain: e.target.value })}
                      className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs font-mono focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* WhatsApp & Concierge */}
                <div className="p-4 bg-[#f2faf4] border border-[#c4e8ce] rounded-sm space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#1d6b38] flex items-center gap-1.5">
                    WhatsApp Concierge Integration
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#333] mb-1">
                        WhatsApp Number (with country code, no +) *
                      </label>
                      <input
                        type="text"
                        required
                        value={settings.whatsappNumber}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        placeholder="923218489999"
                        className="w-full border border-[#ddd] bg-white p-2.5 text-xs rounded-xs font-mono focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#333] mb-1">
                        Support Hotline Display Phone
                      </label>
                      <input
                        type="text"
                        value={settings.supportPhone}
                        onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                        placeholder="+92 321 8489999"
                        className="w-full border border-[#ddd] bg-white p-2.5 text-xs rounded-xs focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#333] mb-1">
                        Default WhatsApp Message Template
                      </label>
                      <input
                        type="text"
                        value={settings.whatsappDefaultMessage}
                        onChange={(e) => setSettings({ ...settings, whatsappDefaultMessage: e.target.value })}
                        className="w-full border border-[#ddd] bg-white p-2.5 text-xs rounded-xs focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping & Delivery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1">
                      Standard Nationwide Shipping Fee (PKR)
                    </label>
                    <input
                      type="number"
                      value={settings.shipping.standardFee}
                      onChange={(e) => setSettings({
                        ...settings,
                        shipping: { ...settings.shipping, standardFee: Number(e.target.value) }
                      })}
                      className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1">
                      Free Shipping Threshold (PKR)
                    </label>
                    <input
                      type="number"
                      value={settings.shipping.freeShippingThreshold}
                      onChange={(e) => setSettings({
                        ...settings,
                        shipping: { ...settings.shipping, freeShippingThreshold: Number(e.target.value) }
                      })}
                      className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#333] mb-1">
                      Bank Transfer Instructions & IBAN
                    </label>
                    <textarea
                      rows={3}
                      value={settings.shipping.bankDetails || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        shipping: { ...settings.shipping, bankDetails: e.target.value }
                      })}
                      className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs font-mono focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Contact Email & Atelier Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1">Lahore Studio Address</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#eee]">
                  <button
                    type="submit"
                    className="bg-[#181818] hover:bg-[#c59b66] text-white text-xs font-bold uppercase tracking-[0.2em] py-3.5 px-8 rounded-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Settings</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setEditingProduct(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl p-6 border border-[#e8e3dc] z-10 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#eee]">
              <h3 className="font-serif text-xl font-bold text-[#111]">
                {isNewProduct ? 'Add New Pakistani Couture Product' : `Edit: ${editingProduct.title}`}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-[#888] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#333] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full border border-[#ddd] p-2 rounded-xs focus:outline-hidden focus:border-[#c59b66]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#333] mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full border border-[#ddd] p-2 rounded-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#333] mb-1">Compare Price (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct.compareAtPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, compareAtPrice: Number(e.target.value) || undefined })}
                    className="w-full border border-[#ddd] p-2 rounded-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#333] mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full border border-[#ddd] p-2 rounded-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#333] mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full border border-[#ddd] p-2 rounded-xs bg-white focus:outline-hidden"
                  >
                    <option value="Unstitched Luxury Lawn">Unstitched Luxury Lawn</option>
                    <option value="Luxury Pret">Luxury Pret</option>
                    <option value="Ready to Wear">Ready to Wear</option>
                    <option value="Festive Formals">Festive Formals</option>
                    <option value="Chiffon Collection">Chiffon Collection</option>
                    <option value="Bridal Couture">Bridal Couture</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#333] mb-1">Fabric Specifications *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.fabric}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                    placeholder="e.g. Pure Jacquard Lawn with Silk Dupatta"
                    className="w-full border border-[#ddd] p-2 rounded-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#333] mb-1">Primary Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingProduct.images[0] || ''}
                  onChange={(e) => {
                    const imgs = [...editingProduct.images];
                    imgs[0] = e.target.value;
                    setEditingProduct({ ...editingProduct, images: imgs });
                  }}
                  className="w-full border border-[#ddd] p-2 rounded-xs font-mono text-[11px] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#333] mb-1">Secondary Hover Image URL</label>
                <input
                  type="url"
                  value={editingProduct.images[1] || ''}
                  onChange={(e) => {
                    const imgs = [...editingProduct.images];
                    imgs[1] = e.target.value;
                    setEditingProduct({ ...editingProduct, images: imgs });
                  }}
                  className="w-full border border-[#ddd] p-2 rounded-xs font-mono text-[11px] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#333] mb-1">Product Showcase Video URL (Optional)</label>
                <input
                  type="url"
                  value={editingProduct.videoUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, videoUrl: e.target.value })}
                  placeholder="https://... (mp4)"
                  className="w-full border border-[#ddd] p-2 rounded-xs font-mono text-[11px] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#333] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full border border-[#ddd] p-2 rounded-xs focus:outline-hidden"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="accent-[#c59b66]"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNewArrival}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                    className="accent-[#c59b66]"
                  />
                  <span>New In Badge</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                  <input
                    type="checkbox"
                    checked={editingProduct.isSoldOut}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isSoldOut: e.target.checked })}
                    className="accent-[#c59b66]"
                  />
                  <span>Sold Out</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#eee] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-[#ccc] rounded-xs text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#181818] hover:bg-[#c59b66] text-white text-xs font-bold uppercase tracking-wider rounded-xs"
                >
                  Save Product
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* INSPECT ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-xl bg-white rounded-lg shadow-2xl p-6 border border-[#e8e3dc] z-10 max-h-[85vh] overflow-y-auto space-y-4 text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#eee]">
              <div>
                <span className="text-[10px] text-[#888] block">ORDER DETAILS</span>
                <h3 className="font-mono text-base font-bold text-[#aa814d]">{selectedOrder.orderNumber}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-[#888] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#faf8f5] p-3 rounded border border-[#eee] space-y-1">
              <p><strong>Customer:</strong> {selectedOrder.customer.fullName}</p>
              <p><strong>Phone:</strong> {selectedOrder.customer.phone} (WhatsApp: {selectedOrder.customer.whatsapp || 'Same'})</p>
              <p><strong>Address:</strong> {selectedOrder.customer.address}, {selectedOrder.customer.apartment || ''}</p>
              <p><strong>City/Province:</strong> {selectedOrder.customer.city}, {selectedOrder.customer.province}</p>
              {selectedOrder.customer.orderNotes && (
                <p className="pt-1 text-[#aa814d]"><strong>Instructions:</strong> {selectedOrder.customer.orderNotes}</p>
              )}
            </div>

            {/* Items */}
            <div>
              <span className="font-bold uppercase tracking-wider text-[#333] block mb-2">Purchased Ensembles:</span>
              <div className="divide-y divide-[#eee] border border-[#eee] rounded">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 flex items-center gap-3">
                    <img src={it.image} alt="" className="w-10 h-12 object-cover rounded-xs border" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#111] truncate">{it.title}</p>
                      <p className="text-[10px] text-[#777]">Size: {it.size} &bull; Qty: {it.quantity}</p>
                    </div>
                    <span className="font-bold text-[#111]">{formatPrice(it.price * it.quantity, 'PKR')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status change */}
            <div className="flex items-center justify-between pt-2">
              <span className="font-bold">Update Order Status:</span>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as OrderStatus)}
                className="border border-[#ddd] p-1.5 font-bold rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="pt-3 border-t border-[#eee] flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-[#ccc] hover:border-black rounded text-xs font-semibold"
              >
                Print Receipt
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
