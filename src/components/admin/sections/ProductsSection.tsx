import React, { useState, useRef } from 'react';
import { 
  Package, Search, Plus, Edit, Trash2, Copy, ExternalLink, 
  Eye, EyeOff, Check, X, ArrowUpDown, Filter, Upload, Image as ImageIcon,
  Video, Sparkles, AlertCircle, CheckCircle2, ChevronDown, Layers
} from 'lucide-react';
import { Product, Category, Collection } from '../../../types';
import { StorageService } from '../../../lib/storage';
import { formatPrice } from '../../../lib/currency';

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

// Pre-defined 6 Storefront Collections
const STOREFRONT_COLLECTIONS = [
  { slug: 'luxury-formals', name: 'Luxury Formals' },
  { slug: 'luxury-pret', name: 'Luxury Pret' },
  { slug: 'velvet-edit', name: 'Velvet Edit' },
  { slug: 'signature-raw-silk', name: 'Signature Raw Silk' },
  { slug: 'wedding-festive', name: 'Wedding Festive' },
  { slug: 'short-length-article', name: 'Short Length Article' }
];

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  categories,
  collections,
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
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Bulk action state
  const [bulkActionOpen, setBulkActionOpen] = useState(false);

  // Quick inline stock editor state
  const [inlineStockEdit, setInlineStockEdit] = useState<{ id: string; stock: number } | null>(null);

  // Form tabs for Add / Edit
  const [formTab, setFormTab] = useState<'basic' | 'media' | 'pricing' | 'collections' | 'fabric' | 'status'>('basic');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>(() => {
    if (editingProduct) return { ...editingProduct };
    return {
      id: `gp-${Date.now()}`,
      title: '',
      slug: '',
      sku: '',
      price: 0,
      compareAtPrice: undefined,
      description: '',
      images: [],
      videoUrl: '',
      stock: 15,
      status: 'Active',
      isVisible: true,
      category: categories[0]?.name || 'Luxury Pret',
      categoryId: categories[0]?.id || 'cat-1',
      categorySlug: categories[0]?.slug || 'luxury-pret',
      collectionNames: ['NEW ARRIVALS'],
      tags: [],
      fabricDetails: 'Pure Organza & Raw Silk 80g',
      pieceCount: '3-Piece (Shirt, Trouser & Dupatta)',
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    };
  });

  // When editingProduct changes externally
  React.useEffect(() => {
    if (editingProduct) {
      setFormData({ ...editingProduct });
      setFormTab('basic');
    }
  }, [editingProduct]);

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

    return matchesSearch && matchesCategory && matchesCollection && matchesStatus;
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

  // DELETE PRODUCT
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      StorageService.deleteProduct(id, false);
      onNotify(`Product "${title}" has been deleted.`);
    }
  };

  // QUICK STOCK SAVE
  const handleSaveInlineStock = (id: string) => {
    if (!inlineStockEdit || inlineStockEdit.id !== id) return;
    const p = products.find(prod => prod.id === id);
    if (p) {
      const updated = { ...p, stock: Number(inlineStockEdit.stock) || 0 };
      StorageService.saveProduct(updated);
      setInlineStockEdit(null);
      onNotify(`Stock updated to ${updated.stock} units.`);
    }
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

  // IMAGE UPLOAD HANDLER FROM PC
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      const currentImages = Array.isArray(formData.images) ? [...formData.images] : [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await StorageService.uploadMediaFile(file, 'product-image', [`Product: ${formData.title || 'New Item'}`]);
        if (res.url) {
          currentImages.push(res.url);
        }
      }

      setFormData(prev => ({ ...prev, images: currentImages }));
      onNotify(`Uploaded ${files.length} image(s) to product media!`);
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Failed to upload image from PC.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // VIDEO UPLOAD HANDLER FROM PC
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingVideo(true);
      const res = await StorageService.uploadMediaFile(file, 'product-video', [`Video: ${formData.title || 'New Item'}`]);
      if (res.url) {
        setFormData(prev => ({ ...prev, videoUrl: res.url }));
        onNotify('Runway preview video uploaded successfully!');
      }
    } catch (err) {
      console.error('Video upload error:', err);
      alert('Failed to upload video from PC.');
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  // SET PRIMARY THUMBNAIL
  const handleSetPrimaryImage = (index: number) => {
    if (!formData.images || index === 0) return;
    const list = [...formData.images];
    const target = list.splice(index, 1)[0];
    list.unshift(target);
    setFormData(prev => ({ ...prev, images: list }));
    onNotify('Primary storefront thumbnail updated.');
  };

  // REMOVE IMAGE
  const handleRemoveImage = (index: number) => {
    if (!formData.images) return;
    const list = formData.images.filter((_, idx) => idx !== index);
    setFormData(prev => ({ ...prev, images: list }));
  };

  // SAVE PRODUCT FORM
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('Please enter a product title.');
      setFormTab('basic');
      return;
    }

    const generatedSlug = formData.slug?.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const generatedSku = formData.sku?.trim() || `GP-${Date.now().toString().slice(-5)}`;

    const fullProduct: Product = {
      id: formData.id || `gp-${Date.now()}`,
      title: formData.title.trim(),
      slug: generatedSlug,
      sku: generatedSku,
      price: Number(formData.price) || 0,
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
      description: formData.description || '',
      images: formData.images && formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'],
      videoUrl: formData.videoUrl || undefined,
      stock: Number(formData.stock) || 0,
      status: formData.status || 'Active',
      isVisible: formData.isVisible ?? true,
      category: formData.category || 'Luxury Pret',
      categoryId: formData.categoryId || 'cat-1',
      categorySlug: formData.categorySlug || 'luxury-pret',
      collectionNames: formData.collectionNames || ['NEW ARRIVALS'],
      tags: formData.tags || [],
      fabric: formData.fabric || formData.fabricDetails || 'Luxury Chiffon / Lawn',
      fabricDetails: formData.fabricDetails,
      pieceCount: formData.pieceCount,
      rating: formData.rating ?? 5.0,
      reviewCount: formData.reviewCount ?? 12,
      sizes: formData.sizes && formData.sizes.length > 0 ? formData.sizes : ['XS', 'S', 'M', 'L', 'XL'],
      isNewArrival: formData.collectionNames?.includes('NEW ARRIVALS'),
      isBestSeller: formData.collectionNames?.includes('TRENDING') || formData.collectionNames?.includes('BEST SELLING'),
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.saveProduct(fullProduct);
    onNotify(`Saved product "${fullProduct.title}" successfully!`);
    onSelectProductToEdit(null);
    onNavigateSub('all');
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => {
              onSelectProductToEdit(null);
              onNavigateSub('all');
            }}
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
            Stock & Inventory
          </button>
          <button
            type="button"
            onClick={() => onNavigateSub('collections')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              subview === 'collections' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Collections Grid
          </button>
        </div>

        {subview === 'all' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onSelectProductToEdit(null);
                onNavigateSub('add');
              }}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium uppercase tracking-wider px-3 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 1. ALL PRODUCTS VIEW                                      */}
      {/* ======================================================== */}
      {subview === 'all' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 border border-stone-200 rounded-lg space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                      className="bg-stone-800 hover:bg-stone-700 text-white px-2.5 py-1 rounded text-xs flex items-center gap-1"
                    >
                      <span>Bulk Actions</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {bulkActionOpen && (
                      <div className="absolute right-0 mt-1 w-52 bg-white text-stone-900 border border-stone-200 rounded shadow-xl py-1 z-30 text-xs">
                        <div className="px-3 py-1 text-[10px] uppercase font-bold text-stone-400">Change Status</div>
                        <button
                          type="button"
                          onClick={() => handleBulkStatusChange('Active')}
                          className="w-full text-left px-3 py-1.5 hover:bg-stone-100"
                        >
                          Mark as Active
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBulkStatusChange('Draft')}
                          className="w-full text-left px-3 py-1.5 hover:bg-stone-100"
                        >
                          Mark as Draft
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBulkStatusChange('Archived')}
                          className="w-full text-left px-3 py-1.5 hover:bg-stone-100"
                        >
                          Mark as Archived
                        </button>

                        <div className="border-t border-stone-100 my-1"></div>
                        <div className="px-3 py-1 text-[10px] uppercase font-bold text-stone-400">Add to Collection</div>
                        {STOREFRONT_COLLECTIONS.map(col => (
                          <button
                            key={col.slug}
                            type="button"
                            onClick={() => handleBulkAddToCollection(col.slug)}
                            className="w-full text-left px-3 py-1.5 hover:bg-stone-100 truncate"
                          >
                            + {col.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProductIds([])}
                    className="text-stone-400 hover:text-white text-xs underline"
                  >
                    Deselect
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Products Table (Responsive for Desktop and Mobile) */}
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase font-bold tracking-wider text-stone-500">
                  <tr>
                    <th className="p-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProductIds(filteredProducts.map(p => p.id));
                          } else {
                            setSelectedProductIds([]);
                          }
                        }}
                      />
                    </th>
                    <th className="p-3">Product</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Collections</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => {
                    const isSelected = selectedProductIds.includes(p.id);
                    const isLowStock = (p.stock || 0) <= 5;

                    return (
                      <tr key={p.id} className={`hover:bg-stone-50/80 transition-colors ${isSelected ? 'bg-stone-50' : ''}`}>
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProductIds([...selectedProductIds, p.id]);
                              } else {
                                setSelectedProductIds(selectedProductIds.filter(id => id !== p.id));
                              }
                            }}
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                              alt={p.title}
                              className="w-12 h-16 object-cover border border-stone-200 rounded shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="font-medium text-stone-900 truncate max-w-xs">{p.title}</h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {p.videoUrl && (
                                  <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded font-mono">
                                    VIDEO
                                  </span>
                                )}
                                {!p.isVisible && (
                                  <span className="text-[9px] bg-stone-200 text-stone-700 px-1 py-0.5 rounded">
                                    Hidden
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-stone-600">
                          {p.sku || '—'}
                        </td>
                        <td className="p-3 text-stone-600">
                          {p.category}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {(p.collectionNames || []).slice(0, 2).map((cName, idx) => (
                              <span key={idx} className="text-[9px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded">
                                {cName}
                              </span>
                            ))}
                            {(p.collectionNames || []).length > 2 && (
                              <span className="text-[9px] text-stone-400">
                                +{(p.collectionNames || []).length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-mono font-medium text-stone-900">
                          {formatPrice(p.price, 'PKR')}
                          {p.compareAtPrice && p.compareAtPrice > p.price && (
                            <span className="line-through text-[10px] text-stone-400 block">
                              {formatPrice(p.compareAtPrice, 'PKR')}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {inlineStockEdit?.id === p.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={inlineStockEdit.stock}
                                onChange={(e) => setInlineStockEdit({ id: p.id, stock: Number(e.target.value) })}
                                className="w-14 p-1 text-xs border border-stone-300 rounded"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveInlineStock(p.id)}
                                className="p-1 bg-emerald-700 text-white rounded hover:bg-emerald-800"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setInlineStockEdit({ id: p.id, stock: p.stock || 0 })}
                              className={`text-xs px-2 py-0.5 rounded border hover:border-stone-400 cursor-pointer ${
                                isLowStock ? 'bg-rose-50 border-rose-200 text-rose-800 font-bold' : 'bg-stone-50 border-stone-200 text-stone-800'
                              }`}
                              title="Click to edit stock inline"
                            >
                              {p.stock} units
                            </button>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            p.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            p.status === 'Draft' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-stone-100 text-stone-600'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle visibility */}
                            <button
                              type="button"
                              onClick={() => handleToggleVisibility(p)}
                              className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded"
                              title={p.isVisible ? 'Hide from storefront' : 'Show on storefront'}
                            >
                              {p.isVisible ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-stone-400" />}
                            </button>

                            {/* View on store */}
                            {onNavigateToStoreProduct && (
                              <button
                                type="button"
                                onClick={() => onNavigateToStoreProduct(p.slug)}
                                className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded"
                                title="View on storefront"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            )}

                            {/* Duplicate */}
                            <button
                              type="button"
                              onClick={() => handleDuplicate(p.id)}
                              className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded"
                              title="Duplicate product"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => {
                                onSelectProductToEdit(p);
                                onNavigateSub('add');
                              }}
                              className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded"
                              title="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id, p.title)}
                              className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-stone-100 rounded"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (Touch-friendly for phone screens) */}
            <div className="md:hidden divide-y divide-stone-200">
              {filteredProducts.map((p) => {
                const isLowStock = (p.stock || 0) <= 5;

                return (
                  <div key={p.id} className="p-4 space-y-3">
                    <div className="flex gap-3">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
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
                          <span className={isLowStock ? 'text-rose-700 font-bold' : 'text-stone-500'}>
                            Stock: {p.stock}
                          </span>
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
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ADD / EDIT PRODUCT VIEW (Tabbed CMS Experience)        */}
      {/* ======================================================== */}
      {subview === 'add' && (
        <form onSubmit={handleSaveProduct} className="space-y-6">
          {/* Sub-tabs for Form */}
          <div className="bg-white border border-stone-200 rounded-lg p-2 flex items-center gap-1 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setFormTab('basic')}
              className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                formTab === 'basic' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              1. Basic Info
            </button>
            <button
              type="button"
              onClick={() => setFormTab('media')}
              className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                formTab === 'media' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              2. Media & Runway Video
            </button>
            <button
              type="button"
              onClick={() => setFormTab('pricing')}
              className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                formTab === 'pricing' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              3. Pricing & Inventory
            </button>
            <button
              type="button"
              onClick={() => setFormTab('collections')}
              className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                formTab === 'collections' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              4. Storefront Collections & Category
            </button>
            <button
              type="button"
              onClick={() => setFormTab('fabric')}
              className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                formTab === 'fabric' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              5. Fabric & Measurements
            </button>
            <button
              type="button"
              onClick={() => setFormTab('status')}
              className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                formTab === 'status' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              6. Status & Visibility
            </button>
          </div>

          {/* Form Content Body */}
          <div className="bg-white border border-stone-200 rounded-lg p-5 sm:p-7 space-y-6">
            {/* 1. BASIC INFO */}
            {formTab === 'basic' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2">
                  General Product Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Meherbaan Raw Silk Anarkali"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-2.5 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      SKU (Stock Keeping Unit)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. GP-LUX-001"
                      value={formData.sku || ''}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full p-2.5 text-xs font-mono border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. meherbaan-raw-silk-anarkali"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full p-2.5 text-xs font-mono border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Full Product Description
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Enter detailed description, embroidery motifs, silhouette, and styling notes..."
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-2.5 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. MEDIA & RUNWAY VIDEO */}
            {formTab === 'media' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                    Product Images & Runway Video
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Upload high-resolution photography and portrait runway videos directly from your PC.
                  </p>
                </div>

                {/* PC Upload Button */}
                <div className="p-6 border-2 border-dashed border-stone-300 rounded-lg text-center space-y-3 bg-stone-50 hover:bg-stone-100/60 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <ImageIcon className="w-8 h-8 mx-auto text-stone-400" />
                  <div>
                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium uppercase tracking-wider rounded inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage ? 'Uploading Photos...' : 'Upload Photos from PC'}</span>
                    </button>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Select one or multiple photos (JPG, PNG, WEBP). First photo is storefront primary thumbnail.
                    </p>
                  </div>
                </div>

                {/* Images Preview Grid */}
                {formData.images && formData.images.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase text-stone-700 mb-2">
                      Uploaded Photos ({formData.images.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {formData.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative group border border-stone-200 rounded overflow-hidden bg-stone-100">
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-36 object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-stone-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                              Primary
                            </span>
                          )}
                          <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(idx)}
                                className="p-1 bg-white text-stone-900 rounded text-[10px] font-medium"
                                title="Set as primary"
                              >
                                Set Main
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 bg-rose-600 text-white rounded"
                              title="Remove image"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Upload / URL Section */}
                <div className="pt-4 border-t border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-stone-700 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-indigo-700" />
                    <span>Runway Video Preview (Optional)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Upload Video from PC (.mp4, .webm)
                      </label>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={handleVideoFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={uploadingVideo}
                        onClick={() => videoInputRef.current?.click()}
                        className="w-full p-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-xs text-stone-800 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{uploadingVideo ? 'Uploading Runway Video...' : 'Choose Video File from PC'}</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Or Paste Video URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://.../video.mp4"
                        value={formData.videoUrl || ''}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        className="w-full p-2.5 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  {formData.videoUrl && (
                    <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded flex items-center justify-between text-xs text-indigo-950">
                      <span className="truncate max-w-sm font-mono text-[11px]">{formData.videoUrl}</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, videoUrl: '' })}
                        className="text-rose-700 hover:underline shrink-0"
                      >
                        Remove video
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. PRICING & INVENTORY */}
            {formTab === 'pricing' && (
              <div className="space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2">
                  Pricing & Stock Inventory
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Selling Price (PKR) *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 18500"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full p-2.5 text-xs font-mono font-bold border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Original / Compare Price (PKR)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 24000 (Shows strikethrough)"
                      value={formData.compareAtPrice || ''}
                      onChange={(e) => setFormData({ ...formData, compareAtPrice: Number(e.target.value) })}
                      className="w-full p-2.5 text-xs font-mono border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Total Available Stock
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      value={formData.stock || ''}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full p-2.5 text-xs font-mono border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded text-xs text-stone-600 space-y-2">
                  <h4 className="font-bold text-stone-800 uppercase tracking-wide text-[11px]">
                    Standard Pakistani Couture Sizing
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'Custom'].map((sz) => {
                      const hasSize = (formData.sizes || []).includes(sz as any);
                      return (
                        <label key={sz} className="inline-flex items-center gap-1.5 p-1.5 bg-white border border-stone-300 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hasSize}
                            onChange={(e) => {
                              const current = formData.sizes || [];
                              const updated = e.target.checked
                                ? [...current, sz as any]
                                : current.filter(s => s !== sz);
                              setFormData({ ...formData, sizes: updated });
                            }}
                          />
                          <span className="font-mono text-xs">{sz}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 4. STOREFRONT COLLECTIONS & CATEGORY */}
            {formTab === 'collections' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                    Storefront Collections & Category Allocation
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Select which of the 6 signature storefront collections this product should appear under.
                  </p>
                </div>

                {/* Primary Category Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Primary Category *
                  </label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => {
                      const catName = e.target.value;
                      const catObj = categories.find(c => c.name === catName);
                      setFormData({
                        ...formData,
                        category: catName,
                        categoryId: catObj?.id,
                        categorySlug: catObj?.slug
                      });
                    }}
                    className="w-full p-2.5 text-xs border border-stone-300 rounded bg-white focus:outline-none focus:border-stone-900"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* 6 Storefront Collections Multi-select Checkboxes */}
                <div className="space-y-3 pt-3 border-t border-stone-200">
                  <label className="block text-xs font-bold text-stone-800">
                    Storefront Collections (Multi-Select)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {STOREFRONT_COLLECTIONS.map(col => {
                      const colTargetName = col.name.toUpperCase();
                      const isChecked = !!(
                        formData.collectionNames?.some(n => n.toUpperCase() === colTargetName) ||
                        formData.tags?.includes(col.slug) ||
                        formData.collection === colTargetName ||
                        formData.collectionSlug === col.slug
                      );

                      return (
                        <label
                          key={col.slug}
                          className={`p-3 border rounded flex items-center gap-3 cursor-pointer transition-colors ${
                            isChecked ? 'bg-amber-50/70 border-amber-400 font-medium' : 'bg-white border-stone-300 hover:border-stone-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              let names = Array.isArray(formData.collectionNames) ? [...formData.collectionNames] : [];
                              let tags = Array.isArray(formData.tags) ? [...formData.tags] : [];

                              if (checked) {
                                if (!names.includes(col.name)) names.push(col.name);
                                if (!tags.includes(col.slug)) tags.push(col.slug);
                              } else {
                                names = names.filter(n => n.toUpperCase() !== colTargetName);
                                tags = tags.filter(t => t !== col.slug);
                              }

                              setFormData({
                                ...formData,
                                collectionNames: names,
                                tags
                              });
                            }}
                            className="accent-stone-900"
                          />
                          <span className="text-xs text-stone-900">{col.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Special Tags */}
                <div className="space-y-2 pt-3 border-t border-stone-200">
                  <label className="block text-xs font-bold text-stone-800">
                    Promotional Badges
                  </label>
                  <div className="flex gap-4 text-xs">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.collectionNames?.includes('NEW ARRIVALS')}
                        onChange={(e) => {
                          let names = formData.collectionNames || [];
                          if (e.target.checked) {
                            if (!names.includes('NEW ARRIVALS')) names = [...names, 'NEW ARRIVALS'];
                          } else {
                            names = names.filter(n => n !== 'NEW ARRIVALS');
                          }
                          setFormData({ ...formData, collectionNames: names });
                        }}
                      />
                      <span>Mark as "New Arrival"</span>
                    </label>

                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.collectionNames?.includes('TRENDING')}
                        onChange={(e) => {
                          let names = formData.collectionNames || [];
                          if (e.target.checked) {
                            if (!names.includes('TRENDING')) names = [...names, 'TRENDING'];
                          } else {
                            names = names.filter(n => n !== 'TRENDING');
                          }
                          setFormData({ ...formData, collectionNames: names });
                        }}
                      />
                      <span>Mark as "Trending"</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 5. FABRIC & MEASUREMENTS */}
            {formTab === 'fabric' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2">
                  Fabric, Silhouette & Specifications
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Fabric Composition
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Pure Raw Silk 80g with Zari thread work"
                      value={formData.fabricDetails || ''}
                      onChange={(e) => setFormData({ ...formData, fabricDetails: e.target.value })}
                      className="w-full p-2.5 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Piece Count
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3-Piece (Shirt, Trouser & Organza Dupatta)"
                      value={formData.pieceCount || ''}
                      onChange={(e) => setFormData({ ...formData, pieceCount: e.target.value })}
                      className="w-full p-2.5 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. STATUS & VISIBILITY */}
            {formTab === 'status' && (
              <div className="space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2">
                  Publishing & Visibility
                </h3>

                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Publishing Status
                    </label>
                    <select
                      value={formData.status || 'Active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full p-2.5 text-xs border border-stone-300 rounded bg-white focus:outline-none focus:border-stone-900"
                    >
                      <option value="Active">Active (Available for purchase)</option>
                      <option value="Draft">Draft (Hidden work in progress)</option>
                      <option value="Archived">Archived (Discontinued)</option>
                    </select>
                  </div>

                  <div className="p-3.5 bg-stone-50 border border-stone-200 rounded flex items-center justify-between">
                    <div>
                      <strong className="block text-xs text-stone-900 font-bold">Storefront Visibility</strong>
                      <span className="text-[11px] text-stone-500">Enable to display on public catalog and search</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isVisible ?? true}
                        onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Action Bar (Mobile & Desktop UX) */}
          <div className="sticky bottom-4 bg-white/95 backdrop-blur-md border border-stone-300 rounded-lg p-3 sm:p-4 shadow-xl flex items-center justify-between z-20">
            <button
              type="button"
              onClick={() => {
                onSelectProductToEdit(null);
                onNavigateSub('all');
              }}
              className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>{editingProduct ? 'Save Changes' : 'Publish Product'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* 3. INVENTORY & STOCK QUICK EDITOR                        */}
      {/* ======================================================== */}
      {subview === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white p-4 border border-stone-200 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Inventory & Low Stock Control
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Update stock units on the fly without entering full product edit mode.
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
                  <th className="p-3">Stock Units</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map(p => {
                  const isLow = (p.stock || 0) <= 5;

                  return (
                    <tr key={p.id} className="hover:bg-stone-50">
                      <td className="p-3 font-medium text-stone-900 max-w-xs truncate">
                        {p.title}
                      </td>
                      <td className="p-3 font-mono text-stone-500">
                        {p.sku || '—'}
                      </td>
                      <td className="p-3 font-mono">
                        {formatPrice(p.price, 'PKR')}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue={p.stock}
                            onBlur={(e) => {
                              const newStock = Number(e.target.value);
                              if (newStock !== p.stock) {
                                StorageService.saveProduct({ ...p, stock: newStock });
                                onNotify(`Updated stock for "${p.title}" to ${newStock}.`);
                              }
                            }}
                            className="w-20 p-1 border border-stone-300 rounded text-xs font-mono"
                          />
                          {isLow && (
                            <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                              LOW
                            </span>
                          )}
                        </div>
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
    </div>
  );
};
