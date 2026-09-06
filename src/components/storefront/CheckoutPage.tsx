import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, Truck, ArrowLeft, CheckCircle2, 
  MessageCircle, Printer, Tag, ShoppingBag, AlertCircle
} from 'lucide-react';
import { CartItem, CurrencyCode, Order, PaymentMethod } from '../../types';
import { StorageService } from '../../lib/storage';
import { formatPrice } from '../../lib/currency';

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

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  currency,
  onClearCart,
  onNavigate
}) => {
  const settings = StorageService.getSettings();

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery (COD)');
  
  // Coupon
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Placed order result state
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const subtotal = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const isFreeShipping = subtotal >= (settings.shipping.freeShippingThreshold || 5000);
  const shippingFee = isFreeShipping ? 0 : (settings.shipping.standardFee || 250);
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

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `GP-${randomSuffix}`;
    const chosenCity = city === 'Other City' ? (customCity.trim() || 'Pakistan') : city;

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
      discount: appliedDiscount,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'Direct Bank Transfer' ? 'Unpaid' : 'Unpaid',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to storage
    StorageService.saveOrder(newOrder);
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
    const whatsappOrderUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
      `Assalam o Alaikum GulPash, I have placed order #${placedOrder.orderNumber} for Rs. ${placedOrder.total} (${placedOrder.customer.fullName}, ${placedOrder.customer.city}). Please confirm dispatch!`
    )}`;

    return (
      <div className="max-w-3xl mx-auto px-4 py-16 font-sans">
        <div className="bg-white border border-stone-200 p-6 sm:p-10 text-center space-y-6">
          
          <div className="w-16 h-16 bg-stone-100 text-stone-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-medium tracking-[0.3em] text-stone-500 block">
              ORDER CONFIRMED
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light italic text-[#1A1A1A] mt-1">
              Shukriya, {placedOrder.customer.fullName}
            </h1>
            <p className="text-xs text-stone-500 mt-2 max-w-md mx-auto font-light">
              Your GulPash order has been received. Our team will verify your address via SMS/call and dispatch within 24-48 hours.
            </p>
          </div>

          {/* Order Reference Box */}
          <div className="bg-stone-50 border border-stone-200 p-4 max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500">Order Number:</span>
              <strong className="text-sm font-mono text-stone-900">{placedOrder.orderNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Payment Method:</span>
              <strong className="text-stone-800 font-medium">{placedOrder.paymentMethod}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Delivery Destination:</span>
              <span className="text-stone-800">{placedOrder.customer.address}, {placedOrder.customer.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Contact Phone:</span>
              <span className="text-stone-800 font-mono">{placedOrder.customer.phone}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-medium">
              <span>Total Payable:</span>
              <span className="font-serif italic font-semibold text-[#1A1A1A]">{formatPrice(placedOrder.total, currency)}</span>
            </div>
          </div>

          {/* Bank details if Bank Transfer chosen */}
          {placedOrder.paymentMethod === 'Direct Bank Transfer' && (
            <div className="bg-stone-50 border border-stone-300 text-stone-800 p-4 text-xs text-left max-w-md mx-auto space-y-2">
              <h4 className="font-medium flex items-center gap-1.5 text-stone-900">
                <AlertCircle className="w-4 h-4 text-stone-700" /> Bank Transfer Details
              </h4>
              <p className="whitespace-pre-line text-[11px] leading-relaxed font-mono">
                {settings.shipping.bankDetails || 'Meezan Bank Ltd\nTitle: GulPash Luxury Apparel\nIBAN: PK45MEZN0001892019283746'}
              </p>
              <p className="text-[11px] font-medium text-stone-700">
                Please send your payment screenshot to WhatsApp: +92 321 8489999.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-medium uppercase tracking-wider py-3 px-6 flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Confirm on WhatsApp</span>
            </a>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto bg-white border border-stone-300 hover:border-stone-900 text-stone-700 text-xs font-medium py-3 px-5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Order Receipt</span>
            </button>

            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium uppercase tracking-wider py-3 px-6 cursor-pointer"
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

              {/* 3. Payment Method */}
              <div className="bg-white p-6 sm:p-7 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="font-serif text-xl font-light italic text-[#1A1A1A]">
                    3. Payment Method
                  </h3>
                  <span className="text-[11px] text-stone-400 font-light">100% Safe & Secure</span>
                </div>

                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label className={`block border p-4 cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery (COD)' 
                      ? 'border-stone-900 bg-stone-50' 
                      : 'border-stone-300 hover:border-stone-400'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery (COD)"
                        checked={paymentMethod === 'Cash on Delivery (COD)'}
                        onChange={() => setPaymentMethod('Cash on Delivery (COD)')}
                        className="accent-stone-900"
                      />
                      <div>
                        <strong className="text-xs text-stone-900 block font-medium">Cash on Delivery (COD)</strong>
                        <span className="text-[11px] text-stone-500 font-light">
                          Pay cash to the TCS or Leopards courier rider when your luxury parcel arrives at your doorstep.
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Direct Bank Transfer */}
                  <label className={`block border p-4 cursor-pointer transition-all ${
                    paymentMethod === 'Direct Bank Transfer' 
                      ? 'border-stone-900 bg-stone-50' 
                      : 'border-stone-300 hover:border-stone-400'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Direct Bank Transfer"
                        checked={paymentMethod === 'Direct Bank Transfer'}
                        onChange={() => setPaymentMethod('Direct Bank Transfer')}
                        className="accent-stone-900"
                      />
                      <div>
                        <strong className="text-xs text-stone-900 block font-medium">Direct Bank Transfer (Meezan / HBL / EasyPaisa)</strong>
                        <span className="text-[11px] text-stone-500 font-light">
                          Transfer directly into our corporate Meezan Bank account and share screenshot via WhatsApp.
                        </span>
                      </div>
                    </div>

                    {paymentMethod === 'Direct Bank Transfer' && (
                      <div className="mt-3 p-3 bg-white border border-stone-200 text-xs text-stone-600 space-y-1 font-light">
                        <p className="font-medium text-stone-900">Account Details:</p>
                        <p className="whitespace-pre-line font-mono text-[11px]">
                          {settings.shipping.bankDetails || 'Bank: Meezan Bank Ltd\nTitle: GulPash Luxury Apparel\nIBAN: PK45MEZN0001892019283746\nBranch: Gulberg Lahore'}
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Submit Order Button (Mobile / Desktop) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium uppercase tracking-[0.25em] py-4 px-6 transition-all cursor-pointer flex items-center justify-center gap-2"
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
                      <div className="mt-1 font-serif italic font-semibold text-stone-900">
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
                  <span className="font-serif italic font-medium text-stone-900">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Nationwide Shipping</span>
                  <span>
                    {isFreeShipping ? (
                      <span className="text-emerald-700 font-medium uppercase text-[11px] tracking-wider">FREE</span>
                    ) : (
                      formatPrice(shippingFee, currency)
                    )}
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount Coupon</span>
                    <span>- {formatPrice(appliedDiscount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-medium text-stone-900 pt-3 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="font-serif italic font-semibold text-lg text-[#1A1A1A]">{formatPrice(total, currency)}</span>
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
