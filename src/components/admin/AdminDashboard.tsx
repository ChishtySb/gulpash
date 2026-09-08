import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Package, Settings, Sliders, DollarSign, 
  TrendingUp, Users, Truck, CheckCircle2, AlertTriangle, 
  Plus, Edit, Trash2, Search, ArrowLeft, Save, Play, 
  Image as ImageIcon, RefreshCw, X, ShieldAlert, Eye, EyeOff,
  Database, ExternalLink, ArrowUp, ArrowDown, Video, Layers, Globe, LogOut, Upload, Loader2
} from 'lucide-react';
import { Product, Order, CMSConfig, SiteSettings, ProductSize, OrderStatus, ProductVariantDetailed, Category } from '../../types';
import { StorageService } from '../../lib/storage';
import { formatPrice } from '../../lib/currency';
import { MigrationReportView } from './MigrationReportView';
import { getSupabaseClient } from '../../lib/supabaseClient';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onNavigateToStoreProduct?: (slug: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin, onNavigateToStoreProduct }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'categories' | 'cms' | 'settings' | 'migration'>('analytics');
  
  // Data states
  const [products, setProducts] = useState<Product[]>(StorageService.getProducts(true));
  const [orders, setOrders] = useState<Order[]>(StorageService.getOrders());
  const [cms, setCms] = useState<CMSConfig>(StorageService.getCMS());
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [categories, setCategories] = useState<Category[]>(StorageService.getCategories());
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Product Editing Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVariantTitle, setNewVariantTitle] = useState('');
  const [newVariantSku, setNewVariantSku] = useState('');
  const [newVariantPrice, setNewVariantPrice] = useState(0);
  const [newVariantStock, setNewVariantStock] = useState(10);
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);

  // Reload data on storage events
  useEffect(() => {
    const handleSync = () => {
      setProducts(StorageService.getProducts(true));
      setOrders(StorageService.getOrders());
      setCms(StorageService.getCMS());
      setSettings(StorageService.getSettings());
      setCategories(StorageService.getCategories());
    };
    window.addEventListener('gulpash_data_changed', handleSync);
    return () => window.removeEventListener('gulpash_data_changed', handleSync);
  }, []);

  const triggerNotice = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // Category management handlers
  const handleToggleCategoryStore = (catId: string) => {
    const updated = categories.map(c => c.id === catId ? { ...c, isVisible: !c.isVisible } : c);
    setCategories(updated);
    StorageService.saveCategories(updated);
    triggerNotice('Category storefront visibility updated');
  };

  const handleToggleCategoryNav = (catId: string) => {
    const updated = categories.map(c => c.id === catId ? { ...c, visibleInNav: c.visibleInNav === false ? true : false } : c);
    setCategories(updated);
    StorageService.saveCategories(updated);
    triggerNotice('Header Navigation visibility updated');
  };

  const handleToggleCategoryHome = (catId: string) => {
    const updated = categories.map(c => c.id === catId ? { ...c, visibleOnHomepage: c.visibleOnHomepage === false ? true : false } : c);
    setCategories(updated);
    StorageService.saveCategories(updated);
    triggerNotice('Homepage visibility updated');
  };

  const handleMoveCategory = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;
    const clone = [...categories];
    const item = clone[idx];
    clone[idx] = clone[targetIdx];
    clone[targetIdx] = item;
    const updated = clone.map((c, i) => ({ ...c, order: i + 1 }));
    setCategories(updated);
    StorageService.saveCategories(updated);
    triggerNotice('Category display order updated');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) return;
    let updated: Category[];
    if (isNewCategory) {
      const newCat: Category = {
        ...editingCategory,
        id: editingCategory.id || `cat-${Date.now()}`,
        name: editingCategory.name.trim(),
        slug: editingCategory.slug?.trim() || editingCategory.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
        order: categories.length + 1,
        isVisible: true,
        visibleInNav: true,
        visibleOnHomepage: true
      };
      updated = [...categories, newCat];
    } else {
      updated = categories.map(c => c.id === editingCategory.id ? {
        ...editingCategory,
        name: editingCategory.name.trim(),
        slug: editingCategory.slug?.trim() || editingCategory.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      } : c);
    }
    setCategories(updated);
    StorageService.saveCategories(updated);
    setEditingCategory(null);
    setIsNewCategory(false);
    triggerNotice('Category updated successfully');
  };

  const handleDeleteCategory = (catId: string) => {
    if (categories.length <= 1) {
      alert('The store must keep at least one category.');
      return;
    }
    if (!confirm('Are you sure you want to delete this category? Products assigned to it will remain in catalog.')) return;
    const updated = categories.filter(c => c.id !== catId);
    setCategories(updated);
    StorageService.saveCategories(updated);
    triggerNotice('Category deleted');
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
      category: 'Unstitched / Stitched',
      collection: 'New Arrivals',
      fabric: 'Pure Lawn with Embroidered Chiffon Dupatta',
      shortDescription: '',
      description: '',
      images: [],
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

  const handleToggleVisibility = (product: Product) => {
    const updated = { ...product, isVisible: !product.isVisible };
    StorageService.saveProduct(updated);
    triggerNotice(`Product "${product.title}" is now ${updated.isVisible ? 'Visible' : 'Hidden'} on storefront`);
  };

  // Image helpers
  const handleMoveImage = (fromIdx: number, toIdx: number) => {
    if (!editingProduct) return;
    const newImgs = [...editingProduct.images];
    if (toIdx < 0 || toIdx >= newImgs.length) return;
    const item = newImgs.splice(fromIdx, 1)[0];
    newImgs.splice(toIdx, 0, item);
    setEditingProduct({ ...editingProduct, images: newImgs });
  };

  const handleSetPrimaryImage = (idx: number) => {
    if (!editingProduct || idx === 0) return;
    const newImgs = [...editingProduct.images];
    const item = newImgs.splice(idx, 1)[0];
    newImgs.unshift(item);
    setEditingProduct({ ...editingProduct, images: newImgs });
  };

  const handleDeleteImage = (idx: number) => {
    if (!editingProduct) return;
    if (editingProduct.images.length <= 1) {
      alert('A product must maintain at least one catalog image.');
      return;
    }
    const newImgs = editingProduct.images.filter((_, i) => i !== idx);
    setEditingProduct({ ...editingProduct, images: newImgs });
  };

  const handleAddImage = () => {
    if (!editingProduct || !newImageUrl.trim()) return;
    setEditingProduct({
      ...editingProduct,
      images: [...editingProduct.images, newImageUrl.trim()]
    });
    setNewImageUrl('');
  };

  // Variant helpers
  const handleAddVariant = () => {
    if (!editingProduct || !newVariantTitle.trim()) return;
    const newVar: ProductVariantDetailed = {
      id: `var-${Date.now()}`,
      title: newVariantTitle.trim(),
      size: newVariantTitle.trim(),
      price: newVariantPrice > 0 ? newVariantPrice : editingProduct.price,
      sku: newVariantSku.trim() || `${editingProduct.sku}-${newVariantTitle.trim().toUpperCase().replace(/\s+/g, '')}`,
      available: newVariantStock > 0,
      stock: newVariantStock,
      position: (editingProduct.variants?.length || 0) + 1
    };

    const currentVariants = editingProduct.variants || [];
    const currentSizes = [...editingProduct.sizes];
    if (!currentSizes.includes(newVariantTitle.trim() as ProductSize)) {
      currentSizes.push(newVariantTitle.trim() as ProductSize);
    }

    setEditingProduct({
      ...editingProduct,
      variants: [...currentVariants, newVar],
      sizes: currentSizes
    });

    setNewVariantTitle('');
    setNewVariantSku('');
    setNewVariantPrice(0);
    setNewVariantStock(10);
  };

  const handleDeleteVariant = (varId: string) => {
    if (!editingProduct || !editingProduct.variants) return;
    const updated = editingProduct.variants.filter(v => v.id !== varId);
    setEditingProduct({
      ...editingProduct,
      variants: updated
    });
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

        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              const supabase = getSupabaseClient();
              if (supabase) {
                await supabase.auth.signOut().catch(() => {});
              }
              StorageService.setAdminAuthenticated(false);
              onExitAdmin();
            }}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-[#222] hover:bg-red-950/40 border border-red-900/40 px-3 py-1.5 rounded-xs transition-colors cursor-pointer"
            title="Sign out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 text-xs text-[#bbb] hover:text-white bg-[#222] hover:bg-[#333] px-3 py-1.5 rounded-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Live Store</span>
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
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'categories' ? 'bg-[#181818] text-white' : 'bg-white text-[#555] hover:text-black'
            }`}
          >
            <Layers className="w-4 h-4 text-[#c59b66]" />
            <span>Categories & Nav ({categories.length})</span>
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
            <span>Store & Branding</span>
          </button>

          <button
            onClick={() => setActiveTab('migration')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors border ${
              activeTab === 'migration' 
                ? 'bg-[#181818] text-white border-black' 
                : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Catalog Migration Audit</span>
            <span className="bg-emerald-700 text-white text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-tight">
              68/68 PASS
            </span>
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
                      <th className="py-3 px-3">Stock Status</th>
                      <th className="py-3 px-3">Storefront Visibility</th>
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

                        {/* Visibility (Phase 13) */}
                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleVisibility(p)}
                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                              p.isVisible !== false
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                            }`}
                            title={p.isVisible !== false ? 'Visible on storefront. Click to hide.' : 'Hidden from storefront. Click to publish.'}
                          >
                            {p.isVisible !== false ? (
                              <>
                                <Eye className="w-3 h-3 text-emerald-600" />
                                <span>Visible</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 text-stone-400" />
                                <span>Hidden</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right space-x-1.5">
                          {onNavigateToStoreProduct && (
                            <button
                              onClick={() => onNavigateToStoreProduct(p.slug)}
                              className="p-1.5 text-[#666] hover:text-[#111] hover:bg-[#faf8f5] rounded-xs cursor-pointer inline-block"
                              title="Preview on Live Store"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsNewProduct(false);
                            }}
                            className="p-1.5 text-[#555] hover:text-[#aa814d] hover:bg-[#faf8f5] rounded-xs cursor-pointer inline-block"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-[#888] hover:text-red-600 hover:bg-[#faf8f5] rounded-xs cursor-pointer inline-block"
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

                {/* Media URLs & Supabase Storage File Uploaders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cms.hero.type === 'video' && (
                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-xs font-bold text-[#333]">
                        Video Media URL (MP4 / WebM) *
                      </label>
                      <input
                        type="url"
                        required
                        value={cms.hero.videoUrl || ''}
                        onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, videoUrl: e.target.value } })}
                        placeholder="https://.../video.mp4"
                        className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs font-mono focus:outline-hidden focus:border-[#c59b66]"
                      />
                      
                      {/* Direct Hero Video Device Uploader */}
                      <label className="block border border-dashed border-stone-300 hover:border-stone-800 p-2.5 text-center text-xs text-stone-600 rounded-xs cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
                        {uploadingHeroVideo ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading video to Supabase Storage (hero-videos)...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <Upload className="w-3.5 h-3.5 text-stone-500" />
                            <span>Upload MP4/WebM Video from Device (Supabase Storage)</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          disabled={uploadingHeroVideo}
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingHeroVideo(true);
                            const res = await StorageService.uploadMedia('hero-videos', file, 'homepage');
                            setUploadingHeroVideo(false);
                            if (res.url) {
                              setCms({ ...cms, hero: { ...cms.hero, videoUrl: res.url } });
                              triggerNotice('Hero video uploaded to Supabase Storage and applied!');
                            } else {
                              alert(res.error || 'Hero video upload failed');
                            }
                          }}
                        />
                      </label>

                      <span className="text-[10px] text-[#777] block">
                        Will automatically play muted and loop continuously on all browsers with fallback poster.
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#333]">
                      Desktop Poster / Hero Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={cms.hero.desktopImageUrl}
                      onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, desktopImageUrl: e.target.value } })}
                      className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs font-mono focus:outline-hidden focus:border-[#c59b66]"
                    />

                    {/* Direct Hero Desktop Image Device Uploader */}
                    <label className="block border border-dashed border-stone-300 hover:border-stone-800 p-2 text-center text-xs text-stone-600 rounded-xs cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
                      {uploadingHeroImage ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading hero image to Supabase Storage (hero-images)...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Upload className="w-3.5 h-3.5 text-stone-500" />
                          <span>Upload Desktop Image File (Supabase Storage)</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingHeroImage}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingHeroImage(true);
                          const res = await StorageService.uploadMedia('hero-images', file, 'homepage_desktop');
                          setUploadingHeroImage(false);
                          if (res.url) {
                            setCms({ ...cms, hero: { ...cms.hero, desktopImageUrl: res.url } });
                            triggerNotice('Hero image uploaded to Supabase Storage and applied!');
                          } else {
                            alert(res.error || 'Hero image upload failed');
                          }
                        }}
                      />
                    </label>
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

        {/* 5. CATEGORIES & NAVIGATION TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#e8e3dc] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eee] pb-5">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#aa814d] block">
                    TAXONOMY & NAVIGATION HIERARCHY
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#111] mt-1">
                    Store Categories & Navigation Visibility
                  </h2>
                  <p className="text-xs text-[#777] mt-1">
                    Manage collection order, header navigation menu links, and homepage showcase rows.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory({
                      id: `cat-${Date.now()}`,
                      name: '',
                      slug: '',
                      description: '',
                      imageUrl: '',
                      order: categories.length + 1,
                      isVisible: true,
                      visibleInNav: true,
                      visibleOnHomepage: true
                    });
                    setIsNewCategory(true);
                  }}
                  className="bg-[#181818] hover:bg-[#c59b66] text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-sm flex items-center gap-2 self-start cursor-pointer transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Category</span>
                </button>
              </div>

              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xs">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Total Categories</span>
                  <span className="text-2xl font-serif font-bold text-stone-900 mt-1 block">{categories.length}</span>
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Configured in store catalog</span>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xs">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Visible in Nav Bar</span>
                  <span className="text-2xl font-serif font-bold text-emerald-800 mt-1 block">
                    {categories.filter(c => c.isVisible && c.visibleInNav !== false).length}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Shown in top navigation header</span>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xs">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">Visible on Homepage</span>
                  <span className="text-2xl font-serif font-bold text-stone-900 mt-1 block">
                    {categories.filter(c => c.isVisible && c.visibleOnHomepage !== false).length}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Curated collections showcase</span>
                </div>
              </div>

              {/* Category Table */}
              <div className="overflow-x-auto border border-stone-200 rounded-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f9f8f6] border-b border-stone-200 text-[#555] uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4 w-20">Order</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-center">Products</th>
                      <th className="py-3 px-4 text-center">Storefront</th>
                      <th className="py-3 px-4 text-center">Header Nav</th>
                      <th className="py-3 px-4 text-center">Homepage</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {categories
                      .slice()
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((cat, idx) => {
                        const productCount = products.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length;
                        return (
                          <tr key={cat.id} className="hover:bg-stone-50/60 transition-colors">
                            {/* Order & Move buttons */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <span className="font-mono text-stone-400 text-xs w-5 font-medium">#{cat.order ?? idx + 1}</span>
                                <div className="flex flex-col gap-0.5">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => handleMoveCategory(idx, 'up')}
                                    className="p-0.5 hover:bg-stone-200 rounded disabled:opacity-20 text-stone-600 cursor-pointer"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === categories.length - 1}
                                    onClick={() => handleMoveCategory(idx, 'down')}
                                    className="p-0.5 hover:bg-stone-200 rounded disabled:opacity-20 text-stone-600 cursor-pointer"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Category info & thumbnail */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-12 bg-stone-100 border border-stone-200 rounded-xs overflow-hidden shrink-0">
                                  {cat.imageUrl ? (
                                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-400 text-[9px] font-medium">
                                      N/A
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <span className="font-semibold text-stone-900 block text-xs">{cat.name}</span>
                                  <span className="text-[10px] text-stone-400 font-mono block">/{cat.slug}</span>
                                  {cat.description && (
                                    <span className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{cat.description}</span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Product count */}
                            <td className="py-3 px-4 text-center">
                              <span className="px-2 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] font-mono text-stone-700">
                                {productCount} items
                              </span>
                            </td>

                            {/* Storefront Active Toggle */}
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleCategoryStore(cat.id)}
                                className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-colors cursor-pointer ${
                                  cat.isVisible
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-stone-100 text-stone-400 border border-stone-200'
                                }`}
                              >
                                {cat.isVisible ? 'Active' : 'Hidden'}
                              </button>
                            </td>

                            {/* Header Nav Toggle */}
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleCategoryNav(cat.id)}
                                className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-colors cursor-pointer ${
                                  cat.visibleInNav !== false && cat.isVisible
                                    ? 'bg-stone-900 text-white'
                                    : 'bg-stone-100 text-stone-400 border border-stone-200'
                                }`}
                              >
                                {cat.visibleInNav !== false ? 'Shown' : 'Off'}
                              </button>
                            </td>

                            {/* Homepage Showcase Toggle */}
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleCategoryHome(cat.id)}
                                className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-colors cursor-pointer ${
                                  cat.visibleOnHomepage !== false && cat.isVisible
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-stone-100 text-stone-400 border border-stone-200'
                                }`}
                              >
                                {cat.visibleOnHomepage !== false ? 'Featured' : 'Off'}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCategory({ ...cat });
                                    setIsNewCategory(false);
                                  }}
                                  className="p-1.5 hover:bg-stone-100 text-stone-700 hover:text-black rounded transition-colors cursor-pointer"
                                  title="Edit Category"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(cat.id)}
                                  className="p-1.5 hover:bg-red-50 text-stone-400 hover:text-red-700 rounded transition-colors cursor-pointer"
                                  title="Delete Category"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. STORE & WHATSAPP SETTINGS TAB */}
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

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1">Brand Logo Image URL (Optional)</label>
                    <input
                      type="url"
                      value={settings.logoUrl || ''}
                      onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                      placeholder="https://gulpash.online/logo.png"
                      className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs font-mono focus:outline-hidden"
                    />
                    <span className="text-[10px] text-[#888] mt-0.5 block">Leave empty to use high-contrast editorial font typography.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333] mb-1">Favicon URL</label>
                    <input
                      type="url"
                      value={settings.faviconUrl || ''}
                      onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                      placeholder="https://gulpash.online/favicon.ico"
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
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-[#aa814d]" />
                        Nationwide Shipping & Cash on Delivery (COD)
                      </h3>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Configure courier rates across Pakistan, free COD promotion threshold, and announcement banner text.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-700">Free COD Promo:</span>
                      <button
                        type="button"
                        onClick={() => setSettings({
                          ...settings,
                          shipping: {
                            ...settings.shipping,
                            freeCodEnabled: settings.shipping.freeCodEnabled === false ? true : false
                          }
                        })}
                        className={`px-3 py-1 rounded-xs text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          settings.shipping.freeCodEnabled !== false
                            ? 'bg-emerald-700 text-white'
                            : 'bg-stone-300 text-stone-700'
                        }`}
                      >
                        {settings.shipping.freeCodEnabled !== false ? 'ENABLED' : 'DISABLED'}
                      </button>
                    </div>
                  </div>

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
                        className="w-full border border-[#ddd] bg-white p-2.5 text-xs rounded-xs focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#333] mb-1">
                        Free Nationwide COD Threshold (PKR)
                      </label>
                      <input
                        type="number"
                        value={settings.shipping.freeShippingThreshold}
                        onChange={(e) => setSettings({
                          ...settings,
                          shipping: { ...settings.shipping, freeShippingThreshold: Number(e.target.value) }
                        })}
                        className="w-full border border-[#ddd] bg-white p-2.5 text-xs rounded-xs focus:outline-hidden"
                      />
                      <span className="text-[10px] text-stone-500 mt-0.5 block">
                        Orders at or above this amount qualify for 100% free delivery nationwide.
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#333] mb-1">
                        Free COD Announcement Bar Text Template
                      </label>
                      <input
                        type="text"
                        value={settings.shipping.codAnnouncementText || '✨ FREE NATIONWIDE CASH ON DELIVERY ON ALL ORDERS ABOVE PKR {amount} ✨'}
                        onChange={(e) => setSettings({
                          ...settings,
                          shipping: { ...settings.shipping, codAnnouncementText: e.target.value }
                        })}
                        placeholder="✨ FREE NATIONWIDE CASH ON DELIVERY ON ALL ORDERS ABOVE PKR {amount} ✨"
                        className="w-full border border-[#ddd] bg-white p-2.5 text-xs rounded-xs focus:outline-hidden"
                      />
                      <span className="text-[10px] text-stone-500 mt-0.5 block">
                        Use <code className="bg-stone-200 px-1 py-0.5 text-[9px] rounded font-mono font-bold">{"{amount}"}</code> to automatically insert the formatted threshold (e.g. PKR 5,000).
                      </span>
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
                        className="w-full border border-[#ddd] bg-white p-2.5 text-xs rounded-xs font-mono focus:outline-hidden"
                      />
                    </div>
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

                {/* Social Media Links */}
                <div className="p-4 bg-[#faf8f5] border border-[#e8e3dc] rounded-sm space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#111] flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#aa814d]" />
                    Social Media Channels (Official Profiles)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#444] mb-1">Instagram URL</label>
                      <input
                        type="url"
                        value={settings.socialLinks.instagram}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                        })}
                        placeholder="https://instagram.com/gulpash.online"
                        className="w-full border border-[#ddd] bg-white p-2 text-xs rounded-xs focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#444] mb-1">Facebook URL</label>
                      <input
                        type="url"
                        value={settings.socialLinks.facebook}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                        })}
                        placeholder="https://facebook.com/gulpashofficial"
                        className="w-full border border-[#ddd] bg-white p-2 text-xs rounded-xs focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#444] mb-1">TikTok URL</label>
                      <input
                        type="url"
                        value={settings.socialLinks.tiktok || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, tiktok: e.target.value }
                        })}
                        placeholder="https://tiktok.com/@gulpash.online"
                        className="w-full border border-[#ddd] bg-white p-2 text-xs rounded-xs focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#444] mb-1">YouTube URL</label>
                      <input
                        type="url"
                        value={settings.socialLinks.youtube || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                        })}
                        placeholder="https://youtube.com/@gulpash"
                        className="w-full border border-[#ddd] bg-white p-2 text-xs rounded-xs focus:outline-hidden"
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
                    <span>Save All Settings</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* 6. MIGRATION & AUDIT REPORT TAB */}
        {activeTab === 'migration' && (
          <div className="space-y-6 animate-in fade-in">
            <MigrationReportView onNavigateToProduct={onNavigateToStoreProduct} />
          </div>
        )}

      </div>

      {/* CATEGORY ADD / EDIT MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setEditingCategory(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-2xl p-6 border border-[#e8e3dc] z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#eee]">
              <h3 className="font-serif text-xl font-bold text-[#111]">
                {isNewCategory ? 'Create New Category' : `Edit: ${editingCategory.name}`}
              </h3>
              <button onClick={() => setEditingCategory(null)} className="p-1 text-[#888] hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#333] mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = isNewCategory ? name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') : editingCategory.slug;
                    setEditingCategory({ ...editingCategory, name, slug });
                  }}
                  placeholder="e.g. Luxury Pret, Chiffon, Lawn"
                  className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333] mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="e.g. luxury-pret"
                  className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333] mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Short editorial summary of this collection"
                  className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333] mb-1">Category Showcase Image URL (Optional)</label>
                <input
                  type="url"
                  value={editingCategory.imageUrl || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-[#ddd] p-2.5 text-xs rounded-xs font-mono focus:outline-hidden"
                />
                {editingCategory.imageUrl && (
                  <div className="mt-2 w-20 h-24 border border-stone-200 rounded overflow-hidden">
                    <img src={editingCategory.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded text-xs space-y-2">
                <span className="font-semibold text-stone-800 block text-[11px] uppercase tracking-wider">Visibility Options</span>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingCategory.isVisible}
                      onChange={(e) => setEditingCategory({ ...editingCategory, isVisible: e.target.checked })}
                      className="accent-stone-900"
                    />
                    <span className="text-stone-700">Active in Storefront Catalog</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingCategory.visibleInNav !== false}
                      onChange={(e) => setEditingCategory({ ...editingCategory, visibleInNav: e.target.checked })}
                      className="accent-stone-900"
                    />
                    <span className="text-stone-700">Show in Top Navigation Header</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingCategory.visibleOnHomepage !== false}
                      onChange={(e) => setEditingCategory({ ...editingCategory, visibleOnHomepage: e.target.checked })}
                      className="accent-stone-900"
                    />
                    <span className="text-stone-700">Show in Homepage Curated Collections Row</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eee]">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 border border-[#ddd] text-xs font-medium rounded-xs text-[#555] hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#181818] hover:bg-[#c59b66] text-white text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow-md transition-colors"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <label className="block font-bold text-[#333] mb-1">Catalog Category (Product Type)</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full border border-[#ddd] p-2 rounded-xs bg-white focus:outline-hidden text-xs"
                  >
                    <option value="Unstitched / Stitched">Unstitched / Stitched</option>
                    <option value="Stitched">Stitched</option>
                    <option value="woman">woman</option>
                    <option value="Clothing">Clothing</option>
                    <option value="3 Pieces">3 Pieces</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#333] mb-1">Assigned Collection</label>
                  <select
                    value={editingProduct.collectionSlug || 'new-arrivals'}
                    onChange={(e) => setEditingProduct({ 
                      ...editingProduct, 
                      collectionSlug: e.target.value,
                      tags: Array.from(new Set([...editingProduct.tags, e.target.value]))
                    })}
                    className="w-full border border-[#ddd] p-2 rounded-xs bg-white focus:outline-hidden text-xs"
                  >
                    <option value="new-arrivals">NEW ARRIVALS (Source Verified)</option>
                    <option value="best-selling">BEST SELLING (Source Verified)</option>
                    <option value="winter-collection">WINTER COLLECTION (Source Verified)</option>
                    <option value="trending-designs">Trending Designs (Source Verified)</option>
                    <option value="co-ords">Co-Ords (Source Verified)</option>
                    <option value="home">Home Featured (Source Verified)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#333] mb-1">Fabric Specifications *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.fabric}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                    placeholder="e.g. Pure Jacquard Lawn with Silk Dupatta"
                    className="w-full border border-[#ddd] p-2 rounded-xs focus:outline-hidden text-xs"
                  />
                </div>

                {/* Optional Product Runway Video */}
                <div className="sm:col-span-2 space-y-1.5 p-3 bg-stone-50 border border-stone-200 rounded-xs">
                  <label className="block font-bold text-[#333] text-xs flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-stone-700" />
                    <span>Product Video / Runway Clip (Optional - Future Use)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={editingProduct.videoUrl || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, videoUrl: e.target.value })}
                      placeholder="https://.../runway.mp4"
                      className="flex-1 border border-[#ddd] p-2 rounded-xs focus:outline-hidden text-xs font-mono bg-white"
                    />
                    <label className="border border-stone-300 hover:border-stone-800 bg-white hover:bg-stone-100 px-3 py-2 text-xs text-stone-700 rounded-xs cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5 text-stone-500" />
                      <span>Upload Video File</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file || !editingProduct) return;
                          const res = await StorageService.uploadMedia('hero-videos', file, `product_${editingProduct.id}`);
                          if (res.url) {
                            setEditingProduct({ ...editingProduct, videoUrl: res.url });
                            triggerNotice('Product video uploaded and linked!');
                          } else {
                            alert(res.error || 'Failed to upload product video');
                          }
                        }}
                      />
                    </label>
                  </div>
                  <span className="text-[10px] text-stone-500 block">
                    Current migration status: 0 videos. Feature is ready for future product video additions.
                  </span>
                </div>
              </div>

              {/* STOREFRONT VISIBILITY & FLAGS */}
              <div className="p-3 bg-[#faf8f5] border border-[#e8e3dc] rounded-sm space-y-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-[#111] block">
                  Storefront Visibility & Display Badges
                </span>
                <div className="flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-800">
                    <input
                      type="checkbox"
                      checked={editingProduct.isVisible !== false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isVisible: e.target.checked })}
                      className="accent-emerald-700 w-4 h-4"
                    />
                    <span>Publish to Storefront (Uncheck to hide completely)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-[#444]">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFeatured}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      className="accent-[#c59b66]"
                    />
                    <span>Featured on Homepage</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-[#444]">
                    <input
                      type="checkbox"
                      checked={editingProduct.isNewArrival}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                      className="accent-[#c59b66]"
                    />
                    <span>New In Badge</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-red-700">
                    <input
                      type="checkbox"
                      checked={editingProduct.isSoldOut}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isSoldOut: e.target.checked })}
                      className="accent-red-600"
                    />
                    <span>Mark as Sold Out</span>
                  </label>
                </div>
              </div>

              {/* PRODUCT IMAGE GALLERY MANAGER */}
              <div className="p-3.5 bg-white border border-[#ddd] rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#111] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#aa814d]" />
                    Product Images ({editingProduct.images.length})
                  </span>
                  <span className="text-[10px] text-[#888]">
                    Image #1 is the Primary thumbnail shown across all storefront grids.
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {editingProduct.images.map((img, idx) => (
                    <div key={idx} className="relative group border border-[#ddd] rounded-xs p-1.5 bg-[#faf8f5] flex flex-col justify-between">
                      <div className="aspect-[3/4] w-full overflow-hidden rounded-xs bg-stone-100 relative">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        {idx === 0 ? (
                          <span className="absolute top-1 left-1 bg-[#111] text-[#c59b66] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Primary
                          </span>
                        ) : (
                          <span className="absolute top-1 left-1 bg-black/60 text-white text-[8px] px-1 rounded">
                            #{idx + 1}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1 pt-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="text-[9px] font-semibold text-[#aa814d] hover:underline"
                            title="Make this the main cover image"
                          >
                            Set Primary
                          </button>
                        )}
                        <div className="flex items-center gap-0.5 ml-auto">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, idx - 1)}
                              className="p-1 text-[#666] hover:text-black"
                              title="Move earlier"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                          )}
                          {idx < editingProduct.images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, idx + 1)}
                              className="p-1 text-[#666] hover:text-black"
                              title="Move later"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(idx)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Delete image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Image via URL or Direct Device Upload */}
                <div className="pt-2 border-t border-[#eee] space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://cdn.shopify.com/... (Image URL)"
                      className="flex-1 border border-[#ddd] p-2 text-xs font-mono rounded-xs focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="bg-[#222] hover:bg-[#c59b66] text-white text-xs font-bold px-3 py-2 rounded-xs uppercase tracking-wider cursor-pointer"
                    >
                      Add Image
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex-1 border border-dashed border-stone-300 hover:border-stone-800 p-2 text-center text-xs text-stone-600 rounded-xs cursor-pointer flex items-center justify-center gap-2 transition-colors bg-stone-50 hover:bg-stone-100">
                      {uploadingProductImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading to Supabase Storage (product-images)...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-stone-500" />
                          <span>Or Upload Image File from Device (Supabase Storage)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingProductImage}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file || !editingProduct) return;
                          setUploadingProductImage(true);
                          const res = await StorageService.uploadMedia('product-images', file, editingProduct.id);
                          setUploadingProductImage(false);
                          if (res.url) {
                            setEditingProduct({
                              ...editingProduct,
                              images: [...editingProduct.images, res.url]
                            });
                            triggerNotice('Product image uploaded successfully to Supabase Storage!');
                          } else {
                            alert(res.error || 'Failed to upload product image');
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* VARIANTS & SIZES MANAGER */}
              <div className="p-3.5 bg-white border border-[#ddd] rounded-sm space-y-3">
                <span className="font-bold text-xs uppercase tracking-wider text-[#111] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#aa814d]" />
                  Product Variants ({editingProduct.variants?.length || editingProduct.sizes.length})
                </span>

                {editingProduct.variants && editingProduct.variants.length > 0 ? (
                  <div className="divide-y divide-[#eee] border border-[#eee] rounded-xs">
                    {editingProduct.variants.map((v) => (
                      <div key={v.id} className="p-2 flex items-center justify-between text-xs hover:bg-[#faf8f5]">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#111]">{v.title}</span>
                          <span className="font-mono text-[10px] text-[#888]">SKU: {v.sku}</span>
                          <span className="font-semibold text-emerald-800">{formatPrice(v.price, 'PKR')}</span>
                          <span className="text-[10px] text-[#666]">Stock: {v.stock ?? 10}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteVariant(v.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove variant"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {editingProduct.sizes.map((s, idx) => (
                      <span key={idx} className="bg-stone-100 border border-stone-300 px-2 py-1 rounded text-xs font-mono font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Add Variant Row */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-[#eee]">
                  <input
                    type="text"
                    value={newVariantTitle}
                    onChange={(e) => setNewVariantTitle(e.target.value)}
                    placeholder="Variant (e.g. XL or Stitched)"
                    className="sm:col-span-2 border border-[#ddd] p-1.5 text-xs rounded-xs"
                  />
                  <input
                    type="text"
                    value={newVariantSku}
                    onChange={(e) => setNewVariantSku(e.target.value)}
                    placeholder="Variant SKU"
                    className="border border-[#ddd] p-1.5 text-xs rounded-xs font-mono"
                  />
                  <input
                    type="number"
                    value={newVariantPrice || ''}
                    onChange={(e) => setNewVariantPrice(Number(e.target.value))}
                    placeholder="Price PKR"
                    className="border border-[#ddd] p-1.5 text-xs rounded-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="bg-[#222] hover:bg-[#c59b66] text-white text-[11px] font-bold py-1.5 rounded-xs uppercase tracking-wider cursor-pointer"
                  >
                    Add Variant
                  </button>
                </div>
              </div>

              {/* SHOWCASE VIDEO URL */}
              <div>
                <label className="block font-bold text-[#333] mb-1 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-[#aa814d]" />
                  Product Showcase Video URL (Optional MP4 / WebM)
                </label>
                <input
                  type="url"
                  value={editingProduct.videoUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, videoUrl: e.target.value })}
                  placeholder="https://... (mp4)"
                  className="w-full border border-[#ddd] p-2 rounded-xs font-mono text-[11px] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#333] mb-1">Description (Preserves Source HTML/Text)</label>
                <textarea
                  rows={4}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full border border-[#ddd] p-2 rounded-xs focus:outline-hidden font-mono text-[11px]"
                />
              </div>

              <div className="pt-4 border-t border-[#eee] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-[#ccc] rounded-xs text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#181818] hover:bg-[#c59b66] text-white text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer"
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
