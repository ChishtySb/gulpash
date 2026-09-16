import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Sparkles, Upload, Image as ImageIcon, Video, AlertCircle, AlertTriangle,
  CheckCircle2, Check, X, ArrowLeft, ArrowRight, RefreshCw, Trash2,
  ExternalLink, Eye, EyeOff, Plus, Layers, Play
} from 'lucide-react';
import { Product, Category, ProductVariantDetailed } from '../../../types';
import { StorageService } from '../../../lib/storage';
import { formatPrice } from '../../../lib/currency';

export const STOREFRONT_COLLECTIONS = [
  { slug: 'new-arrivals', name: 'NEW ARRIVALS' },
  { slug: 'best-selling', name: 'TRENDING' },
  { slug: 'winter-collection', name: 'WINTER COLLECTION' },
  { slug: 'co-ords', name: 'CO-ORDS' },
  { slug: 'short-length-article', name: 'SHORT LENGTH' },
  { slug: 'all', name: 'ALL ENSEMBLES' }
];

const STANDARD_FABRICS = [
  'Pure Raw Silk 80g',
  'Pure Organza',
  'Luxury Chiffon',
  'Lawn',
  'Velvet',
  'Jacquard',
  'Net & Tulle',
  'Cotton',
  'Linen',
  'Khaddar',
  'Cambric',
  'Other / Custom'
];

const PIECE_COUNTS = [
  '1-Piece (Shirt only)',
  '2-Piece (Shirt + Trouser)',
  '2-Piece (Shirt + Dupatta)',
  '3-Piece (Shirt, Trouser & Dupatta)'
];

const CARE_OPTIONS = [
  'Dry Clean Only',
  'Gentle Hand Wash in Cold Water',
  'Machine Wash Cold'
];

const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'Custom'];

interface ProductEditFormProps {
  initialProduct: Product | null;
  categories: Category[];
  onSave: (product: Product, isDraft: boolean) => void;
  onCancel: () => void;
  onPreviewStorefront?: (slug: string) => void;
  onNotify: (msg: string) => void;
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({
  initialProduct,
  categories,
  onSave,
  onCancel,
  onPreviewStorefront,
  onNotify
}) => {
  const [formTab, setFormTab] = useState<'basic' | 'media' | 'pricing' | 'collections' | 'fabric' | 'status'>('basic');
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // File input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const [replaceTargetIndex, setReplaceTargetIndex] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Custom size input
  const [customSizeInput, setCustomSizeInput] = useState('');

  // Initial Form Data setup
  const [formData, setFormData] = useState<Partial<Product>>(() => {
    if (initialProduct) {
      return {
        ...initialProduct,
        inventoryMode: initialProduct.inventoryMode || (initialProduct.stock > 0 ? 'quantity' : 'availability'),
        lowStockThreshold: initialProduct.lowStockThreshold || 3,
        sizeGuideMode: initialProduct.sizeGuideMode || 'standard',
        details: initialProduct.details || {
          shirt: '',
          dupatta: '',
          trouser: '',
          work: '',
          careInstructions: 'Dry Clean Only'
        },
        customMeasurements: initialProduct.customMeasurements || {}
      };
    }

    const defaultCategory = categories?.[0]?.name || 'Luxury Pret';
    const defaultCatObj = categories?.[0];

    return {
      id: `gp-${Date.now()}`,
      title: '',
      slug: '',
      sku: '',
      price: 0,
      compareAtPrice: undefined,
      costPrice: undefined,
      description: '',
      images: [],
      videoUrl: '',
      videoPoster: '',
      stock: 15,
      inventoryMode: 'quantity',
      lowStockThreshold: 3,
      status: 'Active',
      isVisible: true,
      category: defaultCategory,
      categoryId: defaultCatObj?.id || 'cat-1',
      categorySlug: defaultCatObj?.slug || 'luxury-pret',
      collectionNames: ['NEW ARRIVALS'],
      tags: ['new-arrivals'],
      fabric: 'Pure Organza & Raw Silk 80g',
      fabricDetails: 'Pure Organza & Raw Silk 80g',
      pieceCount: '3-Piece (Shirt, Trouser & Dupatta)',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      details: {
        shirt: '',
        dupatta: '',
        trouser: '',
        work: '',
        careInstructions: 'Dry Clean Only'
      },
      sizeGuideMode: 'standard',
      customMeasurements: {}
    };
  });

  // Keep track of variants per size
  const [variantsState, setVariantsState] = useState<ProductVariantDetailed[]>(() => {
    if (initialProduct?.variants && initialProduct.variants.length > 0) {
      return initialProduct.variants;
    }

    const baseSku = initialProduct?.sku || `GP-${Date.now().toString().slice(-4)}`;
    const basePrice = initialProduct?.price || 0;
    const baseCompare = initialProduct?.compareAtPrice || null;
    const activeSizes = initialProduct?.sizes && initialProduct.sizes.length > 0
      ? initialProduct.sizes
      : ['XS', 'S', 'M', 'L', 'XL'];

    return activeSizes.map((sz, idx) => ({
      id: `var-${Date.now()}-${idx}`,
      title: `${initialProduct?.title || 'Product'} - ${sz}`,
      size: String(sz) as any,
      sku: `${baseSku}-${sz}`,
      price: basePrice,
      compareAtPrice: baseCompare,
      stock: 3,
      available: true
    }));
  });

  // Calculate discount percentage
  const discountPercent = useMemo(() => {
    if (formData.compareAtPrice && formData.compareAtPrice > (formData.price || 0)) {
      return Math.round(((formData.compareAtPrice - (formData.price || 0)) / formData.compareAtPrice) * 100);
    }
    return 0;
  }, [formData.price, formData.compareAtPrice]);

  // Sync total stock from variants when in Mode A (Quantity-managed)
  useEffect(() => {
    if (formData.inventoryMode === 'quantity') {
      const activeSizes = formData.sizes || [];
      const totalUnits = variantsState
        .filter(v => activeSizes.includes(v.size))
        .reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

      setFormData(prev => {
        if (prev.stock !== totalUnits) {
          return { ...prev, stock: totalUnits, isSoldOut: totalUnits <= 0 };
        }
        return prev;
      });
    } else {
      // In availability mode, check if at least one variant is available
      const activeSizes = formData.sizes || [];
      const hasAvailable = variantsState.some(v => activeSizes.includes(v.size) && v.available);
      setFormData(prev => ({
        ...prev,
        stock: hasAvailable ? 1 : 0,
        isSoldOut: !hasAvailable
      }));
    }
  }, [variantsState, formData.inventoryMode, formData.sizes]);

  // Auto-generate URL slug when title changes (if slug was empty or auto-generated)
  const handleTitleChange = (newTitle: string) => {
    setIsDirty(true);
    const autoSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setFormData(prev => {
      // If user hasn't explicitly customized slug, auto-update it
      const currentAutoSlug = (prev.title || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const shouldUpdateSlug = !prev.slug || prev.slug === currentAutoSlug;

      return {
        ...prev,
        title: newTitle,
        slug: shouldUpdateSlug ? autoSlug : prev.slug
      };
    });
  };

  // Generate SKU with one click
  const handleGenerateSku = () => {
    setIsDirty(true);
    const catCode = (formData.category || 'LUX').slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'GP');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generated = `GP-${catCode}-${randomSuffix}`;
    setFormData(prev => ({ ...prev, sku: generated }));

    // Also update variant SKUs
    setVariantsState(prev => prev.map(v => ({
      ...v,
      sku: `${generated}-${v.size}`
    })));

    onNotify(`Generated SKU: ${generated}`);
  };

  // Drag & drop photo upload handler
  const handleFilesDrop = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsDirty(true);
    try {
      setUploadingImage(true);
      const currentImages = Array.isArray(formData.images) ? [...formData.images] : [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const res = await StorageService.uploadMediaFile(file, 'product-image', [`Product: ${formData.title || 'New Item'}`]);
        if (res.url) {
          currentImages.push(res.url);
        }
      }
      setFormData(prev => ({ ...prev, images: currentImages }));
      onNotify(`Uploaded ${files.length} photo(s) successfully.`);
    } catch (err) {
      console.error('Upload drop error:', err);
      alert('Failed to upload dropped photos.');
    } finally {
      setUploadingImage(false);
    }
  };

