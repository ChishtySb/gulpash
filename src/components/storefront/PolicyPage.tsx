import React from 'react';
import { ArrowLeft, ShieldCheck, Truck, RefreshCw, MapPin } from 'lucide-react';
import { StorageService } from '../../lib/storage';

interface PolicyPageProps {
  type: 'shipping-policy' | 'exchange-policy' | 'privacy-policy' | 'about';
  onNavigate: (view: string, param?: string) => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type, onNavigate }) => {
  const settings = StorageService.getSettings();

  const renderContent = () => {
    switch (type) {
      case 'shipping-policy':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-stone-700 border-b border-stone-200 pb-4">
              <Truck className="w-8 h-8 text-stone-800" />
              <div>
                <h1 className="font-serif text-3xl font-light italic text-[#1A1A1A]">Shipping & Dispatch Policy</h1>
                <p className="text-xs text-stone-500 mt-0.5 font-light">Reliable Doorstep Delivery Across All Cities of Pakistan</p>
              </div>
            </div>

            <div className="text-xs text-stone-600 space-y-4 leading-relaxed font-light">
              <p>
                At <strong className="text-stone-900 font-medium">GulPash</strong>, every parcel is wrapped with utmost care in our signature luxury presentation boxes to ensure your couture garments arrive in pristine runway condition.
              </p>

              <div className="bg-stone-50 p-5 border border-stone-200 space-y-3">
                <h3 className="font-medium text-sm text-stone-900 font-serif italic">Delivery Timelines</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong className="text-stone-900 font-medium">Lahore, Karachi, Islamabad, Rawalpindi:</strong> 2 to 3 business days.</li>
                  <li><strong className="text-stone-900 font-medium">Other Major Cities (Faisalabad, Multan, Sialkot, Peshawar, Quetta, Hyderabad):</strong> 3 to 4 business days.</li>
                  <li><strong className="text-stone-900 font-medium">Tehsil / Rural Outskirts:</strong> 4 to 5 business days.</li>
                </ul>
              </div>

              <div className="bg-stone-50 p-5 border border-stone-200 space-y-3">
                <h3 className="font-medium text-sm text-stone-900 font-serif italic">Courier Partners & Charges</h3>
                <p>
                  We partner exclusively with <strong className="text-stone-900 font-medium">TCS Express, Leopards Courier, and Call Courier</strong> to offer secure tracking and reliable Cash on Delivery service.
                </p>
                <p>
                  • <strong className="text-stone-900 font-medium">Standard Shipping Fee:</strong> Flat Rs. 250 across all of Pakistan.<br />
                  • <strong className="text-stone-900 font-medium">Free Shipping:</strong> Automatically granted on all orders exceeding <strong className="text-stone-900 font-medium">Rs. 5,000</strong>.
                </p>
              </div>

              <p>
                If you have an urgent wedding or festive date, please notify our WhatsApp Concierge at <strong className="text-stone-900 font-medium">{settings.supportPhone}</strong> right after placing your order so we can arrange priority express handling.
              </p>
            </div>
          </div>
        );

      case 'exchange-policy':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-stone-700 border-b border-stone-200 pb-4">
              <RefreshCw className="w-8 h-8 text-stone-800" />
              <div>
                <h1 className="font-serif text-3xl font-light italic text-[#1A1A1A]">7-Day Easy Exchange Policy</h1>
                <p className="text-xs text-stone-500 mt-0.5 font-light">Your Complete Satisfaction is Our Royal Guarantee</p>
              </div>
            </div>

            <div className="text-xs text-stone-600 space-y-4 leading-relaxed font-light">
              <p>
                We want you to adore your GulPash ensemble. If you are not completely satisfied with sizing, cut, or design, we offer an effortless 7-day exchange window from the date of package delivery.
              </p>

              <div className="bg-stone-50 p-5 border border-stone-200 space-y-3">
                <h3 className="font-medium text-sm text-stone-900 font-serif italic">Exchange Guidelines</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Garments must be unworn, unwashed, and in their original packaging with all GulPash tags intact.</li>
                  <li>Unstitched suits must contain all included fabric yards, organza borders, and embroidered laces.</li>
                  <li>Exchanges must be initiated within 7 calendar days of delivery.</li>
                </ul>
              </div>

              <div className="bg-stone-50 p-5 border border-stone-200 space-y-2">
                <h3 className="font-medium text-sm text-stone-900 font-serif italic">How to Request an Exchange</h3>
                <p>
                  Simply send a WhatsApp message to <strong className="text-stone-900 font-medium">{settings.supportPhone}</strong> with your Order Number (e.g. GP-94825) and photos of the garment. Our support team will guide you through the return pickup or drop-off process promptly.
                </p>
              </div>
            </div>
          </div>
        );

      case 'privacy-policy':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-stone-700 border-b border-stone-200 pb-4">
              <ShieldCheck className="w-8 h-8 text-stone-800" />
              <div>
                <h1 className="font-serif text-3xl font-light italic text-[#1A1A1A]">Privacy Policy & Terms</h1>
                <p className="text-xs text-stone-500 mt-0.5 font-light">Transparent Customer Data Protection</p>
              </div>
            </div>

            <div className="text-xs text-stone-600 space-y-4 leading-relaxed font-light">
              <p>
                GulPash (<a href="https://gulpash.online" className="text-stone-900 underline font-medium">gulpash.online</a>) respects your personal privacy. When you purchase from us or register an account, we strictly collect only the necessary details (such as name, delivery address, phone number, and email) required to process and dispatch your parcels.
              </p>
              <p>
                • We do not sell or rent your contact information to third parties.<br />
                • Phone numbers are exclusively used for courier address verification and order tracking notifications via SMS or WhatsApp.<br />
                • All electronic payments are processed over encrypted channels. We never store credit or debit card numbers on our servers.
              </p>
            </div>
          </div>
        );

      case 'about':
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-stone-700 border-b border-stone-200 pb-4">
              <MapPin className="w-8 h-8 text-stone-800" />
              <div>
                <h1 className="font-serif text-3xl font-light italic text-[#1A1A1A]">About GulPash Couture</h1>
                <p className="text-xs text-stone-500 mt-0.5 font-light">Heritage Pakistani Craftsmanship from the Heart of Lahore</p>
              </div>
            </div>

            <div className="text-xs text-stone-600 space-y-4 leading-relaxed font-light">
              <p>
                Founded in Lahore, <strong className="text-stone-900 font-medium">GulPash</strong> blends centuries of Mughal textile traditions with modern silhouettes tailored for the contemporary Pakistani woman.
              </p>
              <p>
                From hand-loomed pure lawn weaves with digital silk dupattas to intricate tilla, zardozi, and resham needlework on pure raw silks, every ensemble is cut and finished with artisanal devotion.
              </p>
              <div className="bg-stone-50 p-5 border border-stone-200 space-y-2">
                <h3 className="font-medium text-sm text-stone-900 font-serif italic">Our Flagship Atelier</h3>
                <p>{settings.address}</p>
                <p>Email: {settings.contactEmail} &bull; WhatsApp: {settings.supportPhone}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-[#FAF9F6] font-sans pb-24 min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-black font-medium mb-6 cursor-pointer uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Store</span>
        </button>

        <div className="bg-white border border-stone-200 p-6 sm:p-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
