import React, { useState } from 'react';
import { 
  X, Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle, 
  Upload, ImageIcon, Check, AlertTriangle 
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { Order, CurrencyCode } from '../../types';
import { formatPrice } from '../../lib/currency';
import { resolveWhatsAppSettings, getWhatsAppUrl } from '../../lib/whatsapp';

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

  // Resubmission states (Req 2)
  const [newTrxId, setNewTrxId] = useState('');
  const [newProofImage, setNewProofImage] = useState<string | null>(null);
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [resubmitSuccess, setResubmitSuccess] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const clean = query.trim().toUpperCase();
    // Fetch latest fresh orders from server
    const orders = await StorageService.fetchOrdersAsync();
    const found = orders.find(o => 
      o.orderNumber.toUpperCase() === clean ||
      o.customer.phone.replace(/\s+/g, '') === clean.replace(/\s+/g, '') ||
      o.customer.email.toLowerCase() === clean.toLowerCase()
    );

    setOrder(found || null);
    if (found) {
      setNewTrxId(found.paymentProof?.transactionReference || '');
      setNewProofImage(null);
    }
    setSearched(true);
    setResubmitSuccess(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = () => {
        setNewProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed reading file:', err);
    }
  };

  const handleResubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    setIsSubmittingProof(true);
    try {
      let finalScreenshotUrl = newProofImage || order.paymentProof?.screenshotUrl;
      if (newProofImage && newProofImage.startsWith('data:')) {
        finalScreenshotUrl = await StorageService.uploadPaymentProof(newProofImage);
      }

      const updatedProof = {
        screenshotUrl: finalScreenshotUrl,
        transactionReference: newTrxId.trim() || order.paymentProof?.transactionReference,
        submittedAt: new Date().toISOString()
      };

      StorageService.attachOrderPaymentProof(order.id, updatedProof);

      const refreshedOrder: Order = {
        ...order,
        paymentProof: updatedProof,
        paymentStatus: 'Under Verification',
        status: 'Payment Verification Pending',
        updatedAt: new Date().toISOString()
      };

      setOrder(refreshedOrder);
      setResubmitSuccess(true);
      setNewProofImage(null);
    } catch (err) {
      console.error('Failed to resubmit payment proof:', err);
    } finally {
      setIsSubmittingProof(false);
    }
  };

  const steps = [
    { label: 'Order Placed', status: 'Pending', icon: Clock },
    { label: 'Confirmed', status: 'Confirmed', icon: CheckCircle2 },
    { label: 'Ready to Dispatch', status: 'Ready to Dispatch', icon: PackageCheck },
    { label: 'Out for Delivery (TCS)', status: 'Shipped', icon: Truck },
    { label: 'Delivered', status: 'Delivered', icon: CheckCircle2 }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Payment Verification Pending': return 0;
      case 'Payment Action Required': return 0;
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Ready to Dispatch': return 2;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;
  const isRejected = order && (order.paymentStatus === 'Rejected' || order.status === 'Payment Action Required');

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
            className="p-1 text-[#888] hover:text-black rounded-sm cursor-pointer"
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
              className="bg-[#181818] hover:bg-[#c59b66] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xs transition-all flex items-center gap-1.5 cursor-pointer"
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
                {(() => {
                  const waConfig = resolveWhatsAppSettings(StorageService.getSettings());
                  if (waConfig.enabled && waConfig.showInOrderAssistance) {
                    return (
                      <p className="mt-1">
                        Please double check your order number or phone, or contact{' '}
                        <a
                          href={getWhatsAppUrl(waConfig.destinationNumber, `Assalam o Alaikum, I need assistance tracking my GulPash order (Query: ${query})`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-stone-900 underline font-semibold hover:text-[#aa814d]"
                        >
                          {waConfig.displayLabel} at {waConfig.number}
                        </a>.
                      </p>
                    );
                  }
                  return (
                    <p className="mt-1">Please double check your order number or phone, or contact customer support.</p>
                  );
                })()}
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
                    <span className={`font-bold px-2 py-0.5 rounded-xs text-[11px] ${
                      isRejected
                        ? 'bg-rose-100 text-rose-900 border border-rose-300'
                        : order.status === 'Ready to Dispatch'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : order.status === 'Payment Verification Pending'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-stone-100 text-stone-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* REJECTION ALERT & RESUBMISSION FORM (Req 1, 2) */}
                {isRejected && (
                  <div className="bg-rose-50 border border-rose-300 rounded-xs p-4 text-xs space-y-3">
                    <div className="flex items-center gap-2 text-rose-900">
                      <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider block">
                          PAYMENT ACTION REQUIRED
                        </span>
                        <p className="text-xs text-rose-800 font-medium">
                          Your previous payment proof could not be reconciled. Your order remains active.
                        </p>
                      </div>
                    </div>

                    {order.paymentProof?.rejectionReason && (
                      <div className="bg-white border border-rose-200 p-2.5 rounded-xs text-rose-900">
                        <span className="text-[10px] font-bold uppercase text-stone-500 block">
                          Concierge Rejection Reason:
                        </span>
                        <p className="font-semibold text-xs mt-0.5 italic">
                          &ldquo;{order.paymentProof.rejectionReason}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Resubmission controls */}
                    <form onSubmit={handleResubmitProof} className="space-y-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          UPDATE TRANSACTION ID / REFERENCE NUMBER
                        </label>
                        <input
                          type="text"
                          value={newTrxId}
                          onChange={(e) => setNewTrxId(e.target.value)}
                          placeholder="e.g. 12-digit JazzCash TID, Easypaisa TRX, or Bank Ref #"
                          className="w-full border border-stone-300 bg-white p-2 text-xs font-mono rounded-xs focus:outline-hidden focus:border-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          UPLOAD NEW PAYMENT PROOF
                        </label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-medium rounded-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{newProofImage ? 'Change Image' : 'Choose Receipt Screenshot'}</span>
                          </button>
                          {newProofImage && (
                            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Ready to upload
                            </span>
                          )}
                        </div>

                        {newProofImage && (
                          <div className="mt-2 border border-stone-300 p-1 bg-white inline-block">
                            <img src={newProofImage} alt="Receipt Preview" className="h-20 object-contain" />
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingProof || (!newTrxId.trim() && !newProofImage)}
                        className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xs transition-colors cursor-pointer"
                      >
                        {isSubmittingProof ? 'Uploading & Updating...' : 'Resubmit Payment Proof'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Resubmission Success Banner */}
                {resubmitSuccess && (
                  <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xs text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      Payment proof resubmitted! Status has returned to <strong>UNDER VERIFICATION</strong>.
                    </span>
                  </div>
                )}

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
                  <p><strong>Payment:</strong> {order.paymentMethod} &bull; Total: <span className="font-sans not-italic font-semibold text-stone-900 price-display">{formatPrice(order.total, currency)}</span></p>
                  <p><strong>Payment Status:</strong> <span className="font-semibold text-stone-900">{order.paymentStatus || 'Unpaid'}</span></p>
                  {order.paymentProof?.transactionReference && (
                    <p><strong>Transaction Ref / TID:</strong> <span className="font-mono text-stone-900 font-bold">{order.paymentProof.transactionReference}</span></p>
                  )}
                  {order.paymentProof?.screenshotUrl && (
                    <div className="pt-2">
                      <span className="block text-[11px] font-bold text-stone-700 mb-1">Attached Payment Proof:</span>
                      <img 
                        src={order.paymentProof.screenshotUrl} 
                        alt="Payment Proof" 
                        className="max-h-32 object-contain border border-stone-200 rounded-xs bg-stone-50 p-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

