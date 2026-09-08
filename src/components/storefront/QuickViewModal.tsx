import React, { useState } from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, Truck, Play, Check } from 'lucide-react';
import { Product, CurrencyCode, ProductSize } from '../../types';
import { formatPrice } from '../../lib/currency';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  currency: CurrencyCode;
  onAddToCart: (product: Product, size: ProductSize, quantity: number) => void;
  onViewFullDetails: (slug: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onOpenSizeGuide: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  currency,
  onAddToCart,
  onViewFullDetails,
  isWishlisted,
  onToggleWishlist,
  onOpenSizeGuide
}) => {
  if (!product) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0] || 'Unstitched');
  const [quantity, setQuantity] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 1200);
  };

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden border border-[#e8e3dc] z-10 max-h-[92vh] flex flex-col md:flex-row animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-black flex items-center justify-center shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Media Gallery */}
        <div className="w-full md:w-1/2 bg-[#faf8f5] p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#eee]">
          <div className="relative aspect-[3/4] w-full bg-white border border-[#e8e3dc] rounded-sm overflow-hidden flex items-center justify-center">
            {showVideo && product.videoUrl ? (
              <video
                src={product.videoUrl}
                autoPlay
                controls
                loop
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover object-top"
              />
            )}

            {/* Video switch button */}
            {product.videoUrl && (
              <button
                onClick={() => setShowVideo(!showVideo)}
                className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md backdrop-blur-xs transition-all ${
                  showVideo ? 'bg-[#c59b66] text-white' : 'bg-black/60 text-white hover:bg-black'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{showVideo ? 'Show Photos' : 'Watch Video'}</span>
              </button>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {discountPercent > 0 && (
                <span className="bg-[#8b2635] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-xs">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveImageIdx(idx);
                  setShowVideo(false);
                }}
                className={`w-14 h-18 shrink-0 rounded-xs overflow-hidden border-2 transition-all ${
                  activeImageIdx === idx && !showVideo ? 'border-[#c59b66]' : 'border-[#e0dad0] opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Specs & Actions */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs text-[#888] uppercase tracking-wider mb-1">
              <span className="font-medium text-stone-500">GulPash Luxury Couture</span>
              <span className="text-[11px] font-mono text-[#aaa]">SKU: {product.sku}</span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#111] leading-snug">
              {product.title}
            </h2>

            {/* Price */}
            <div className="mt-2.5 flex items-baseline gap-3">
              <span className="text-xl font-bold text-[#111]">
                {formatPrice(product.price, currency)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-[#999] line-through">
                  {formatPrice(product.compareAtPrice, currency)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs text-[#8b2635] font-bold">
                  ({discountPercent}% OFF)
                </span>
              )}
            </div>

            {/* Fabric specification tag */}
            <div className="mt-3 py-2 px-3 bg-[#faf8f5] border border-[#e8e3dc] rounded-sm text-xs text-[#444]">
              <span className="font-bold text-[#222]">Fabric: </span>
              <span>{product.fabric}</span>
            </div>

            <p className="mt-3 text-xs text-[#666] line-clamp-3 leading-relaxed">
              {product.shortDescription || (product.description ? product.description.replace(/<[^>]+>/g, ' ') : '')}
            </p>

            {/* Size Selector */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-[#333] uppercase tracking-wider">Size Option:</span>
                <button
                  onClick={onOpenSizeGuide}
                  className="text-[#c59b66] hover:underline text-[11px] font-medium"
                >
                  Size Guide & Measurements
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 text-xs rounded-xs border font-medium transition-all ${
                      selectedSize === size
                        ? 'border-[#c59b66] bg-[#c59b66] text-white shadow-xs'
                        : 'border-[#d8d2c7] bg-white text-[#333] hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#333]">Quantity:</span>
              <div className="flex items-center border border-[#ddd] rounded-xs bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-sm font-bold text-[#555] hover:bg-[#eee]"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-[#111]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 text-sm font-bold text-[#555] hover:bg-[#eee]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-3 border-t border-[#eee]">
            <div className="flex gap-2">
              <button
                id="quickview-add-cart-btn"
                onClick={handleAdd}
                disabled={product.isSoldOut}
                className={`flex-1 text-xs font-bold uppercase tracking-[0.2em] py-3.5 px-4 rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  product.isSoldOut
                    ? 'bg-[#ccc] text-[#666] cursor-not-allowed'
                    : 'bg-[#181818] hover:bg-[#c59b66] text-white'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{product.isSoldOut ? 'Sold Out' : 'Add to Shopping Bag'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`w-12 h-12 rounded-sm border flex items-center justify-center transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-[#8b2635] text-white border-[#8b2635]'
                    : 'border-[#ddd] hover:border-black text-[#444]'
                }`}
                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* View Full Product Link */}
            <button
              onClick={() => {
                onViewFullDetails(product.slug);
                onClose();
              }}
              className="w-full text-center text-xs font-semibold text-[#c59b66] hover:text-[#aa814d] hover:underline py-1"
            >
              &rarr; View Full Product Description & Editorial Gallery
            </button>

            {/* Micro guarantees */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-[#777] border-t border-[#f2ece4]">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#c59b66]" /> 2-4 Days Dispatch (PK)
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c59b66]" /> 100% Original Brand
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
