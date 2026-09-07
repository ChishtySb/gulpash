import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { Product, CurrencyCode } from '../../types';
import { formatPrice } from '../../lib/currency';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (slug: string) => void;
  currency: CurrencyCode;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  currency
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const clean = query.toLowerCase().trim();
    const all = StorageService.getProducts(false);
    const matched = all.filter(p => 
      p.title.toLowerCase().includes(clean) ||
      p.sku.toLowerCase().includes(clean) ||
      p.category.toLowerCase().includes(clean) ||
      p.fabric.toLowerCase().includes(clean) ||
      (p.collection && p.collection.toLowerCase().includes(clean)) ||
      p.tags.some(t => t.toLowerCase().includes(clean))
    );
    setResults(matched);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 font-sans">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 z-10 animate-in fade-in zoom-in-95 font-sans">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search luxury lawn, pret, silk formals, SKU..."
            className="w-full text-base sm:text-lg text-stone-900 placeholder-stone-400 focus:outline-hidden font-sans font-light"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[10px] font-medium text-stone-500 hover:text-black uppercase tracking-widest px-2 py-1 border border-stone-200 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Popular searches suggestions if empty */}
        {!query && (
          <div className="p-6 bg-stone-50">
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-stone-500 block mb-3">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {['Trending', 'Unstitched / Stitched', 'Stitched', 'Co-Ords', 'WINTER COLLECTION', 'Trending Designs'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="flex items-center gap-1.5 text-xs bg-white border border-stone-200 text-stone-700 hover:border-stone-900 hover:text-stone-900 px-3 py-1.5 transition-colors cursor-pointer"
                >
                  <Tag className="w-3 h-3 text-stone-400" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results list */}
        {query && (
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-stone-100">
            {results.length === 0 ? (
              <div className="text-center py-12 text-stone-500 font-light">
                <p className="text-sm">No products found matching &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-stone-400 mt-1">Try searching by category such as Lawn, Silk, Pret, or Festive.</p>
              </div>
            ) : (
              results.map(product => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product.slug);
                    onClose();
                  }}
                  className="py-3 flex items-center justify-between gap-4 group hover:bg-stone-50 px-2 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-14 h-18 object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-medium tracking-wider text-stone-500 block">
                        {product.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-medium text-stone-900 group-hover:text-black transition-colors line-clamp-1">
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5 font-light">{product.fabric}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-serif italic font-semibold text-stone-900">
                          {formatPrice(product.price, currency)}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-[11px] text-stone-400 line-through">
                            {formatPrice(product.compareAtPrice, currency)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-stone-900 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
