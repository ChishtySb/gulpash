import React, { useState, useEffect } from 'react';
import { 
  Instagram, Facebook, Youtube, Send, 
  MapPin, Phone, Mail, Clock, ShieldCheck, Truck, RefreshCw, CheckCircle2 
} from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { SiteSettings } from '../../types';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenTrackOrder: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTrackOrder }) => {
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setSettings(StorageService.getSettings());
    window.addEventListener('gulpash_data_changed', handleUpdate);
    return () => window.removeEventListener('gulpash_data_changed', handleUpdate);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const categories = StorageService.getCategories();

  return (
    <footer className="bg-[#1A1A1A] text-stone-300 border-t border-stone-800 pt-16 pb-12 font-sans">
      {/* 1. VALUE PROPOSITIONS BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-stone-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-stone-300">
              <Truck className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-widest font-medium">Nationwide Delivery</h4>
              <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                Fast dispatch via TCS & Leopards to all cities across Pakistan. Free above Rs. 5,000.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-stone-300">
              <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-widest font-medium">Cash on Delivery</h4>
              <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                Pay conveniently at your doorstep or via direct Meezan/HBL bank transfer.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-stone-300">
              <RefreshCw className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-widest font-medium">7-Day Hassle-Free Exchange</h4>
              <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                Simple exchange process if you need size or design assistance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 text-stone-300">
              <Clock className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-white text-xs uppercase tracking-widest font-medium">Dedicated WhatsApp Concierge</h4>
              <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                Instant styling advice, custom stitch inquiries, and order tracking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="font-serif text-3xl font-light italic tracking-[0.2em] text-white uppercase">
                {settings.brandName || 'GULPASH'}
              </span>
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-400 mt-1 font-medium">
                LUXURY PAKISTANI FASHION
              </p>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm pt-2 font-light">
              GulPash celebrates the sovereign grandeur of Pakistani craftsmanship. From pure lawn with ethereal chiffon dupattas to hand-embellished raw silk pret, every silhouette is an ode to timeless royal elegance.
            </p>

            <div className="pt-2 space-y-2 text-xs text-stone-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Support: {settings.supportPhone} (Mon - Sat, 10am - 8pm PKT)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </p>
            </div>

            {/* Social Links (only configured ones show) */}
            <div className="pt-4 flex items-center gap-3">
              {settings.socialLinks.instagram && (
                <a 
                  href={settings.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.facebook && (
                <a 
                  href={settings.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.youtube && (
                <a 
                  href={settings.socialLinks.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.2em] mb-4 font-medium">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => onNavigate('category', cat.slug)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button 
                  onClick={() => onNavigate('shop')}
                  className="hover:text-white transition-colors text-stone-300 font-medium"
                >
                  &rarr; View All Designs
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.2em] mb-4 font-medium">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button 
                  id="footer-track-order-btn"
                  onClick={onOpenTrackOrder}
                  className="hover:text-white transition-colors font-medium text-stone-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-stone-400" /> Track Your Order
                </button>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Ordering Help
                </a>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('shipping-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shipping & Dispatch Time
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('exchange-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  7-Day Exchange Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('privacy-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy & Terms
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('admin')}
                  className="hover:text-white transition-colors text-stone-500 cursor-pointer"
                >
                  Staff / Admin Login
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.2em] mb-4 font-medium">
              Private Salon VIP
            </h4>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed font-light">
              Subscribe to receive early VIP access to lawn drops, festive previews, and exclusive offers.
            </p>
            {subscribed ? (
              <div className="bg-stone-900 text-stone-200 text-xs p-3 border border-stone-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Thank you! You are on the GulPash VIP list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-stone-900 border border-stone-800 text-white placeholder-stone-500 text-xs px-3 py-2.5 focus:outline-hidden focus:border-stone-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-stone-100 hover:bg-white text-stone-900 transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-stone-500 block">
                  We respect your privacy. Unsubscribe anytime.
                </span>
              </form>
            )}

            {/* Payment badges */}
            <div className="pt-6">
              <span className="text-[10px] uppercase tracking-widest text-stone-500 block mb-2 font-medium">
                Payment Options
              </span>
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-stone-400">
                <span className="bg-stone-900 border border-stone-800 px-2 py-1 font-medium text-stone-200">
                  Cash on Delivery
                </span>
                <span className="bg-stone-900 border border-stone-800 px-2 py-1">
                  Meezan Bank
                </span>
                <span className="bg-stone-900 border border-stone-800 px-2 py-1">
                  HBL
                </span>
                <span className="bg-stone-900 border border-stone-800 px-2 py-1">
                  Visa / Mastercard
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. COPYRIGHT & DOMAIN NOTICE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
        <p>
          &copy; {new Date().getFullYear()} GulPash (<a href="https://gulpash.pk" className="text-stone-300 hover:underline">gulpash.pk</a>). All rights reserved. Crafted with authentic Pakistani couture heritage.
        </p>
        <p className="mt-2 sm:mt-0 text-[11px] text-stone-500">
          Production Ecommerce • Vercel Ready • Supabase Integrated
        </p>
      </div>
    </footer>
  );
};
