import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, CurrencyCode } from '../../types';
import { formatPrice } from '../../lib/currency';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemove: (id: string) => void;
  onSelectProduct: (slug: string) => void;
  currency: CurrencyCode;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemove,
  onSelectProduct,
  currency
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-2xl p-6 border border-[#e8e3dc] z-10 animate-in fade-in max-h-[85vh] flex flex-col justify-between">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#eee]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#8b2635] fill-[#8b2635]" />
            <h3 className="font-serif text-2xl font-bold text-[#111]">
              Saved Wishlist ({wishlistProducts.length})
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#888] hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#eee] my-4 pr-1">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12 text-[#888] space-y-3">
              <p className="text-sm">Your wishlist is currently empty.</p>
              <p className="text-xs text-[#aaa]">Click the heart icon on any design to save it for later.</p>
            </div>
          ) : (
            wishlistProducts.map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between gap-3">
                <div 
                  onClick={() => {
                    onSelectProduct(p.slug);
                    onClose();
                  }}
                  className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-14 h-18 object-cover border border-[#e8e3dc] rounded-xs shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#aa814d] uppercase font-bold tracking-wider block">
                      {p.category}
                    </span>
                    <h4 className="text-xs font-semibold text-[#111] group-hover:text-[#c59b66] transition-colors truncate">
                      {p.title}
                    </h4>
                    <span className="text-xs font-bold text-[#111] mt-1 block">
                      {formatPrice(p.price, currency)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectProduct(p.slug);
                      onClose();
                    }}
                    className="bg-[#181818] hover:bg-[#c59b66] text-white text-[11px] font-bold uppercase tracking-wider py-2 px-3 rounded-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => onRemove(p.id)}
                    className="p-2 text-[#aaa] hover:text-red-600 rounded-xs transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-[#eee] text-center">
          <p className="text-[11px] text-[#888]">
            Items in your wishlist remain saved on this device.
          </p>
        </div>

      </div>
    </div>
  );
};
