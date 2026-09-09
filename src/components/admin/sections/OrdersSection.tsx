import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Filter, ExternalLink, Printer, 
  CheckCircle2, XCircle, Clock, Truck, CreditCard, 
  Smartphone, Building2, Eye, MessageCircle, AlertTriangle,
  ArrowRight, ShieldCheck, Download, Sparkles, X, ChevronRight
} from 'lucide-react';
import { Order, OrderStatus, SiteSettings } from '../../../types';
import { StorageService } from '../../../lib/storage';
import { formatPrice } from '../../../lib/currency';
import { NotificationService } from '../../../lib/notifications';

interface OrdersSectionProps {
  orders: Order[];
  settings: SiteSettings;
  subview: 'all' | 'proof_verification' | 'pending_advance' | 'confirmed' | 'dispatched' | 'delivered' | 'returns';
  selectedOrder: Order | null;
  onSelectOrder: (order: Order | null) => void;
  onNavigateSub: (sub: 'all' | 'proof_verification' | 'pending_advance' | 'confirmed' | 'dispatched' | 'delivered' | 'returns') => void;
  onNotify: (msg: string) => void;
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  settings,
  subview,
  selectedOrder,
  onSelectOrder,
  onNavigateSub,
  onNotify
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [proofModalImage, setProofModalImage] = useState<string | null>(null);
  const [rejectionModalOrder, setRejectionModalOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Amount or Transaction ID could not be verified.');
  const [courierInput, setCourierInput] = useState('');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  // Filter orders by subview
  const filteredOrders = orders.filter(order => {
    // Search matching
    const matchSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery) ||
      order.customer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.paymentProof?.transactionReference?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    if (subview === 'proof_verification') {
      return (
        order.status === 'Payment Verification Pending' || 
        (order.paymentProof && order.paymentStatus === 'Under Verification')
      );
    }
    if (subview === 'pending_advance') {
      return (
        order.paymentMethod !== 'Cash on Delivery (COD)' &&
        (order.status === 'Pending' || order.status === 'Payment Verification Pending' || order.paymentStatus === 'Unpaid')
      );
    }
    if (subview === 'confirmed') {
      return order.status === 'Confirmed' || order.status === 'In Production';
    }
    if (subview === 'dispatched') {
      return order.status === 'Dispatched';
    }
    if (subview === 'delivered') {
      return order.status === 'Delivered';
    }
    if (subview === 'returns') {
      return order.status === 'Exchange Requested' || order.status === 'Cancelled';
    }
    return true;
  });

  // Approve payment proof
  const handleApproveProof = (order: Order) => {
    const updated: Order = {
      ...order,
      paymentStatus: 'Paid',
      status: 'Confirmed',
      paymentProof: order.paymentProof ? {
        ...order.paymentProof,
        verifiedAt: new Date().toISOString(),
        verifiedBy: 'Admin'
      } : undefined,
      updatedAt: new Date().toISOString()
    };

    StorageService.saveOrder(updated);
    onSelectOrder(updated);
    onNotify(`Order #${order.orderNumber} payment approved and confirmed!`);
  };

  // Reject payment proof
  const handleRejectProof = () => {
    if (!rejectionModalOrder) return;
    const updated: Order = {
      ...rejectionModalOrder,
      paymentStatus: 'Failed',
      status: 'Payment Verification Pending',
      paymentProof: rejectionModalOrder.paymentProof ? {
        ...rejectionModalOrder.paymentProof,
        rejectionReason: rejectionReason.trim(),
        verifiedAt: new Date().toISOString(),
        verifiedBy: 'Admin'
      } : undefined,
      updatedAt: new Date().toISOString()
    };

    StorageService.saveOrder(updated);
    if (selectedOrder?.id === rejectionModalOrder.id) {
      onSelectOrder(updated);
    }
    onNotify(`Payment proof for #${rejectionModalOrder.orderNumber} marked as rejected.`);
    setRejectionModalOrder(null);
  };

