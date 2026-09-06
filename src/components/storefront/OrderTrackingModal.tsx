import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { Order, CurrencyCode } from '../../types';
import { formatPrice } from '../../lib/currency';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  currency
}) => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const clean = query.trim().toUpperCase();
    const orders = StorageService.getOrders();
    const found = orders.find(o => 
      o.orderNumber.toUpperCase() === clean ||
      o.customer.phone.replace(/\s+/g, '') === clean.replace(/\s+/g, '') ||
      o.customer.email.toLowerCase() === clean.toLowerCase()
    );

    setOrder(found || null);
    setSearched(true);
  };

  const steps = [
    { label: 'Order Placed', status: 'Pending', icon: Clock },
    { label: 'Confirmed', status: 'Confirmed', icon: CheckCircle2 },
    { label: 'Stitched & Packed', status: 'Processing', icon: PackageCheck },
    { label: 'Out for Delivery (TCS)', status: 'Shipped', icon: Truck },
    { label: 'Delivered', status: 'Delivered', icon: CheckCircle2 }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-2xl p-6 border border-[#e8e3dc] z-10 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#eee]">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#c59b66]" />
            <h3 className="font-serif text-2xl font-bold text-[#111]">Track Your GulPash Order</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-[#888] hover:text-black rounded-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracking Input Form */}
        <form onSubmit={handleTrack} className="mt-5">
          <label className="block text-xs font-semibold text-[#444] mb-1.5">
            Enter Order Number (e.g. GP-94825) or Contact Phone:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="e.g. GP-94825 or 03211234567"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border border-[#ddd] p-2.5 text-xs rounded-xs font-mono uppercase focus:outline-hidden focus:border-[#c59b66]"
            />
            <button
              type="submit"
              className="bg-[#181818] hover:bg-[#c59b66] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xs transition-all flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
          </div>
        </form>

        {/* Result presentation */}
        {searched && (
          <div className="mt-6 pt-5 border-t border-[#eee]">
            {!order ? (
              <div className="text-center py-6 text-xs text-[#777] bg-[#faf8f5] rounded border border-[#eee]">
                <AlertCircle className="w-6 h-6 text-[#aa814d] mx-auto mb-2" />
                <p className="font-semibold text-[#333]">No order found matching &ldquo;{query}&rdquo;</p>
                <p className="mt-1">Please double check your order number or phone, or WhatsApp us at +92 321 8489999.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Order header */}
                <div className="flex items-center justify-between bg-[#faf8f5] p-3.5 rounded border border-[#e8e3dc] text-xs">
                  <div>
                    <span className="text-[10px] text-[#888] block">ORDER NUMBER</span>
                    <strong className="text-sm font-mono text-[#aa814d]">{order.orderNumber}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#888] block">CURRENT STATUS</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-xs text-[11px]">
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="py-2">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#eee] -z-1" />
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#c59b66] transition-all duration-500 -z-1"
                      style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                    {steps.map((step, idx) => {
                      const isComplete = idx <= currentStep;
                      const Icon = step.icon;
                      return (
                        <div key={step.label} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                            isComplete 
                              ? 'bg-[#c59b66] text-white shadow-md' 
                              : 'bg-white border-2 border-[#ddd] text-[#aaa]'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-medium mt-2 text-center max-w-[70px] ${
                            isComplete ? 'text-[#111] font-bold' : 'text-[#aaa]'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details summary */}
                <div className="text-xs text-[#555] space-y-1.5 pt-2">
                  <p><strong>Customer:</strong> {order.customer.fullName} ({order.customer.city})</p>
                  <p><strong>Courier:</strong> TCS Express / Leopards (Dispatch from Lahore Atelier)</p>
                  <p><strong>Payment:</strong> {order.paymentMethod} &bull; Total: <strong>{formatPrice(order.total, currency)}</strong></p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
