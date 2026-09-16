import React, { useState } from 'react';
import { 
  Megaphone, Globe, Sparkles, Image as ImageIcon, 
  Save, CheckCircle2, Eye, Link2, Clock, Tag
} from 'lucide-react';
import { SiteSettings, HomepageCMS } from '../../../types';
import { StorageService } from '../../../lib/storage';
import { MEDIA_SPECS } from '../../../constants/mediaSpecs';
import { MediaUploaderCard } from '../MediaUploaderCard';

interface MarketingSeoSectionProps {
  settings: SiteSettings;
  subview: 'seo' | 'promotions';
  onNavigateSub: (sub: 'seo' | 'promotions') => void;
  onNotify: (msg: string, status?: 'saving' | 'saved' | 'failed') => void;
}

export const MarketingSeoSection: React.FC<MarketingSeoSectionProps> = ({
  settings,
  subview,
  onNavigateSub,
  onNotify
}) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ ...settings });
  const [cms, setCms] = useState<HomepageCMS>(() => StorageService.getCMS());
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSeo = async () => {
    try {
      setIsSaving(true);
      onNotify('Saving SEO Configuration...', 'saving');
      await StorageService.saveSettingsAsync(siteSettings);
      StorageService.addActivityLog({
        action: 'SEO Metadata Updated',
        category: 'settings',
        actor: 'Admin Concierge',
        details: `Updated meta title: "${siteSettings.seo.siteTitle}" and Open Graph share image.`
      });
      onNotify('SEO & Metadata saved successfully.', 'saved');
    } catch (err: any) {
      console.error('Failed saving SEO:', err);
      onNotify(err?.message || 'Failed to save SEO configuration.', 'failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePromotions = async () => {
    try {
      setIsSaving(true);
      onNotify('Saving Promotional Banners...', 'saving');
      await StorageService.saveCMSAsync(cms);
      StorageService.addActivityLog({
        action: 'Promotional Banners Updated',
        category: 'cms',
        actor: 'Admin Concierge',
        details: 'Updated promotional banners and campaign announcements.'
      });
      onNotify('Promotional banners saved successfully.', 'saved');
    } catch (err: any) {
      console.error('Failed saving promotional banners:', err);
      onNotify(err?.message || 'Failed to save promotional banners.', 'failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* SUBVIEW TABS */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          type="button"
          onClick={() => onNavigateSub('seo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
            subview === 'seo'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>SEO & Social Sharing</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateSub('promotions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
            subview === 'promotions'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Promotional Banners & Deals</span>
        </button>
      </div>

      {/* 1. SEO & SOCIAL SHARING SUBVIEW */}
      {subview === 'seo' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Search Engine Optimization (SEO)
              </h3>
              <p className="text-xs text-stone-500">
                Configure your organic Google search listings, Open Graph metadata, and social previews when links are shared on WhatsApp, Facebook, or Instagram.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Input Fields */}
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block font-bold text-stone-700">
                    SEO Site Title
                  </label>
                  <input
                    type="text"
                    value={siteSettings.seo.siteTitle}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      seo: { ...siteSettings.seo, siteTitle: e.target.value }
                    })}
                    className="w-full p-2.5 border border-stone-300 rounded font-medium focus:ring-1 focus:ring-stone-900"
                    placeholder="GulPash | Pure Pakistani Luxury Pret & Formal Ensembles"
                  />
                  <span className="text-[10px] text-stone-400">
                    Recommended: 50–60 characters. Current: {siteSettings.seo.siteTitle.length}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-stone-700">
                    Meta Description
                  </label>
                  <textarea
                    rows={4}
                    value={siteSettings.seo.metaDescription}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      seo: { ...siteSettings.seo, metaDescription: e.target.value }
                    })}
                    className="w-full p-2.5 border border-stone-300 rounded font-medium focus:ring-1 focus:ring-stone-900 leading-relaxed"
                    placeholder="Discover timeless Pakistani luxury pret, signature velvets, and hand-embellished raw silks by GulPash. Worldwide shipping available."
                  />
                  <span className="text-[10px] text-stone-400">
                    Recommended: 140–160 characters. Current: {siteSettings.seo.metaDescription.length}
                  </span>
                </div>

                {/* Open Graph Image Uploader */}
                <div className="space-y-1 pt-2">
                  <label className="block font-bold text-stone-700">
                    Open Graph Social Share Image
                  </label>
                  <MediaUploaderCard
                    spec={MEDIA_SPECS.OG_IMAGE}
                    currentUrl={siteSettings.seo.ogImage}
                    onUrlChange={(url) => setSiteSettings({
                      ...siteSettings,
                      seo: { ...siteSettings.seo, ogImage: url }
                    })}
                    onStatusChange={(status, msg) => {
                      if (status === 'uploading' || status === 'saving') {
                        onNotify(msg || 'Uploading OG share image...', 'saving');
                      } else if (status === 'saved') {
                        onNotify(msg || 'Open Graph share image uploaded!', 'saved');
                      } else if (status === 'failed') {
                        onNotify(msg || 'Failed to upload OG image', 'failed');
                      }
                    }}
                  />
                </div>
              </div>

              {/* Right: Live Google Search Snippet Preview */}
              <div className="space-y-4">
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700 border-b border-stone-200 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-stone-500" />
                      <span>Google Search Result Snippet Preview</span>
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">Desktop Preview</span>
                  </div>

                  {/* Google Snippet Card */}
                  <div className="bg-white p-4 rounded border border-stone-200 shadow-2xs space-y-1">
                    <div className="flex items-center gap-2 text-xs text-stone-700">
                      <div className="w-4 h-4 rounded-full bg-stone-900 flex items-center justify-center text-[9px] text-white font-bold">
                        G
                      </div>
                      <span className="text-stone-800 font-medium">https://gulpash.online</span>
                    </div>
                    <h4 className="text-blue-700 hover:underline font-medium text-base cursor-pointer truncate">
                      {siteSettings.seo.siteTitle || 'GulPash | Pure Pakistani Luxury Pret'}
                    </h4>
                    <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed">
                      {siteSettings.seo.metaDescription || 'Discover timeless Pakistani luxury pret, signature velvets, and hand-embellished raw silks by GulPash.'}
                    </p>
                  </div>
                </div>

                {/* Social Share WhatsApp Preview */}
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700 border-b border-stone-200 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-stone-500" />
                      <span>Social Media Link Card Preview</span>
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">WhatsApp / iMessage</span>
                  </div>

                  <div className="bg-white rounded border border-stone-200 overflow-hidden shadow-2xs max-w-sm">
                    {siteSettings.seo.ogImage ? (
                      <img
                        src={siteSettings.seo.ogImage}
                        alt="OG Preview"
                        className="w-full aspect-1.91/1 object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-1.91/1 bg-stone-100 flex items-center justify-center text-stone-400 text-xs">
                        No OG Image Uploaded
                      </div>
                    )}
                    <div className="p-3 space-y-1 bg-stone-50">
                      <span className="text-[10px] uppercase font-mono text-stone-400">gulpash.online</span>
                      <h5 className="font-bold text-stone-900 text-xs truncate">
                        {siteSettings.seo.siteTitle}
                      </h5>
                      <p className="text-[11px] text-stone-500 line-clamp-2">
                        {siteSettings.seo.metaDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={handleSaveSeo}
                disabled={isSaving}
                className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save SEO Configuration'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROMOTIONAL BANNERS SUBVIEW */}
      {subview === 'promotions' && (
        <div className="space-y-6">
          {/* Top Marquee Announcement Bar */}
          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Top Announcement Marquee Bar
              </h3>
              <p className="text-xs text-stone-500">
                Rotating luxury ribbon displayed at the very top of every storefront page.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded border border-stone-200">
                <span className="font-bold text-stone-900">Enable Top Announcement Bar</span>
                <input
                  type="checkbox"
                  checked={cms.announcementBar?.enabled ?? true}
                  onChange={(e) => setCms({
                    ...cms,
                    announcementBar: {
                      ...(cms.announcementBar || { messages: [] }),
                      enabled: e.target.checked
                    }
                  })}
                  className="w-4 h-4 accent-stone-900 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-stone-700">
                  Announcement Messages (One per line):
                </label>
                <textarea
                  rows={3}
                  value={(cms.announcementBar?.messages || ['COMPLIMENTARY SHIPPING ON ALL FULL ADVANCE ORDERS', 'WORLDWIDE EXPRESS ATELIER COURIER', 'PURE ORGANZA & RAW SILK CRAFTSMANSHIP']).join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').filter(Boolean);
                    setCms({
                      ...cms,
                      announcementBar: {
                        ...(cms.announcementBar || { enabled: true }),
                        messages: lines
                      }
                    });
                  }}
                  className="w-full p-2.5 border border-stone-300 rounded font-mono text-xs focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Seasonal Editorial Promotional Banner */}
          <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Mid-Page Editorial Promotional Banner
              </h3>
              <p className="text-xs text-stone-500">
                Featured full-width or inset banner highlighted between homepage collection rows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block font-bold text-stone-700">Promo Headline</label>
                  <input
                    type="text"
                    value={cms.editorialShowcase?.heading || 'The Velvet & Raw Silk Edit'}
                    onChange={(e) => setCms({
                      ...cms,
                      editorialShowcase: {
                        ...cms.editorialShowcase,
                        heading: e.target.value
                      }
                    })}
                    className="w-full p-2.5 border border-stone-300 rounded font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-stone-700">Promo Subtitle</label>
                  <input
                    type="text"
                    value={cms.editorialShowcase?.subtitle || 'Exquisite Hand-Embellished Winter Couture'}
                    onChange={(e) => setCms({
                      ...cms,
                      editorialShowcase: {
                        ...cms.editorialShowcase,
                        subtitle: e.target.value
                      }
                    })}
                    className="w-full p-2.5 border border-stone-300 rounded font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-stone-700">CTA Button Text</label>
                  <input
                    type="text"
                    value={cms.editorialShowcase?.buttonText || 'Explore Signature Pieces'}
                    onChange={(e) => setCms({
                      ...cms,
                      editorialShowcase: {
                        ...cms.editorialShowcase,
                        buttonText: e.target.value
                      }
                    })}
                    className="w-full p-2.5 border border-stone-300 rounded font-medium"
                  />
                </div>
              </div>

              {/* Promo Banner Image Upload with Specs */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Editorial Banner Image (PC Upload)
                </label>
                <MediaUploaderCard
                  spec={MEDIA_SPECS.PROMO_BANNER_MID}
                  currentUrl={cms.editorialShowcase?.imageUrl}
                  onUrlChange={(url) => setCms({
                    ...cms,
                    editorialShowcase: {
                      ...cms.editorialShowcase,
                      imageUrl: url
                    }
                  })}
                  onAutoSave={async (url) => {
                    const updated = {
                      ...cms,
                      editorialShowcase: {
                        ...cms.editorialShowcase,
                        imageUrl: url
                      }
                    };
                    setCms(updated);
                    await StorageService.saveCMSAsync(updated);
                  }}
                  onStatusChange={(status, msg) => {
                    if (status === 'uploading' || status === 'saving') {
                      onNotify(msg || 'Uploading promotional banner...', 'saving');
                    } else if (status === 'saved') {
                      onNotify(msg || 'Promotional banner uploaded & saved!', 'saved');
                    } else if (status === 'failed') {
                      onNotify(msg || 'Failed to upload promotional banner', 'failed');
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={handleSavePromotions}
                disabled={isSaving}
                className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Promotional Banners'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
