import React, { useState } from 'react';
import { 
  Users, Search, MessageCircle, ShoppingBag, 
  DollarSign, TrendingUp, Sparkles, ExternalLink 
} from 'lucide-react';
import { Order } from '../../../types';
import { formatPrice } from '../../../lib/currency';

interface CustomersSectionProps {
  orders: Order[];
  subview: 'all' | 'repeat' | 'high_value';
  onNavigateSub: (sub: 'all' | 'repeat' | 'high_value') => void;
  onSelectOrder?: (orderId: string) => void;
  onNotify: (msg: string) => void;
}

interface CustomerSummary {
  phone: string;
  fullName: string;
  email?: string;
  city: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
  orderIds: string[];
}

export const CustomersSection: React.FC<CustomersSectionProps> = ({
  orders,
  subview,
  onNavigateSub,
  onNotify
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Aggregate customers from orders
  const customerMap = new Map<string, CustomerSummary>();

  orders.forEach(order => {
    const key = order.customer.phone.replace(/\D/g, '') || order.customer.fullName.toLowerCase();
    const existing = customerMap.get(key);

    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += (order.total || 0);
      existing.orderIds.push(order.orderNumber);
      if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = order.createdAt;
        existing.city = order.customer.city || existing.city;
      }
    } else {
      customerMap.set(key, {
        phone: order.customer.phone,
        fullName: order.customer.fullName,
        email: order.customer.email,
        city: order.customer.city,
        orderCount: 1,
        totalSpent: order.total || 0,
        lastOrderDate: order.createdAt,
        orderIds: [order.orderNumber]
      });
    }
  });

  const allCustomers = Array.from(customerMap.values());

  // Filter based on subview and search
  const filteredCustomers = allCustomers.filter(cust => {
    const matchSearch = 
      cust.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.phone.includes(searchQuery) ||
      cust.city.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    if (subview === 'repeat') {
      return cust.orderCount >= 2;
    }
    if (subview === 'high_value') {
      return cust.totalSpent >= 40000;
    }
    return true;
  });

  // Direct WhatsApp helper
  const getWhatsAppLink = (phone: string, name: string) => {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '92' + clean.slice(1);
    const msg = encodeURIComponent(`Assalam-o-Alaikum ${name}! Thank you for shopping with GulPash. How may we assist you with our latest collections?`);
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
          Customer Directory ({allCustomers.length})
        </button>
        <button
          type="button"
          onClick={() => onNavigateSub('repeat')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            subview === 'repeat' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Repeat Patrons ({allCustomers.filter(c => c.orderCount >= 2).length})</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigateSub('high_value')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            subview === 'high_value' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>High-Value VIPs (Rs. 40k+)</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 border border-stone-200 rounded-lg flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by customer name, phone number, or city..."
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

      {/* Customers Table */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs">
            <Users className="w-8 h-8 mx-auto mb-2 text-stone-300 stroke-1" />
            <p>No customer profiles found for this selection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 border-b border-stone-200 text-[10px] uppercase font-bold tracking-wider text-stone-500">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Phone & City</th>
                  <th className="p-3">Total Orders</th>
                  <th className="p-3">Lifetime Spend</th>
                  <th className="p-3">Avg Order Value</th>
                  <th className="p-3">Last Active</th>
                  <th className="p-3 text-right">Quick WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCustomers.map((cust, idx) => {
                  const aov = Math.round(cust.totalSpent / cust.orderCount);
                  const isVip = cust.totalSpent >= 40000;
                  const isRepeat = cust.orderCount >= 2;

                  return (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="p-3">
                        <div className="font-bold text-stone-900 flex items-center gap-1.5">
                          <span>{cust.fullName}</span>
                          {isVip && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-mono font-bold">
                              VIP
                            </span>
                          )}
                        </div>
                        {cust.email && (
                          <div className="text-[11px] text-stone-400">{cust.email}</div>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="font-mono text-stone-800">{cust.phone}</div>
                        <div className="text-[11px] text-stone-400">{cust.city}</div>
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                          isRepeat ? 'bg-emerald-50 text-emerald-800 font-bold' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {cust.orderCount} {cust.orderCount === 1 ? 'order' : 'orders'}
                        </span>
                      </td>

                      <td className="p-3 font-mono font-bold text-stone-900">
                        {formatPrice(cust.totalSpent, 'PKR')}
                      </td>

                      <td className="p-3 font-mono text-stone-600">
                        {formatPrice(aov, 'PKR')}
                      </td>

                      <td className="p-3 text-[11px] text-stone-500">
                        {new Date(cust.lastOrderDate).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      <td className="p-3 text-right">
                        <a
                          href={getWhatsAppLink(cust.phone, cust.fullName)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded hover:bg-emerald-100 text-xs font-medium"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Chat</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
