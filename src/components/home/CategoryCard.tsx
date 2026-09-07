import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category, Product } from '../../types';
import { resolveCategoryImage, getCategoryProductFallback } from '../../lib/mediaResolver';

interface CategoryCardProps {
  category: Category;
  products: Product[];
  onNavigate: (view: string, param?: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  products,
  onNavigate
}) => {
  const initialImage = resolveCategoryImage(category, products);
  const [currentSrc, setCurrentSrc] = useState<string>(initialImage);
  const [imageError, setImageError] = useState<boolean>(!initialImage);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  React.useEffect(() => {
    const resolved = resolveCategoryImage(category, products);
    setCurrentSrc(resolved);
    setImageError(!resolved);
  }, [category, products]);

  const handleImageError = () => {
    // 1. Try first authentic product image belonging to this category
    const productFallback = getCategoryProductFallback(category, products);
    if (productFallback && productFallback !== currentSrc) {
      setCurrentSrc(productFallback);
      return;
    }

    // 2. Try another authentic catalog image
    const globalCatalogFallback = products[0]?.images?.[0];
    if (globalCatalogFallback && globalCatalogFallback !== currentSrc) {
      setCurrentSrc(globalCatalogFallback);
      return;
    }

    // 3. Gracefully switch to elegant typographic luxury card (never show broken <img>)
    setImageError(true);
  };

  return (
    <div
      onClick={() => onNavigate('category', category.slug)}
      className="group cursor-pointer flex flex-col items-center text-center space-y-2.5 sm:space-y-3 w-full"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigate('category', category.slug);
        }
      }}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden border border-stone-200 group-hover:border-stone-500 bg-[#FAF9F6] transition-all duration-300">
        {!imageError && currentSrc ? (
          <>
            <img
              src={currentSrc}
              alt={category.name}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              onError={handleImageError}
              className={`w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {/* Smooth shimmer placeholder while loading */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-stone-100 animate-pulse flex items-center justify-center">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
                  GulPash
                </span>
              </div>
            )}
            {/* Gradient protection overlay for white typography legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-75 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" />
          </>
        ) : (
          /* Clean non-broken visual placeholder when image is unavailable */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#F5F3EF] border border-stone-200 text-center">
            <div className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 mb-2">
              <Sparkles className="w-4 h-4 text-stone-400" />
            </div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-medium">
              GulPash Atelier
            </span>
          </div>
        )}

        {/* Category Label at Bottom of Card */}
        <div className="absolute bottom-2.5 sm:bottom-3.5 inset-x-2 sm:inset-x-3 text-center pointer-events-none z-10">
          <span className="text-white text-[11px] sm:text-xs font-medium uppercase tracking-widest drop-shadow-md line-clamp-1 block">
            {category.name}
          </span>
          {category.productCount ? (
            <span className="text-stone-300 text-[9px] uppercase tracking-wider block mt-0.5 opacity-90">
              {category.productCount} Ensembles
            </span>
          ) : null}
        </div>
      </div>

      {/* View Collection Call to Action */}
      <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-500 group-hover:text-black transition-colors flex items-center gap-1 border-b border-transparent group-hover:border-stone-400 pb-0.5">
        <span>View Collection</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </span>
    </div>
  );
};