  // Update order status
  const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
    const updated: Order = {
      ...order,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };
    StorageService.saveOrder(updated);
    onSelectOrder(updated);
    onNotify(`Order #${order.orderNumber} status changed to ${newStatus}.`);
  };

  // Update courier info
  const handleSaveCourier = (order: Order) => {
    const updated: Order = {
      ...order,
      trackingNumber: trackingNumberInput.trim() || order.trackingNumber,
      carrier: courierInput.trim() || order.carrier,
      updatedAt: new Date().toISOString()
    };
    StorageService.saveOrder(updated);
    onSelectOrder(updated);
    onNotify(`Courier tracking details saved for #${order.orderNumber}!`);
  };

  // Direct WhatsApp link
  const getWhatsAppLink = (phone: string, orderNumber: string) => {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '92' + clean.slice(1);
    const msg = encodeURIComponent(`Assalam-o-Alaikum! We are contacting you from GulPash regarding your order #${orderNumber}.`);
    return `https://wa.me/${clean}?text=${msg}`;
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-stone-200 pb-2 text-xs">
        <button
          type="button"
          onClick={() => onNavigateSub('all')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
            subview === 'all' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          All Orders ({orders.length})
        </button>
        <button
          type="button"
          onClick={() => onNavigateSub('proof_verification')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            subview === 'proof_verification' ? 'bg-amber-800 text-white' : 'text-amber-800 hover:bg-amber-50'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Proof Verification</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateSub('pending_advance')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
            subview === 'pending_advance' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Pending Advance
        </button>
        <button
          type="button"
          onClick={() => onNavigateSub('confirmed')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
            subview === 'confirmed' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Confirmed & Production
        </button>
        <button
          type="button"
          onClick={() => onNavigateSub('dispatched')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
            subview === 'dispatched' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Dispatched
        </button>
        <button
          type="button"
          onClick={() => onNavigateSub('delivered')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
            subview === 'delivered' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Delivered
        </button>
        <button
          type="button"
          onClick={() => onNavigateSub('returns')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
            subview === 'returns' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Returns & Cancelled
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 border border-stone-200 rounded-lg flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by order # (GP-...), customer name, phone number, city, or transaction reference..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs border-none focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-stone-400 hover:text-stone-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* Main Content Area (Orders List + Order Detail Drawer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Orders List Table / Cards (7 cols on desktop if an order is selected, else 12) */}
        <div className={selectedOrder ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-stone-400 text-xs">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-stone-300 stroke-1" />
                <p>No orders found matching the filter criteria.</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {filteredOrders.map((order) => {
                  const isAdvance = order.paymentMethod !== 'Cash on Delivery (COD)';
                  const isSelected = selectedOrder?.id === order.id;
                  const hasProof = !!order.paymentProof?.screenshotUrl;
                  const isProofPending = order.status === 'Payment Verification Pending' || (hasProof && order.paymentStatus === 'Under Verification');

                  return (
                    <div
                      key={order.id}
                      onClick={() => onSelectOrder(order)}
                      className={`p-4 transition-colors cursor-pointer ${
                        isSelected ? 'bg-amber-50/50 border-l-4 border-amber-600' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          {/* Order number & customer name */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-stone-900">
                              #{order.orderNumber}
                            </span>
                            <span className="text-xs font-medium text-stone-800">
                              {order.customer.fullName}
                            </span>
                            <span className="text-[11px] text-stone-400">
                              &bull; {order.customer.city}
                            </span>
                          </div>

                          {/* Items preview */}
                          <div className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                            {order.items.map(i => `${i.quantity}x ${i.title} (${i.size})`).join(', ')}
                          </div>

                          {/* Badges: Advance Free Delivery vs Standard Shipping */}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {isAdvance ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">
                                <Sparkles className="w-3 h-3 text-emerald-600" />
                                <span>Advance Payment: Free Delivery Applied (Saved Rs. 250)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 bg-stone-100 text-stone-700 rounded">
                                <Truck className="w-3 h-3 text-stone-500" />
                                <span>COD: Standard Shipping (Rs. {order.shippingFee || 250})</span>
                              </span>
                            )}

                            {hasProof && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                isProofPending ? 'bg-amber-100 text-amber-900 animate-pulse' : 'bg-stone-100 text-stone-700'
                              }`}>
                                Proof Attached
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price & Status */}
                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-xs text-stone-900">
                            {formatPrice(order.total, 'PKR')}
                          </div>
                          <div className="text-[10px] text-stone-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>

                          <div className="mt-1.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                              order.status === 'Dispatched' ? 'bg-indigo-50 text-indigo-700' :
                              order.status === 'Confirmed' ? 'bg-blue-50 text-blue-700' :
                              order.status === 'Payment Verification Pending' ? 'bg-amber-100 text-amber-900 font-bold' :
                              order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' :
                              'bg-stone-100 text-stone-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Detail Drawer (5 cols on desktop) */}
        {selectedOrder && (
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-5 sticky top-24">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">
                    Order Details
                  </span>
                  <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                    <span>#{selectedOrder.orderNumber}</span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectOrder(null)}
                  className="p-1 text-stone-400 hover:text-stone-900 rounded hover:bg-stone-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Stepper / Quick Updater */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Order Status Workflow
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder, e.target.value as OrderStatus)}
                  className="w-full p-2 text-xs border border-stone-300 rounded bg-white font-medium focus:outline-none focus:border-stone-900"
                >
                  <option value="Pending">Pending (Awaiting Confirmation)</option>
                  <option value="Payment Verification Pending">Payment Verification Pending</option>
                  <option value="Confirmed">Confirmed (Ready for Tailoring/Packing)</option>
                  <option value="In Production">In Production (Handcrafted At Studio)</option>
                  <option value="Dispatched">Dispatched (Handed Over to Courier)</option>
                  <option value="Delivered">Delivered (Successfully Received)</option>
                  <option value="Exchange Requested">Exchange Requested</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Payment Proof Verification Card */}
              {selectedOrder.paymentMethod !== 'Cash on Delivery (COD)' && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-300 rounded text-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950">
                      <CreditCard className="w-4 h-4 text-amber-700" />
                      <span>{selectedOrder.paymentMethod} Verification</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      selectedOrder.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                      selectedOrder.paymentStatus === 'Failed' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-200 text-amber-900'
                    }`}>
                      {selectedOrder.paymentStatus || 'Under Verification'}
                    </span>
                  </div>

                  {selectedOrder.paymentProof?.transactionReference && (
                    <div className="text-[11px]">
                      <span className="text-stone-500">Transaction TID / Reference: </span>
                      <strong className="font-mono text-stone-900">{selectedOrder.paymentProof.transactionReference}</strong>
                    </div>
                  )}

                  {/* Proof Screenshot */}
                  {selectedOrder.paymentProof?.screenshotUrl ? (
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-1">Transfer Screenshot:</span>
                      <img
                        src={selectedOrder.paymentProof.screenshotUrl}
                        alt="Payment Receipt"
                        onClick={() => setProofModalImage(selectedOrder.paymentProof?.screenshotUrl || null)}
                        className="w-full h-32 object-cover border border-amber-300 rounded cursor-pointer hover:opacity-90 transition-opacity"
                      />
                      <span className="text-[10px] text-stone-400 block mt-0.5">Click image to expand full size</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-stone-500 italic">
                      Customer has not attached a screenshot receipt yet.
                    </p>
                  )}

                  {/* Approve / Reject Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleApproveProof(selectedOrder)}
                      className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Proof</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectionModalOrder(selectedOrder)}
                      className="py-1.5 px-3 border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 rounded font-bold text-[11px]"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Customer Info Card */}
              <div className="space-y-2 text-xs border border-stone-200 rounded p-3 bg-stone-50">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900">Customer & Shipping Address</h4>
                  <a
                    href={getWhatsAppLink(selectedOrder.customer.phone, selectedOrder.orderNumber)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div className="space-y-1 text-stone-600 text-[11px]">
                  <p><strong className="text-stone-800">Name:</strong> {selectedOrder.customer.fullName}</p>
                  <p><strong className="text-stone-800">Phone:</strong> {selectedOrder.customer.phone}</p>
                  {selectedOrder.customer.email && (
                    <p><strong className="text-stone-800">Email:</strong> {selectedOrder.customer.email}</p>
                  )}
                  <p><strong className="text-stone-800">Address:</strong> {selectedOrder.customer.address}, {selectedOrder.customer.city}</p>
                  {selectedOrder.customer.orderNotes && (
                    <div className="p-2 bg-amber-50/60 border border-amber-200 rounded text-amber-900 text-[11px] mt-2">
                      <strong>Customer Note:</strong> {selectedOrder.customer.orderNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Ordered List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Purchased Items ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-9 h-12 object-cover rounded border border-stone-200 shrink-0"
                          />
                        )}
                        <div className="truncate">
                          <h5 className="font-medium text-stone-900 truncate">{item.title}</h5>
                          <span className="text-[10px] text-stone-500">
                            Size: {item.size} &bull; Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-medium text-stone-900 shrink-0">
                        {formatPrice(item.price * item.quantity, 'PKR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Breakdown */}
              <div className="pt-2 border-t border-stone-200 text-xs space-y-1.5 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-stone-900">{formatPrice(selectedOrder.subtotal, 'PKR')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping:</span>
                  {selectedOrder.shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[10px]">
                      FREE (Advance Offer)
                    </span>
                  ) : (
                    <span className="font-mono text-stone-900">{formatPrice(selectedOrder.shippingFee, 'PKR')}</span>
                  )}
                </div>
                <div className="flex justify-between font-bold text-sm text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total:</span>
                  <span className="font-mono">{formatPrice(selectedOrder.total, 'PKR')}</span>
                </div>
              </div>

              {/* Courier Tracking Dispatch Form */}
              <div className="pt-3 border-t border-stone-200 space-y-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-600" />
                  <span>Courier & Tracking</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Carrier (TCS / Trax / Leopards)"
                    defaultValue={selectedOrder.carrier || ''}
                    onChange={(e) => setCourierInput(e.target.value)}
                    className="p-2 border border-stone-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Tracking Tracking #"
                    defaultValue={selectedOrder.trackingNumber || ''}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    className="p-2 border border-stone-300 rounded font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveCourier(selectedOrder)}
                  className="w-full py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium uppercase tracking-wider cursor-pointer"
                >
                  Update Tracking Number
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Proof Image Zoom Modal */}
      {proofModalImage && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase">Transfer Screenshot Zoom</h4>
              <button
                type="button"
                onClick={() => setProofModalImage(null)}
                className="text-stone-400 hover:text-stone-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto flex items-center justify-center">
              <img
                src={proofModalImage}
                alt="Zoomed Payment Receipt"
                className="max-w-full h-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Rejection Prompt Modal */}
      {rejectionModalOrder && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-lg max-w-md w-full p-5 space-y-4">
            <h4 className="text-sm font-bold text-stone-900">Reject Payment Proof</h4>
            <p className="text-xs text-stone-500">
              Provide a reason so the customer can be guided on WhatsApp or upon order status lookup.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-300 rounded focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectionModalOrder(null)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectProof}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-medium rounded"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
