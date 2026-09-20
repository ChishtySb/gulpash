import React, { useState, useRef } from 'react';
import { 
  Sparkles, Image as ImageIcon, Video, Upload, 
  Save, Eye, EyeOff, ExternalLink, Check, RefreshCw,
  Layers, MessageSquare, ShieldCheck, Phone, CheckCircle2,
  Sliders, Link2, FileText, ChevronRight
} from 'lucide-react';
import { Collection, CMSConfig, SiteSettings } from '../../../types';
import { StorageService } from '../../../lib/storage';
import { MEDIA_SPECS } from '../../../constants/mediaSpecs';
import { MediaUploaderCard } from '../MediaUploaderCard';
import { MediaLibrarySection } from './MediaLibrarySection';
import { HeroSlideManager } from './HeroSlideManager';
import { EditorialCampaignManager } from './EditorialCampaignManager';

export type StorefrontSubview = 
  | 'homepage' 
  | 'hero' 
  | 'campaign'
  | 'collections' 
  | 'banners' 
  | 'navigation' 
  | 'announcement' 
  | 'footer' 
  | 'media';

interface StorefrontSectionProps {
  collections: Collection[];
  cms: CMSConfig;
  settings: SiteSettings;
  subview: StorefrontSubview;
  onNavigateSub: (sub: StorefrontSubview) => void;
  onNotify: (msg: string, status?: 'saving' | 'saved' | 'failed') => void;
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

