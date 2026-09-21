import React, { useState } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  ImageIcon, 
  Video, 
  Eye, 
  CheckCircle2, 
  Sliders, 
  Sparkles,
  Smartphone,
  Monitor
} from 'lucide-react';
import { CMSConfig, EditorialCampaignItem, EditorialCampaignSectionConfig } from '../../../types';
import { MEDIA_SPECS } from '../../../constants/mediaSpecs';
import { MediaUploaderCard } from '../MediaUploaderCard';
import { StorageService } from '../../../lib/storage';
import { 
  normalizeEditorialCampaign, 
  createNewCampaign 
} from '../../../lib/campaignHelper';

interface EditorialCampaignManagerProps {
  cmsConfig: CMSConfig;
  onUpdateCMS: (updated: CMSConfig) => void;
  onNotify: (msg: string, status?: 'saving' | 'saved' | 'failed') => void;
}

export const EditorialCampaignManager: React.FC<EditorialCampaignManagerProps> = ({
  cmsConfig,
  onUpdateCMS,
  onNotify
}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');

  // Ensure normalized config
  const campaignConfig: EditorialCampaignSectionConfig = normalizeEditorialCampaign(cmsConfig);
  const campaigns = campaignConfig.campaigns && campaignConfig.campaigns.length > 0
    ? campaignConfig.campaigns
    : [createNewCampaign(1, 'Campaign 1')];

  const [activeCampaignIdx, setActiveCampaignIdx] = useState<number>(() => {
    const activeIdx = campaigns.findIndex(c => c.id === campaignConfig.activeCampaignId);
    return activeIdx >= 0 ? activeIdx : 0;
  });

  const safeIdx = activeCampaignIdx < campaigns.length ? activeCampaignIdx : 0;
  const currentCampaign = campaigns[safeIdx] || campaigns[0];

  // Helper to commit changes to local React state
  const updateSectionConfig = (newConfig: EditorialCampaignSectionConfig) => {
    const updatedCMS: CMSConfig = {
      ...cmsConfig,
      showEditorialCampaign: newConfig.enabled,
      showEditorialBanner: newConfig.enabled,
      editorialCampaign: newConfig
    };
    onUpdateCMS(updatedCMS);
  };

  const updateCurrentCampaign = (patch: Partial<EditorialCampaignItem>) => {
    const updatedCampaigns = campaigns.map((c, idx) => {
      if (idx === safeIdx) {
        return { ...c, ...patch };
      }
      return c;
    });

    updateSectionConfig({
      ...campaignConfig,
      campaigns: updatedCampaigns
    });
  };

  // Persistent Auto-Save for Media Uploads (Persists to canonical Supabase CMS before confirming saved)
  const autoSaveCampaignMedia = async (field: keyof EditorialCampaignItem, newUrl: string, label: string) => {
    const previousValue = currentCampaign[field];

    const updatedCampaigns = campaigns.map((c, idx) => {
      if (idx === safeIdx) {
        return { ...c, [field]: newUrl };
      }
      return c;
    });

    const updatedSection: EditorialCampaignSectionConfig = {
      ...campaignConfig,
      campaigns: updatedCampaigns
    };

    const updatedCMS: CMSConfig = {
      ...cmsConfig,
      showEditorialCampaign: updatedSection.enabled,
      showEditorialBanner: updatedSection.enabled,
      editorialCampaign: updatedSection
    };

    // 1. Authoritative CMS persistence to Supabase
    await StorageService.saveCMSAsync(updatedCMS);

    // 2. Safe cleanup of old replaced Supabase asset (ONLY after CMS save succeeded)
    if (
      typeof previousValue === 'string' &&
      previousValue &&
      previousValue !== newUrl &&
      previousValue.includes('supabase.co/storage/v1/object/public/')
    ) {
      try {
        const match = previousValue.match(/public\/([^/]+)\/(.+)$/);
        if (match) {
          const [, bucket, storagePath] = match;
          StorageService.deleteFromSupabaseStorage(bucket, decodeURIComponent(storagePath)).catch(() => {});
        }
      } catch {}
    }

    // 3. Update React CMS state
    updateSectionConfig(updatedSection);
    onNotify(`${label} saved & published to CMS.`, 'saved');
  };

  // Master Section Save Handler (Secure Server Endpoint)
  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      onNotify('Saving editorial campaign to Supabase...', 'saving');

      const updatedCMS: CMSConfig = {
        ...cmsConfig,
        showEditorialCampaign: campaignConfig.enabled,
        showEditorialBanner: campaignConfig.enabled,
        editorialCampaign: campaignConfig
      };

      await StorageService.saveCMSAsync(updatedCMS);
      StorageService.addActivityLog({
        action: 'Editorial Campaign Updated',
        category: 'cms',
        actor: 'Admin Concierge',
        details: `Saved ${campaigns.length} editorial campaign(s). Active: ${currentCampaign.name}.`
      });

      onNotify('Editorial campaign saved & published successfully!', 'saved');
    } catch (err: any) {
      console.error('Failed to save editorial campaign:', err);
      onNotify(err?.message || 'Failed to save editorial campaign to Supabase.', 'failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Campaign management actions
  const handleAddCampaign = () => {
    const newOrder = campaigns.length + 1;
    const newCamp = createNewCampaign(newOrder, `Campaign ${newOrder}`);
    const updated = [...campaigns, newCamp];
    updateSectionConfig({
      ...campaignConfig,
      campaigns: updated
    });
    setActiveCampaignIdx(updated.length - 1);
  };

  const handleDuplicateCampaign = () => {
    const newOrder = campaigns.length + 1;
    const dup: EditorialCampaignItem = {
      ...currentCampaign,
      id: `campaign-${Date.now()}`,
      order: newOrder,
      name: `${currentCampaign.name} (Copy)`,
      enabled: false // duplicated as draft
    };
    const updated = [...campaigns, dup];
    updateSectionConfig({
      ...campaignConfig,
      campaigns: updated
    });
    setActiveCampaignIdx(updated.length - 1);
  };

  const handleDeleteCampaign = () => {
    if (campaigns.length <= 1) {
      alert('At least one campaign must remain in the configuration.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${currentCampaign.name}"?`)) {
      return;
    }

    const updated = campaigns.filter((_, idx) => idx !== safeIdx).map((c, i) => ({
      ...c,
      order: i + 1
    }));

    updateSectionConfig({
      ...campaignConfig,
      campaigns: updated
    });
    setActiveCampaignIdx(Math.max(0, safeIdx - 1));
  };

  const handleMoveUp = () => {
    if (safeIdx <= 0) return;
    const updated = [...campaigns];
    const temp = updated[safeIdx - 1];
    updated[safeIdx - 1] = updated[safeIdx];
    updated[safeIdx] = temp;
    updated.forEach((c, idx) => { c.order = idx + 1; });
    updateSectionConfig({ ...campaignConfig, campaigns: updated });
    setActiveCampaignIdx(safeIdx - 1);
  };

  const handleMoveDown = () => {
    if (safeIdx >= campaigns.length - 1) return;
    const updated = [...campaigns];
    const temp = updated[safeIdx + 1];
    updated[safeIdx + 1] = updated[safeIdx];
    updated[safeIdx] = temp;
    updated.forEach((c, idx) => { c.order = idx + 1; });
    updateSectionConfig({ ...campaignConfig, campaigns: updated });
    setActiveCampaignIdx(safeIdx + 1);
  };

  return (
    <div className="space-y-6">
      {/* 1. MASTER HEADER & PUBLISH CONTROLS */}
      <div className="bg-white p-6 border border-stone-200 rounded-lg shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded uppercase">
                16:7 DESKTOP • 4:5 MOBILE CANVAS
              </span>
              <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded uppercase">
                SUPABASE CMS READY
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900 mt-1">
              Homepage Editorial & Royal Couture Campaign
            </h3>
            <p className="text-xs text-stone-500 max-w-2xl">
              Configure the mid-page editorial showcase featuring artisan needlework, zardozi embroidery stories, or runway video clips.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save & Publish Campaign'}</span>
            </button>
          </div>
        </div>

        {/* Master Section Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-lg gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-stone-900">Show Editorial Campaign</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                campaignConfig.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
              }`}>
                {campaignConfig.enabled ? 'VISIBLE ON HOMEPAGE' : 'COMPLETELY HIDDEN'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              When switched OFF, this entire section is eliminated from the storefront without leaving any blank gap.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={campaignConfig.enabled}
                onChange={(e) => updateSectionConfig({ ...campaignConfig, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
            </label>
          </div>
        </div>

        {/* Display Mode Switcher (Single vs Slider) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg space-y-2">
            <span className="block font-bold text-xs text-stone-800">Display Mode</span>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => updateSectionConfig({ ...campaignConfig, displayMode: 'single' })}
                className={`flex-1 py-2 px-3 rounded font-medium text-center transition-colors cursor-pointer ${
                  campaignConfig.displayMode === 'single'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-300 text-stone-700'
                }`}
              >
                Single Campaign (Default)
              </button>
              <button
                type="button"
                onClick={() => updateSectionConfig({ ...campaignConfig, displayMode: 'slider' })}
                className={`flex-1 py-2 px-3 rounded font-medium text-center transition-colors cursor-pointer ${
                  campaignConfig.displayMode === 'slider'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-300 text-stone-700'
                }`}
              >
                Campaign Slider
              </button>
            </div>
          </div>

          {/* Slider Specific Settings */}
          {campaignConfig.displayMode === 'slider' && (
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg space-y-2 text-xs">
              <span className="block font-bold text-stone-800">Slider Controls</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campaignConfig.sliderSettings?.autoPlay ?? true}
                    onChange={(e) => updateSectionConfig({
                      ...campaignConfig,
                      sliderSettings: {
                        ...(campaignConfig.sliderSettings || { slideDuration: 6, showArrows: true, showDots: true, pauseOnHover: true, autoPlay: true }),
                        autoPlay: e.target.checked
                      }
                    })}
                    className="accent-stone-900"
                  />
                  <span>Autoplay</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campaignConfig.sliderSettings?.showArrows ?? true}
                    onChange={(e) => updateSectionConfig({
                      ...campaignConfig,
                      sliderSettings: {
                        ...(campaignConfig.sliderSettings || { autoPlay: true, slideDuration: 6, showDots: true, pauseOnHover: true, showArrows: true }),
                        showArrows: e.target.checked
                      }
                    })}
                    className="accent-stone-900"
                  />
                  <span>Show Arrows</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campaignConfig.sliderSettings?.showDots ?? true}
                    onChange={(e) => updateSectionConfig({
                      ...campaignConfig,
                      sliderSettings: {
                        ...(campaignConfig.sliderSettings || { autoPlay: true, slideDuration: 6, showArrows: true, pauseOnHover: true, showDots: true }),
                        showDots: e.target.checked
                      }
                    })}
                    className="accent-stone-900"
                  />
                  <span>Show Dots</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campaignConfig.sliderSettings?.pauseOnHover ?? true}
                    onChange={(e) => updateSectionConfig({
                      ...campaignConfig,
                      sliderSettings: {
                        ...(campaignConfig.sliderSettings || { autoPlay: true, slideDuration: 6, showArrows: true, showDots: true, pauseOnHover: true }),
                        pauseOnHover: e.target.checked
                      }
                    })}
                    className="accent-stone-900"
                  />
                  <span>Pause on Hover</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. CAMPAIGN TABS & REORDER BAR */}
      <div className="bg-white p-4 border border-stone-200 rounded-lg shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider text-stone-700">Campaigns</span>
            <span className="text-[10px] text-stone-500 font-mono">({campaigns.length} total)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleMoveUp}
              disabled={safeIdx <= 0}
              className="p-1.5 border border-stone-200 rounded text-stone-600 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
              title="Move Up"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleMoveDown}
              disabled={safeIdx >= campaigns.length - 1}
              className="p-1.5 border border-stone-200 rounded text-stone-600 hover:bg-stone-100 disabled:opacity-30 cursor-pointer"
              title="Move Down"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleDuplicateCampaign}
              className="p-1.5 border border-stone-200 rounded text-stone-600 hover:bg-stone-100 cursor-pointer"
              title="Duplicate Campaign"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleDeleteCampaign}
              disabled={campaigns.length <= 1}
              className="p-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded disabled:opacity-30 cursor-pointer"
              title="Delete Campaign"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleAddCampaign}
              className="flex items-center gap-1 bg-stone-900 hover:bg-stone-800 text-white px-3 py-1.5 rounded text-xs font-medium cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Campaign</span>
            </button>
          </div>
        </div>

        {/* Campaign Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {campaigns.map((camp, idx) => {
            const isSelected = idx === safeIdx;
            const isLive = camp.enabled;
            return (
              <button
                key={camp.id}
                type="button"
                onClick={() => {
                  setActiveCampaignIdx(idx);
                  if (campaignConfig.displayMode === 'single') {
                    updateSectionConfig({ ...campaignConfig, activeCampaignId: camp.id });
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>#{idx + 1} {camp.name || `Campaign ${idx + 1}`}</span>
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-stone-400'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE CAMPAIGN SETTINGS & MEDIA EDITORS */}
      <div className="bg-white p-6 border border-stone-200 rounded-lg shadow-xs space-y-6">
        {/* Campaign Meta: Name & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-stone-100 text-xs">
          <div>
            <label className="block font-bold text-stone-800 mb-1">Campaign Title (Internal Reference)</label>
            <input
              type="text"
              value={currentCampaign.name}
              onChange={(e) => updateCurrentCampaign({ name: e.target.value })}
              className="w-full p-2 border border-stone-300 rounded font-medium"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer pb-2">
              <input
                type="checkbox"
                checked={currentCampaign.enabled}
                onChange={(e) => updateCurrentCampaign({ enabled: e.target.checked })}
                className="w-4 h-4 accent-stone-900"
              />
              <span className="font-bold text-stone-800">Campaign Active / Published</span>
            </label>
          </div>

          {/* Media Type Switcher */}
          <div>
            <label className="block font-bold text-stone-800 mb-1">Media Presentation Format</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateCurrentCampaign({ mediaType: 'image' })}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded font-medium transition-colors cursor-pointer ${
                  currentCampaign.mediaType === 'image'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-50 border border-stone-300 text-stone-700'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Option A: Image</span>
              </button>

              <button
                type="button"
                onClick={() => updateCurrentCampaign({ mediaType: 'video' })}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded font-medium transition-colors cursor-pointer ${
                  currentCampaign.mediaType === 'video'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-50 border border-stone-300 text-stone-700'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Option B: Video Loop</span>
              </button>
            </div>
          </div>
        </div>

        {/* MEDIA UPLOADERS */}
        {currentCampaign.mediaType === 'image' ? (
          /* IMAGE MODE */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-stone-800">
                Campaign Imagery (16:7 Desktop & 4:5 Mobile)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Desktop Image */}
              <div className="space-y-3">
                <MediaUploaderCard
                  spec={MEDIA_SPECS.CAMPAIGN_DESKTOP_IMAGE}
                  currentUrl={currentCampaign.desktopImageUrl}
                  onUrlChange={(url) => updateCurrentCampaign({ desktopImageUrl: url })}
                  onAutoSave={async (url) => {
                    await autoSaveCampaignMedia('desktopImageUrl', url, 'Campaign desktop image');
                  }}
                  onStatusChange={(status, msg) => {
                    if (status === 'uploading' || status === 'saving') onNotify(msg || 'Uploading...', 'saving');
                    else if (status === 'saved') onNotify(msg || 'Image saved successfully!', 'saved');
                    else if (status === 'failed') onNotify(msg || 'Upload failed', 'failed');
                  }}
                />

                <div className="text-xs space-y-1">
                  <label className="block font-medium text-stone-700">Desktop Focal Position</label>
                  <select
                    value={currentCampaign.objectPositionDesktop || 'center'}
                    onChange={(e) => updateCurrentCampaign({ objectPositionDesktop: e.target.value as any })}
                    className="w-full p-2 border border-stone-300 rounded bg-white text-xs"
                  >
                    <option value="center">Center (Default)</option>
                    <option value="top">Top (Preserve Neckline & Embroidery)</option>
                    <option value="bottom">Bottom (Focus on Hem / Daman)</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

              {/* Mobile Image */}
              <div className="space-y-3">
                <MediaUploaderCard
                  spec={MEDIA_SPECS.CAMPAIGN_MOBILE_IMAGE}
                  currentUrl={currentCampaign.mobileImageUrl || currentCampaign.desktopImageUrl}
                  onUrlChange={(url) => updateCurrentCampaign({ mobileImageUrl: url })}
                  onAutoSave={async (url) => {
                    await autoSaveCampaignMedia('mobileImageUrl', url, 'Campaign mobile image');
                  }}
                  onStatusChange={(status, msg) => {
                    if (status === 'uploading' || status === 'saving') onNotify(msg || 'Uploading...', 'saving');
                    else if (status === 'saved') onNotify(msg || 'Image saved successfully!', 'saved');
                    else if (status === 'failed') onNotify(msg || 'Upload failed', 'failed');
                  }}
                />

                <div className="text-xs space-y-1">
                  <label className="block font-medium text-stone-700">Mobile Focal Position</label>
                  <select
                    value={currentCampaign.objectPositionMobile || 'center'}
                    onChange={(e) => updateCurrentCampaign({ objectPositionMobile: e.target.value as any })}
                    className="w-full p-2 border border-stone-300 rounded bg-white text-xs"
                  >
                    <option value="center">Center (Default)</option>
                    <option value="top">Top (Portrait Center)</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Accessibility Alt Text */}
            <div className="text-xs space-y-1 pt-2">
              <label className="block font-medium text-stone-700">Image Alt Text (Accessibility & SEO)</label>
              <input
                type="text"
                value={currentCampaign.altText || ''}
                onChange={(e) => updateCurrentCampaign({ altText: e.target.value })}
                placeholder="e.g. Royal Couture Campaign - Handcrafted Pakistani Zardozi Embroidery"
                className="w-full p-2 border border-stone-300 rounded"
              />
            </div>
          </div>
        ) : (
          /* VIDEO MODE */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-stone-800">
                Runway & Atelier Video Loops (16:7 Desktop & 4:5 Mobile)
              </span>
            </div>

            {/* Video Uploaders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Desktop Video */}
              <div className="space-y-3">
                <MediaUploaderCard
                  spec={MEDIA_SPECS.CAMPAIGN_DESKTOP_VIDEO}
                  currentUrl={currentCampaign.videoUrl}
                  onUrlChange={(url) => updateCurrentCampaign({ videoUrl: url })}
                  onAutoSave={async (url) => {
                    await autoSaveCampaignMedia('videoUrl', url, 'Campaign desktop video');
                  }}
                  onStatusChange={(status, msg) => {
                    if (status === 'uploading' || status === 'saving') onNotify(msg || 'Uploading video...', 'saving');
                    else if (status === 'saved') onNotify(msg || 'Video saved!', 'saved');
                    else if (status === 'failed') onNotify(msg || 'Upload failed', 'failed');
                  }}
                />
              </div>

              {/* Mobile Video */}
              <div className="space-y-3">
                <MediaUploaderCard
                  spec={MEDIA_SPECS.CAMPAIGN_MOBILE_VIDEO}
                  currentUrl={currentCampaign.mobileVideoUrl}
                  onUrlChange={(url) => updateCurrentCampaign({ mobileVideoUrl: url })}
                  onAutoSave={async (url) => {
                    await autoSaveCampaignMedia('mobileVideoUrl', url, 'Campaign mobile video');
                  }}
                  onStatusChange={(status, msg) => {
                    if (status === 'uploading' || status === 'saving') onNotify(msg || 'Uploading video...', 'saving');
                    else if (status === 'saved') onNotify(msg || 'Video saved!', 'saved');
                    else if (status === 'failed') onNotify(msg || 'Upload failed', 'failed');
                  }}
                />

                {/* Fallback choice if mobile video not uploaded */}
                <div className="text-xs space-y-1">
                  <label className="block font-medium text-stone-700">Mobile Video Fallback Strategy</label>
                  <select
                    value={currentCampaign.mobileVideoFallback || 'mobile_poster'}
                    onChange={(e) => updateCurrentCampaign({ mobileVideoFallback: e.target.value as any })}
                    className="w-full p-2 border border-stone-300 rounded bg-white text-xs"
                  >
                    <option value="mobile_poster">Use Mobile Poster Image (Recommended for Performance)</option>
                    <option value="desktop_video">Use Desktop Video Loop</option>
                    <option value="mobile_image">Use Mobile Artwork Image</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Poster Images for Video (Avoid black flashes) */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-3 text-xs">
              <div>
                <span className="font-bold text-stone-800 block">Video Poster & Fallback Frame (Required for Smooth Paint)</span>
                <p className="text-stone-500">
                  Displayed while the video buffers, when autoplay is blocked by browser battery saver, or when user has reduced motion turned on.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MediaUploaderCard
                  spec={MEDIA_SPECS.CAMPAIGN_DESKTOP_POSTER}
                  currentUrl={currentCampaign.posterImageUrl}
                  onUrlChange={(url) => updateCurrentCampaign({ posterImageUrl: url })}
                  onAutoSave={async (url) => {
                    await autoSaveCampaignMedia('posterImageUrl', url, 'Desktop video poster frame');
                  }}
                />

                <MediaUploaderCard
                  spec={MEDIA_SPECS.CAMPAIGN_MOBILE_POSTER}
                  currentUrl={currentCampaign.mobilePosterImageUrl}
                  onUrlChange={(url) => updateCurrentCampaign({ mobilePosterImageUrl: url })}
                  onAutoSave={async (url) => {
                    await autoSaveCampaignMedia('mobilePosterImageUrl', url, 'Mobile video poster frame');
                  }}
                />
              </div>
            </div>

            {/* Video Playback Settings */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-3 text-xs">
              <span className="font-bold text-stone-800 block">Cinematic Playback Parameters</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentCampaign.videoAutoplay !== false}
                    onChange={(e) => updateCurrentCampaign({ videoAutoplay: e.target.checked })}
                    className="accent-stone-900"
                  />
                  <span>Autoplay (Muted)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentCampaign.videoLoop !== false}
                    onChange={(e) => updateCurrentCampaign({ videoLoop: e.target.checked })}
                    className="accent-stone-900"
                  />
                  <span>Loop Indefinitely</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentCampaign.videoMuted !== false}
                    onChange={(e) => updateCurrentCampaign({ videoMuted: e.target.checked })}
                    className="accent-stone-900"
                  />
                  <span>Muted Audio</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentCampaign.videoShowControls === true}
                    onChange={(e) => updateCurrentCampaign({ videoShowControls: e.target.checked })}
                    className="accent-stone-900"
                  />
                  <span>Show Video Controls</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 4. TEXT & CTA MASTER TOGGLE */}
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-stone-900">Show Text & CTA Overlay</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  currentCampaign.showTextAndCta !== false
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {currentCampaign.showTextAndCta !== false ? 'TEXT & CTAS ACTIVE' : 'PURE ARTWORK ONLY'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Turn OFF to display clean, full-bleed imagery/video with zero text, headings, buttons, or dark text backdrop.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={currentCampaign.showTextAndCta !== false}
                onChange={(e) => updateCurrentCampaign({ showTextAndCta: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
            </label>
          </div>
        </div>

        {/* 5. INDIVIDUAL TEXT CONTROLS (IF TEXT ON) */}
        {currentCampaign.showTextAndCta !== false && (
          <div className="p-5 border border-stone-200 rounded-lg space-y-4 text-xs">
            <span className="font-bold text-xs uppercase tracking-wider text-stone-800 block">
              Editorial Copywriting & CTAs
            </span>

            {/* Eyebrow */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-stone-800">Eyebrow Tagline</label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentCampaign.showEyebrow !== false}
                    onChange={(e) => updateCurrentCampaign({ showEyebrow: e.target.checked })}
                    className="accent-stone-900"
                  />
                  <span>Show Eyebrow</span>
                </label>
              </div>
              <input
                type="text"
                value={currentCampaign.eyebrow ?? ''}
                placeholder="e.g. ROYAL COUTURE CAMPAIGN"
                onChange={(e) => updateCurrentCampaign({ eyebrow: e.target.value })}
                disabled={currentCampaign.showEyebrow === false}
                className="w-full p-2 border border-stone-300 rounded disabled:bg-stone-100 uppercase tracking-widest font-mono text-[11px]"
              />
            </div>

            {/* Heading */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-stone-800">Main Editorial Headline</label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentCampaign.showHeading !== false}
                    onChange={(e) => updateCurrentCampaign({ showHeading: e.target.checked })}
                    className="accent-stone-900"
                  />
                  <span>Show Heading</span>
                </label>
              </div>
              <input
                type="text"
                value={currentCampaign.heading ?? ''}
                placeholder="e.g. The Sovereign Craft of Pakistani Embroidery"
                onChange={(e) => updateCurrentCampaign({ heading: e.target.value })}
                disabled={currentCampaign.showHeading === false}
                className="w-full p-2.5 border border-stone-300 rounded font-serif text-sm font-medium disabled:bg-stone-100"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-stone-800">Campaign Narrative / Description</label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentCampaign.showDescription !== false}
                    onChange={(e) => updateCurrentCampaign({ showDescription: e.target.checked })}
                    className="accent-stone-900"
                  />
                  <span>Show Description</span>
                </label>
              </div>
              <textarea
                rows={2}
                value={currentCampaign.description ?? ''}
                placeholder="Witness the intricate zardozi, hand-tilla motifs, and fine pure threadwork..."
                onChange={(e) => updateCurrentCampaign({ description: e.target.value })}
                disabled={currentCampaign.showDescription === false}
                className="w-full p-2 border border-stone-300 rounded disabled:bg-stone-100 font-sans"
              />
            </div>

            {/* Primary CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-800">Primary CTA Label</label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentCampaign.showCta !== false}
                      onChange={(e) => updateCurrentCampaign({ showCta: e.target.checked })}
                      className="accent-stone-900"
                    />
                    <span>Show CTA</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={currentCampaign.ctaLabel ?? ''}
                  placeholder="e.g. EXPLORE TRENDING ENSEMBLES"
                  onChange={(e) => updateCurrentCampaign({ ctaLabel: e.target.value })}
                  disabled={currentCampaign.showCta === false}
                  className="w-full p-2 border border-stone-300 rounded disabled:bg-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-800">Primary CTA Link</label>
                <input
                  type="text"
                  value={currentCampaign.ctaUrl ?? ''}
                  placeholder="e.g. /collections/best-selling"
                  onChange={(e) => updateCurrentCampaign({ ctaUrl: e.target.value })}
                  disabled={currentCampaign.showCta === false}
                  className="w-full p-2 border border-stone-300 rounded font-mono text-xs disabled:bg-stone-100"
                />
              </div>
            </div>

            {/* Secondary CTA (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-800">Secondary CTA Label (Optional)</label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentCampaign.showSecondaryCta === true}
                      onChange={(e) => updateCurrentCampaign({ showSecondaryCta: e.target.checked })}
                      className="accent-stone-900"
                    />
                    <span>Enable 2nd CTA</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={currentCampaign.secondaryCtaLabel || ''}
                  onChange={(e) => updateCurrentCampaign({ secondaryCtaLabel: e.target.value })}
                  disabled={!currentCampaign.showSecondaryCta}
                  placeholder="e.g. View Lookbook"
                  className="w-full p-2 border border-stone-300 rounded disabled:bg-stone-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-800">Secondary CTA Link</label>
                <input
                  type="text"
                  value={currentCampaign.secondaryCtaUrl || ''}
                  onChange={(e) => updateCurrentCampaign({ secondaryCtaUrl: e.target.value })}
                  disabled={!currentCampaign.showSecondaryCta}
                  placeholder="/collections/luxury-formals"
                  className="w-full p-2 border border-stone-300 rounded font-mono text-xs disabled:bg-stone-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* 6. OVERLAY, THEME & CONTENT ALIGNMENT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 bg-stone-50 border border-stone-200 rounded-lg text-xs">
          {/* Overlay Strength Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800">Dark Overlay</span>
              <span className="font-mono font-bold bg-stone-200 text-stone-800 px-2 py-0.5 rounded text-[11px]">
                {currentCampaign.showOverlay !== false ? `${currentCampaign.overlayOpacity ?? 45}%` : 'OFF'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={currentCampaign.overlayOpacity ?? 45}
              onChange={(e) => updateCurrentCampaign({ 
                overlayOpacity: Number(e.target.value),
                showOverlay: Number(e.target.value) > 0
              })}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <span className="text-[10px] text-stone-500 block">Controls dark legibility tint (0% to 80%).</span>
          </div>

          {/* Text Theme */}
          <div className="space-y-2">
            <span className="font-bold text-stone-800 block">Text Theme</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateCurrentCampaign({ textTheme: 'light' })}
                className={`flex-1 py-1.5 rounded font-medium border text-center transition-colors cursor-pointer ${
                  currentCampaign.textTheme !== 'dark'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                Light (White)
              </button>
              <button
                type="button"
                onClick={() => updateCurrentCampaign({ textTheme: 'dark' })}
                className={`flex-1 py-1.5 rounded font-medium border text-center transition-colors cursor-pointer ${
                  currentCampaign.textTheme === 'dark'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                Dark (Charcoal)
              </button>
            </div>
            <span className="text-[10px] text-stone-500 block">Match text color to campaign artwork.</span>
          </div>

          {/* Content Alignment */}
          <div className="space-y-2">
            <span className="font-bold text-stone-800 block">Content Alignment</span>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={currentCampaign.horizontalAlignment || 'center'}
                onChange={(e) => updateCurrentCampaign({ horizontalAlignment: e.target.value as any })}
                className="w-full p-1.5 border border-stone-300 rounded bg-white"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>

              <select
                value={currentCampaign.verticalAlignment || 'center'}
                onChange={(e) => updateCurrentCampaign({ verticalAlignment: e.target.value as any })}
                className="w-full p-1.5 border border-stone-300 rounded bg-white"
              >
                <option value="top">Top</option>
                <option value="center">Center</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
            <span className="text-[10px] text-stone-500 block">Default: Center / Center.</span>
          </div>
        </div>
      </div>

      {/* 7. EXACT LIVE PREVIEW (16:7 DESKTOP & 4:5 MOBILE) */}
      <div className="bg-white p-6 border border-stone-200 rounded-lg shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-stone-800" />
            <span className="font-bold text-xs uppercase tracking-wider text-stone-800">
              Exact Canvas Live Storefront Preview
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setPreviewViewport('desktop')}
              className={`flex items-center gap-1 px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                previewViewport === 'desktop' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop (16:7)</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewViewport('mobile')}
              className={`flex items-center gap-1 px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                previewViewport === 'mobile' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (4:5)</span>
            </button>
          </div>
        </div>

        {/* Live Preview Container */}
        <div className="bg-stone-950 p-4 rounded-lg flex items-center justify-center overflow-hidden">
          <div className={`relative overflow-hidden rounded bg-stone-900 transition-all duration-300 ${
            previewViewport === 'desktop'
              ? 'w-full aspect-[16/7] max-w-5xl'
              : 'w-full max-w-xs aspect-[4/5]'
          }`}>
            {/* Media Background */}
            {currentCampaign.mediaType === 'video' && currentCampaign.videoUrl ? (
              <video
                src={currentCampaign.videoUrl}
                poster={currentCampaign.posterImageUrl}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (previewViewport === 'mobile' ? (currentCampaign.mobileImageUrl || currentCampaign.desktopImageUrl) : currentCampaign.desktopImageUrl) ? (
              <img
                src={previewViewport === 'mobile' ? (currentCampaign.mobileImageUrl || currentCampaign.desktopImageUrl) : currentCampaign.desktopImageUrl}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900 text-stone-500 text-xs p-4 text-center">
                <ImageIcon className="w-8 h-8 stroke-1 text-stone-600 mb-1" />
                <span>No media configured</span>
              </div>
            )}

            {/* Dark Overlay */}
            {currentCampaign.showOverlay !== false && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundColor: `rgba(0, 0, 0, ${(currentCampaign.overlayOpacity ?? 45) / 100})` }}
              />
            )}

            {/* Overlay Text & CTA */}
            {currentCampaign.showTextAndCta !== false && (
              <div className={`absolute inset-0 flex flex-col p-6 sm:p-10 ${
                currentCampaign.verticalAlignment === 'top' ? 'justify-start' :
                currentCampaign.verticalAlignment === 'bottom' ? 'justify-end' : 'justify-center'
              }`}>
                <div className={`flex flex-col space-y-2 ${
                  currentCampaign.horizontalAlignment === 'left' ? 'items-start text-left' :
                  currentCampaign.horizontalAlignment === 'right' ? 'items-end text-right' : 'items-center text-center'
                }`}>
                  {currentCampaign.showEyebrow !== false && currentCampaign.eyebrow && (
                    <span className={`text-[9px] uppercase tracking-[0.3em] font-medium ${
                      currentCampaign.textTheme === 'dark' ? 'text-stone-700' : 'text-stone-300'
                    }`}>
                      {currentCampaign.eyebrow}
                    </span>
                  )}

                  {currentCampaign.showHeading !== false && currentCampaign.heading && (
                    <h3 className={`font-serif text-lg sm:text-2xl lg:text-3xl font-light italic leading-tight ${
                      currentCampaign.textTheme === 'dark' ? 'text-stone-900' : 'text-white'
                    }`}>
                      {currentCampaign.heading}
                    </h3>
                  )}

                  {currentCampaign.showDescription !== false && currentCampaign.description && (
                    <p className={`text-[11px] sm:text-xs max-w-md ${
                      currentCampaign.textTheme === 'dark' ? 'text-stone-800' : 'text-stone-200'
                    }`}>
                      {currentCampaign.description}
                    </p>
                  )}

                  {currentCampaign.showCta !== false && currentCampaign.ctaLabel && (
                    <div className="pt-2">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest py-2 px-4 shadow-sm ${
                        currentCampaign.textTheme === 'dark'
                          ? 'bg-stone-900 text-white'
                          : 'bg-white text-stone-900'
                      }`}>
                        <span>{currentCampaign.ctaLabel}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
