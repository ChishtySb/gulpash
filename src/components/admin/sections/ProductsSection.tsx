import React, { useState } from 'react';
import { 
  Package, Search, Plus, Edit, Trash2, Copy, ExternalLink, 
  Eye, EyeOff, Check, X, ArrowUpDown, Filter, Sparkles, 
  AlertTriangle, CheckCircle2, ChevronDown, Layers
} from 'lucide-react';
import { Product, Category, Collection } from '../../../types';
import { StorageService } from '../../../lib/storage';
import { formatPrice } from '../../../lib/currency';
import { ProductEditForm, STOREFRONT_COLLECTIONS } from './ProductEditForm';

interface ProductsSectionProps {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  subview: 'all' | 'add' | 'collections' | 'inventory';
  editingProduct: Product | null;
  onSelectProductToEdit: (product: Product | null) => void;
  onNavigateSub: (sub: 'all' | 'add' | 'collections' | 'inventory') => void;
  onNavigateToStoreProduct?: (slug: string) => void;
  onNotify: (msg: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products = [],
  categories = [],
  collections = [],
  subview,
  editingProduct,
  onSelectProductToEdit,
  onNavigateSub,
  onNavigateToStoreProduct,
  onNotify
}) => {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Bulk action state
  const [bulkActionOpen, setBulkActionOpen] = useState(false);

  // Modals & inline stock editing
  const [inlineStockEdit, setInlineStockEdit] = useState<{ id: string; stock: number } | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ id: string; title: string } | null>(null);

  // Derived filtered products
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory || p.categorySlug === selectedCategory;
    
    let matchesCollection = true;
    if (selectedCollection !== 'all') {
      const colTarget = STOREFRONT_COLLECTIONS.find(c => c.slug === selectedCollection);
      const targetName = colTarget?.name.toUpperCase();
      matchesCollection = !!(
        p.collectionNames?.some(n => n.toUpperCase() === targetName) ||
        p.tags?.includes(selectedCollection) ||
        p.collection === targetName ||
        p.collectionSlug === selectedCollection
      );
    }

    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

    const matchesStock = (() => {
      if (selectedStockFilter === 'all') return true;
      const isOutOfStock = p.isSoldOut || (p.stock ?? 0) <= 0;
      if (selectedStockFilter === 'out_of_stock') return isOutOfStock;
      if (selectedStockFilter === 'low_stock') {
        if (p.inventoryMode === 'availability') return false;
        const threshold = p.lowStockThreshold || 3;
        return !isOutOfStock && (p.stock ?? 0) <= threshold;
      }
      if (selectedStockFilter === 'in_stock') {
        return !isOutOfStock;
      }
      return true;
    })();

    return matchesSearch && matchesCategory && matchesCollection && matchesStatus && matchesStock;
  });

  // DUPLICATE PRODUCT
  const handleDuplicate = (id: string) => {
    const copy = StorageService.duplicateProduct(id);
    if (copy) {
      onNotify(`Product duplicated successfully as "${copy.title}"!`);
      onSelectProductToEdit(copy);
      onNavigateSub('add');
    }
  };

  // TOGGLE VISIBILITY
  const handleToggleVisibility = (p: Product) => {
    const updated = { ...p, isVisible: !p.isVisible };
    StorageService.saveProduct(updated);
    onNotify(`Product "${p.title}" is now ${updated.isVisible ? 'Visible on store' : 'Hidden from store'}.`);
  };

  // DELETE / ARCHIVE PRODUCT
  const handleDelete = (id: string, title: string) => {
    setDeleteConfirmModal({ id, title });
  };

  const handleArchiveProduct = () => {
    if (!deleteConfirmModal) return;
    const p = products.find(prod => prod.id === deleteConfirmModal.id);
    if (p) {
      const updated: Product = { ...p, status: 'Archived', isVisible: false };
      StorageService.saveProduct(updated);
      onNotify(`Product "${p.title}" has been safely archived. Historical customer orders preserved.`);
    }
    setDeleteConfirmModal(null);
  };

  const handlePermanentDeleteProduct = () => {
    if (!deleteConfirmModal) return;
    StorageService.deleteProduct(deleteConfirmModal.id, false);
    onNotify(`Product "${deleteConfirmModal.title}" permanently deleted.`);
    setDeleteConfirmModal(null);
  };

  // BULK ACTIONS
  const handleBulkStatusChange = (status: 'Active' | 'Draft' | 'Archived') => {
    if (selectedProductIds.length === 0) return;
    StorageService.bulkUpdateProductStatus(selectedProductIds, status);
    onNotify(`Updated ${selectedProductIds.length} products to status: ${status}.`);
    setSelectedProductIds([]);
    setBulkActionOpen(false);
  };

  const handleBulkAddToCollection = (colSlug: string) => {
    if (selectedProductIds.length === 0) return;
    StorageService.bulkUpdateCollections(selectedProductIds, [colSlug]);
    const colName = STOREFRONT_COLLECTIONS.find(c => c.slug === colSlug)?.name || colSlug;
    onNotify(`Added ${selectedProductIds.length} products to collection: ${colName}.`);
    setSelectedProductIds([]);
    setBulkActionOpen(false);
  };

  const handleBulkDelete = () => {
    if (selectedProductIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedProductIds.length} selected products?`)) {
      selectedProductIds.forEach(id => {
        StorageService.deleteProduct(id, false);
      });
      onNotify(`Deleted ${selectedProductIds.length} products.`);
      setSelectedProductIds([]);
      setBulkActionOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => onNavigateSub('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              subview === 'all' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            All Products ({products.length})
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectProductToEdit(null);
              onNavigateSub('add');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              subview === 'add' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{editingProduct ? 'Edit Product' : 'Add Product'}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSub('inventory')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              subview === 'inventory' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Inventory & Stock
          </button>

          <button
            type="button"
            onClick={() => onNavigateSub('collections')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              subview === 'collections' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Storefront Collections
          </button>
        </div>

        {/* Informative catalog stats pill */}
        <div className="text-xs text-stone-500 font-mono flex items-center gap-3">
          <span>Active: <strong className="text-stone-900">{products.filter(p => p.status === 'Active').length}</strong></span>
          <span>•</span>
          <span>Drafts: <strong className="text-stone-900">{products.filter(p => p.status === 'Draft').length}</strong></span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. ALL PRODUCTS VIEW                                      */}
      {/* ======================================================== */}
      {subview === 'all' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 border border-stone-200 rounded-lg space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search title, SKU, slug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-stone-300 rounded bg-white focus:outline-none focus:border-stone-900"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Collection Filter */}
              <div>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-stone-300 rounded bg-white focus:outline-none focus:border-stone-900"
                >
                  <option value="all">All Storefront Collections</option>
                  {STOREFRONT_COLLECTIONS.map(col => (
                    <option key={col.slug} value={col.slug}>{col.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-stone-300 rounded bg-white focus:outline-none focus:border-stone-900"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Stock / Availability Filter */}
              <div>
                <select
                  value={selectedStockFilter}
                  onChange={(e) => setSelectedStockFilter(e.target.value as any)}
                  className="w-full py-2 px-3 text-xs border border-stone-300 rounded bg-white focus:outline-none focus:border-stone-900"
                >
                  <option value="all">All Inventory Status</option>
                  <option value="in_stock">In Stock (Available)</option>
                  <option value="low_stock">Low Stock (≤ 3 units)</option>
                  <option value="out_of_stock">Out of Stock (Sold Out)</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedProductIds.length > 0 && (
              <div className="p-2.5 bg-stone-900 text-white rounded flex items-center justify-between text-xs animate-in fade-in">
                <span className="font-medium">
                  {selectedProductIds.length} products selected
                </span>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setBulkActionOpen(!bulkActionOpen)}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <span>Bulk Actions</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {bulkActionOpen && (
                      <div className="absolute right-0 bottom-full mb-1 w-56 bg-white text-stone-800 rounded-lg shadow-xl border border-stone-200 py-1.5 z-30 animate-in fade-in">
                        <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          Update Status
                        </div>
                        <button
                          type="button"
                          onClick={() => handleBulkStatusChange('Active')}
                          className="w-full text-left px-3 py-1.5 hover:bg-stone-100 text-xs flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Set Status to Active
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBulkStatusChange('Draft')}
                          className="w-full text-left px-3 py-1.5 hover:bg-stone-100 text-xs flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Set Status to Draft
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBulkStatusChange('Archived')}
                          className="w-full text-left px-3 py-1.5 hover:bg-stone-100 text-xs flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-stone-400" />
                          Archive Products
                        </button>

                        <div className="border-t border-stone-100 my-1" />
                        <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          Add to Collection
                        </div>
                        {STOREFRONT_COLLECTIONS.filter(c => c.slug !== 'all').map(col => (
                          <button
                            key={col.slug}
                            type="button"
                            onClick={() => handleBulkAddToCollection(col.slug)}
                            className="w-full text-left px-3 py-1.5 hover:bg-stone-100 text-xs truncate"
                          >
                            + {col.name}
                          </button>
                        ))}

                        <div className="border-t border-stone-100 my-1" />
                        <button
                          type="button"
                          onClick={handleBulkDelete}
                          className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 text-xs flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Selected
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProductIds([])}
                    className="p-1 text-stone-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Products Table */}
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                  <tr>
                    <th className="p-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.length > 0 && selectedProductIds.length === filteredProducts.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProductIds(filteredProducts.map(p => p.id));
                          } else {
                            setSelectedProductIds([]);
                          }
                        }}
                        className="accent-stone-900"
                      />
                    </th>
                    <th className="p-3 w-16">Image</th>
                    <th className="p-3 min-w-[180px]">Product & SKU</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 min-w-[150px]">Collections</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock / Availability</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Visibility</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-stone-500">
                        No products match your current search and filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const isSelected = selectedProductIds.includes(p.id);
                      const isLowStock = p.inventoryMode !== 'availability' && (p.stock || 0) <= (p.lowStockThreshold || 3) && (p.stock || 0) > 0;
                      const isOutOfStock = p.isSoldOut || (p.stock || 0) <= 0;

                      return (
                        <tr key={p.id} className={`hover:bg-stone-50/80 transition-colors ${isSelected ? 'bg-amber-50/40' : ''}`}>
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProductIds(prev => [...prev, p.id]);
                                } else {
                                  setSelectedProductIds(prev => prev.filter(id => id !== p.id));
                                }
                              }}
                              className="accent-stone-900"
                            />
                          </td>
                          <td className="p-3">
                            <div className="relative w-10 h-13 rounded overflow-hidden border border-stone-200 bg-stone-100">
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'}
                                alt={p.title}
                                className="w-full h-full object-cover object-top"
                              />
                              {p.videoUrl && (
                                <span className="absolute bottom-0 right-0 bg-stone-900/80 text-white text-[8px] px-1 py-0.2 rounded-tl">
                                  VID
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium text-stone-900 line-clamp-1">{p.title}</div>
                            <div className="text-[10px] font-mono text-stone-500 flex items-center gap-1 mt-0.5">
                              <span>SKU: {p.sku || '—'}</span>
                              <span>•</span>
                              <span className="truncate max-w-[120px]">{p.slug}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-stone-700">{p.category || 'Luxury Pret'}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1 max-w-[190px]">
                              {(p.collectionNames || []).slice(0, 2).map((cName, idx) => (
                                <span key={idx} className="text-[9px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded font-medium truncate max-w-[90px]">
                                  {cName}
                                </span>
                              ))}
                              {(p.collectionNames || []).length > 2 && (
                                <div className="relative inline-block group">
                                  <button
                                    type="button"
                                    className="text-[9px] bg-stone-200 hover:bg-stone-300 text-stone-800 px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors"
                                  >
                                    +{(p.collectionNames || []).length - 2} more
                                  </button>
                                  <div className="hidden group-hover:block group-focus-within:block absolute left-0 bottom-full mb-1 z-40 w-48 p-2.5 bg-stone-900 text-white text-[10px] rounded-md shadow-xl border border-stone-800 pointer-events-none">
                                    <div className="font-bold uppercase tracking-wider text-amber-400 mb-1.5 text-[9px]">
                                      Assigned Collections ({(p.collectionNames || []).length})
                                    </div>
                                    <div className="space-y-1">
                                      {(p.collectionNames || []).map((col, cIdx) => (
                                        <div key={cIdx} className="flex items-center gap-1.5">
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                          <span className="truncate">{col}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-mono font-bold text-stone-900">
                              {formatPrice(p.price, 'PKR')}
                            </div>
                            {p.compareAtPrice && p.compareAtPrice > p.price && (
                              <div className="text-[10px] font-mono text-stone-400 line-through">
                                {formatPrice(p.compareAtPrice, 'PKR')}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            {p.inventoryMode === 'availability' ? (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.isSoldOut 
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}>
                                {p.isSoldOut ? 'Sold Out' : 'Available'}
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className={`font-mono font-bold ${
                                  isOutOfStock ? 'text-rose-700' : isLowStock ? 'text-amber-700' : 'text-stone-900'
                                }`}>
                                  {p.stock} units
                                </span>
                                {isOutOfStock && (
                                  <span className="text-[9px] bg-rose-50 text-rose-700 font-bold px-1 rounded border border-rose-200">
                                    OUT
                                  </span>
                                )}
                                {isLowStock && (
                                  <span className="text-[9px] bg-amber-50 text-amber-800 font-bold px-1 rounded border border-amber-300">
                                    LOW
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              p.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                              p.status === 'Draft' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                              'bg-stone-100 text-stone-600'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={() => handleToggleVisibility(p)}
                              className="text-stone-500 hover:text-stone-900 cursor-pointer"
                              title={p.isVisible ? 'Hide from storefront catalog' : 'Show on storefront catalog'}
                            >
                              {p.isVisible ? (
                                <span className="flex items-center gap-1 text-[11px] text-emerald-700">
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Visible</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-[11px] text-stone-400">
                                  <EyeOff className="w-3.5 h-3.5" />
                                  <span>Hidden</span>
                                </span>
                              )}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {p.slug && onNavigateToStoreProduct && (
                                <button
                                  type="button"
                                  onClick={() => onNavigateToStoreProduct(p.slug)}
                                  className="p-1 hover:bg-stone-100 rounded text-stone-500 hover:text-stone-900 cursor-pointer"
                                  title="View on Storefront"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDuplicate(p.id)}
                                className="p-1 hover:bg-stone-100 rounded text-stone-500 hover:text-stone-900 cursor-pointer"
                                title="Duplicate Product"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectProductToEdit(p);
                                  onNavigateSub('add');
                                }}
                                className="p-1 hover:bg-stone-100 rounded text-stone-700 hover:text-stone-900 cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(p.id, p.title)}
                                className="p-1 hover:bg-rose-50 rounded text-rose-500 hover:text-rose-700 cursor-pointer"
                                title="Archive / Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {filteredProducts.map((p) => {
              const isLowStock = p.inventoryMode !== 'availability' && (p.stock || 0) <= (p.lowStockThreshold || 3) && (p.stock || 0) > 0;
              const isOutOfStock = p.isSoldOut || (p.stock || 0) <= 0;

              return (
                <div key={p.id} className="bg-white border border-stone-200 rounded-lg p-3 space-y-3">
                  <div className="flex gap-3">
                    <img
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80'}
                      alt={p.title}
                      className="w-16 h-22 object-cover border border-stone-200 rounded shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-stone-900 text-xs line-clamp-2">{p.title}</h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                          p.status === 'Active' ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-stone-500 mt-1">
                        SKU: {p.sku || '—'}
                      </div>
                      <div className="text-xs font-mono font-bold text-stone-900 mt-1">
                        {formatPrice(p.price, 'PKR')}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px]">
                        {p.inventoryMode === 'availability' ? (
                          <span className={p.isSoldOut ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                            {p.isSoldOut ? 'Sold Out' : 'Available'}
                          </span>
                        ) : (
                          <span className={isOutOfStock ? 'text-rose-700 font-bold' : isLowStock ? 'text-amber-700 font-bold' : 'text-stone-500'}>
                            Stock: {p.stock} units
                          </span>
                        )}
                        <span>&bull;</span>
                        <span className="text-stone-500">{p.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Card Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(p)}
                      className="text-stone-600 flex items-center gap-1"
                    >
                      {p.isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{p.isVisible ? 'Visible' : 'Hidden'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(p.id)}
                        className="px-2 py-1 bg-stone-100 rounded text-stone-700"
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProductToEdit(p);
                          onNavigateSub('add');
                        }}
                        className="px-3 py-1 bg-stone-900 text-white rounded font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ADD / EDIT PRODUCT VIEW (Modular CMS Experience)       */}
      {/* ======================================================== */}
      {subview === 'add' && (
        <ProductEditForm
          initialProduct={editingProduct}
          categories={categories}
          onSave={(savedProduct, isDraft) => {
            StorageService.saveProduct(savedProduct);
            onNotify(isDraft 
              ? `Saved draft for "${savedProduct.title || 'Untitled'}" successfully!` 
              : `Published "${savedProduct.title}" successfully to storefront!`
            );
            onSelectProductToEdit(null);
            onNavigateSub('all');
          }}
          onCancel={() => {
            onSelectProductToEdit(null);
            onNavigateSub('all');
          }}
          onPreviewStorefront={onNavigateToStoreProduct}
          onNotify={onNotify}
        />
      )}

      {/* ======================================================== */}
      {/* 3. INVENTORY & STOCK QUICK EDITOR                        */}
      {/* ======================================================== */}
      {subview === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white p-4 border border-stone-200 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Inventory & Stock Control
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Quick-adjust units for Mode A tracked items, or toggle Availability for Mode B source items.
              </p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase font-bold text-stone-500">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Tracking Mode</th>
                  <th className="p-3">Stock / Availability</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map(p => {
                  const isModeB = p.inventoryMode === 'availability';
                  const isLow = !isModeB && (p.stock || 0) <= (p.lowStockThreshold || 3) && (p.stock || 0) > 0;

                  return (
                    <tr key={p.id} className="hover:bg-stone-50">
                      <td className="p-3 font-medium text-stone-900 max-w-xs truncate">
                        <div className="flex items-center gap-2">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=100&q=80'}
                            alt={p.title}
                            className="w-8 h-10 object-cover rounded border border-stone-200 shrink-0"
                          />
                          <span className="truncate">{p.title}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-stone-500">
                        {p.sku || '—'}
                      </td>
                      <td className="p-3 font-mono">
                        {formatPrice(p.price, 'PKR')}
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                          {isModeB ? 'Availability' : 'Quantity Units'}
                        </span>
                      </td>
                      <td className="p-3">
                        {isModeB ? (
                          <button
                            type="button"
                            onClick={() => {
                              const newSoldOut = !p.isSoldOut;
                              const updated = { ...p, isSoldOut: newSoldOut, stock: newSoldOut ? 0 : 1 };
                              StorageService.saveProduct(updated);
                              onNotify(`"${p.title}" marked as ${newSoldOut ? 'Sold Out' : 'Available'}.`);
                            }}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium border cursor-pointer ${
                              p.isSoldOut
                                ? 'bg-rose-50 border-rose-300 text-rose-700'
                                : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                            }`}
                          >
                            {p.isSoldOut ? 'Sold Out (Click to make Available)' : 'Available (Click to mark Sold Out)'}
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              defaultValue={p.stock}
                              onBlur={(e) => {
                                const newStock = Math.max(0, Number(e.target.value));
                                if (newStock !== p.stock) {
                                  StorageService.saveProduct({ ...p, stock: newStock, isSoldOut: newStock <= 0 });
                                  onNotify(`Updated stock for "${p.title}" to ${newStock} units.`);
                                }
                              }}
                              className="w-20 p-1 border border-stone-300 rounded text-xs font-mono font-bold"
                            />
                            {isLow && (
                              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-300">
                                LOW
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] px-2 py-0.5 bg-stone-100 rounded text-stone-700">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. COLLECTIONS GRID VIEW                                 */}
      {/* ======================================================== */}
      {subview === 'collections' && (
        <div className="space-y-4">
          <div className="bg-white p-4 border border-stone-200 rounded-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Assigned Products per Storefront Collection
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Click any collection to filter the active catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STOREFRONT_COLLECTIONS.map(col => {
              const matches = products.filter(p => 
                p.collectionNames?.some(n => n.toUpperCase() === col.name.toUpperCase()) ||
                p.tags?.includes(col.slug) ||
                p.collection === col.name.toUpperCase() ||
                p.collectionSlug === col.slug
              );

              return (
                <div key={col.slug} className="bg-white border border-stone-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      {col.name}
                    </h4>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-stone-100 rounded text-stone-800">
                      {matches.length} items
                    </span>
                  </div>

                  <div className="flex -space-x-2 overflow-hidden py-1">
                    {matches.slice(0, 5).map(m => (
                      <img
                        key={m.id}
                        src={m.images?.[0]}
                        alt={m.title}
                        className="inline-block h-10 w-8 object-cover rounded ring-2 ring-white"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCollection(col.slug);
                      onNavigateSub('all');
                    }}
                    className="w-full text-center py-1.5 border border-stone-200 rounded text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    View in Products Table &rarr;
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Delete / Archive Confirmation Modal */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in font-sans">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Manage Product Removal</h4>
                <p className="text-xs text-stone-500 font-medium truncate max-w-xs">{deleteConfirmModal.title}</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Permanent deletion will erase this product from your database. To preserve customer historical orders, order details, and sales audit trails, we strongly recommend <strong>Archiving</strong> instead.
            </p>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 space-y-1">
              <p><strong>Archiving:</strong> Hides product from storefront catalog while protecting previous purchases.</p>
              <p><strong>Permanent Delete:</strong> Erases the record completely from Supabase.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="w-full sm:w-auto px-3.5 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleArchiveProduct}
                className="w-full sm:w-auto px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                Archive (Recommended)
              </button>
              <button
                type="button"
                onClick={handlePermanentDeleteProduct}
                className="w-full sm:w-auto px-3.5 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