  // CMS state
  const [cmsConfig, setCmsConfig] = useState<CMSConfig>(cms);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  // Save Collection Changes
  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollection) return;
    try {
      setIsSaving(true);
      onNotify(`Saving collection "${editingCollection.name}"...`, 'saving');
      const updated: Collection = {
        ...editingCollection,
        order: Number(editingCollection.order) || 1,
        displayOrder: Number(editingCollection.order) || 1
      };
      await StorageService.updateCollectionAsync(updated.id, updated);
      StorageService.addActivityLog({
        action: 'Collection Updated',
        category: 'collection',
        actor: 'Admin Concierge',
        details: `Updated collection "${updated.name}" banner and card media.`
      });
      onNotify(`Collection "${updated.name}" updated and saved successfully!`, 'saved');
      setEditingCollection(null);
    } catch (err: any) {
      console.error('Failed updating collection:', err);
      onNotify(err?.message || 'Error updating collection assets.', 'failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Save CMS Config
  const handleSaveCMS = async (label: string = 'Storefront CMS') => {
    try {
      setIsSaving(true);
      onNotify(`Saving ${label}...`, 'saving');
      await StorageService.saveCMSAsync(cmsConfig);
      StorageService.addActivityLog({
        action: `${label} Saved`,
        category: 'cms',
        actor: 'Admin Concierge',
        details: `Saved changes to ${label.toLowerCase()}.`
      });
      onNotify(`${label} saved successfully!`, 'saved');
    } catch (err: any) {
      console.error(`Failed saving ${label}:`, err);
      onNotify(`Failed to save ${label}: ${err?.message || 'Storage error'}`, 'failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Settings Config (Navigation, Footer, etc.)
  const handleSaveSettings = async (label: string = 'Storefront Settings') => {
    try {
      setIsSaving(true);
      onNotify(`Saving ${label}...`, 'saving');
      await StorageService.saveSettingsAsync(siteSettings);
      StorageService.addActivityLog({
        action: `${label} Saved`,
        category: 'settings',
        actor: 'Admin Concierge',
        details: `Saved changes to ${label.toLowerCase()}.`
      });
      onNotify(`${label} saved successfully!`, 'saved');
    } catch (err: any) {
      console.error(`Failed saving ${label}:`, err);
      onNotify(`Failed to save ${label}: ${err?.message || 'Storage error'}`, 'failed');
    } finally {
      setIsSaving(false);
    }
  };

  const storefrontTabs: Array<{ id: StorefrontSubview; label: string }> = [
    { id: 'homepage', label: 'Homepage CMS' },
    { id: 'hero', label: 'Hero Slides (Video/Img)' },
    { id: 'campaign', label: 'Editorial Campaign' },
    { id: 'collections', label: 'Collections & Cards' },
    { id: 'banners', label: 'Page Banners' },
    { id: 'navigation', label: 'Header & Navigation' },
    { id: 'announcement', label: 'Announcement Bar' },
    { id: 'footer', label: 'Footer & Policies' },
    { id: 'media', label: 'Media Library' }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* SUBVIEW NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-stone-200 pb-2 text-xs">
        {storefrontTabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigateSub(tab.id)}
            className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors cursor-pointer ${
              subview === tab.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* 1. HOMEPAGE CMS                                          */}
      {/* ======================================================== */}
      {subview === 'homepage' && (
        <div className="bg-white p-6 border border-stone-200 rounded-lg space-y-6 shadow-xs">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Homepage Layout & Content Modules
            </h3>
            <p className="text-xs text-stone-500">
              Control which sections appear on the homepage and customize headings.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-3">
              <label className="block font-bold text-stone-800">
                Storefront Section Toggles
              </label>

              {[
                { key: 'showHero', label: 'Hero Banner / Runway Video Section', default: true },
                { key: 'showNewArrivals', label: 'New Arrivals Product Carousel', default: true },
                { key: 'showTrending', label: 'Trending / Best Sellers Grid', default: true },
                { key: 'showCollections', label: 'Signature Collections Showcase Grid', default: true },
                { key: 'showEditorial', label: 'Mid-Page Editorial Brand Showcase', default: true },
                { key: 'showTrustBadges', label: 'Luxury Assurance & Trust Badges Ribbon', default: true }
              ].map(sec => {
                const current = (cmsConfig as any)[sec.key] ?? sec.default;
                return (
                  <div key={sec.key} className="flex items-center justify-between p-3 bg-stone-50 rounded border border-stone-200">
                    <span className="font-medium text-stone-800">{sec.label}</span>
                    <input
                      type="checkbox"
                      checked={current}
                      onChange={(e) => setCmsConfig({ ...cmsConfig, [sec.key]: e.target.checked })}
                      className="w-4 h-4 accent-stone-900 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => handleSaveCMS('Homepage CMS')}
              disabled={isSaving}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Homepage CMS'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. HERO SLIDES (MULTI-SLIDE CAROUSEL & EXACT 16:7 CANVAS) */}
      {/* ======================================================== */}
      {subview === 'hero' && (
        <HeroSlideManager
          cmsConfig={cmsConfig}
          onUpdateCMS={(updated) => setCmsConfig(updated)}
          onNotify={(msg, status) => onNotify(msg, status === 'info' ? 'saved' : status)}
        />
      )}

      {/* ======================================================== */}
      {/* 2B. EDITORIAL CAMPAIGN (16:7 DESKTOP / 4:5 MOBILE CANVAS) */}
      {/* ======================================================== */}
      {subview === 'campaign' && (
        <EditorialCampaignManager
          cmsConfig={cmsConfig}
          onUpdateCMS={(updated) => setCmsConfig(updated)}
          onNotify={(msg, status) => onNotify(msg, status)}
        />
      )}

      {/* ======================================================== */}
      {/* 3. THE 6 SIGNATURE COLLECTIONS & HOMEPAGE CARDS          */}
      {/* ======================================================== */}
      {subview === 'collections' && (
        <div className="space-y-6">
          <div className="bg-white p-6 border border-stone-200 rounded-lg flex items-center justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded uppercase">
                  ACTIVE 6 SIGNATURE COLLECTIONS
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 mt-1">
                Storefront Collection Cards & Ordering
              </h3>
              <p className="text-xs text-stone-500">
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
                  <div key={col.id} className="bg-white border border-stone-200 rounded-lg overflow-hidden flex flex-col justify-between shadow-2xs">
                    <div>
                      {/* Banner or Card Preview */}
                      <div className="relative aspect-4/5 bg-stone-100 overflow-hidden">
                        <img
                          src={col.imageUrl || col.image || col.bannerUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                          alt={col.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                          <div className="text-white">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono uppercase tracking-widest bg-amber-400 text-stone-950 px-1.5 py-0.5 rounded font-bold">
                                Order #{orderNum}
                              </span>
                              <span className="text-[10px] font-mono text-stone-300">
                                /{col.slug}
                              </span>
                            </div>
                            <h4 className="font-serif text-lg font-bold">{col.name}</h4>
                          </div>
                        </div>

                        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium shadow-xs ${
                            isVisible ? 'bg-emerald-600 text-white' : 'bg-stone-500 text-white'
                          }`}>
                            {isVisible ? 'Live' : 'Hidden'}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium shadow-xs ${
                            isHomepage ? 'bg-amber-600 text-white' : 'bg-stone-600 text-white'
                          }`}>
                            {isHomepage ? 'Homepage: ON' : 'Homepage: OFF'}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3 text-xs">
                        <p className="text-stone-600 line-clamp-2 leading-relaxed">
                          {col.description || 'Signature collection crafted with exquisite embroidery and regal silhouettes.'}
                        </p>

                        <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded border border-stone-200">
                          <span className="font-bold text-stone-800">Show on Homepage</span>
                          <input
                            type="checkbox"
                            checked={isHomepage}
                            onChange={(e) => {
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
                        Edit Media & Banners
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* EDIT COLLECTION MODAL WITH MEDIA UPLOADER CARDS */}
          {editingCollection && (
            <div className="fixed inset-0 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
              <div className="bg-white rounded-lg max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">Collection Settings</span>
                    <h3 className="font-serif text-lg font-bold text-stone-900">{editingCollection.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingCollection(null)}
                    className="text-stone-400 hover:text-stone-900 text-2xl"
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
                        className="w-full p-2 border border-stone-300 rounded font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">Order (1-6)</label>
                      <input
                        type="number"
                        min={1}
                        max={6}
                        value={editingCollection.order ?? 1}
                        onChange={(e) => setEditingCollection({ ...editingCollection, order: Number(e.target.value) })}
                        className="w-full p-2 border border-stone-300 rounded font-mono font-bold"
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
                      className="w-full p-2 border border-stone-300 rounded leading-relaxed"
                    />
                  </div>

                  {/* 1. Homepage Card Image (Portrait 4:5) */}
                  <div className="space-y-2">
                    <label className="block font-bold text-stone-800">
                      Homepage Curated Card Photo
                    </label>
                    <MediaUploaderCard
                      spec={MEDIA_SPECS.COLLECTION_CARD}
                      currentUrl={editingCollection.imageUrl || editingCollection.image}
                      onUrlChange={(url) => setEditingCollection({
                        ...editingCollection,
                        imageUrl: url,
                        image: url
                      })}
                      onStatusChange={(status, msg) => {
                        if (status === 'uploading' || status === 'saving') {
                          onNotify(msg || 'Uploading collection card photo...', 'saving');
                        } else if (status === 'saved') {
                          onNotify(msg || 'Collection card photo uploaded!', 'saved');
                        } else if (status === 'failed') {
                          onNotify(msg || 'Failed to upload photo', 'failed');
                        }
                      }}
                    />
                  </div>

                  {/* 2. Collection Page Header Banner */}
                  <div className="space-y-4 pt-2 border-t border-stone-100">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-stone-800">Collection Page Landing Banner</label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingCollection.bannerEnabled ?? true}
                          onChange={(e) => setEditingCollection({ ...editingCollection, bannerEnabled: e.target.checked })}
                          className="w-4 h-4 accent-stone-900"
                        />
                        <span className="font-bold text-stone-700">Banner Enabled</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Desktop Banner */}
                      <div>
                        <MediaUploaderCard
                          spec={MEDIA_SPECS.COLLECTION_BANNER}
                          currentUrl={editingCollection.bannerDesktopImage || editingCollection.bannerUrl}
                          onUrlChange={(url) => setEditingCollection({
                            ...editingCollection,
                            bannerDesktopImage: url,
                            bannerUrl: url
                          })}
                          onStatusChange={(status, msg) => {
                            if (status === 'uploading' || status === 'saving') {
                              onNotify(msg || 'Uploading collection banner...', 'saving');
                            } else if (status === 'saved') {
                              onNotify(msg || 'Collection banner uploaded!', 'saved');
                            } else if (status === 'failed') {
                              onNotify(msg || 'Failed to upload banner', 'failed');
                            }
                          }}
                        />
                      </div>

                      {/* Mobile Banner */}
                      <div>
                        <MediaUploaderCard
                          spec={MEDIA_SPECS.COLLECTION_BANNER_MOBILE}
                          currentUrl={editingCollection.bannerMobileImage}
                          onUrlChange={(url) => setEditingCollection({
                            ...editingCollection,
                            bannerMobileImage: url
                          })}
                          onStatusChange={(status, msg) => {
                            if (status === 'uploading' || status === 'saving') {
                              onNotify(msg || 'Uploading mobile collection banner...', 'saving');
                            } else if (status === 'saved') {
                              onNotify(msg || 'Mobile collection banner uploaded!', 'saved');
                            } else if (status === 'failed') {
                              onNotify(msg || 'Failed to upload mobile banner', 'failed');
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setEditingCollection(null)}
                      className="px-4 py-2 border border-stone-300 rounded text-stone-700 hover:bg-stone-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-medium uppercase tracking-wider cursor-pointer"
                    >
                      Save Collection Media
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. PAGE BANNERS                                          */}
      {/* ======================================================== */}
      {subview === 'banners' && (
        <div className="bg-white p-6 border border-stone-200 rounded-lg space-y-6 shadow-xs">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Page Header Banners
            </h3>
            <p className="text-xs text-stone-500">
              Control the top panoramic banner images across all collection landing pages.
            </p>
          </div>

          <div className="divide-y divide-stone-200 text-xs">
            {collections.map(col => (
              <div key={col.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={col.bannerDesktopImage || col.bannerUrl || col.imageUrl || 'https://via.placeholder.com/100'}
                    alt={col.name}
                    className="w-20 h-12 object-cover rounded border border-stone-200"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900">{col.name}</h4>
                    <span className="text-[10px] text-stone-500 font-mono">
                      Banner: {col.bannerEnabled !== false ? 'ENABLED' : 'DISABLED'} • Type: {col.bannerType || 'Image + Text'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingCollection(col);
                    onNavigateSub('collections');
                  }}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-900 hover:text-white rounded text-xs font-medium transition-colors cursor-pointer"
                >
                  Configure Banner
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. HEADER & NAVIGATION                                   */}
      {/* ======================================================== */}
      {subview === 'navigation' && (
        <div className="bg-white p-6 border border-stone-200 rounded-lg space-y-6 shadow-xs">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Header & Main Navigation Menu
            </h3>
            <p className="text-xs text-stone-500">
              Configure menu links rendered in the sticky customer navigation bar.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-stone-50 rounded border border-stone-200 space-y-2">
              <span className="font-bold text-stone-900 block">Active Storefront Menu Items:</span>
              <ul className="space-y-1.5 font-mono text-stone-700">
                <li className="flex items-center justify-between py-1 border-b border-stone-200">
                  <span>1. New Arrivals</span>
                  <span className="text-stone-400">/?collection=new-arrivals</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-stone-200">
                  <span>2. Trending</span>
                  <span className="text-stone-400">/?collection=best-selling</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-stone-200">
                  <span>3. Winter Collection</span>
                  <span className="text-stone-400">/?collection=winter-collection</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-stone-200">
                  <span>4. Co-Ords</span>
                  <span className="text-stone-400">/?collection=co-ords</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-stone-200">
                  <span>5. Short Length</span>
                  <span className="text-stone-400">/?collection=short-length-article</span>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span>6. All Ensembles</span>
                  <span className="text-stone-400">/?collection=all</span>
                </li>
              </ul>
            </div>

            {/* Empty Collection Display Policy */}
            <div className="p-4 bg-stone-50 rounded border border-stone-200 flex items-center justify-between">
              <div>
                <strong className="block text-xs text-stone-900 font-bold">Show Empty Collections on Storefront</strong>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  When OFF (recommended), collections with 0 products (e.g. Short Length) will not clutter customer navigation or filter tabs until items are assigned.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = {
                    ...siteSettings,
                    showEmptyCollectionsOnStorefront: !siteSettings.showEmptyCollectionsOnStorefront
                  };
                  setSiteSettings(updated);
                  StorageService.saveSettings(updated);
                  onNotify(`Show empty collections set to: ${!siteSettings.showEmptyCollectionsOnStorefront ? 'ENABLED' : 'DISABLED (Recommended)'}`);
                }}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                  siteSettings.showEmptyCollectionsOnStorefront ? 'bg-stone-900' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    siteSettings.showEmptyCollectionsOnStorefront ? 'translate-x-4.5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. ANNOUNCEMENT BAR                                      */}
      {/* ======================================================== */}
      {subview === 'announcement' && (
        <div className="bg-white p-6 border border-stone-200 rounded-lg space-y-6 shadow-xs">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Top Announcement Marquee
            </h3>
            <p className="text-xs text-stone-500">
              Rotating message bar at the very top of the storefront.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-stone-50 rounded border border-stone-200">
              <span className="font-bold text-stone-900">Enable Announcement Bar</span>
              <input
                type="checkbox"
                checked={cmsConfig.announcementBar?.enabled ?? true}
                onChange={(e) => setCmsConfig({
                  ...cmsConfig,
                  announcementBar: {
                    ...(cmsConfig.announcementBar || { messages: [] }),
                    enabled: e.target.checked
                  }
                })}
                className="w-4 h-4 accent-stone-900 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-stone-800">
                Announcement Messages (One per line):
              </label>
              <textarea
                rows={4}
                value={(cmsConfig.announcementBar?.messages || [
                  'COMPLIMENTARY SHIPPING ON ALL FULL ADVANCE ORDERS',
                  'WORLDWIDE EXPRESS ATELIER COURIER',
                  'PURE ORGANZA & RAW SILK CRAFTSMANSHIP'
                ]).join('\n')}
                onChange={(e) => {
                  const msgs = e.target.value.split('\n').filter(Boolean);
                  setCmsConfig({
                    ...cmsConfig,
                    announcementBar: {
                      ...(cmsConfig.announcementBar || { enabled: true }),
                      messages: msgs
                    }
                  });
                }}
                className="w-full p-2.5 border border-stone-300 rounded font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => handleSaveCMS('Announcement Bar')}
              disabled={isSaving}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Announcement Bar'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. FOOTER & POLICIES                                     */}
      {/* ======================================================== */}
      {subview === 'footer' && (
        <div className="bg-white p-6 border border-stone-200 rounded-lg space-y-6 shadow-xs">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Footer Content & Atelier Blurb
            </h3>
            <p className="text-xs text-stone-500">
              Manage atelier story blurb, customer service hours, and policy notes.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block font-bold text-stone-800">Atelier Brand Story / Footer Blurb</label>
              <textarea
                rows={3}
                value={siteSettings.tagline || 'GulPash represents the pinnacle of handcrafted Pakistani luxury pret, signature velvets, and pure organza ensembles.'}
                onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-stone-800">Boutique Address</label>
              <input
                type="text"
                value={siteSettings.address || 'GulPash Atelier, MM Alam Road, Gulberg III, Lahore, Pakistan'}
                onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => handleSaveSettings('Footer Content')}
              disabled={isSaving}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Footer'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. MEDIA LIBRARY EMBEDDED                                */}
      {/* ======================================================== */}
      {subview === 'media' && (
        <MediaLibrarySection onNotify={onNotify} />
      )}
    </div>
  );
};
