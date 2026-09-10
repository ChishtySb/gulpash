import React, { useState, useRef } from 'react';
import { 
  Sparkles, Image as ImageIcon, Video, Upload, 
  Save, Eye, EyeOff, ExternalLink, Check, RefreshCw,
  Layers, MessageSquare, ShieldCheck, Phone
} from 'lucide-react';
import { Collection, CMSConfig, SiteSettings } from '../../../types';
import { StorageService } from '../../../lib/storage';
import { resolveWhatsAppSettings, getWhatsAppUrl, normalizeWhatsAppDestination } from '../../../lib/whatsapp';

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
  const [collectionMobileBannerFile, setCollectionMobileBannerFile] = useState<File | null>(null);
  const [collectionCardFile, setCollectionCardFile] = useState<File | null>(null);
  const [uploadingColAsset, setUploadingColAsset] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const mobileBannerInputRef = useRef<HTMLInputElement>(null);
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
      let bannerDesktopImage = editingCollection.bannerDesktopImage || bannerUrl;
      let bannerMobileImage = editingCollection.bannerMobileImage;
      let cardUrl = editingCollection.imageUrl || editingCollection.image;

      if (collectionBannerFile) {
        const res = await StorageService.uploadMediaFile(collectionBannerFile, 'collection-banner', [`Desktop Banner: ${editingCollection.name}`]);
        if (res.url) {
          bannerUrl = res.url;
          bannerDesktopImage = res.url;
        }
      }

      if (collectionMobileBannerFile) {
        const res = await StorageService.uploadMediaFile(collectionMobileBannerFile, 'collection-banner', [`Mobile Banner: ${editingCollection.name}`]);
        if (res.url) {
          bannerMobileImage = res.url;
        }
      }

      if (collectionCardFile) {
        const res = await StorageService.uploadMediaFile(collectionCardFile, 'collection-image', [`Card: ${editingCollection.name}`]);
        if (res.url) {
          cardUrl = res.url;
        }
      }

      const updated: Collection = {
        ...editingCollection,
        bannerUrl,
        bannerDesktopImage,
        bannerMobileImage,
        imageUrl: cardUrl,
        image: cardUrl,
        order: Number(editingCollection.order) || 1,
        displayOrder: Number(editingCollection.order) || 1
      };

      StorageService.updateCollection(updated.id, updated);
      onNotify(`Storefront Collection "${updated.name}" updated successfully!`);
      setEditingCollection(null);
      setCollectionBannerFile(null);
      setCollectionMobileBannerFile(null);
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
            {collections
              .slice()
              .sort((a, b) => (a.order ?? a.displayOrder ?? 99) - (b.order ?? b.displayOrder ?? 99))
              .map((col) => {
                const isVisible = col.isVisible ?? true;
                const isHomepage = col.slug === 'all' ? (col.visibleOnHomepage === true) : (col.visibleOnHomepage !== false);
                const orderNum = col.order ?? col.displayOrder ?? 1;

                return (
                  <div key={col.id} className="bg-white border border-stone-200 rounded-lg overflow-hidden flex flex-col justify-between shadow-xs">
                    <div>
                      {/* Banner or Card Preview */}
                      <div className="relative h-48 bg-stone-100 overflow-hidden">
                        <img
                          src={col.imageUrl || col.image || col.bannerUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                          alt={col.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                          <div className="text-white">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono uppercase tracking-widest bg-amber-400/90 text-stone-900 px-1.5 py-0.5 rounded-xs font-bold">
                                Order #{orderNum}
                              </span>
                              <span className="text-[10px] font-mono text-stone-300">
                                /{col.slug}
                              </span>
                            </div>
                            <h4 className="font-serif text-lg font-normal">{col.name}</h4>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                          <span className={`text-[10px] px-2 py-0.5 rounded-xs font-medium shadow-xs ${
                            isVisible ? 'bg-emerald-600 text-white' : 'bg-stone-500 text-white'
                          }`}>
                            {isVisible ? 'Catalog: Live' : 'Catalog: Hidden'}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-xs font-medium shadow-xs ${
                            isHomepage ? 'bg-indigo-600 text-white' : 'bg-stone-600/90 text-stone-200'
                          }`}>
                            {isHomepage ? 'Homepage: ON' : 'Homepage: OFF'}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3 text-xs">
                        <p className="text-stone-600 line-clamp-2 leading-relaxed">
                          {col.description || 'Signature collection crafted with exquisite embroidery and regal silhouettes.'}
                        </p>
                        
                        <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-100">
                          <span>Assigned Products: <strong className="text-stone-800 font-mono text-xs">{col.productCount || 0}</strong></span>
                          <a
                            href={`#collection-${col.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(`/?collection=${col.slug}`, '_blank');
                            }}
                            className="text-stone-700 hover:text-stone-900 flex items-center gap-1 font-medium hover:underline"
                          >
                            <span>Preview Collection</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        {/* Inline Homepage Toggle */}
                        <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded border border-stone-200">
                          <div>
                            <span className="block font-bold text-[11px] text-stone-900">Show on Homepage</span>
                            <span className="block text-[10px] text-stone-500">
                              {col.slug === 'all' ? 'Toggle "ALL ENSEMBLES" card on homepage' : 'Display card in curated collection grid'}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={isHomepage}
                            onChange={(e) => {
                              const updatedCol = { ...col, visibleOnHomepage: e.target.checked };
                              StorageService.updateCollection(col.id, { visibleOnHomepage: e.target.checked });
                              onNotify(`Homepage visibility for "${col.name}" set to ${e.target.checked ? 'ON' : 'OFF'}`);
                            }}
                            className="w-4 h-4 accent-stone-900 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-stone-50 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setEditingCollection(col)}
                        className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Edit Media, Banners & Details
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Edit Collection Modal */}
          {editingCollection && (
            <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
              <div className="bg-white rounded-lg max-w-xl w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
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
                      setCollectionMobileBannerFile(null);
                      setCollectionCardFile(null);
                    }}
                    className="text-stone-400 hover:text-stone-900 text-lg leading-none"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSaveCollection} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
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
                      <label className="block font-bold text-stone-800 mb-1">Canonical Order (1-6)</label>
                      <input
                        type="number"
                        min={1}
                        max={6}
                        value={editingCollection.order ?? 1}
                        onChange={(e) => setEditingCollection({ ...editingCollection, order: Number(e.target.value) })}
                        className="w-full p-2 border border-stone-300 rounded"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Editorial Description</label>
                    <textarea
                      rows={2}
                      value={editingCollection.description || ''}
                      onChange={(e) => setEditingCollection({ ...editingCollection, description: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded"
                    />
                  </div>

                  {/* 1. Card Image Upload */}
                  <div className="space-y-2 p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-stone-800">
                        Homepage Card Image (Portrait 4:5)
                      </label>
                      <span className="text-[10px] text-stone-500 font-mono">Recommended: 1200 × 1500 px (4:5)</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <img
                        src={collectionCardFile ? URL.createObjectURL(collectionCardFile) : (editingCollection.imageUrl || editingCollection.image)}
                        alt="Card preview"
                        className="w-16 h-20 object-cover rounded border border-stone-300 shrink-0"
                      />
                      <div className="space-y-2 flex-1">
                        <input
                          ref={cardInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => setCollectionCardFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => cardInputRef.current?.click()}
                            className="px-3 py-1.5 bg-stone-900 text-white rounded text-[11px] font-medium hover:bg-stone-800 cursor-pointer"
                          >
                            {collectionCardFile ? 'Replace Card Photo' : 'Upload Card Photo from PC'}
                          </button>
                          {(collectionCardFile || editingCollection.imageUrl) && (
                            <button
                              type="button"
                              onClick={() => {
                                setCollectionCardFile(null);
                                setEditingCollection({ ...editingCollection, imageUrl: '', image: '' });
                              }}
                              className="px-2.5 py-1.5 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded text-[11px] cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        {collectionCardFile && (
                          <span className="block text-[10px] text-emerald-700 font-bold">Selected: {collectionCardFile.name}</span>
                        )}
                        <div>
                          <label className="block text-[10px] text-stone-600 mb-0.5">Alt Text / SEO Description</label>
                          <input
                            type="text"
                            value={editingCollection.altText || ''}
                            onChange={(e) => setEditingCollection({ ...editingCollection, altText: e.target.value })}
                            placeholder="e.g. GulPash New Arrivals — Embroidered Ensemble"
                            className="w-full p-1.5 text-[11px] border border-stone-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Collection Header Banner Controls */}
                  <div className="space-y-3 p-3 bg-stone-50 border border-stone-200 rounded">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <div>
                        <strong className="block text-stone-900">Collection Header Banner</strong>
                        <span className="text-[11px] text-stone-500">Displayed at the top of the collection landing page</span>
                      </div>
                      <label className="flex items-center gap-1.5 text-stone-800 font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingCollection.bannerEnabled ?? true}
                          onChange={(e) => setEditingCollection({ ...editingCollection, bannerEnabled: e.target.checked })}
                          className="w-4 h-4 accent-stone-900 cursor-pointer"
                        />
                        <span>Banner Enabled</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-stone-800 mb-1">Banner Type</label>
                        <select
                          value={editingCollection.bannerType || 'image_text'}
                          onChange={(e) => setEditingCollection({ ...editingCollection, bannerType: e.target.value as any })}
                          className="w-full p-2 border border-stone-300 rounded"
                        >
                          <option value="image_text">Image + Text Overlay</option>
                          <option value="image">Image Only (No Text Overlay)</option>
                          <option value="text">Text Only (Dark Background)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 mb-1">Banner Heading</label>
                        <input
                          type="text"
                          value={editingCollection.bannerTitle || ''}
                          onChange={(e) => setEditingCollection({ ...editingCollection, bannerTitle: e.target.value })}
                          placeholder={editingCollection.name}
                          className="w-full p-2 border border-stone-300 rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-800 mb-1">Banner Subtitle / Description</label>
                      <input
                        type="text"
                        value={editingCollection.bannerSubtitle || ''}
                        onChange={(e) => setEditingCollection({ ...editingCollection, bannerSubtitle: e.target.value })}
                        placeholder={editingCollection.description || ''}
                        className="w-full p-2 border border-stone-300 rounded"
                      />
                    </div>

                    {/* Desktop Banner Image Upload */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800 text-[11px]">Desktop Header Banner</span>
                        <span className="text-[10px] text-stone-500 font-mono">Recommended: 1920 × 600 px (16:5)</span>
                      </div>
                      <div className="space-y-2">
                        {(collectionBannerFile || editingCollection.bannerDesktopImage || editingCollection.bannerUrl) && (
                          <img
                            src={collectionBannerFile ? URL.createObjectURL(collectionBannerFile) : (editingCollection.bannerDesktopImage || editingCollection.bannerUrl)}
                            alt="Desktop Banner Preview"
                            className="w-full h-20 object-cover rounded border border-stone-300"
                          />
                        )}
                        <input
                          ref={bannerInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => setCollectionBannerFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => bannerInputRef.current?.click()}
                            className="px-3 py-1.5 bg-stone-900 text-white rounded text-[11px] font-medium hover:bg-stone-800 cursor-pointer"
                          >
                            {collectionBannerFile ? 'Replace Desktop Banner' : 'Upload Desktop Banner from PC'}
                          </button>
                          {(collectionBannerFile || editingCollection.bannerDesktopImage || editingCollection.bannerUrl) && (
                            <button
                              type="button"
                              onClick={() => {
                                setCollectionBannerFile(null);
                                setEditingCollection({ ...editingCollection, bannerDesktopImage: '', bannerUrl: '' });
                              }}
                              className="px-2.5 py-1.5 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded text-[11px] cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        {collectionBannerFile && (
                          <span className="block text-[10px] text-emerald-700 font-bold">Selected: {collectionBannerFile.name}</span>
                        )}
                      </div>
                    </div>

                    {/* Mobile Banner Image Upload */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800 text-[11px]">Mobile Header Banner</span>
                        <span className="text-[10px] text-stone-500 font-mono">Recommended: 1080 × 1350 px (4:5)</span>
                      </div>
                      <div className="space-y-2">
                        {(collectionMobileBannerFile || editingCollection.bannerMobileImage) && (
                          <img
                            src={collectionMobileBannerFile ? URL.createObjectURL(collectionMobileBannerFile) : editingCollection.bannerMobileImage}
                            alt="Mobile Banner Preview"
                            className="w-24 h-24 object-cover rounded border border-stone-300"
                          />
                        )}
                        <input
                          ref={mobileBannerInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => setCollectionMobileBannerFile(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => mobileBannerInputRef.current?.click()}
                            className="px-3 py-1.5 bg-stone-900 text-white rounded text-[11px] font-medium hover:bg-stone-800 cursor-pointer"
                          >
                            {collectionMobileBannerFile ? 'Replace Mobile Banner' : 'Upload Mobile Banner from PC'}
                          </button>
                          {(collectionMobileBannerFile || editingCollection.bannerMobileImage) && (
                            <button
                              type="button"
                              onClick={() => {
                                setCollectionMobileBannerFile(null);
                                setEditingCollection({ ...editingCollection, bannerMobileImage: '' });
                              }}
                              className="px-2.5 py-1.5 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded text-[11px] cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        {collectionMobileBannerFile && (
                          <span className="block text-[10px] text-emerald-700 font-bold">Selected: {collectionMobileBannerFile.name}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. Homepage & Storefront Visibility Toggles */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded">
                      <div>
                        <strong className="block text-stone-900">Show on Homepage Collections Row</strong>
                        <span className="text-[11px] text-stone-500">
                          {editingCollection.slug === 'all'
                            ? 'Toggle ON to display "ALL ENSEMBLES" card on the homepage collections grid.'
                            : 'Display this collection card on the homepage curated showcase.'}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editingCollection.slug === 'all' ? (editingCollection.visibleOnHomepage === true) : (editingCollection.visibleOnHomepage !== false)}
                        onChange={(e) => setEditingCollection({ ...editingCollection, visibleOnHomepage: e.target.checked })}
                        className="w-4 h-4 accent-stone-900 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded">
                      <div>
                        <strong className="block text-stone-900">Active in Storefront Catalog</strong>
                        <span className="text-[11px] text-stone-500">Enable this collection in shop filters and navigation</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editingCollection.isVisible ?? true}
                        onChange={(e) => setEditingCollection({ ...editingCollection, isVisible: e.target.checked })}
                        className="w-4 h-4 accent-stone-900 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setEditingCollection(null)}
                      className="px-4 py-2 border border-stone-300 rounded text-stone-700 hover:bg-stone-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingColAsset}
                      className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                    >
                      {uploadingColAsset ? 'Uploading & Saving...' : 'Save Collection Changes'}
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
                    const res = await StorageService.uploadMediaFile(file, 'homepage-image', ['Homepage Hero Banner']);
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
                    const res = await StorageService.uploadMediaFile(file, 'homepage-video', ['Homepage Runway Video']);
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

          {(() => {
            const waConfig = resolveWhatsAppSettings(siteSettings);
            const destNumber = normalizeWhatsAppDestination(waConfig.number);
            const testUrl = getWhatsAppUrl(destNumber, waConfig.defaultMessage);

            return (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Visible WhatsApp Number *
                    </label>
                    <input
                      type="text"
                      value={waConfig.number}
                      onChange={(e) => {
                        const newNum = e.target.value;
                        setSiteSettings({
                          ...siteSettings,
                          whatsappNumber: newNum,
                          whatsappAssistance: {
                            ...waConfig,
                            number: newNum,
                            destinationNumber: normalizeWhatsAppDestination(newNum)
                          }
                        });
                      }}
                      placeholder="03006392025"
                      className="w-full p-2.5 border border-stone-300 rounded font-mono font-bold text-stone-900"
                    />
                    <span className="text-[10px] text-stone-500 mt-0.5 block">Visible customer format: 03006392025</span>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Button / Link Label
                    </label>
                    <input
                      type="text"
                      value={waConfig.displayLabel}
                      onChange={(e) => {
                        const newLabel = e.target.value;
                        setSiteSettings({
                          ...siteSettings,
                          whatsappAssistance: {
                            ...waConfig,
                            displayLabel: newLabel
                          }
                        });
                      }}
                      placeholder="WhatsApp Assistance"
                      className="w-full p-2.5 border border-stone-300 rounded"
                    />
                    <span className="text-[10px] text-stone-500 mt-0.5 block">Storefront label: WhatsApp Assistance</span>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Customer Support Email
                    </label>
                    <input
                      type="email"
                      value={siteSettings.contactEmail || siteSettings.email || 'orders@gulpash.pk'}
                      onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value, email: e.target.value })}
                      className="w-full p-2.5 border border-stone-300 rounded"
                    />
                    <span className="text-[10px] text-stone-500 mt-0.5 block">Official customer care inbox</span>
                  </div>

                  <div className="md:col-span-3">
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

                <div className="p-3 bg-[#eef8f1] border border-[#c4e8ce] rounded flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-stone-900 block">Click-to-Chat Destination: https://wa.me/{destNumber}</span>
                    <span className="text-[11px] text-stone-600">Syncs directly to Supabase site_settings and triggers live updates across the storefront.</span>
                  </div>
                  <a
                    href={testUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold rounded text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Test WhatsApp Link</span>
                  </a>
                </div>
              </>
            );
          })()}

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