  // File input change handler for photos
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await handleFilesDrop(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Video upload handler
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsDirty(true);
    try {
      setUploadingVideo(true);
      const res = await StorageService.uploadMediaFile(file, 'product-video', [`Video: ${formData.title || 'Product'}`]);
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

  // Poster image upload handler
  const handlePosterFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsDirty(true);
    try {
      setUploadingPoster(true);
      const res = await StorageService.uploadMediaFile(file, 'product-image', [`Video Poster: ${formData.title || 'Product'}`]);
      if (res.url) {
        setFormData(prev => ({ ...prev, videoPoster: res.url }));
        onNotify('Video poster thumbnail uploaded!');
      }
    } catch (err) {
      console.error('Poster upload error:', err);
      alert('Failed to upload video poster.');
    } finally {
      setUploadingPoster(false);
      if (posterInputRef.current) posterInputRef.current.value = '';
    }
  };

  // Image actions: Set primary, reorder, replace, remove
  const handleSetPrimaryImage = (index: number) => {
    if (!formData.images || index === 0) return;
    setIsDirty(true);
    const list = [...formData.images];
    const target = list.splice(index, 1)[0];
    list.unshift(target);
    setFormData(prev => ({ ...prev, images: list }));
    onNotify('Primary storefront thumbnail updated.');
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    if (!formData.images) return;
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= formData.images.length) return;
    setIsDirty(true);
    const list = [...formData.images];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setFormData(prev => ({ ...prev, images: list }));
  };

