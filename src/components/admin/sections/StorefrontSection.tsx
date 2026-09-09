import React, { useState, useRef } from 'react';
import { 
  Sparkles, Image as ImageIcon, Video, Upload, 
  Save, Eye, EyeOff, ExternalLink, Check, RefreshCw,
  Layers, MessageSquare, ShieldCheck, Phone
} from 'lucide-react';
import { Collection, CMSConfig, SiteSettings } from '../../../types';
import { StorageService } from '../../../lib/storage';

interface StorefrontSectionProps {
  collections: Collection[];
  cms: CMSConfig;
  settings: SiteSettings;
  subview: 'collections' | 'banners' | 'announcement' | 'policy';
  onNavigateSub: (sub: 'collections' | 'banners' | 'announcement' | 'policy') => void;
  onNotify: (msg: string) => void;
}

export const StorefrontSection: React.FC<StorefrontSectionProps> = ({
  collections,
  cms,
  settings,
  subview,
  onNavigateSub,
  onNotify
}) => {
  // Collection editor state
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [collectionBannerFile, setCollectionBannerFile] = useState<File | null>(null);
  const [collectionCardFile, setCollectionCardFile] = useState<File | null>(null);
  const [uploadingColAsset, setUploadingColAsset] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const cardInputRef = useRef<HTMLInputElement>(null);

  // CMS state
  const [cmsConfig, setCmsConfig] = useState<CMSConfig>(cms);
  const [uploadingHeroMedia, setUploadingHeroMedia] = useState(false);
  const heroImgInputRef = useRef<HTMLInputElement>(null);
  const heroVidInputRef = useRef<HTMLInputElement>(null);

  // Settings state for policy & announcement
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(settings);

  // 1. SAVE COLLECTION CHANGES
  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollection) return;

    try {
      setUploadingColAsset(true);
      let bannerUrl = editingCollection.bannerUrl;
      let cardUrl = editingCollection.imageUrl;

      if (collectionBannerFile) {
        const res = await StorageService.uploadMediaFile(collectionBannerFile, 'collection-banner', [`Banner: ${editingCollection.name}`]);
        if (res.url) bannerUrl = res.url;
      }

      if (collectionCardFile) {
        const res = await StorageService.uploadMediaFile(collectionCardFile, 'collection-image', [`Card: ${editingCollection.name}`]);
        if (res.url) cardUrl = res.url;
      }

      const updated: Collection = {
        ...editingCollection,
        bannerUrl,
        imageUrl: cardUrl,
        image: cardUrl
      };

      StorageService.updateCollection(updated.id, updated);
      onNotify(`Storefront Collection "${updated.name}" updated successfully!`);
      setEditingCollection(null);
      setCollectionBannerFile(null);
      setCollectionCardFile(null);
    } catch (err) {
      console.error('Failed updating collection:', err);
      alert('Error updating collection assets.');
    } finally {
      setUploadingColAsset(false);
    }
  };

  // 2. SAVE CMS HERO & BANNERS
  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveCMS(cmsConfig);
    onNotify('Storefront Hero & Visual Banners saved successfully!');
  };

  // 3. SAVE POLICY & ANNOUNCEMENT
  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(siteSettings);
    onNotify('Storefront announcements & policy contacts saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-stone-200 pb-2 text-xs">
        <button
          type="button"
          onClick={() => onNavigateSub('collections')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
            subview === 'collections' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          6 Signature Collections
        </button>
        <button
          type="button"
          onClick={() => onNavigateSub('banners')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
            subview === 'banners' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Hero Banners & Videos
        </button>
        <button
          type="button"
          onClick={() => onNavigateSub('announcement')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
            subview === 'announcement' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Announcement Bar
        </button>
        <button
          type="button"
          onClick={() => onNavigateSub('policy')}
          className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
            subview === 'policy' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Policy & WhatsApp Concierge
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. 6 SIGNATURE STOREFRONT COLLECTIONS MANAGER            */}
      {/* ======================================================== */}
      {subview === 'collections' && (
        <div className="space-y-6">
          <div className="bg-white p-4 border border-stone-200 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                The 6 Storefront Collections
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage collection landing banners, catalog cards, headlines, and descriptions shown to customers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((col) => {
              const isVisible = col.isVisible ?? true;

              return (
                <div key={col.id} className="bg-white border border-stone-200 rounded-lg overflow-hidden flex flex-col justify-between">
                  <div>
                    {/* Banner or Card Preview */}
                    <div className="relative h-44 bg-stone-100 overflow-hidden">
                      <img
                        src={col.imageUrl || col.bannerUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                        alt={col.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                        <div className="text-white">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 block">
                            {col.slug}
                          </span>
                          <h4 className="font-serif text-lg font-light">{col.name}</h4>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          isVisible ? 'bg-emerald-500 text-white' : 'bg-stone-500 text-white'
                        }`}>
                          {isVisible ? 'Live on Store' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2 text-xs">
                      <p className="text-stone-600 line-clamp-2 leading-relaxed">
                        {col.description || 'Signature collection crafted with exquisite embroidery and regal silhouettes.'}
                      </p>
                      <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100">
                        <span>Items: <strong>{col.productCount || 0}</strong></span>
                        <a
                          href={`#collection-${col.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(`/?collection=${col.slug}`, '_blank');
                          }}
                          className="text-stone-700 hover:text-stone-900 flex items-center gap-1 font-medium hover:underline"
                        >
                          <span>Preview Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setEditingCollection(col)}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Edit Banner & Info
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edit Collection Modal */}
          {editingCollection && (
            <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
              <div className="bg-white rounded-lg max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">Edit Collection</span>
                    <h3 className="font-serif text-lg font-bold text-stone-900">{editingCollection.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCollection(null);
                      setCollectionBannerFile(null);
                      setCollectionCardFile(null);
                    }}
                    className="text-stone-400 hover:text-stone-900"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSaveCollection} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Collection Title</label>
                    <input
                      type="text"
                      value={editingCollection.name}
                      onChange={(e) => setEditingCollection({ ...editingCollection, name: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingCollection.description || ''}
                      onChange={(e) => setEditingCollection({ ...editingCollection, description: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded"
                    />
                  </div>

                  {/* Card Image Upload */}
                  <div className="space-y-2 p-3 bg-stone-50 border border-stone-200 rounded">
                    <label className="block font-bold text-stone-800">
                      Collection Card Thumbnail (Portrait 4:5)
                    </label>
                    <div className="flex items-center gap-3">
                      <img
                        src={collectionCardFile ? URL.createObjectURL(collectionCardFile) : editingCollection.imageUrl}
                        alt="Card preview"
                        className="w-14 h-18 object-cover rounded border border-stone-300 shrink-0"
                      />
                      <div className="space-y-1">
                        <input
                          ref={cardInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => setCollectionCardFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => cardInputRef.current?.click()}
                          className="px-3 py-1.5 bg-stone-900 text-white rounded text-[11px] font-medium"
                        >
                          Upload Card Photo from PC
                        </button>
                        {collectionCardFile && (
                          <span className="block text-[10px] text-emerald-700 font-bold">Selected: {collectionCardFile.name}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Banner Image Upload */}
                  <div className="space-y-2 p-3 bg-stone-50 border border-stone-200 rounded">
                    <label className="block font-bold text-stone-800">
                      Collection Header Banner (Landscape 16:9)
                    </label>
                    <div className="space-y-2">
                      {(collectionBannerFile || editingCollection.bannerUrl) && (
                        <img
                          src={collectionBannerFile ? URL.createObjectURL(collectionBannerFile) : editingCollection.bannerUrl}
                          alt="Banner preview"
                          className="w-full h-24 object-cover rounded border border-stone-300"
                        />
                      )}
                      <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCollectionBannerFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => bannerInputRef.current?.click()}
                        className="px-3 py-1.5 bg-stone-900 text-white rounded text-[11px] font-medium"
                      >
                        Upload Header Banner from PC
                      </button>
                      {collectionBannerFile && (
                        <span className="block text-[10px] text-emerald-700 font-bold">Selected: {collectionBannerFile.name}</span>
                      )}
                    </div>
                  </div>

                  {/* Visibility toggle */}
                  <div className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded">
                    <div>
                      <strong className="block text-stone-900">Show on Storefront</strong>
                      <span className="text-[11px] text-stone-500">Display this collection card on the homepage</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={editingCollection.isVisible ?? true}
                      onChange={(e) => setEditingCollection({ ...editingCollection, isVisible: e.target.checked })}
                      className="w-4 h-4 accent-stone-900 cursor-pointer"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setEditingCollection(null)}
                      className="px-4 py-2 border border-stone-300 rounded text-stone-700 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingColAsset}
                      className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium uppercase tracking-wider disabled:opacity-50"
                    >
                      {uploadingColAsset ? 'Uploading & Saving...' : 'Save Collection'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. HERO BANNERS & RUNWAY VIDEOS                          */}
      {/* ======================================================== */}
      {subview === 'banners' && (
        <form onSubmit={handleSaveCMS} className="bg-white p-6 border border-stone-200 rounded-lg space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Hero Slides & Video Presentation
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Customize the full-bleed visual experience on the GulPash storefront.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Hero Heading Text
              </label>
              <input
                type="text"
                value={cmsConfig.hero?.title || 'GulPash Luxury Formals'}
                onChange={(e) => setCmsConfig({
                  ...cmsConfig,
                  hero: { ...cmsConfig.hero, title: e.target.value }
                })}
                className="w-full p-2.5 text-xs border border-stone-300 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Hero Subtitle / Tagline
              </label>
              <input
                type="text"
                value={cmsConfig.hero?.subtitle || 'Heirloom Handcrafted Pakistani Couture'}
                onChange={(e) => setCmsConfig({
                  ...cmsConfig,
                  hero: { ...cmsConfig.hero, subtitle: e.target.value }
                })}
                className="w-full p-2.5 text-xs border border-stone-300 rounded"
              />
            </div>

            {/* Desktop Hero Image URL or Upload */}
            <div className="space-y-2 p-3 bg-stone-50 border border-stone-200 rounded">
              <label className="block text-xs font-bold text-stone-800">
                Desktop Hero Banner Image
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={cmsConfig.hero?.image || ''}
                  onChange={(e) => setCmsConfig({
                    ...cmsConfig,
                    hero: { ...cmsConfig.hero, image: e.target.value }
                  })}
                  placeholder="https://.../hero.jpg"
                  className="flex-1 p-2 text-xs border border-stone-300 rounded"
                />
                <input
                  ref={heroImgInputRef}
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingHeroMedia(true);
                    const res = await StorageService.uploadMediaFile(file, 'hero-image', ['Homepage Hero Banner']);
                    if (res.url) {
                      setCmsConfig({
                        ...cmsConfig,
                        hero: { ...cmsConfig.hero, image: res.url }
                      });
                      onNotify('Uploaded hero image from PC!');
                    }
                    setUploadingHeroMedia(false);
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => heroImgInputRef.current?.click()}
                  className="px-3 py-2 bg-stone-900 text-white rounded text-xs whitespace-nowrap cursor-pointer"
                >
                  Upload PC Photo
                </button>
              </div>
            </div>

            {/* Hero Runway Video */}
            <div className="space-y-2 p-3 bg-indigo-50/50 border border-indigo-200 rounded">
              <label className="block text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-indigo-700" />
                <span>Runway Video Background (Optional)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={cmsConfig.hero?.videoUrl || ''}
                  onChange={(e) => setCmsConfig({
                    ...cmsConfig,
                    hero: { ...cmsConfig.hero, videoUrl: e.target.value }
                  })}
                  placeholder="https://.../runway.mp4"
                  className="flex-1 p-2 text-xs border border-stone-300 rounded"
                />
                <input
                  ref={heroVidInputRef}
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingHeroMedia(true);
                    const res = await StorageService.uploadMediaFile(file, 'hero-video', ['Homepage Runway Video']);
                    if (res.url) {
                      setCmsConfig({
                        ...cmsConfig,
                        hero: { ...cmsConfig.hero, videoUrl: res.url }
                      });
                      onNotify('Uploaded hero runway video from PC!');
                    }
                    setUploadingHeroMedia(false);
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => heroVidInputRef.current?.click()}
                  className="px-3 py-2 bg-indigo-900 text-white rounded text-xs whitespace-nowrap cursor-pointer"
                >
                  Upload PC Video
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end">
            <button
              type="submit"
              disabled={uploadingHeroMedia}
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Hero Presentation</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* 3. ANNOUNCEMENT BAR                                      */}
      {/* ======================================================== */}
      {subview === 'announcement' && (
        <form onSubmit={handleSavePolicy} className="bg-white p-6 border border-stone-200 rounded-lg space-y-5">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Top Announcement Ticker
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Highlight the Advance Free Delivery promotion across the entire store header.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded">
              <div>
                <strong className="block text-xs text-stone-900">Show Announcement Bar</strong>
                <span className="text-[11px] text-stone-500">Displays rotating text ticker at the very top of the screen</span>
              </div>
              <input
                type="checkbox"
                checked={siteSettings.announcement?.enabled ?? true}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  announcement: {
                    ...siteSettings.announcement,
                    enabled: e.target.checked,
                    text: siteSettings.announcement?.text || ''
                  }
                })}
                className="w-4 h-4 accent-stone-900 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Announcement Text Message
              </label>
              <textarea
                rows={3}
                value={siteSettings.announcement?.text || '⚡ COMPLIMENTARY NATIONWIDE DELIVERY on all Full Advance Orders via JazzCash, Easypaisa & Bank Transfer • Worldwide Express Shipping'}
                onChange={(e) => setSiteSettings({
                  ...siteSettings,
                  announcement: {
                    ...siteSettings.announcement,
                    enabled: siteSettings.announcement?.enabled ?? true,
                    text: e.target.value
                  }
                })}
                className="w-full p-2.5 text-xs border border-stone-300 rounded font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Announcement</span>
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* 4. POLICY & CONCIERGE WHATSAPP                           */}
      {/* ======================================================== */}
      {subview === 'policy' && (
        <form onSubmit={handleSavePolicy} className="bg-white p-6 border border-stone-200 rounded-lg space-y-5">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Concierge WhatsApp & Contact Channels
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Contact numbers used across footer, order confirmation slips, and floating concierge button.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                Official WhatsApp Number (without +)
              </label>
              <input
                type="text"
                value={siteSettings.whatsappNumber || '923218489999'}
                onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded font-mono"
              />
              <span className="text-[10px] text-stone-500">Format: 923218489999</span>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">
                Customer Support Email
              </label>
              <input
                type="email"
                value={siteSettings.email || 'orders@gulpash.pk'}
                onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-stone-800 mb-1">
                Flagship Studio Address
              </label>
              <input
                type="text"
                value={siteSettings.address || 'GulPash Haute Couture Studio, MM Alam Road, Gulberg III, Lahore, Pakistan'}
                onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Contact Details</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
