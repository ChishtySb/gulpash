import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, Truck, ArrowLeft, CheckCircle2, 
  MessageCircle, Printer, Tag, ShoppingBag, AlertCircle,
  Copy, Check, Upload, Image as ImageIcon, X, Clock,
  CreditCard, Smartphone, Building2, ChevronRight, Zap, Sparkles
} from 'lucide-react';
import { CartItem, CurrencyCode, Order, PaymentMethod, SiteSettings } from '../../types';
import { StorageService } from '../../lib/storage';
import { formatPrice } from '../../lib/currency';
import { NotificationService } from '../../lib/notifications';

interface CheckoutPageProps {
  items: CartItem[];
  currency: CurrencyCode;
  onClearCart: () => void;
  onNavigate: (view: string, param?: string) => void;
}

const PAKISTANI_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 
  'Hyderabad', 'Bahawalpur', 'Sargodha', 'Abbottabad', 'Sukkur', 
  'Larkana', 'Sheikhupura', 'Jhelum', 'Mardan', 'Kasur', 'Other City'
];

const PROVINCES = [
  'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 
  'Islamabad Capital Territory', 'Azad Jammu & Kashmir', 'Gilgit-Baltistan'
];

// Helper to compress uploaded images for reliable, fast local persistence
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  currency,
  onClearCart,
  onNavigate
}) => {
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());

  // Listen to live settings changes (e.g. from Admin in another tab or action)
  useEffect(() => {
    const handleSync = () => {
      setSettings(StorageService.getSettings());
    };
    window.addEventListener('gulpash_data_changed', handleSync);
    return () => window.removeEventListener('gulpash_data_changed', handleSync);
  }, []);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('Lahore');
  const [customCity, setCustomCity] = useState('');
  const [province, setProvince] = useState('Punjab');
  const [postalCode, setPostalCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Payment method and advance payment details
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery (COD)');
  const [transactionReference, setTransactionReference] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Coupon
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Placed order result state
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Post-order upload proof state on confirmation screen
  const [postTrxRef, setPostTrxRef] = useState('');
  const [postReceiptImg, setPostReceiptImg] = useState<string | null>(null);
  const [postUploadSuccess, setPostUploadSuccess] = useState(false);
  const [postUploading, setPostUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const postFileInputRef = useRef<HTMLInputElement>(null);

  // Derive payment gateway configurations
  const codEnabled = settings.payments?.cod?.enabled ?? settings.shipping.codEnabled ?? true;
  const jazzCashConfig = settings.payments?.jazzCash;
  const easypaisaConfig = settings.payments?.easypaisa;
  const bankTransferConfig = settings.payments?.bankTransfer;

  // Available payment methods list
  interface PaymentOption {
    id: PaymentMethod;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    tag?: string;
  }

  const paymentOptions: PaymentOption[] = [];
  if (codEnabled) {
    paymentOptions.push({
      id: 'Cash on Delivery (COD)',
      label: 'Cash on Delivery (COD)',
      sublabel: 'Pay cash to the courier rider upon delivery at your doorstep.',
      icon: Truck,
      tag: 'Doorstep Cash'
    });
  }
  if (jazzCashConfig?.enabled) {
    paymentOptions.push({
      id: 'JazzCash',
      label: 'JazzCash Mobile Account',
      sublabel: `Transfer directly to ${jazzCashConfig.accountNumber} (${jazzCashConfig.accountTitle}).`,
      icon: Smartphone,
      tag: 'Advance Payment'
    });
  }
  if (easypaisaConfig?.enabled) {
    paymentOptions.push({
      id: 'Easypaisa',
      label: 'Easypaisa Mobile Account',
      sublabel: `Transfer directly to ${easypaisaConfig.accountNumber} (${easypaisaConfig.accountTitle}).`,
      icon: Smartphone,
      tag: 'Advance Payment'
    });
  }
  if (bankTransferConfig?.enabled) {
    paymentOptions.push({
      id: 'Direct Bank Transfer',
      label: 'Direct Bank Transfer',
      sublabel: `Online transfer / ATM deposit to ${bankTransferConfig.bankName || 'Meezan Bank'}.`,
      icon: Building2,
      tag: 'Bank Transfer / IBAN'
    });
  }

  // Ensure current selection is valid
  useEffect(() => {
    if (paymentOptions.length > 0) {
      const isCurrentValid = paymentOptions.some(opt => opt.id === paymentMethod);
      if (!isCurrentValid) {
        setPaymentMethod(paymentOptions[0].id);
      }
    }
  }, [codEnabled, jazzCashConfig?.enabled, easypaisaConfig?.enabled, bankTransferConfig?.enabled]);

  // Copy helper
  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Receipt image file selection
  const handleReceiptFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingReceipt(true);
      const dataUrl = await compressImage(file);
      setReceiptImage(dataUrl);
    } catch (err) {
      console.error('Failed to process image', err);
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handlePostReceiptFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPostUploading(true);
      const dataUrl = await compressImage(file);
      setPostReceiptImg(dataUrl);
    } catch (err) {
      console.error('Failed to process image', err);
    } finally {
      setPostUploading(false);
    }
  };

  const handleSavePostProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placedOrder) return;
    setPostUploading(true);

    try {
      let finalScreenshotUrl = postReceiptImg || placedOrder.paymentProof?.screenshotUrl;
      if (postReceiptImg && postReceiptImg.startsWith('data:')) {
        try {
          finalScreenshotUrl = await StorageService.uploadPaymentProof(postReceiptImg);
        } catch (err) {
          console.error('Failed uploading proof to server:', err);
        }
      }

      const proof = {
        screenshotUrl: finalScreenshotUrl,
        transactionReference: postTrxRef.trim() || placedOrder.paymentProof?.transactionReference,
        submittedAt: new Date().toISOString()
      };
      StorageService.attachOrderPaymentProof(placedOrder.id, proof);
      setPlacedOrder({
        ...placedOrder,
        paymentProof: proof,
        paymentStatus: 'Under Verification',
        status: 'Payment Verification Pending',
        updatedAt: new Date().toISOString()
      });
      setPostUploadSuccess(true);
      setTimeout(() => setPostUploadSuccess(false), 4000);
    } finally {
      setPostUploading(false);
    }
  };

  // Calculations & Advance Payment Free Delivery (Req 35-44)
  const subtotal = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const standardFee = settings.shipping.standardFee || 250;
  const freeCodEnabled = settings.shipping.freeCodEnabled === true;
  const isFreeCodThreshold = freeCodEnabled && (subtotal >= (settings.shipping.freeShippingThreshold || 5000));
  
  const advanceOffer = settings.shipping?.advanceFreeDelivery;
  const eligibleAdvanceMethods = advanceOffer?.eligiblePaymentMethods || ['JazzCash', 'Easypaisa', 'Direct Bank Transfer'];
  const isAdvancePayment = paymentMethod !== 'Cash on Delivery (COD)';
  const minAdvanceAmount = advanceOffer?.minimumOrderAmount || 0;
  const isEligibleForAdvanceFree = (advanceOffer?.enabled !== false) && eligibleAdvanceMethods.includes(paymentMethod) && (subtotal >= minAdvanceAmount);

  let shippingFee = standardFee;
  let shippingDiscount = 0;
  let shippingDiscountReason: string | undefined = undefined;

  if (isEligibleForAdvanceFree) {
    shippingFee = 0;
    shippingDiscount = standardFee;
    shippingDiscountReason = 'FULL_ADVANCE_PAYMENT';
  } else if (isFreeCodThreshold) {
    shippingFee = 0;
    shippingDiscount = standardFee;
    shippingDiscountReason = 'FREE_SHIPPING_THRESHOLD';
  }

  const isFreeShipping = shippingFee === 0;
  const total = Math.max(0, subtotal + shippingFee - appliedDiscount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'WELCOME10') {
      const discount = Math.round(subtotal * 0.10);
      setAppliedDiscount(discount);
      setPromoMessage({ text: `Coupon applied! You saved 10% (Rs. ${discount})`, isError: false });
    } else if (clean === 'EID2026') {
      setAppliedDiscount(500);
      setPromoMessage({ text: 'Eid Celebration Voucher applied! Rs. 500 off', isError: false });
    } else {
      setPromoMessage({ text: 'Invalid coupon code. Try "WELCOME10"', isError: true });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `GP-${randomSuffix}`;
    const chosenCity = city === 'Other City' ? (customCity.trim() || 'Pakistan') : city;

    // Determine initial order status:
    // Advance payment methods start at 'Payment Verification Pending'
    // COD orders start at 'Pending'
    const status = isAdvancePayment ? 'Payment Verification Pending' : 'Pending';
    const paymentStatus = isAdvancePayment ? 'Under Verification' : 'Unpaid';

    let finalScreenshotUrl = receiptImage || undefined;
    if (finalScreenshotUrl && finalScreenshotUrl.startsWith('data:')) {
      try {
        finalScreenshotUrl = await StorageService.uploadPaymentProof(finalScreenshotUrl);
      } catch (err) {
        console.error('Failed uploading proof to server in checkout:', err);
      }
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customer: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        address: address.trim(),
        apartment: apartment.trim(),
        city: chosenCity,
        province,
        postalCode: postalCode.trim(),
        orderNotes: orderNotes.trim()
      },
      items: items.map(item => ({
        productId: item.productId,
        title: item.product.title,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        image: item.product.images[0] || '',
        sku: item.product.sku
      })),
      subtotal,
      shippingFee,
      shippingDiscount,
      shippingDiscountReason,
      discount: appliedDiscount,
      total,
      paymentMethod,
      paymentType: isAdvancePayment ? 'Full Advance' : 'Cash on Delivery',
      paymentStatus,
      status,
      paymentProof: isAdvancePayment ? {
        screenshotUrl: finalScreenshotUrl,
        transactionReference: transactionReference.trim() || undefined,
        submittedAt: new Date().toISOString()
      } : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to storage
    StorageService.saveOrder(newOrder);

    // Trigger in-app notification and browser chime
    NotificationService.notify({
      type: 'NEW_ORDER',
      title: `New Order Placed: #${newOrder.orderNumber}`,
      message: `${newOrder.customer.fullName} placed an order of ${formatPrice(newOrder.total, currency)} via ${newOrder.paymentMethod}.`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      orderTotal: newOrder.total,
      customerName: newOrder.customer.fullName,
      paymentMethod: newOrder.paymentMethod
    });

    onClearCart();
    setPlacedOrder(newOrder);
    setIsSubmitting(false);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (placedOrder) {
    const isPlacedAdvance = placedOrder.paymentMethod !== 'Cash on Delivery (COD)';
    const cleanPhone = (settings.whatsappNumber || '923218489999').replace(/\D/g, '');
    
    // WhatsApp message with ACTUAL order information (Requirement 13)
    const whatsappOrderMessage = isPlacedAdvance
      ? `Assalam o Alaikum GulPash Atelier,\n\nHere are my payment details for Order #${placedOrder.orderNumber}:\n• Customer Name: ${placedOrder.customer.fullName}\n• Contact Phone: ${placedOrder.customer.phone}\n• Total Amount: PKR ${placedOrder.total.toLocaleString()}\n• Payment Method: ${placedOrder.paymentMethod}\n• Transaction / Ref #: ${placedOrder.paymentProof?.transactionReference || transactionReference || 'Receipt screenshot attached'}\n• City: ${placedOrder.customer.city}\n\nPlease find my payment confirmation attached for verification and dispatch. Shukriya!`
      : `Assalam o Alaikum GulPash Atelier,\n\nI have placed Cash on Delivery Order #${placedOrder.orderNumber} for PKR ${placedOrder.total.toLocaleString()}.\n• Customer Name: ${placedOrder.customer.fullName}\n• Phone: ${placedOrder.customer.phone}\n• Destination: ${placedOrder.customer.address}, ${placedOrder.customer.city}\n\nPlease confirm dispatch! Shukriya.`;

    const whatsappOrderUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappOrderMessage)}`;

    return (
      <div className="max-w-3xl mx-auto px-4 py-16 font-sans">
        <div className="bg-white border border-stone-200 p-6 sm:p-10 text-center space-y-6 shadow-xs">
          
          <div className={`w-16 h-16 flex items-center justify-center mx-auto rounded-full ${
            isPlacedAdvance ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-stone-100 text-stone-800'
          }`}>
            {isPlacedAdvance ? (
              <Clock className="w-8 h-8 text-amber-700" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-emerald-700" />
            )}
          </div>

          <div>
            <span className={`text-[11px] uppercase font-bold tracking-[0.25em] px-3 py-1 rounded-xs inline-block ${
              placedOrder.status === 'Payment Action Required' || placedOrder.paymentStatus === 'Rejected'
                ? 'bg-rose-100 text-rose-900 border border-rose-300'
                : isPlacedAdvance 
                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                : 'bg-stone-100 text-stone-700'
            }`}>
              {placedOrder.status === 'Payment Action Required' || placedOrder.paymentStatus === 'Rejected'
                ? 'PAYMENT ACTION REQUIRED'
                : isPlacedAdvance ? 'PAYMENT VERIFICATION PENDING' : 'ORDER CONFIRMED'}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light italic text-[#1A1A1A] mt-3">
              Shukriya, {placedOrder.customer.fullName}
            </h1>
            <p className="text-xs text-stone-600 mt-2 max-w-lg mx-auto font-light leading-relaxed">
              {placedOrder.status === 'Payment Action Required' || placedOrder.paymentStatus === 'Rejected' ? (
                <>
                  Your order <strong>#{placedOrder.orderNumber}</strong> remains active. However, our accounts team noted: <em>&ldquo;{placedOrder.paymentProof?.rejectionReason || 'Transfer could not be verified'}&rdquo;</em>. Please provide an updated Transaction ID or replacement receipt below.
                </>
              ) : isPlacedAdvance ? (
                <>
                  Your order <strong>#{placedOrder.orderNumber}</strong> is reserved. Our concierge and accounts team will verify your transfer and mark the parcel <strong>Ready to Dispatch</strong>.
                </>
              ) : (
                <>
                  Your order <strong>#{placedOrder.orderNumber}</strong> has been received. Our team will verify your contact via SMS/call and dispatch within 24-48 hours.
                </>
              )}
            </p>
          </div>

          {/* Order Reference Box */}
          <div className="bg-[#FAF9F6] border border-stone-200 p-5 max-w-lg mx-auto text-left space-y-2.5 text-xs">
            <div className="flex justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500 font-medium">Order Number:</span>
              <strong className="text-sm font-mono text-stone-900">{placedOrder.orderNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Order Status:</span>
              <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200 font-mono text-[11px]">
                {placedOrder.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Payment Method:</span>
              <strong className="text-stone-800 font-medium">{placedOrder.paymentMethod}</strong>
            </div>
            {placedOrder.paymentProof?.transactionReference && (
              <div className="flex justify-between">
                <span className="text-stone-500">Transaction Ref / TID:</span>
                <span className="text-stone-900 font-mono font-bold">{placedOrder.paymentProof.transactionReference}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-stone-500">Delivery Destination:</span>
              <span className="text-stone-800 text-right max-w-[260px] truncate">{placedOrder.customer.address}, {placedOrder.customer.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Contact Phone:</span>
              <span className="text-stone-800 font-mono">{placedOrder.customer.phone}</span>
            </div>
            <div className="flex justify-between pt-2.5 border-t border-stone-200 text-sm font-medium">
              <span>Total Payable:</span>
              <span className="font-sans not-italic font-bold text-[#1A1A1A] price-display">{formatPrice(placedOrder.total, currency)}</span>
            </div>
          </div>

          {/* Uploaded Payment Proof Display (if submitted) */}
          {placedOrder.paymentProof?.screenshotUrl && (
            <div className="bg-white border border-stone-200 p-4 max-w-lg mx-auto text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                  Payment Screenshot Submitted
                </span>
                <span className="text-[10px] text-stone-500">
                  {new Date(placedOrder.paymentProof.submittedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="border border-stone-200 rounded overflow-hidden bg-stone-50 p-1 flex justify-center">
                <img 
                  src={placedOrder.paymentProof.screenshotUrl} 
                  alt="Payment Receipt" 
                  className="max-h-48 object-contain rounded-xs"
                />
              </div>
            </div>
          )}

          {/* Advance Payment Post-Order Proof Upload Box (if proof missing or customer wants to update) */}
          {isPlacedAdvance && (
            <div className="bg-stone-50 border border-stone-300 p-5 text-xs text-left max-w-lg mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  {placedOrder.paymentProof?.screenshotUrl ? 'Update Payment Receipt / TID' : 'Upload Payment Receipt Proof'}
                </h4>
                {postUploadSuccess && (
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
              </div>

              <p className="text-[11px] text-stone-600">
                To expedite verification, please provide your Transaction ID and transfer receipt screenshot below, or click the WhatsApp button to send it directly.
              </p>

              <form onSubmit={handleSavePostProof} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Transaction ID / Reference Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12-digit JazzCash TID, Easypaisa TRX, or Bank Ref #"
                    value={postTrxRef}
                    onChange={(e) => setPostTrxRef(e.target.value)}
                    className="w-full border border-stone-300 bg-white p-2 text-xs font-mono rounded-xs focus:outline-hidden focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Receipt / Transfer Screenshot
                  </label>
                  <input
                    ref={postFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePostReceiptFileChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => postFileInputRef.current?.click()}
                      className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-medium rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{postReceiptImg ? 'Change Screenshot' : 'Choose Receipt Image'}</span>
                    </button>
                    {postReceiptImg && (
                      <span className="text-[11px] text-emerald-700 font-medium">Image attached</span>
                    )}
                  </div>
                  {postReceiptImg && (
                    <div className="mt-2 relative inline-block border border-stone-300 p-1 bg-white">
                      <img src={postReceiptImg} alt="Preview" className="h-20 object-contain" />
                      <button
                        type="button"
                        onClick={() => setPostReceiptImg(null)}
                        className="absolute -top-2 -right-2 bg-stone-900 text-white p-0.5 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={postUploading || (!postTrxRef.trim() && !postReceiptImg)}
                  className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xs transition-colors cursor-pointer"
                >
                  {postUploading ? 'Saving Proof...' : 'Submit Payment Proof'}
                </button>
              </form>
            </div>
          )}

          {/* Action buttons (WhatsApp with ACTUAL order info - Requirement 13) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider py-3.5 px-6 flex items-center justify-center gap-2 rounded-xs transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isPlacedAdvance ? 'Send Payment Details via WhatsApp' : 'Confirm Order on WhatsApp'}</span>
            </a>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto bg-white border border-stone-300 hover:border-stone-900 text-stone-700 text-xs font-medium py-3.5 px-5 flex items-center justify-center gap-2 rounded-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Order Receipt</span>
            </button>

            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium uppercase tracking-wider py-3.5 px-6 rounded-xs cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>

        </div>
      </div>
    );
  }

  // EMPTY CHECKOUT REDIRECT
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center font-sans">
        <div className="w-16 h-16 bg-stone-100 flex items-center justify-center mx-auto text-stone-700 mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-light italic text-[#1A1A1A]">Your bag is currently empty</h2>
        <p className="text-xs text-stone-500 mt-1.5 mb-6 font-light">
          Please select your favorite lawn, pret or festive formals before proceeding to checkout.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium uppercase tracking-wider py-3 px-8 cursor-pointer"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] font-sans pb-24">
      
      {/* Header return */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-stone-200">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-black cursor-pointer font-medium uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Store</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: SHIPPING & BILLING DETAILS (7 COLS) */}
          <div className="lg:col-span-7">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
              
              {/* 1. Contact Information */}
              <div className="bg-white p-6 sm:p-7 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="font-serif text-xl font-light italic text-[#1A1A1A]">
                    1. Contact Information
                  </h3>
                  <span className="text-[11px] text-stone-400 font-light">Deliveries within Pakistan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fatima Tariq"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border border-stone-300 p-2.5 text-xs focus:outline-hidden focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-stone-300 p-2.5 text-xs focus:outline-hidden focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Phone Number (for Courier Dispatch) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0321 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-stone-300 p-2.5 text-xs focus:outline-hidden focus:border-stone-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="0321 1234567"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full border border-stone-300 p-2.5 text-xs focus:outline-hidden focus:border-stone-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="bg-white p-6 sm:p-7 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="font-serif text-xl font-light italic text-[#1A1A1A]">
                    2. Shipping Address
                  </h3>
                  <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1 uppercase tracking-wider">
                    <Truck className="w-3.5 h-3.5 text-stone-700" /> Doorstep Delivery
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Street Address / House / Plot # *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="House # 14, Street 5, Sector / Block..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-stone-300 p-2.5 text-xs focus:outline-hidden focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Apartment, Floor, Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Near Mini Market, 2nd Floor..."
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="w-full border border-stone-300 p-2.5 text-xs focus:outline-hidden focus:border-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        City *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border border-stone-300 p-2.5 text-xs bg-white focus:outline-hidden focus:border-stone-900"
                      >
                        {PAKISTANI_CITIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {city === 'Other City' && (
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Specify City Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your City"
                          value={customCity}
                          onChange={(e) => setCustomCity(e.target.value)}
                          className="w-full border border-stone-300 p-2.5 text-xs focus:outline-hidden focus:border-stone-900"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Province *
                      </label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full border border-stone-300 p-2.5 text-xs bg-white focus:outline-hidden focus:border-stone-900"
                      >
                        {PROVINCES.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 54000"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full border border-stone-300 p-2.5 text-xs focus:outline-hidden focus:border-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Special Delivery Instructions / Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Please deliver after 3 PM or call before arriving."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full border border-stone-300 p-2.5 text-xs focus:outline-hidden focus:border-stone-900"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method (Dynamically Reflects Enabled Methods - Req 5 & 6) */}
              <div className="bg-white p-6 sm:p-7 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="font-serif text-xl font-light italic text-[#1A1A1A]">
                    3. Payment Method
                  </h3>
                  <span className="text-[11px] text-stone-400 font-light">100% Safe & Secure</span>
                </div>

                {/* ADVANCE PAYMENT FREE DELIVERY INCENTIVE BANNER (Req 35-44) */}
                {advanceOffer?.enabled !== false && (
                  <div>
                    {isEligibleForAdvanceFree ? (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between gap-3 rounded-xs shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                          <div>
                            <span className="font-bold text-emerald-900 block text-xs">
                              FREE Nationwide Delivery Applied!
                            </span>
                            <span className="text-[11px] text-emerald-800">
                              You unlocked Rs. {standardFee} off shipping by choosing {paymentMethod}.
                            </span>
                          </div>
                        </div>
                        <span className="shrink-0 bg-emerald-800 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Saved Rs. {standardFee}
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3 rounded-xs">
                        <div className="flex items-center gap-2.5">
                          <Zap className="w-4 h-4 text-amber-700 shrink-0" />
                          <div>
                            <span className="font-bold text-amber-900 block text-xs">
                              Special Offer: 100% FREE Delivery Nationwide!
                            </span>
                            <span className="text-[11px] text-amber-800">
                              Pay in full via JazzCash, Easypaisa, or Direct Bank Transfer to waive the Rs. {standardFee} delivery fee.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* COD OFF Notice if Cash on Delivery is disabled */}
                {!codEnabled && (
                  <div className="p-3.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5 rounded-xs">
                    <AlertCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block">Cash on Delivery (COD) is currently disabled.</strong>
                      <span className="text-[11px] leading-relaxed">
                        To reserve and process your luxury ensemble, please select an advance payment method (JazzCash, Easypaisa, or Direct Bank Transfer) below.
                      </span>
                    </div>
                  </div>
                )}

                {paymentOptions.length === 0 ? (
                  <div className="p-4 bg-stone-50 border border-stone-300 text-center text-xs text-stone-600">
                    Online checkout is currently undergoing routine maintenance. Please contact our WhatsApp concierge at +{settings.whatsappNumber || '923218489999'} to place your order directly.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentOptions.map(option => {
                      const Icon = option.icon;
                      const isSelected = paymentMethod === option.id;
                      return (
                        <div key={option.id}>
                          <label className={`block border p-4 cursor-pointer transition-all rounded-xs ${
                            isSelected 
                              ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900' 
                              : 'border-stone-300 hover:border-stone-400'
                          }`}>
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="paymentMethod"
                                  value={option.id}
                                  checked={isSelected}
                                  onChange={() => setPaymentMethod(option.id)}
                                  className="accent-stone-900"
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4 text-stone-800" />
                                    <strong className="text-xs text-stone-900 block font-medium">{option.label}</strong>
                                  </div>
                                  <span className="text-[11px] text-stone-500 font-light block mt-0.5">
                                    {option.sublabel}
                                  </span>
                                </div>
                              </div>
                              {option.tag && (
                                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-stone-100 text-stone-700 rounded-xs">
                                  {option.tag}
                                </span>
                              )}
                            </div>
                          </label>

                          {/* ADVANCE PAYMENT WORKFLOW DETAILS & UPLOAD (Requirements 6, 7, 8) */}
                          {isSelected && option.id !== 'Cash on Delivery (COD)' && (
                            <div className="mt-2.5 p-4 bg-white border border-stone-300 rounded-xs space-y-4 animate-in fade-in">
                              
                              {/* Option-Specific Account Details Card */}
                              {option.id === 'JazzCash' && jazzCashConfig && (
                                <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xs text-xs space-y-2">
                                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                                    <span className="font-bold text-amber-950 uppercase tracking-wider text-[10px]">
                                      JazzCash Account Details
                                    </span>
                                    <span className="text-[10px] text-amber-800 font-mono">Mobile Account</span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-800">
                                    <div>
                                      <span className="text-stone-500 text-[10px] block">Account Title:</span>
                                      <strong className="font-semibold text-stone-900">{jazzCashConfig.accountTitle}</strong>
                                    </div>
                                    <div>
                                      <span className="text-stone-500 text-[10px] block">Account / Mobile Number:</span>
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-stone-900 text-sm">{jazzCashConfig.accountNumber}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleCopy(jazzCashConfig.accountNumber, 'jc-num')}
                                          className="text-stone-500 hover:text-stone-900 text-[10px] flex items-center gap-1 border border-stone-300 px-1.5 py-0.5 rounded cursor-pointer"
                                        >
                                          {copiedField === 'jc-num' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                          <span>{copiedField === 'jc-num' ? 'Copied' : 'Copy'}</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  {jazzCashConfig.instructions && (
                                    <p className="text-[11px] text-stone-600 pt-1 border-t border-amber-200/60 font-light">
                                      {jazzCashConfig.instructions}
                                    </p>
                                  )}
                                </div>
                              )}

                              {option.id === 'Easypaisa' && easypaisaConfig && (
                                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xs text-xs space-y-2">
                                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                                    <span className="font-bold text-emerald-950 uppercase tracking-wider text-[10px]">
                                      Easypaisa Account Details
                                    </span>
                                    <span className="text-[10px] text-emerald-800 font-mono">Mobile Account</span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-800">
                                    <div>
                                      <span className="text-stone-500 text-[10px] block">Account Title:</span>
                                      <strong className="font-semibold text-stone-900">{easypaisaConfig.accountTitle}</strong>
                                    </div>
                                    <div>
                                      <span className="text-stone-500 text-[10px] block">Account / Mobile Number:</span>
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-stone-900 text-sm">{easypaisaConfig.accountNumber}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleCopy(easypaisaConfig.accountNumber, 'ep-num')}
                                          className="text-stone-500 hover:text-stone-900 text-[10px] flex items-center gap-1 border border-stone-300 px-1.5 py-0.5 rounded cursor-pointer"
                                        >
                                          {copiedField === 'ep-num' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                          <span>{copiedField === 'ep-num' ? 'Copied' : 'Copy'}</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  {easypaisaConfig.instructions && (
                                    <p className="text-[11px] text-stone-600 pt-1 border-t border-emerald-200/60 font-light">
                                      {easypaisaConfig.instructions}
                                    </p>
                                  )}
                                </div>
                              )}

                              {option.id === 'Direct Bank Transfer' && bankTransferConfig && (
                                <div className="p-3.5 bg-stone-50 border border-stone-300 rounded-xs text-xs space-y-2">
                                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                                    <span className="font-bold text-stone-900 uppercase tracking-wider text-[10px]">
                                      {bankTransferConfig.bankName || 'Meezan Bank Ltd'}
                                    </span>
                                    {bankTransferConfig.branchName && (
                                      <span className="text-[10px] text-stone-500">{bankTransferConfig.branchName}</span>
                                    )}
                                  </div>
                                  <div className="space-y-1.5 text-stone-800">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                      <span className="text-stone-500 text-[10px]">Account Title:</span>
                                      <strong className="font-semibold text-stone-900">{bankTransferConfig.accountTitle}</strong>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                      <span className="text-stone-500 text-[10px]">Account Number:</span>
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-stone-900">{bankTransferConfig.accountNumber}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleCopy(bankTransferConfig.accountNumber, 'bt-acc')}
                                          className="text-stone-500 hover:text-stone-900 text-[10px] flex items-center gap-1 border border-stone-300 px-1.5 py-0.5 rounded cursor-pointer"
                                        >
                                          {copiedField === 'bt-acc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                          <span>{copiedField === 'bt-acc' ? 'Copied' : 'Copy'}</span>
                                        </button>
                                      </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                      <span className="text-stone-500 text-[10px]">IBAN:</span>
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-stone-900 text-[11px] break-all">{bankTransferConfig.iban}</span>
                                        <button
                                          type="button"
                                          onClick={() => handleCopy(bankTransferConfig.iban, 'bt-iban')}
                                          className="text-stone-500 hover:text-stone-900 text-[10px] flex items-center gap-1 border border-stone-300 px-1.5 py-0.5 rounded cursor-pointer shrink-0"
                                        >
                                          {copiedField === 'bt-iban' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                          <span>{copiedField === 'bt-iban' ? 'Copied' : 'Copy'}</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  {bankTransferConfig.instructions && (
                                    <p className="text-[11px] text-stone-600 pt-1 border-t border-stone-200 font-light">
                                      {bankTransferConfig.instructions}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Transaction Reference Number Input (Requirement 8) */}
                              <div>
                                <label className="block text-xs font-bold text-stone-800 mb-1">
                                  Transaction ID / Reference Number
                                </label>
                                <input
                                  type="text"
                                  placeholder={
                                    option.id === 'JazzCash' 
                                      ? 'Enter 12-digit JazzCash TID (e.g. 029384728192)' 
                                      : option.id === 'Easypaisa' 
                                      ? 'Enter Easypaisa TRX ID (e.g. 1928374650)' 
                                      : 'Enter Bank Transfer Reference # or Sender Account'
                                  }
                                  value={transactionReference}
                                  onChange={(e) => setTransactionReference(e.target.value)}
                                  className="w-full border border-stone-300 bg-white p-2.5 text-xs font-mono rounded-xs focus:outline-hidden focus:border-stone-900"
                                />
                                <span className="text-[10px] text-stone-500 mt-1 block">
                                  Enter the confirmation number received on your phone or banking app after transfer.
                                </span>
                              </div>

                              {/* Payment Screenshot / Receipt Upload (Requirement 7) */}
                              <div>
                                <label className="block text-xs font-bold text-stone-800 mb-1">
                                  Payment Screenshot / Transfer Receipt (Optional at checkout)
                                </label>
                                
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={handleReceiptFileChange}
                                  className="hidden"
                                />

                                {!receiptImage ? (
                                  <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-stone-300 hover:border-stone-600 bg-stone-50 p-4 text-center cursor-pointer rounded-xs transition-colors"
                                  >
                                    <Upload className="w-5 h-5 text-stone-500 mx-auto mb-1" />
                                    <p className="text-xs font-medium text-stone-800">
                                      {uploadingReceipt ? 'Processing Screenshot...' : 'Click to Upload Payment Screenshot'}
                                    </p>
                                    <p className="text-[10px] text-stone-500 mt-0.5">
                                      PNG, JPG or JPEG. You can also share the receipt via WhatsApp after placing the order.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="relative border border-stone-300 bg-stone-50 p-2 rounded-xs flex items-center gap-3">
                                    <img src={receiptImage} alt="Receipt preview" className="w-16 h-16 object-cover border border-stone-300 rounded-xs" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Screenshot Attached
                                      </p>
                                      <p className="text-[10px] text-stone-500 truncate">
                                        Receipt will be attached to your order for admin verification.
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setReceiptImage(null)}
                                      className="p-1.5 text-stone-400 hover:text-stone-900 border border-stone-300 hover:border-stone-900 rounded-xs"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>

                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Submit Order Button (Mobile / Desktop) */}
              <button
                type="submit"
                disabled={isSubmitting || paymentOptions.length === 0}
                className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-medium uppercase tracking-[0.25em] py-4 px-6 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Processing Order...' : `Complete Order • ${formatPrice(total, currency)}`}</span>
              </button>

            </form>
          </div>

          {/* RIGHT: ORDER SUMMARY (5 COLS) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 border border-stone-200 sticky top-28 space-y-5">
              <h3 className="font-serif text-xl font-light italic text-[#1A1A1A] border-b border-stone-200 pb-3">
                Order Summary ({items.reduce((acc, i) => acc + i.quantity, 0)} Items)
              </h3>

              {/* Product item previews */}
              <div className="max-h-72 overflow-y-auto divide-y divide-stone-200 pr-1">
                {items.map(item => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-14 h-18 object-cover border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <h4 className="font-medium text-stone-900 truncate">{item.product.title}</h4>
                      <div className="text-[11px] text-stone-500 mt-0.5 font-light">
                        Size: <span className="font-medium text-stone-800">{item.size}</span> &bull; Qty: {item.quantity}
                      </div>
                      <div className="mt-1 font-sans not-italic font-semibold text-stone-900 price-display">
                        {formatPrice(item.price * item.quantity, currency)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="pt-3 border-t border-stone-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Voucher (Try WELCOME10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 border border-stone-300 p-2 text-xs uppercase tracking-wider focus:outline-hidden focus:border-stone-900"
                  />
                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium uppercase tracking-wider px-3 py-2 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] mt-1.5 ${promoMessage.isError ? 'text-amber-800' : 'text-emerald-700 font-medium'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Subtotal Calculations */}
              <div className="space-y-2 pt-3 border-t border-stone-200 text-xs font-light">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-sans not-italic font-medium text-stone-900 price-display">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between items-start text-stone-600">
                  <div>
                    <span>Nationwide Shipping</span>
                    {isEligibleForAdvanceFree && (
                      <span className="block text-[10px] text-emerald-800 font-medium">
                        Full Advance Offer (-Rs. {standardFee})
                      </span>
                    )}
                  </div>
                  <span className="font-sans not-italic">
                    {isFreeShipping ? (
                      <span className="text-emerald-700 font-medium uppercase text-[11px] tracking-wider flex items-center gap-1.5 justify-end">
                        <span className="line-through text-stone-400 text-[10px] font-normal font-sans price-display">
                          {formatPrice(standardFee, currency)}
                        </span>
                        FREE
                      </span>
                    ) : (
                      formatPrice(shippingFee, currency)
                    )}
                  </span>
                </div>
                {!isAdvancePayment && advanceOffer?.enabled !== false && (
                  <div className="p-2 bg-amber-50/90 border border-amber-200 text-amber-900 text-[11px] rounded-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Pay via JazzCash/Bank to get <strong>FREE delivery</strong>!</span>
                  </div>
                )}
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium font-sans not-italic">
                    <span>Discount Coupon</span>
                    <span>- {formatPrice(appliedDiscount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-medium text-stone-900 pt-3 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="font-sans not-italic font-semibold text-lg text-[#1A1A1A] price-display">{formatPrice(total, currency)}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 text-[11px] text-stone-500 space-y-1 font-light">
                <p className="flex items-center gap-1.5 font-medium text-stone-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-700" /> Official GulPash Guarantee
                </p>
                <p>100% Original Pakistani Couture. 7-Day Exchange available upon receipt.</p>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
