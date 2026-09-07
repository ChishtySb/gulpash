import React, { useState } from 'react';
import { Heart, Eye, Play, Check } from 'lucide-react';
import { Product, CurrencyCode, ProductSize } from '../../types';
import { formatPrice } from '../../lib/currency';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  onSelect: (slug: string) => void;
  onQuickView: (product: Product) => void;
  onQuickAddToCart: (product: Product, size: ProductSize) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelect,
  onQuickView,
  onQuickAddToCart,
  isWishlisted,
  onToggleWishlist
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [primaryFailed, setPrimaryFailed] = useState(false);
  const [secondaryFailed, setSecondaryFailed] = useState(false);

  const primaryImage = (!primaryFailed && product.images[0]) ? product.images[0] : (product.images[1] || '');
  const secondaryImage = (!secondaryFailed && product.images[1]) ? product.images[1] : primaryImage;

  // Calculate discount %
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleSizeSelect = (size: ProductSize, e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAddToCart(product, size);
    setShowSizePicker(false);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div 
      className="group relative flex flex-col bg-white border border-stone-200 hover:border-stone-400 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSizePicker(false);
      }}
    >
      {/* 1. MEDIA CONTAINER WITH BORDER */}
      <div 
        className="relative w-full aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer"
        onClick={() => onSelect(product.slug)}
      >
        {/* Primary Image */}
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.title}
            loading="lazy"
            onError={() => setPrimaryFailed(true)}
            className={`w-full h-full object-cover object-top transition-all duration-700 ease-out ${
              isHovered && secondaryImage !== primaryImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs uppercase tracking-wider">
            GulPash Couture
          </div>
        )}

        {/* Secondary Image on Hover */}
        {secondaryImage && secondaryImage !== primaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.title} Alternate View`}
            loading="lazy"
            onError={() => setSecondaryFailed(true)}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100 pointer-events-none'
            }`}
          />
        )}

        {/* Badges Container */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isSoldOut ? (
            <span className="bg-stone-900 text-white text-[9px] uppercase font-medium tracking-widest px-2 py-0.5">
              Sold Out
            </span>
          ) : discountPercent > 0 ? (
            <span className="bg-stone-900 text-white text-[9px] uppercase font-medium tracking-widest px-2 py-0.5">
              SAVE {discountPercent}%
            </span>
          ) : product.isNewArrival ? (
            <span className="bg-stone-800 text-white text-[9px] uppercase font-medium tracking-widest px-2 py-0.5">
              New In
            </span>
          ) : null}

          {product.isBestSeller && !product.isSoldOut && (
            <span className="bg-stone-700 text-stone-100 text-[9px] uppercase font-medium tracking-wider px-2 py-0.5">
              Trending
            </span>
          )}
        </div>

        {/* Video Badge */}
        {product.videoUrl && (
          <div 
            className="absolute top-2.5 right-11 bg-black/50 backdrop-blur-xs text-white p-1.5 rounded-full z-10 hover:bg-black/80 transition-colors"
            title="Video Available"
          >
            <Play className="w-3 h-3 fill-white text-white" />
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer ${
            isWishlisted 
              ? 'bg-stone-900 text-white' 
              : 'bg-white/85 hover:bg-white text-stone-700 hover:text-black shadow-xs'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button (Desktop hover) */}
        <div className={`absolute bottom-3 inset-x-3 transition-all duration-300 z-20 flex gap-2 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 bg-white/95 hover:bg-white text-stone-900 text-[10px] font-medium uppercase tracking-widest py-2.5 px-3 border border-stone-200 shadow-md backdrop-blur-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Quick Added Notification */}
        {addedNotice && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-30 animate-in fade-in">
            <div className="bg-white text-stone-900 text-xs font-medium py-2 px-4 shadow-xl flex items-center gap-2 border border-stone-200">
              <Check className="w-4 h-4 text-emerald-700" />
              <span className="uppercase tracking-wider text-[11px]">Added to Bag</span>
            </div>
          </div>
        )}

        {/* Quick Size Picker Overlay */}
        {showSizePicker && !product.isSoldOut && (
          <div 
            className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-3 border-t border-stone-200 z-30 animate-in slide-in-from-bottom-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-medium text-stone-500 tracking-wider">
                Select Size:
              </span>
              <button 
                onClick={() => setShowSizePicker(false)}
                className="text-[10px] text-stone-400 hover:text-black"
              >
                Cancel
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => handleSizeSelect(size, e)}
                  className="px-2.5 py-1 text-[11px] border border-stone-200 hover:border-black hover:bg-stone-100 hover:text-black font-medium transition-colors cursor-pointer uppercase"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 2. PRODUCT INFO & DETAILS */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category / Fabric Subtitle */}
          <div className="flex items-center justify-between text-[10px] uppercase font-medium text-stone-400 tracking-widest mb-1">
            <span className="truncate">{product.category}</span>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-stone-800 font-medium tracking-normal shrink-0">Only {product.stock} left</span>
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onSelect(product.slug)}
            className="text-xs sm:text-[13px] font-medium text-[#1A1A1A] hover:text-stone-600 transition-colors line-clamp-2 leading-snug cursor-pointer min-h-[34px]"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Fabric Specification */}
          <p className="text-[11px] text-stone-500 mt-1 line-clamp-1 italic font-serif">
            {product.fabric}
          </p>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-1">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-serif italic font-semibold text-[#1A1A1A] whitespace-nowrap">
                {formatPrice(product.price, currency)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-[10px] sm:text-[11px] text-stone-400 line-through font-serif italic whitespace-nowrap">
                  {formatPrice(product.compareAtPrice, currency)}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[9px] text-stone-600 font-medium tracking-wider whitespace-nowrap">
                ({discountPercent}% OFF)
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          {!product.isSoldOut ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (product.sizes.length === 1) {
                  handleSizeSelect(product.sizes[0], e);
                } else {
                  setShowSizePicker(!showSizePicker);
                }
              }}
              className="text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest font-medium text-stone-800 hover:text-white bg-transparent hover:bg-stone-900 border border-stone-300 hover:border-stone-900 px-2 sm:px-3 py-1 sm:py-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              + Add
            </button>
          ) : (
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-400 font-medium whitespace-nowrap">
              Out of stock
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
