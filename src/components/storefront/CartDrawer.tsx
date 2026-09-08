import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { CartItem, CurrencyCode } from '../../types';
import { formatPrice } from '../../lib/currency';
import { StorageService } from '../../lib/storage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  currency: CurrencyCode;
  onProceedToCheckout: () => void;
  onNavigate: (view: string, param?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  currency,
  onProceedToCheckout,
  onNavigate
}) => {
  if (!isOpen) return null;

  const settings = StorageService.getSettings();
  const freeCodEnabled = settings.shipping.freeCodEnabled !== false;
  const freeShippingThreshold = settings.shipping.freeShippingThreshold || 5000;

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const isQualifiedForFree = freeCodEnabled && subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      <div 
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-[#FAF9F6] h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 z-10 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-stone-700 stroke-[1.5]" />
            <h3 className="font-serif text-xl font-light italic text-[#1A1A1A]">
              Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-black transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {freeCodEnabled && (
          <div className="bg-stone-100 px-5 py-3 border-b border-stone-200">
            <div className="flex items-center justify-between text-xs font-medium text-stone-700 mb-1.5">
              {isQualifiedForFree ? (
                <span className="text-emerald-800 flex items-center gap-1 font-medium">
                  <Truck className="w-3.5 h-3.5" /> You qualify for FREE Nationwide Delivery!
                </span>
              ) : (
                <span>
                  Add <strong className="text-stone-900 font-semibold">{formatPrice(remainingForFreeShipping, currency)}</strong> more for <span className="underline">FREE Delivery</span>
                </span>
              )}
              <span className="text-[10px] text-stone-500">{progressPercent}%</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  isQualifiedForFree ? 'bg-emerald-700' : 'bg-stone-900'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-200">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-600">
                <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-light italic text-[#1A1A1A]">Your bag is empty</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-xs font-light">
                  Discover our new luxury lawn & raw silk pret collections to find your perfect ensemble.
                </p>
              </div>
              <button
                onClick={() => {
                  onNavigate('shop');
                  onClose();
                }}
                className="bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium uppercase tracking-[0.2em] py-3 px-6 shadow-sm transition-all cursor-pointer"
              >
                Shop New Arrivals
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-3.5 items-start">
                {/* Product Thumbnail */}
                <img
                  src={item.product.images[0] || ''}
                  alt={item.product.title}
                  className="w-18 h-24 object-cover object-top border border-stone-200 shrink-0 bg-stone-100"
                />

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-medium text-[#1A1A1A] line-clamp-1 leading-tight">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-400 hover:text-stone-900 p-0.5 transition-colors shrink-0 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[11px] text-stone-500">
                      <span className="bg-stone-100 border border-stone-200 px-2 py-0.5 text-stone-700 text-[10px] uppercase tracking-wider font-medium">
                        Size: {item.size}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[10px] text-stone-500 italic font-serif truncate">{item.product.fabric}</span>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-stone-300 bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-medium text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-sans not-italic font-semibold text-[#1A1A1A] price-display">
                        {formatPrice(item.price * item.quantity, currency)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="block text-[10px] text-stone-500 font-sans not-italic">
                          ({formatPrice(item.price, currency)} each)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout Actions */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-stone-200 space-y-3.5">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-sans not-italic font-semibold text-[#1A1A1A] price-display">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>Shipping across Pakistan:</span>
                <span className="font-sans not-italic">
                  {isQualifiedForFree ? (
                    <span className="text-emerald-700 font-medium uppercase text-[10px] tracking-wider">FREE</span>
                  ) : (
                    formatPrice(settings.shipping.standardFee, currency)
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium text-[#1A1A1A] pt-2 border-t border-stone-200">
                <span>Estimated Total:</span>
                <span className="text-base font-sans not-italic font-semibold text-[#1A1A1A] price-display">
                  {formatPrice(
                    subtotal + (isQualifiedForFree ? 0 : settings.shipping.standardFee),
                    currency
                  )}
                </span>
              </div>
            </div>

            <button
              id="cart-proceed-checkout-btn"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium uppercase tracking-[0.2em] py-3.5 px-4 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-1 flex items-center justify-center gap-4 text-[10px] text-stone-500 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-600" /> Cash on Delivery
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-stone-600" /> 2-4 Days Delivery
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