  const handleTriggerReplace = (index: number) => {
    setReplaceTargetIndex(index);
    if (replaceInputRef.current) {
      replaceInputRef.current.value = '';
      replaceInputRef.current.click();
    }
  };

  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || replaceTargetIndex === null || !formData.images) return;
    setIsDirty(true);
    try {
      setUploadingImage(true);
      const res = await StorageService.uploadMediaFile(files[0], 'product-image', [`Product: ${formData.title || 'Item'}`]);
      if (res.url) {
        const list = [...formData.images];
        list[replaceTargetIndex] = res.url;
        setFormData(prev => ({ ...prev, images: list }));
        onNotify(`Replaced image ${replaceTargetIndex + 1} successfully!`);
      }
    } catch (err) {
      console.error('Replace image error:', err);
      alert('Failed to replace image.');
    } finally {
      setUploadingImage(false);
      setReplaceTargetIndex(null);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    if (!formData.images) return;
    setIsDirty(true);
    const list = formData.images.filter((_, idx) => idx !== index);
    setFormData(prev => ({ ...prev, images: list }));
  };

  // Toggle size active state
  const handleToggleSize = (sizeName: string) => {
    setIsDirty(true);
    const currentSizes = formData.sizes || [];
    const isCurrentlyActive = currentSizes.includes(sizeName as any);

    let updatedSizes: string[];
    if (isCurrentlyActive) {
      updatedSizes = currentSizes.filter(s => s !== sizeName);
    } else {
      updatedSizes = [...currentSizes, sizeName];
      // Ensure variant exists
      if (!variantsState.some(v => v.size === sizeName)) {
        setVariantsState(prev => [
          ...prev,
          {
            id: `var-${Date.now()}-${sizeName}`,
            title: `${formData.title || 'Product'} - ${sizeName}`,
            size: sizeName as any,
            sku: `${formData.sku || 'GP'}-${sizeName}`,
            price: Number(formData.price) || 0,
            compareAtPrice: formData.compareAtPrice || null,
            stock: 3,
            available: true
          }
        ]);
      }
    }
    setFormData(prev => ({ ...prev, sizes: updatedSizes }));
  };

  // Add custom size
  const handleAddCustomSize = () => {
    const trimmed = customSizeInput.trim().toUpperCase();
    if (!trimmed) return;
    setIsDirty(true);
    const current = formData.sizes || [];
    if (!current.includes(trimmed as any)) {
      setFormData(prev => ({ ...prev, sizes: [...current, trimmed] }));
      setVariantsState(prev => [
        ...prev,
        {
          id: `var-${Date.now()}-${trimmed}`,
          title: `${formData.title || 'Product'} - ${trimmed}`,
          size: trimmed as any,
          sku: `${formData.sku || 'GP'}-${trimmed}`,
          price: Number(formData.price) || 0,
          compareAtPrice: formData.compareAtPrice || null,
          stock: 3,
          available: true
        }
      ]);
      onNotify(`Added size "${trimmed}".`);
    }
    setCustomSizeInput('');
  };

  // Variant update helper
  const handleUpdateVariant = (size: string, field: keyof ProductVariantDetailed, value: any) => {
    setIsDirty(true);
    setVariantsState(prev => prev.map(v => {
      if (v.size === size) {
        return { ...v, [field]: value };
      }
      return v;
    }));
  };

  // Publication validation checklist
  const validationChecks = useMemo(() => {
    const hasTitle = Boolean(formData.title?.trim());
    const hasSku = Boolean(formData.sku?.trim());
    const hasPrice = Boolean((Number(formData.price) || 0) > 0);
    const hasImage = Boolean(formData.images && formData.images.length > 0 && formData.images[0]);
    const hasCollection = Boolean(
      (formData.collectionNames && formData.collectionNames.length > 0) ||
      (formData.tags && formData.tags.length > 0)
    );
    const hasSizes = Boolean(formData.sizes && formData.sizes.length > 0);

    const allValid = hasTitle && hasSku && hasPrice && hasImage && hasCollection && hasSizes;

    return {
      hasTitle,
      hasSku,
      hasPrice,
      hasImage,
      hasCollection,
      hasSizes,
      allValid
    };
  }, [formData]);

  // Unified save logic
  const handleSaveProduct = (saveAsStatus: 'Draft' | 'Active') => {
    if (saveAsStatus === 'Active' && !validationChecks.allValid) {
      alert('Please complete all required fields before publishing to the live storefront.');
      setFormTab('status');
      return;
    }

    const generatedSlug = formData.slug?.trim() || 
      (formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `gp-${Date.now()}`);
    const generatedSku = formData.sku?.trim() || `GP-${Date.now().toString().slice(-5)}`;

    const isNewIn = formData.collectionNames?.some(n => n.toUpperCase() === 'NEW ARRIVALS') || formData.tags?.includes('new-arrivals');
    const isTrending = formData.collectionNames?.some(n => n.toUpperCase() === 'TRENDING' || n.toUpperCase() === 'BEST SELLING') || formData.tags?.includes('best-selling');

    const fullProduct: Product = {
      id: formData.id || `gp-${Date.now()}`,
      title: formData.title?.trim() || (saveAsStatus === 'Draft' ? 'Untitled Draft' : 'GulPash Couture Ensemble'),
      slug: generatedSlug,
      sku: generatedSku,
      price: Number(formData.price) || 0,
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
      costPrice: formData.costPrice ? Number(formData.costPrice) : undefined,
      description: formData.description || '',
      images: formData.images && formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'],
      videoUrl: formData.videoUrl || undefined,
      videoPoster: formData.videoPoster || undefined,
      stock: Number(formData.stock) || 0,
      inventoryMode: formData.inventoryMode || 'quantity',
      lowStockThreshold: Number(formData.lowStockThreshold) || 3,
      status: saveAsStatus,
      isVisible: saveAsStatus === 'Active' ? (formData.isVisible ?? true) : false,
      category: formData.category || 'Luxury Pret',
      categoryId: formData.categoryId || 'cat-1',
      categorySlug: formData.categorySlug || 'luxury-pret',
      collectionNames: formData.collectionNames && formData.collectionNames.length > 0 ? formData.collectionNames : ['NEW ARRIVALS'],
      tags: formData.tags || ['new-arrivals'],
      fabric: formData.fabric || formData.fabricDetails || 'Luxury Chiffon / Lawn',
      fabricDetails: formData.fabricDetails,
      pieceCount: formData.pieceCount,
      rating: formData.rating ?? 5.0,
      reviewCount: formData.reviewCount ?? 12,
      sizes: formData.sizes && formData.sizes.length > 0 ? formData.sizes : ['XS', 'S', 'M', 'L', 'XL'],
      variants: variantsState,
      details: formData.details,
      sizeGuideMode: formData.sizeGuideMode || 'standard',
      customMeasurements: formData.customMeasurements || {},
      isNewArrival: isNewIn,
      isBestSeller: isTrending,
      isSoldOut: (Number(formData.stock) || 0) <= 0,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setIsDirty(false);
    onSave(fullProduct, saveAsStatus === 'Draft');
  };

  // Navigation with Unsaved Changes Protection
  const handleAttemptNavigate = (action: () => void) => {
    if (isDirty) {
      setPendingAction(() => action);
      setShowUnsavedModal(true);
    } else {
      action();
    }
  };

  // Step advancement helper
  const stepsList: Array<'basic' | 'media' | 'pricing' | 'collections' | 'fabric' | 'status'> = [
    'basic', 'media', 'pricing', 'collections', 'fabric', 'status'
  ];

  const currentStepIdx = stepsList.indexOf(formTab);

  const handleNextStep = () => {
    if (currentStepIdx < stepsList.length - 1) {
      setFormTab(stepsList[currentStepIdx + 1]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs for Form with Progress Indications */}
      <div className="bg-white border border-stone-200 rounded-lg p-2 flex items-center gap-1 overflow-x-auto text-xs shadow-2xs">
        {stepsList.map((stepKey, idx) => {
          const stepNames = {
            basic: '1. Basic Info',
            media: '2. Media & Runway Video',
            pricing: '3. Pricing & Inventory',
            collections: '4. Collections & Category',
            fabric: '5. Fabric & Measurements',
            status: '6. Status & Visibility'
          };

          const isActive = formTab === stepKey;

          return (
            <button
              key={stepKey}
              type="button"
              onClick={() => setFormTab(stepKey)}
              className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isActive ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {stepNames[stepKey]}
            </button>
          );
        })}
      </div>

      {/* Form Content Body */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 sm:p-7 space-y-6 shadow-xs">
        {/* ======================================================== */}
        {/* STEP 1: BASIC INFO                                       */}
        {/* ======================================================== */}
        {formTab === 'basic' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                General Product Details
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Define the primary title, SKU, handle, and editorial description.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Meherbaan Raw Silk Anarkali"
                  value={formData.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full p-2.5 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-800">
                    SKU (Stock Keeping Unit) *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSku}
                    className="text-[11px] font-medium text-stone-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Generate SKU</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. GP-LUX-4019"
                  value={formData.sku || ''}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({ ...formData, sku: e.target.value.toUpperCase() });
                  }}
                  className="w-full p-2.5 text-xs font-mono border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Storefront URL Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. meherbaan-raw-silk-anarkali"
                  value={formData.slug || ''}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
                  }}
                  className="w-full p-2.5 text-xs font-mono border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                />
                <span className="text-[10px] text-stone-500 mt-1 block">
                  https://gulpash.online/product/{formData.slug || 'url-slug'}
                </span>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Full Editorial Description
                </label>
                <textarea
                  rows={5}
                  placeholder="Enter detailed description, embroidery motifs, silhouette, craft details, and styling notes..."
                  value={formData.description || ''}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({ ...formData, description: e.target.value });
                  }}
                  className="w-full p-2.5 text-xs border border-stone-300 rounded focus:outline-none focus:border-stone-900 leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: MEDIA & RUNWAY VIDEO                              */}
        {/* ======================================================== */}
        {formTab === 'media' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Product Images & Runway Video
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Upload authentic photography and portrait runway video clips directly from your computer.
              </p>
            </div>

            {/* Image Canvas Specifications Banner */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-md text-xs text-amber-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold uppercase tracking-wider text-[11px] text-amber-900">
                  Product Image Canvas Specifications
                </p>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  <span className="font-medium">Recommended Resolution:</span> 1200 × 1500 px &nbsp;|&nbsp; 
                  <span className="font-medium">Aspect Ratio:</span> 4:5 Portrait &nbsp;|&nbsp; 
                  <span className="font-medium">Format:</span> WebP / JPG. 
                  Non-destructive presentation preserves authentic tailoring without artificial stretching.
                </p>
              </div>
            </div>

            {/* Drag & Drop / Click Upload Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                handleFilesDrop(e.dataTransfer.files);
              }}
              className={`p-6 border-2 border-dashed rounded-lg text-center space-y-3 transition-colors ${
                isDraggingOver ? 'border-stone-900 bg-stone-100' : 'border-stone-300 bg-stone-50 hover:bg-stone-100/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageFileChange}
                className="hidden"
              />
              <input
                ref={replaceInputRef}
                type="file"
                accept="image/*"
                onChange={handleReplaceFileChange}
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
                  Drag & drop files or click to browse (JPG, PNG, WEBP). First image is the primary storefront thumbnail.
                </p>
              </div>
            </div>

            {/* Images Preview Grid with Reorder, Replace, Primary, Remove */}
            {formData.images && formData.images.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase text-stone-700">
                    Uploaded Gallery ({formData.images.length})
                  </h4>
                  <span className="text-[11px] text-stone-500">
                    Hover image to reorder, set primary, replace, or delete
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {formData.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative group border border-stone-200 rounded-sm overflow-hidden bg-stone-100 aspect-[3/4] flex flex-col justify-between shadow-2xs">
                      <img
                        src={imgUrl}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover object-top"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10 pointer-events-none">
                        {idx === 0 ? (
                          <span className="bg-stone-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-xs">
                            Primary
                          </span>
                        ) : (
                          <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-1 py-0.5 rounded">
                            #{idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Hover Action Overlay */}
                      <div className="absolute inset-0 bg-stone-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 z-20">
                        {/* Top row: Reorder arrows */}
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveImage(idx, 'left')}
                            className="p-1 bg-white/90 hover:bg-white text-stone-800 disabled:opacity-30 rounded text-xs cursor-pointer"
                            title="Move Left"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === (formData.images?.length || 0) - 1}
                            onClick={() => handleMoveImage(idx, 'right')}
                            className="p-1 bg-white/90 hover:bg-white text-stone-800 disabled:opacity-30 rounded text-xs cursor-pointer"
                            title="Move Right"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Middle: Set Primary & Replace */}
                        <div className="flex flex-col gap-1 items-center">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="w-full py-1 px-1.5 bg-white text-stone-900 rounded text-[10px] font-medium tracking-wide uppercase hover:bg-stone-100 cursor-pointer text-center"
                            >
                              Set Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleTriggerReplace(idx)}
                            className="w-full py-1 px-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded text-[10px] font-medium tracking-wide flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>Replace</span>
                          </button>
                        </div>

                        {/* Bottom: Remove */}
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 bg-rose-600 hover:bg-rose-700 text-white rounded cursor-pointer"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Upload Section */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase text-stone-700 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-indigo-700" />
                    <span>Runway Fashion Video (Portrait 9:16 or 4:5)</span>
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Upload MP4 / WebM video clip to enable the video badge and runway modal on the storefront.
                  </p>
                </div>
                {formData.videoUrl && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                    Active Video Attached
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Upload Video Button */}
                <div className="p-4 border border-stone-200 rounded-lg space-y-3 bg-stone-50">
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={uploadingVideo}
                      onClick={() => videoInputRef.current?.click()}
                      className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingVideo ? 'Uploading Video...' : formData.videoUrl ? 'Replace Video File' : 'Upload Video from PC'}</span>
                    </button>
                    {formData.videoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsDirty(true);
                          setFormData({ ...formData, videoUrl: '' });
                        }}
                        className="px-3 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-stone-500">
                    Direct PC upload ensures videos persist securely without external broken links.
                  </p>
                </div>

                {/* Video Preview */}
                {formData.videoUrl ? (
                  <div className="relative rounded-lg overflow-hidden border border-stone-300 bg-black aspect-[3/4] max-h-52 flex items-center justify-center">
                    <video
                      src={formData.videoUrl}
                      poster={formData.videoPoster}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="border border-dashed border-stone-300 rounded-lg p-4 flex flex-col items-center justify-center text-center text-stone-400 aspect-[3/4] max-h-52">
                    <Play className="w-8 h-8 opacity-40 mb-1" />
                    <span className="text-xs">No video assigned</span>
                  </div>
                )}
              </div>

              {/* Video Poster Thumbnail */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-md">
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Optional Video Cover Poster Image
                </label>
                <div className="flex items-center gap-3">
                  {formData.videoPoster ? (
                    <img
                      src={formData.videoPoster}
                      alt="Poster Preview"
                      className="w-12 h-16 object-cover rounded border border-stone-300 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-stone-200 border border-dashed border-stone-300 rounded flex items-center justify-center text-[9px] text-stone-500 text-center p-1">
                      No Poster
                    </div>
                  )}

                  <div className="space-y-1">
                    <input
                      ref={posterInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePosterFileChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={uploadingPoster}
                        onClick={() => posterInputRef.current?.click()}
                        className="px-3 py-1.5 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 disabled:opacity-50"
                      >
                        {uploadingPoster ? 'Uploading...' : formData.videoPoster ? 'Replace Poster' : 'Upload Poster from PC'}
                      </button>
                      {formData.videoPoster && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsDirty(true);
                            setFormData({ ...formData, videoPoster: '' });
                          }}
                          className="px-2.5 py-1.5 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded text-xs"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: PRICING & INVENTORY                              */}
        {/* ======================================================== */}
        {formTab === 'pricing' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Pricing & Variant Inventory
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Set selling price, compare-at discount price, and manage stock via real unit counts or availability mode.
              </p>
            </div>

            {/* Pricing Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Selling Price (PKR) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 18500"
                  value={formData.price || ''}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({ ...formData, price: Number(e.target.value) });
                  }}
                  className="w-full p-2.5 text-xs font-mono font-bold border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-800">
                    Compare-At Price (PKR)
                  </label>
                  {discountPercent > 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  placeholder="e.g. 24000 (Strikethrough)"
                  value={formData.compareAtPrice || ''}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({ ...formData, compareAtPrice: e.target.value ? Number(e.target.value) : undefined });
                  }}
                  className="w-full p-2.5 text-xs font-mono border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Internal Cost Price (PKR)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 9500 (Internal only)"
                  value={formData.costPrice || ''}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({ ...formData, costPrice: e.target.value ? Number(e.target.value) : undefined });
                  }}
                  className="w-full p-2.5 text-xs font-mono border border-stone-300 rounded focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            {/* Inventory Mode Switcher */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Inventory Tracking Mode
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Select how inventory is tracked for this couture piece.
                  </p>
                </div>

                <div className="inline-flex rounded-md p-0.5 bg-stone-200 border border-stone-300 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDirty(true);
                      setFormData(prev => ({ ...prev, inventoryMode: 'quantity' }));
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                      formData.inventoryMode === 'quantity'
                        ? 'bg-white text-stone-900 shadow-xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Mode A: Exact Units
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDirty(true);
                      setFormData(prev => ({ ...prev, inventoryMode: 'availability' }));
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                      formData.inventoryMode === 'availability'
                        ? 'bg-white text-stone-900 shadow-xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Mode B: Availability Only
                  </button>
                </div>
              </div>

              {formData.inventoryMode === 'quantity' ? (
                <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-stone-500 block text-[11px]">Total Active Stock Units:</span>
                      <strong className="text-sm font-mono text-stone-900 font-bold">
                        {formData.stock ?? 0} units
                      </strong>
                    </div>
                    <span className="text-[10px] text-stone-400">
                      (Auto-calculated sum of all active size variants)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-medium text-stone-700">Low Stock Alert Threshold:</label>
                    <input
                      type="number"
                      value={formData.lowStockThreshold || 3}
                      onChange={(e) => {
                        setIsDirty(true);
                        setFormData({ ...formData, lowStockThreshold: Number(e.target.value) || 3 });
                      }}
                      className="w-16 p-1 text-xs font-mono border border-stone-300 rounded bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-stone-200 text-xs text-stone-600">
                  <span className="font-semibold text-stone-900">Availability-Only Mode:</span> No fake unit numbers are shown. Items and sizes are marked as either <strong className="text-emerald-700 font-bold">Available</strong> or <strong className="text-rose-700 font-bold">Sold Out</strong>.
                </div>
              )}
            </div>

            {/* Size & Variant Breakdown */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="block text-xs font-bold text-stone-800">
                  Offered Sizes & Variant Table
                </label>
                
                {/* Custom size adder */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add custom size (e.g. XXL)"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    className="p-1 px-2 text-xs border border-stone-300 rounded font-mono"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSize();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="p-1 px-2 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 cursor-pointer"
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              {/* Size Checkboxes */}
              <div className="flex flex-wrap gap-2">
                {STANDARD_SIZES.concat((formData.sizes || []).filter(s => !STANDARD_SIZES.includes(s as any))).map((sz) => {
                  const isActive = (formData.sizes || []).includes(sz as any);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleToggleSize(sz)}
                      className={`px-3 py-1.5 rounded border text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-stone-900 text-white border-stone-900 font-bold'
                          : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
                      }`}
                    >
                      <span>{sz}</span>
                      {isActive && <Check className="w-3 h-3 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Variant Table */}
              <div className="border border-stone-200 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase font-bold text-stone-500">
                    <tr>
                      <th className="p-2.5">Size</th>
                      <th className="p-2.5">Variant SKU</th>
                      <th className="p-2.5">Selling Price (PKR)</th>
                      <th className="p-2.5">
                        {formData.inventoryMode === 'quantity' ? 'Stock Units' : 'Store Availability'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {(formData.sizes || []).map((sz) => {
                      const variant = variantsState.find(v => v.size === sz) || {
                        id: `v-${sz}`,
                        size: sz as any,
                        sku: `${formData.sku || 'GP'}-${sz}`,
                        price: formData.price || 0,
                        stock: 3,
                        available: true
                      };

                      return (
                        <tr key={sz} className="hover:bg-stone-50/70">
                          <td className="p-2.5 font-bold font-mono text-stone-900">
                            {sz}
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={variant.sku || `${formData.sku || 'GP'}-${sz}`}
                              onChange={(e) => handleUpdateVariant(sz, 'sku', e.target.value)}
                              className="w-32 p-1 font-mono text-xs border border-stone-200 rounded focus:border-stone-900"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="number"
                              value={variant.price ?? formData.price ?? 0}
                              onChange={(e) => handleUpdateVariant(sz, 'price', Number(e.target.value))}
                              className="w-24 p-1 font-mono text-xs border border-stone-200 rounded focus:border-stone-900"
                            />
                          </td>
                          <td className="p-2.5">
                            {formData.inventoryMode === 'quantity' ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min={0}
                                  value={variant.stock ?? 0}
                                  onChange={(e) => handleUpdateVariant(sz, 'stock', Math.max(0, Number(e.target.value)))}
                                  className="w-20 p-1 font-mono text-xs border border-stone-200 rounded focus:border-stone-900 font-bold"
                                />
                                {(variant.stock ?? 0) === 0 && (
                                  <span className="text-[10px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                                    OUT
                                  </span>
                                )}
                              </div>
                            ) : (
                              <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={variant.available ?? true}
                                  onChange={(e) => handleUpdateVariant(sz, 'available', e.target.checked)}
                                  className="accent-stone-900"
                                />
                                <span className={`text-[11px] font-medium ${
                                  variant.available ? 'text-emerald-700' : 'text-rose-600 font-bold'
                                }`}>
                                  {variant.available ? 'Available' : 'Sold Out'}
                                </span>
                              </label>
                            )}
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

        {/* ======================================================== */}
        {/* STEP 4: STOREFRONT COLLECTIONS & CATEGORY                */}
        {/* ======================================================== */}
        {formTab === 'collections' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Storefront Collections & Category Allocation
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Assign this product to one or more of GulPash's signature storefront collections.
              </p>
            </div>

            {/* Primary Category Select */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Primary Category *
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => {
                  setIsDirty(true);
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

            {/* Single Source of Truth Collection Checkboxes */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-800">
                  Storefront Collections (Single Source of Truth) *
                </label>
                <span className="text-[11px] text-stone-500">
                  Controls badges and filter tabs simultaneously
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {STOREFRONT_COLLECTIONS.filter(c => c.slug !== 'all').map(col => {
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
                      className={`p-3.5 border rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                        isChecked ? 'bg-amber-50/80 border-amber-400 font-semibold' : 'bg-white border-stone-300 hover:border-stone-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          setIsDirty(true);
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
                        className="accent-stone-900 w-4 h-4"
                      />
                      <div className="text-xs text-stone-900">
                        <span>{col.name}</span>
                        {col.slug === 'new-arrivals' && (
                          <span className="block text-[10px] text-stone-500 font-normal">
                            Auto-enables "NEW IN" badge on product cards
                          </span>
                        )}
                        {col.slug === 'best-selling' && (
                          <span className="block text-[10px] text-stone-500 font-normal">
                            Auto-enables "TRENDING" badge on product cards
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Informative Note */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded text-[11px] text-stone-600">
                <span className="font-semibold text-stone-800">Automatic Catalog Inclusion:</span> All active published products automatically appear in the <strong className="text-stone-900">ALL ENSEMBLES</strong> master collection without requiring manual selection.
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 5: FABRIC, MEASUREMENTS & SPECIFICATIONS            */}
        {/* ======================================================== */}
        {formTab === 'fabric' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Fabric, Silhouette & Specifications
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Pakistani couture tailoring details, embroidery compositions, and custom size charts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Fabric Type
                </label>
                <select
                  value={formData.fabric || STANDARD_FABRICS[0]}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({ ...formData, fabric: e.target.value });
                  }}
                  className="w-full p-2.5 text-xs border border-stone-300 rounded bg-white focus:outline-none focus:border-stone-900"
                >
                  {STANDARD_FABRICS.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Piece Count
                </label>
                <select
                  value={formData.pieceCount || PIECE_COUNTS[3]}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({ ...formData, pieceCount: e.target.value });
                  }}
                  className="w-full p-2.5 text-xs border border-stone-300 rounded bg-white focus:outline-none focus:border-stone-900"
                >
                  {PIECE_COUNTS.map(pc => (
                    <option key={pc} value={pc}>{pc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Care Instructions
                </label>
                <select
                  value={formData.details?.careInstructions || CARE_OPTIONS[0]}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({
                      ...formData,
                      details: { ...(formData.details || {}), careInstructions: e.target.value }
                    });
                  }}
                  className="w-full p-2.5 text-xs border border-stone-300 rounded bg-white focus:outline-none focus:border-stone-900"
                >
                  {CARE_OPTIONS.map(co => (
                    <option key={co} value={co}>{co}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Detailed Component Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Shirt Details (Length, Neckline, Sleeves)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Calf length kalidar kurta, organza embellished boat neckline with hand-worked sleeves"
                  value={formData.details?.shirt || ''}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({
                      ...formData,
                      details: { ...(formData.details || {}), shirt: e.target.value }
                    });
                  }}
                  className="w-full p-2 text-xs border border-stone-300 rounded focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Trouser / Lower Details (Fabric, Silhouette)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Straight raw silk trousers with pintucks and lace insert at hem"
                  value={formData.details?.trouser || ''}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({
                      ...formData,
                      details: { ...(formData.details || {}), trouser: e.target.value }
                    });
                  }}
                  className="w-full p-2 text-xs border border-stone-300 rounded focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Dupatta Details (Fabric, Finish)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Pure organza dupatta with four-sided zari borders and hand-tied tassels"
                  value={formData.details?.dupatta || ''}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({
                      ...formData,
                      details: { ...(formData.details || {}), dupatta: e.target.value }
                    });
                  }}
                  className="w-full p-2 text-xs border border-stone-300 rounded focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Work / Embroidery Details
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Hand-worked zardozi, kora dabka, sequins, and resham thread embroidery"
                  value={formData.details?.work || ''}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({
                      ...formData,
                      details: { ...(formData.details || {}), work: e.target.value }
                    });
                  }}
                  className="w-full p-2 text-xs border border-stone-300 rounded focus:border-stone-900"
                />
              </div>
            </div>

            {/* Size Guide / Measurements Selection */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Product Size Guide & Measurements
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Choose standard studio size chart or specify exact garment measurements.
                  </p>
                </div>

                <div className="inline-flex rounded-md p-0.5 bg-stone-200 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDirty(true);
                      setFormData(prev => ({ ...prev, sizeGuideMode: 'standard' }));
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer ${
                      formData.sizeGuideMode !== 'custom'
                        ? 'bg-white text-stone-900 shadow-xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Standard Studio Guide
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDirty(true);
                      setFormData(prev => ({ ...prev, sizeGuideMode: 'custom' }));
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer ${
                      formData.sizeGuideMode === 'custom'
                        ? 'bg-white text-stone-900 shadow-xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Custom Measurements
                  </button>
                </div>
              </div>

              {formData.sizeGuideMode === 'custom' && (
                <div className="border border-stone-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase font-bold text-stone-500">
                      <tr>
                        <th className="p-2.5">Size</th>
                        <th className="p-2.5">Chest (in)</th>
                        <th className="p-2.5">Waist (in)</th>
                        <th className="p-2.5">Hip (in)</th>
                        <th className="p-2.5">Shirt Length (in)</th>
                        <th className="p-2.5">Trouser Length (in)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {(formData.sizes || []).map((sz) => {
                        const measurements = formData.customMeasurements?.[sz] || {};
                        return (
                          <tr key={sz}>
                            <td className="p-2.5 font-bold font-mono text-stone-900">{sz}</td>
                            <td className="p-2.5">
                              <input
                                type="text"
                                placeholder='e.g. 36"'
                                value={measurements.chest || ''}
                                onChange={(e) => {
                                  setIsDirty(true);
                                  setFormData({
                                    ...formData,
                                    customMeasurements: {
                                      ...(formData.customMeasurements || {}),
                                      [sz]: { ...measurements, chest: e.target.value }
                                    }
                                  });
                                }}
                                className="w-20 p-1 border border-stone-200 rounded text-xs"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="text"
                                placeholder='e.g. 30"'
                                value={measurements.waist || ''}
                                onChange={(e) => {
                                  setIsDirty(true);
                                  setFormData({
                                    ...formData,
                                    customMeasurements: {
                                      ...(formData.customMeasurements || {}),
                                      [sz]: { ...measurements, waist: e.target.value }
                                    }
                                  });
                                }}
                                className="w-20 p-1 border border-stone-200 rounded text-xs"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="text"
                                placeholder='e.g. 39"'
                                value={measurements.hip || ''}
                                onChange={(e) => {
                                  setIsDirty(true);
                                  setFormData({
                                    ...formData,
                                    customMeasurements: {
                                      ...(formData.customMeasurements || {}),
                                      [sz]: { ...measurements, hip: e.target.value }
                                    }
                                  });
                                }}
                                className="w-20 p-1 border border-stone-200 rounded text-xs"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="text"
                                placeholder='e.g. 46"'
                                value={measurements.length || ''}
                                onChange={(e) => {
                                  setIsDirty(true);
                                  setFormData({
                                    ...formData,
                                    customMeasurements: {
                                      ...(formData.customMeasurements || {}),
                                      [sz]: { ...measurements, length: e.target.value }
                                    }
                                  });
                                }}
                                className="w-20 p-1 border border-stone-200 rounded text-xs"
                              />
                            </td>
                            <td className="p-2.5">
                              <input
                                type="text"
                                placeholder='e.g. 38"'
                                value={measurements.trouserLength || ''}
                                onChange={(e) => {
                                  setIsDirty(true);
                                  setFormData({
                                    ...formData,
                                    customMeasurements: {
                                      ...(formData.customMeasurements || {}),
                                      [sz]: { ...measurements, trouserLength: e.target.value }
                                    }
                                  });
                                }}
                                className="w-20 p-1 border border-stone-200 rounded text-xs"
                              />
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
        )}

        {/* ======================================================== */}
        {/* STEP 6: STATUS, VISIBILITY & PUBLICATION CHECKLIST       */}
        {/* ======================================================== */}
        {formTab === 'status' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Publishing Status & Pre-Flight Validation
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Verify that all mandatory parameters meet publication standards before releasing to customers.
              </p>
            </div>

            {/* Publishing & Visibility Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Product State
                </label>
                <select
                  value={formData.status || 'Active'}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData({ ...formData, status: e.target.value as any });
                  }}
                  className="w-full p-2.5 text-xs border border-stone-300 rounded bg-white focus:outline-none focus:border-stone-900"
                >
                  <option value="Active">Active (Live on Public Storefront)</option>
                  <option value="Draft">Draft (Internal Only - Not Visible to Customers)</option>
                  <option value="Archived">Archived (Discontinued)</option>
                </select>
              </div>

              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between">
                <div>
                  <strong className="block text-xs text-stone-900 font-bold">Storefront Search & Catalog Visibility</strong>
                  <span className="text-[11px] text-stone-500">Allows product to be indexed and searched</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVisible ?? true}
                    onChange={(e) => {
                      setIsDirty(true);
                      setFormData({ ...formData, isVisible: e.target.checked });
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
                </label>
              </div>
            </div>

            {/* Pre-Flight Publication Checklist */}
            <div className="p-4 border border-stone-200 rounded-lg space-y-3 bg-stone-50/70">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Publication Validation Checklist</span>
                </h4>
                {validationChecks.allValid ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ready for Storefront Publication</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Incomplete Fields Require Attention</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* 1. Title */}
                <div className="p-2.5 bg-white border border-stone-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {validationChecks.hasTitle ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span className={validationChecks.hasTitle ? 'text-stone-800' : 'text-amber-900 font-medium'}>
                      Product Title Provided
                    </span>
                  </div>
                  {!validationChecks.hasTitle && (
                    <button
                      type="button"
                      onClick={() => setFormTab('basic')}
                      className="text-[10px] text-stone-900 font-semibold underline cursor-pointer"
                    >
                      Fix in Step 1
                    </button>
                  )}
                </div>

                {/* 2. SKU */}
                <div className="p-2.5 bg-white border border-stone-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {validationChecks.hasSku ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span className={validationChecks.hasSku ? 'text-stone-800' : 'text-amber-900 font-medium'}>
                      SKU Defined ({formData.sku || 'None'})
                    </span>
                  </div>
                  {!validationChecks.hasSku && (
                    <button
                      type="button"
                      onClick={() => setFormTab('basic')}
                      className="text-[10px] text-stone-900 font-semibold underline cursor-pointer"
                    >
                      Fix in Step 1
                    </button>
                  )}
                </div>

                {/* 3. Price */}
                <div className="p-2.5 bg-white border border-stone-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {validationChecks.hasPrice ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span className={validationChecks.hasPrice ? 'text-stone-800' : 'text-amber-900 font-medium'}>
                      Selling Price Set ({formData.price ? formatPrice(formData.price, 'PKR') : '0 PKR'})
                    </span>
                  </div>
                  {!validationChecks.hasPrice && (
                    <button
                      type="button"
                      onClick={() => setFormTab('pricing')}
                      className="text-[10px] text-stone-900 font-semibold underline cursor-pointer"
                    >
                      Fix in Step 3
                    </button>
                  )}
                </div>

                {/* 4. Primary Image */}
                <div className="p-2.5 bg-white border border-stone-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {validationChecks.hasImage ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span className={validationChecks.hasImage ? 'text-stone-800' : 'text-amber-900 font-medium'}>
                      Primary Image Uploaded ({formData.images?.length || 0} photos)
                    </span>
                  </div>
                  {!validationChecks.hasImage && (
                    <button
                      type="button"
                      onClick={() => setFormTab('media')}
                      className="text-[10px] text-stone-900 font-semibold underline cursor-pointer"
                    >
                      Fix in Step 2
                    </button>
                  )}
                </div>

                {/* 5. Collection */}
                <div className="p-2.5 bg-white border border-stone-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {validationChecks.hasCollection ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span className={validationChecks.hasCollection ? 'text-stone-800' : 'text-amber-900 font-medium'}>
                      Storefront Collection Assigned ({formData.collectionNames?.length || 0} selected)
                    </span>
                  </div>
                  {!validationChecks.hasCollection && (
                    <button
                      type="button"
                      onClick={() => setFormTab('collections')}
                      className="text-[10px] text-stone-900 font-semibold underline cursor-pointer"
                    >
                      Fix in Step 4
                    </button>
                  )}
                </div>

                {/* 6. Sizes */}
                <div className="p-2.5 bg-white border border-stone-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {validationChecks.hasSizes ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span className={validationChecks.hasSizes ? 'text-stone-800' : 'text-amber-900 font-medium'}>
                      Sizing Configured ({formData.sizes?.length || 0} active sizes)
                    </span>
                  </div>
                  {!validationChecks.hasSizes && (
                    <button
                      type="button"
                      onClick={() => setFormTab('pricing')}
                      className="text-[10px] text-stone-900 font-semibold underline cursor-pointer"
                    >
                      Fix in Step 3
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Preview Card */}
            <div className="p-4 bg-white border border-stone-200 rounded-lg flex items-center gap-4">
              <img
                src={formData.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'}
                alt={formData.title || 'Preview'}
                className="w-16 h-20 object-cover object-top rounded border border-stone-200 shrink-0"
              />
              <div className="min-w-0 flex-1 space-y-1 text-xs">
                <h4 className="font-bold text-stone-900 text-sm truncate">
                  {formData.title || 'Untitled Ensemble'}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-stone-600 text-[11px]">
                  <span>SKU: {formData.sku || '—'}</span>
                  <span>•</span>
                  <span className="font-mono font-bold text-stone-900">
                    {formatPrice(formData.price || 0, 'PKR')}
                  </span>
                  {discountPercent > 0 && (
                    <span className="bg-stone-900 text-white text-[9px] px-1.5 py-0.2 rounded font-mono">
                      SAVE {discountPercent}%
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 text-[10px] pt-1">
                  {(formData.collectionNames || []).map(col => (
                    <span key={col} className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* ACTION BAR: Strictly separated steps (1-5 vs 6)           */}
      {/* ======================================================== */}
      <div className="sticky bottom-4 bg-white/95 backdrop-blur-md border border-stone-300 rounded-lg p-3 sm:p-4 shadow-xl flex items-center justify-between z-20">
        <button
          type="button"
          onClick={() => handleAttemptNavigate(onCancel)}
          className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded text-xs font-medium cursor-pointer"
        >
          Cancel
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Save Draft is available on ALL steps */}
          <button
            type="button"
            onClick={() => handleSaveProduct('Draft')}
            className="px-4 py-2 border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 rounded text-xs font-medium cursor-pointer transition-colors"
          >
            Save Draft
          </button>

          {/* Steps 1-5: Save & Continue -> (NO Publish button here!) */}
          {formTab !== 'status' ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <span>Save & Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            /* Step 6 ONLY: Preview & Publish Product */
            <div className="flex items-center gap-2">
              {formData.slug && onPreviewStorefront && (
                <button
                  type="button"
                  onClick={() => onPreviewStorefront(formData.slug!)}
                  className="px-3.5 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Preview Storefront</span>
                </button>
              )}

              <button
                type="button"
                disabled={!validationChecks.allValid}
                onClick={() => handleSaveProduct('Active')}
                className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:pointer-events-none text-white rounded text-xs font-medium uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{initialProduct?.status === 'Active' ? 'Save Changes' : 'Publish Product'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* UNSAVED CHANGES PROTECTION MODAL                         */}
      {/* ======================================================== */}
      {showUnsavedModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-lg max-w-md w-full p-5 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Unsaved Changes</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  You have made modifications to this product that haven't been saved yet.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded border border-stone-200">
              Do you want to save your entered work as a draft, keep editing, or discard your changes?
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowUnsavedModal(false);
                  setIsDirty(false);
                  if (pendingAction) pendingAction();
                }}
                className="px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded text-xs font-medium"
              >
                Discard Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUnsavedModal(false);
                  handleSaveProduct('Draft');
                  if (pendingAction) pendingAction();
                }}
                className="px-3 py-1.5 border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-medium"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setShowUnsavedModal(false)}
                className="px-4 py-1.5 bg-stone-900 text-white hover:bg-stone-800 rounded text-xs font-medium"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
