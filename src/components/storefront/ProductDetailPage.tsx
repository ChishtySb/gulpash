import React, { useState, useEffect } from 'react';
import { 
  Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, 
  Play, Star, CheckCircle, ChevronRight, MessageCircle, 
  Ruler, Share2, Sparkles, Check
} from 'lucide-react';
import { Product, CurrencyCode, ProductSize, Review } from '../../types';
import { formatPrice } from '../../lib/currency';
import { StorageService } from '../../lib/storage';
import { ProductCard } from './ProductCard';

interface ProductDetailPageProps {
  product: Product;
  currency: CurrencyCode;
  onAddToCart: (product: Product, size: ProductSize, quantity: number) => void;
  onBuyNow: (product: Product, size: ProductSize, quantity: number) => void;
  onSelectProduct: (slug: string) => void;
  onOpenQuickView: (product: Product) => void;
  onQuickAddToCart: (product: Product, size: ProductSize) => void;
  onOpenSizeGuide: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onNavigate: (view: string, param?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  currency,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
  onOpenQuickView,
  onQuickAddToCart,
  onOpenSizeGuide,
  isWishlisted,
  onToggleWishlist,
  onNavigate
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'photos' | 'video'>('photos');
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0] || 'Unstitched');
  const [quantity, setQuantity] = useState(1);
  const [activeInfoTab, setActiveInfoTab] = useState<'details' | 'fabric' | 'shipping' | 'reviews'>('details');
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review form
  const [newAuthor, setNewAuthor] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const settings = StorageService.getSettings();
  const allReviews = StorageService.getReviews().filter(r => r.productId === product.id);
  const relatedProducts = StorageService.getProducts(false)
    .filter(p => p.id !== product.id && (p.category === product.category || p.collection === product.collection))
    .slice(0, 4);

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  // Dynamic Product SEO & Structured Data (JSON-LD)
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${product.title} | ${settings.brandName || 'GulPash'} Luxury Apparel`;

    // Dynamic Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://gulpash.online/products/${product.slug}`;

    // Dynamic JSON-LD structured data
    const scriptId = 'product-jsonld-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.title,
      "image": product.images,
      "description": product.shortDescription || `${product.title} by GulPash`,
      "sku": product.sku,
      "brand": {
        "@type": "Brand",
        "name": settings.brandName || "GulPash"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://gulpash.online/products/${product.slug}`,
        "priceCurrency": "PKR",
        "price": product.price,
        "availability": !product.isSoldOut ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    };
    scriptTag.textContent = JSON.stringify(schemaData);

    return () => {
      document.title = originalTitle;
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [product, settings.brandName]);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedSize, quantity);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;
    const review: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      author: newAuthor.trim(),
      city: newCity.trim() || 'Pakistan',
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      verifiedPurchase: true
    };
    StorageService.addReview(review);
    setReviewSubmitted(true);
    setNewAuthor('');
    setNewCity('');
    setNewComment('');
  };

  const whatsappInquiryUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `Assalam o Alaikum GulPash, I want to inquire about ${product.title} (SKU: ${product.sku}) priced at Rs. ${product.price}. Is size "${selectedSize}" in stock? Link: ${window.location.href}`
  )}`;

  return (
    <div className="bg-[#FAF9F6] font-sans pb-20">
      
      {/* 1. BREADCRUMBS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider">
          <button onClick={() => onNavigate('home')} className="hover:text-black cursor-pointer">Home</button>
          <ChevronRight className="w-3 h-3 text-stone-300" />
          <button onClick={() => onNavigate('shop')} className="hover:text-black cursor-pointer">Shop</button>
          <ChevronRight className="w-3 h-3 text-stone-300" />
          <button onClick={() => onNavigate('collection', 'all')} className="hover:text-black truncate cursor-pointer">
            {product.collectionNames?.[0] || 'All Ensembles'}
          </button>
          <ChevronRight className="w-3 h-3 text-stone-300" />
          <span className="text-stone-900 font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>
      </div>

      {/* 2. MAIN PRODUCT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* LEFT: MEDIA GALLERY (7 Cols on Desktop) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails list */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[650px] shrink-0 pb-2 sm:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageIdx(idx);
                    setActiveTab('photos');
                  }}
                  className={`w-16 sm:w-20 aspect-[3/4] border transition-all shrink-0 bg-stone-100 cursor-pointer ${
                    selectedImageIdx === idx && activeTab === 'photos'
                      ? 'border-stone-900 ring-1 ring-stone-900'
                      : 'border-stone-200 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-top" />
                </button>
              ))}

              {/* Video Thumbnail tab if video exists */}
              {product.videoUrl && (
                <button
                  onClick={() => setActiveTab('video')}
                  className={`w-16 sm:w-20 aspect-[3/4] border flex flex-col items-center justify-center gap-1 bg-stone-900 text-white transition-all shrink-0 cursor-pointer ${
                    activeTab === 'video' ? 'border-stone-900 ring-1 ring-stone-900' : 'border-stone-800 opacity-80 hover:opacity-100'
                  }`}
                >
                  <Play className="w-5 h-5 fill-stone-100 text-stone-100" />
                  <span className="text-[9px] uppercase font-medium tracking-wider">Video</span>
                </button>
              )}
            </div>

            {/* Main Stage Image / Video */}
            <div className="flex-1 relative aspect-[3/4] bg-stone-100 border border-stone-200 overflow-hidden">
              {activeTab === 'video' && product.videoUrl ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <video
                    src={product.videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-full relative group overflow-hidden cursor-zoom-in">
                  <img
                    src={product.images[selectedImageIdx] || product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                    {discountPercent > 0 && (
                      <span className="bg-stone-900 text-white text-[9px] font-medium uppercase tracking-widest px-2.5 py-1">
                        SAVE {discountPercent}%
                      </span>
                    )}
                    {product.isSoldOut && (
                      <span className="bg-stone-800 text-white text-[9px] font-medium uppercase tracking-widest px-2.5 py-1">
                        Sold Out
                      </span>
                    )}
                    {product.isNewArrival && (
                      <span className="bg-stone-900 text-white text-[9px] font-medium uppercase tracking-widest px-2.5 py-1">
                        New In
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: BUYING CONSOLE & DETAILS (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-wider mb-1.5">
                <span className="font-medium text-stone-500">GulPash Haute Couture</span>
                <span className="font-mono text-stone-400">SKU: {product.sku}</span>
              </div>

              <h1 className="font-rush-driver text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#1A1A1A] leading-tight">
                {product.title}
              </h1>

              {/* Brand Name */}
              <div className="font-zaslia text-sm tracking-[0.2em] uppercase text-stone-500 font-normal mt-1">
                GulPash
              </div>

              {/* Rating and review counter */}
              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-stone-800 font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-stone-500">({product.reviewCount || allReviews.length} verified reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-white border border-stone-200 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-sans not-italic font-semibold text-2xl sm:text-3xl text-[#1A1A1A] price-display">
                    {formatPrice(product.price, currency)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-sm font-sans not-italic text-stone-400 line-through">
                      {formatPrice(product.compareAtPrice, currency)}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-stone-500 mt-0.5 block font-light">
                  Inclusive of all taxes. {settings.shipping?.freeCodEnabled === true 
                    ? `Free shipping on orders above Rs. ${(settings.shipping?.freeShippingThreshold || 5000).toLocaleString()}.` 
                    : 'Nationwide delivery across Pakistan.'}
                </span>
              </div>

              {discountPercent > 0 && (
                <div className="bg-stone-100 text-stone-800 border border-stone-200 text-xs font-medium px-3 py-1.5 text-center">
                  <span>{discountPercent}%</span>
                  <span className="block text-[8px] uppercase tracking-wider">Discount</span>
                </div>
              )}
            </div>

            {/* Fabric Highlight Badge */}
            <div className="flex items-start gap-2.5 p-3.5 bg-stone-100 border border-stone-200 text-xs text-stone-700">
              <Sparkles className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-stone-900 uppercase tracking-wider text-[11px]">Fabric Specs: </span>
                <span className="italic font-serif">{product.fabric}</span>
              </div>
            </div>

            {/* Authentic Product Description Snapshot */}
            {product.description && (
              <div className="p-4 bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-2">
                <span className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] block">
                  Authentic Product Details:
                </span>
                {product.description.includes('<') ? (
                  <div 
                    className="prose prose-stone max-w-none text-xs leading-relaxed text-stone-700 [&_p]:mb-1.5 [&_strong]:text-stone-900 [&_strong]:font-medium [&_ul]:list-disc [&_ul]:pl-4"
                    dangerouslySetInnerHTML={{ __html: product.description }} 
                  />
                ) : (
                  <p className="leading-relaxed">{product.description}</p>
                )}
              </div>
            )}

            {/* Size Picker */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-stone-900">
                  Select Size:
                </span>
                <button
                  onClick={onOpenSizeGuide}
                  className="flex items-center gap-1 text-xs text-stone-600 hover:text-black font-medium cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart & Measurements</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] px-3.5 py-2 text-xs font-medium transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'border border-stone-900 bg-stone-900 text-white'
                        : 'border border-stone-300 bg-white text-stone-700 hover:border-stone-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium uppercase tracking-wider text-stone-900">Quantity:</span>
              <div className="flex items-center border border-stone-300 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-medium text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  +
                </button>
              </div>

              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-xs text-amber-800 font-medium">
                  Hurry! Only {product.stock} pieces remaining.
                </span>
              )}
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <div className="flex gap-3">
                {/* Add to Cart */}
                <button
                  id="pdp-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.isSoldOut}
                  className={`flex-1 text-[11px] font-medium uppercase tracking-[0.2em] py-4 px-6 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    product.isSoldOut
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{product.isSoldOut ? 'Sold Out' : 'Add to Shopping Bag'}</span>
                    </>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`w-14 h-14 border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isWishlisted 
                      ? 'bg-stone-900 text-white border-stone-900' 
                      : 'border-stone-300 hover:border-stone-900 text-stone-700 bg-white'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Buy Now (Direct Checkout) */}
              {!product.isSoldOut && (
                <button
                  id="pdp-buy-now-btn"
                  onClick={handleBuyNow}
                  className="w-full bg-stone-800 hover:bg-stone-700 text-white text-[11px] font-medium uppercase tracking-[0.2em] py-4 px-6 transition-all cursor-pointer"
                >
                  Buy Now — Cash on Delivery
                </button>
              )}

              {/* WhatsApp Instant Inquiry */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-medium uppercase tracking-wider py-3.5 px-4 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Inquire on WhatsApp (+92 321 8489999)</span>
              </a>

              {/* Share link button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleShare}
                  className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
                </button>
              </div>
            </div>

            {/* Pakistani Trust Guarantees */}
            <div className="p-4 bg-white border border-stone-200 divide-y divide-stone-100 text-xs space-y-3">
              <div className="flex items-center gap-3 pt-1">
                <Truck className="w-4 h-4 text-stone-600 shrink-0" />
                <div>
                  <strong className="text-stone-900 font-medium">Nationwide Dispatch: </strong>
                  <span className="text-stone-500 font-light">Delivered in 2-4 working days via TCS & Leopards.</span>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-3">
                <ShieldCheck className="w-4 h-4 text-stone-600 shrink-0" />
                <div>
                  <strong className="text-stone-900 font-medium">Payment Security: </strong>
                  <span className="text-stone-500 font-light">Cash on Delivery (COD) or Direct Bank Transfer.</span>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-3">
                <RefreshCw className="w-4 h-4 text-stone-600 shrink-0" />
                <div>
                  <strong className="text-stone-900 font-medium">7-Day Easy Exchange: </strong>
                  <span className="text-stone-500 font-light">Full support for size adjustments and swaps.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 3. PRODUCT SPECIFICATION & DETAILS TABS */}
        <div className="mt-16 bg-white border border-stone-200 p-6 sm:p-8">
          {/* Tab buttons */}
          <div className="flex flex-wrap gap-6 sm:gap-10 border-b border-stone-200 pb-4 mb-6">
            <button
              onClick={() => setActiveInfoTab('details')}
              className={`text-xs uppercase tracking-[0.2em] font-medium pb-2 border-b-2 transition-all cursor-pointer ${
                activeInfoTab === 'details' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              Product Details & Silhouette
            </button>
            <button
              onClick={() => setActiveInfoTab('fabric')}
              className={`text-xs uppercase tracking-[0.2em] font-medium pb-2 border-b-2 transition-all cursor-pointer ${
                activeInfoTab === 'fabric' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              Fabric Breakdown & Care
            </button>
            <button
              onClick={() => setActiveInfoTab('shipping')}
              className={`text-xs uppercase tracking-[0.2em] font-medium pb-2 border-b-2 transition-all cursor-pointer ${
                activeInfoTab === 'shipping' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              Delivery & Returns
            </button>
            <button
              onClick={() => setActiveInfoTab('reviews')}
              className={`text-xs uppercase tracking-[0.2em] font-medium pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeInfoTab === 'reviews' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              <span>Customer Reviews</span>
              <span className="bg-stone-100 text-stone-700 px-2 py-0.5 text-[10px]">
                {allReviews.length}
              </span>
            </button>
          </div>

          {/* Tab Contents */}
          {activeInfoTab === 'details' && (
            <div className="text-sm text-stone-600 leading-relaxed space-y-4 max-w-3xl font-light">
              {product.description?.includes('<') ? (
                <div 
                  className="prose prose-stone max-w-none text-sm leading-relaxed text-stone-600 [&_p]:mb-3 [&_strong]:text-stone-900 [&_strong]:font-medium [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: product.description }} 
                />
              ) : (
                <p>{product.description}</p>
              )}
              {product.details?.stitchingDetails && (
                <div className="bg-stone-50 p-4 border border-stone-200 text-xs space-y-1">
                  <h4 className="font-medium text-stone-900 uppercase tracking-wider text-[11px]">Tailoring & Embellishments:</h4>
                  <p>{product.details.stitchingDetails}</p>
                </div>
              )}
            </div>
          )}

          {activeInfoTab === 'fabric' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-600">
              <div className="space-y-2">
                <p><strong className="text-stone-900 font-medium">Fabric:</strong> {product.fabric}</p>
                {product.details?.shirt && <p><strong className="text-stone-900 font-medium">Shirt:</strong> {product.details.shirt}</p>}
                {product.details?.dupatta && <p><strong className="text-stone-900 font-medium">Dupatta:</strong> {product.details.dupatta}</p>}
                {product.details?.trouser && <p><strong className="text-stone-900 font-medium">Trouser:</strong> {product.details.trouser}</p>}
              </div>
              <div className="bg-stone-50 p-4 border border-stone-200 space-y-2 font-light">
                <h4 className="font-medium text-stone-900 uppercase tracking-wider text-[11px]">Care Instructions:</h4>
                <p className="leading-relaxed">
                  {product.details?.careInstructions || 'Dry clean recommended. Iron at moderate heat. Do not bleach or wash with harsh detergents.'}
                </p>
              </div>
            </div>
          )}

          {activeInfoTab === 'shipping' && (
            <div className="text-xs text-stone-600 leading-relaxed space-y-3 max-w-2xl font-light">
              <p>
                • <strong className="text-stone-900 font-medium">Standard Dispatch:</strong> Orders are dispatched within 24 to 48 hours from our Lahore atelier.
              </p>
              <p>
                • <strong className="text-stone-900 font-medium">Delivery Timeline:</strong> Major cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad) receive packages within 2-3 business days. Rural destinations take 3-5 business days.
              </p>
              <p>
                • <strong className="text-stone-900 font-medium">Shipping Charges:</strong> Flat Rs. {settings.shipping?.standardFee || 250} across Pakistan.{settings.shipping?.freeCodEnabled !== false ? ` Free shipping on all orders above Rs. ${(settings.shipping?.freeShippingThreshold || 5000).toLocaleString()}.` : ''}
              </p>
              <p>
                • <strong className="text-stone-900 font-medium">Exchanges:</strong> If you face size or design issues, notify our WhatsApp concierge within 7 days of delivery for a seamless replacement.
              </p>
            </div>
          )}

          {activeInfoTab === 'reviews' && (
            <div className="space-y-8">
              {/* Existing Reviews */}
              <div className="divide-y divide-stone-200">
                {allReviews.length === 0 ? (
                  <p className="text-xs text-stone-500 py-4 font-light">No reviews yet. Be the first to share your thoughts!</p>
                ) : (
                  allReviews.map((rev) => (
                    <div key={rev.id} className="py-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs text-stone-900">{rev.author}</span>
                          <span className="text-[10px] text-stone-500">• {rev.city}</span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 flex items-center gap-0.5 font-medium">
                              <CheckCircle className="w-3 h-3" /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed pt-1 font-light">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Review Submission Form */}
              <div className="pt-6 border-t border-stone-200 bg-stone-50 p-5">
                <h4 className="font-serif text-lg font-light italic text-stone-900 mb-2">Write a Review</h4>
                {reviewSubmitted ? (
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs">
                    Thank you! Your verified review has been submitted and published.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name *"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="bg-white border border-stone-300 p-2 text-xs focus:outline-hidden focus:border-stone-900"
                      />
                      <input
                        type="text"
                        placeholder="City (e.g. Lahore, Karachi) *"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="bg-white border border-stone-300 p-2 text-xs focus:outline-hidden focus:border-stone-900"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-stone-700">Rating:</span>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="bg-white border border-stone-300 p-1.5 text-xs"
                      >
                        <option value={5}>5 Stars - Outstanding</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Average</option>
                        <option value={2}>2 Stars - Below Expectations</option>
                        <option value={1}>1 Star - Poor</option>
                      </select>
                    </div>

                    <textarea
                      required
                      rows={3}
                      placeholder="Share your experience with fabric quality, embroidery finish, and fitting..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full bg-white border border-stone-300 p-2 text-xs focus:outline-hidden focus:border-stone-900"
                    />

                    <button
                      type="submit"
                      className="bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium uppercase tracking-[0.2em] py-2.5 px-6 transition-all cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. RELATED / RECOMMENDED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase font-medium tracking-[0.3em] text-stone-500 block">
                CURATED RECOMMENDATIONS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light italic text-[#1A1A1A] mt-1">
                You May Also Admire
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  currency={currency}
                  onSelect={onSelectProduct}
                  onQuickView={onOpenQuickView}
                  onQuickAddToCart={onQuickAddToCart}
                  isWishlisted={StorageService.getWishlist().includes(p.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
