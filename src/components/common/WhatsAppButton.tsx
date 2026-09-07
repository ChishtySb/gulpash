import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { StorageService } from '../../lib/storage';
import { SiteSettings } from '../../types';

export const WhatsAppButton: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(StorageService.getSettings());
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setSettings(StorageService.getSettings());
    window.addEventListener('gulpash_data_changed', handleUpdate);
    return () => window.removeEventListener('gulpash_data_changed', handleUpdate);
  }, []);

  // Show tooltip once after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    settings.whatsappDefaultMessage || 'Assalam o Alaikum, I would like to inquire about GulPash collections.'
  )}`;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-end gap-3 font-sans">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-[#222] text-xs py-2 px-3 rounded-md shadow-xl border border-[#e8e3dc] max-w-xs animate-in fade-in slide-in-from-bottom-2">
          <span>Need help with sizing or custom stitching? Chat with us!</span>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-[#999] hover:text-black p-0.5"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* WhatsApp Action Button */}
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group cursor-pointer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp (+92 321 8489999)"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 sm:w-3.5 h-3 sm:h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </a>
    </div>
  );
};
