import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Copy, Eye, EyeOff, Save, CheckCircle, 
  AlertCircle, Sparkles, MoveHorizontal, Monitor, Smartphone, Sliders, 
  Image as ImageIcon, Video, Layers, Type, ExternalLink
} from 'lucide-react';
import { HomepageCMS, HeroSlideItem, HeroSliderSettings } from '../../../types';
import { MEDIA_SPECS } from '../../../constants/mediaSpecs';
import { MediaUploaderCard } from '../MediaUploaderCard';
import { StorageService } from '../../../lib/storage';
import { 
  createEmptyHeroSlide, 
  migrateHeroToSlides, 
  syncSlideToLegacyHero,
  DEFAULT_HERO_SLIDER_SETTINGS 
} from '../../../lib/heroHelper';

interface HeroSlideManagerProps {
  cmsConfig: HomepageCMS;
  onUpdateCMS: (updated: HomepageCMS) => void;
  onNotify: (msg: string, type: 'saved' | 'failed' | 'saving' | 'info') => void;
}

export const HeroSlideManager: React.FC<HeroSlideManagerProps> = ({
  cmsConfig,
  onUpdateCMS,
  onNotify,
}) => {
  // Initialize state from existing cmsConfig
  const [slides, setSlides] = useState<HeroSlideItem[]>(() => {
    const { slides: initialSlides } = migrateHeroToSlides(cmsConfig);
    return initialSlides;
  });

  const [sliderSettings, setSliderSettings] = useState<HeroSliderSettings>(() => {
    const { settings } = migrateHeroToSlides(cmsConfig);
    return settings;
  });

  const [announcementBarActive, setAnnouncementBarActive] = useState<boolean>(
    cmsConfig.announcementBarActive ?? true
  );

  const [activeSlideId, setActiveSlideId] = useState<string>(() => {
    const { slides: initialSlides } = migrateHeroToSlides(cmsConfig);
    return initialSlides[0]?.id || 'slide-1';
  });

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync state if external cmsConfig changes
  useEffect(() => {
    if (cmsConfig.heroSlides && cmsConfig.heroSlides.length > 0) {
      setSlides(cmsConfig.heroSlides);
    }
    if (cmsConfig.heroSliderSettings) {
      setSliderSettings(cmsConfig.heroSliderSettings);
    }
    if (typeof cmsConfig.announcementBarActive === 'boolean') {
      setAnnouncementBarActive(cmsConfig.announcementBarActive);
    }
  }, [cmsConfig.heroSlides, cmsConfig.heroSliderSettings, cmsConfig.announcementBarActive]);

  // Current active slide
  const activeSlide = slides.find((s) => s.id === activeSlideId) || slides[0] || createEmptyHeroSlide(1);
  const activeIndex = slides.findIndex((s) => s.id === activeSlide.id);

  // Helper to update active slide partially
  const updateActiveSlide = (patch: Partial<HeroSlideItem>) => {
    setSlides((prev) =>
      prev.map((slide) => {
        if (slide.id === activeSlide.id) {
          return {
            ...slide,
            ...patch,
            updatedAt: new Date().toISOString(),
          };
        }
        return slide;
      })
    );
    setSaveStatus('idle');
  };

  // Add a new slide
  const handleAddSlide = () => {
    const newSlide = createEmptyHeroSlide(slides.length + 1);
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideId(newSlide.id);
    setSaveStatus('idle');
    onNotify(`Added Slide ${slides.length + 1}`, 'info');
  };

  // Duplicate slide
  const handleDuplicateSlide = (slide: HeroSlideItem) => {
    const dup: HeroSlideItem = {
      ...slide,
      id: `slide-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      order: slides.length + 1,
      heading: `${slide.heading} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSlides((prev) => [...prev, dup]);
    setActiveSlideId(dup.id);
    setSaveStatus('idle');
    onNotify(`Duplicated Slide: ${dup.heading}`, 'info');
  };

  // Delete slide
  const handleDeleteSlide = (id: string) => {
    if (slides.length <= 1) {
      onNotify('At least one hero slide must remain.', 'failed');
      return;
    }
    const target = slides.find((s) => s.id === id);
    if (!window.confirm(`Are you sure you want to delete "${target?.heading || 'this slide'}"?`)) {
      return;
    }
    const filtered = slides.filter((s) => s.id !== id).map((s, idx) => ({ ...s, order: idx + 1 }));
    setSlides(filtered);
    if (activeSlideId === id) {
      setActiveSlideId(filtered[0].id);
    }
    setSaveStatus('idle');
    onNotify('Slide deleted.', 'info');
  };

  // Move slide up / down
  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    // Reassign order
    const reordered = newSlides.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSlides(reordered);
    setSaveStatus('idle');
  };

  // Toggle slide enabled
  const handleToggleSlideEnabled = (id: string) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    setSaveStatus('idle');
  };

  // Atomic Save to Supabase
  const handleSaveAll = async (isDraft = false) => {
    setIsSaving(true);
    setSaveStatus('saving');
    setSaveError(null);
    onNotify('Persisting Hero & Slider to database...', 'saving');

    try {
      // Re-index orders
      const normalizedSlides = slides.map((s, idx) => ({ ...s, order: idx + 1 }));
      const primarySlide = normalizedSlides.find((s) => s.enabled) || normalizedSlides[0];
      const legacyHero = syncSlideToLegacyHero(primarySlide);

      const updatedCMS: HomepageCMS = {
        ...cmsConfig,
        hero: legacyHero,
        heroSlides: normalizedSlides,
        heroSliderSettings: sliderSettings,
        announcementBarActive,
      };

      // Save via privileged storage service
      await StorageService.saveCMSAsync(updatedCMS);

      onUpdateCMS(updatedCMS);
      setSaveStatus('saved');
      onNotify('Hero slides & settings saved successfully!', 'saved');

      StorageService.addActivityLog({
        action: 'Hero Carousel Config Updated',
        category: 'cms',
        actor: 'Admin Concierge',
        details: `Updated ${normalizedSlides.length} hero slides. Master canvas: 16:7 desktop, 4:5 mobile.`,
      });

      setTimeout(() => {
        setSaveStatus('idle');
      }, 4000);
    } catch (err: any) {
      console.error('Failed to save hero slides:', err);
      const msg = err?.message || 'Database error occurred while saving hero slides';
      setSaveError(msg);
      setSaveStatus('failed');
      onNotify(msg, 'failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & CANVAS SPECIFICATION BANNER */}
      <div className="bg-white p-6 border border-stone-200 rounded-lg shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded uppercase">
              STANDARDIZED LUXURY CANVAS
            </span>
            <span className="text-[10px] font-mono bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
              Desktop: 16:7 (1920 × 840 px) • Mobile: 4:5 (1080 × 1350 px)
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900 mt-1">
            Homepage Hero Slides & Storefront Canvas Manager
          </h3>
          <p className="text-xs text-stone-500 max-w-3xl">
            Configure full-bleed hero slides for GulPash. Upload separate desktop and mobile assets, toggle text overlays on/off without losing data, and customize carousel autoplay speed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleAddSlide}
            className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium px-3 py-2 rounded transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Slide</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveAll(false)}
            disabled={isSaving}
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Save Feedback */}
      {saveStatus === 'saved' && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs flex items-center gap-2 font-medium animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All hero slides and slider configurations have been successfully saved to Supabase!</span>
        </div>
      )}

      {saveStatus === 'failed' && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-lg text-xs flex items-center gap-2 font-medium animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{saveError || 'Failed to persist changes to the database. Please verify your connection.'}</span>
        </div>
      )}

      {/* 2. SLIDE SELECTOR TABS & REORDER BAR */}
      <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {slides.map((slide, idx) => {
            const isCurrent = slide.id === activeSlide.id;
            return (
              <div
                key={slide.id}
                onClick={() => setActiveSlideId(slide.id)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all border ${
                  isCurrent
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                {/* Live/Muted Dot */}
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    slide.enabled ? 'bg-emerald-400' : 'bg-stone-400'
                  }`}
                  title={slide.enabled ? 'Live on storefront' : 'Hidden / Inactive'}
                />
                <span>
                  Slide {idx + 1}: {slide.heading ? slide.heading.slice(0, 16) + (slide.heading.length > 16 ? '...' : '') : 'Untitled'}
                </span>
                {!slide.enabled && (
                  <span className="text-[9px] opacity-75 font-mono">(Draft)</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Active Slide Control Actions (Move, Duplicate, Delete, Visibility) */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            disabled={activeIndex === 0}
            onClick={() => handleMoveSlide(activeIndex, 'up')}
            className="p-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded disabled:opacity-30 cursor-pointer"
            title="Move Slide Left / Earlier"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={activeIndex === slides.length - 1}
            onClick={() => handleMoveSlide(activeIndex, 'down')}
            className="p-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded disabled:opacity-30 cursor-pointer"
            title="Move Slide Right / Later"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleDuplicateSlide(activeSlide)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded cursor-pointer"
            title="Duplicate Current Slide"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleSlideEnabled(activeSlide.id)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded border cursor-pointer ${
              activeSlide.enabled
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-stone-200 text-stone-700 border-stone-300'
            }`}
          >
            {activeSlide.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{activeSlide.enabled ? 'Enabled (Live)' : 'Disabled (Hidden)'}</span>
          </button>

          {slides.length > 1 && (
            <button
              type="button"
              onClick={() => handleDeleteSlide(activeSlide.id)}
              className="p-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded cursor-pointer"
              title="Delete Slide"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. SLIDE CONFIGURATION PANEL */}
      <div className="bg-white p-6 border border-stone-200 rounded-lg shadow-xs space-y-6">
        {/* Media Presentation Format Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">Media Type:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateActiveSlide({ mediaType: 'image' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium cursor-pointer transition-colors ${
                  activeSlide.mediaType === 'image'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-300 text-stone-700'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Studio Photography (Image)</span>
              </button>

              <button
                type="button"
                onClick={() => updateActiveSlide({ mediaType: 'video' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium cursor-pointer transition-colors ${
                  activeSlide.mediaType === 'video'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-300 text-stone-700'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Runway Cinematic Loop (Video)</span>
              </button>
            </div>
          </div>

          <span className="text-[11px] text-stone-500 font-mono">
            Editing Slide #{activeIndex + 1} of {slides.length}
          </span>
        </div>

        {/* Media Uploaders (Exact Standardized 16:7 Desktop & 4:5 Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Desktop Media */}
          <div className="space-y-3">
            <MediaUploaderCard
              spec={
                activeSlide.mediaType === 'video'
                  ? MEDIA_SPECS.HERO_VIDEO_DESKTOP
                  : MEDIA_SPECS.HERO_DESKTOP
              }
              currentUrl={
                activeSlide.mediaType === 'video'
                  ? activeSlide.videoUrl
                  : activeSlide.desktopImageUrl || activeSlide.image
              }
              onUrlChange={(url) => {
                if (activeSlide.mediaType === 'video') {
                  updateActiveSlide({ videoUrl: url });
                } else {
                  updateActiveSlide({ desktopImageUrl: url, image: url });
                }
              }}
              onAutoSave={async (url) => {
                const patch = activeSlide.mediaType === 'video'
                  ? { videoUrl: url }
                  : { desktopImageUrl: url, image: url };
                updateActiveSlide(patch);
                // Also trigger immediate background persist
                const updatedSlides = slides.map((s) => (s.id === activeSlide.id ? { ...s, ...patch } : s));
                await StorageService.saveCMSAsync({
                  ...cmsConfig,
                  heroSlides: updatedSlides,
                  heroSliderSettings: sliderSettings,
                });
              }}
              onStatusChange={(status, msg) => {
                if (status === 'uploading' || status === 'saving') {
                  onNotify(msg || 'Saving desktop media...', 'saving');
                } else if (status === 'saved') {
                  onNotify(msg || 'Desktop media saved to database!', 'saved');
                } else if (status === 'failed') {
                  onNotify(msg || 'Failed to save desktop media', 'failed');
                }
              }}
            />

            {/* Desktop Crop Position Alignment */}
            <div className="flex items-center justify-between text-xs p-2.5 bg-stone-50 rounded border border-stone-200">
              <span className="font-medium text-stone-700">Desktop Crop Alignment:</span>
              <div className="flex items-center gap-1">
                {(['center', 'top', 'bottom', 'left', 'right'] as const).map((pos) => (
                  <button
                    key={`d-pos-${pos}`}
                    type="button"
                    onClick={() => updateActiveSlide({ objectPositionDesktop: pos })}
                    className={`px-2 py-1 rounded text-[10px] uppercase font-mono cursor-pointer transition-colors ${
                      (activeSlide.objectPositionDesktop || 'center') === pos
                        ? 'bg-stone-900 text-white font-bold'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Media */}
          <div className="space-y-3">
            <MediaUploaderCard
              spec={
                activeSlide.mediaType === 'video'
                  ? MEDIA_SPECS.HERO_VIDEO_MOBILE
                  : MEDIA_SPECS.HERO_MOBILE
              }
              currentUrl={
                activeSlide.mediaType === 'video'
                  ? activeSlide.mobileVideoUrl
                  : activeSlide.mobileImageUrl || activeSlide.mobileImage
              }
              onUrlChange={(url) => {
                if (activeSlide.mediaType === 'video') {
                  updateActiveSlide({ mobileVideoUrl: url });
                } else {
                  updateActiveSlide({ mobileImageUrl: url, mobileImage: url });
                }
              }}
              onAutoSave={async (url) => {
                const patch = activeSlide.mediaType === 'video'
                  ? { mobileVideoUrl: url }
                  : { mobileImageUrl: url, mobileImage: url };
                updateActiveSlide(patch);
                const updatedSlides = slides.map((s) => (s.id === activeSlide.id ? { ...s, ...patch } : s));
                await StorageService.saveCMSAsync({
                  ...cmsConfig,
                  heroSlides: updatedSlides,
                  heroSliderSettings: sliderSettings,
                });
              }}
              onStatusChange={(status, msg) => {
                if (status === 'uploading' || status === 'saving') {
                  onNotify(msg || 'Saving mobile media...', 'saving');
                } else if (status === 'saved') {
                  onNotify(msg || 'Mobile media saved to database!', 'saved');
                } else if (status === 'failed') {
                  onNotify(msg || 'Failed to save mobile media', 'failed');
                }
              }}
            />

            {/* Mobile Crop Position Alignment */}
            <div className="flex items-center justify-between text-xs p-2.5 bg-stone-50 rounded border border-stone-200">
              <span className="font-medium text-stone-700">Mobile Crop Alignment:</span>
              <div className="flex items-center gap-1">
                {(['center', 'top', 'bottom', 'left', 'right'] as const).map((pos) => (
                  <button
                    key={`m-pos-${pos}`}
                    type="button"
                    onClick={() => updateActiveSlide({ objectPositionMobile: pos })}
                    className={`px-2 py-1 rounded text-[10px] uppercase font-mono cursor-pointer transition-colors ${
                      (activeSlide.objectPositionMobile || 'center') === pos
                        ? 'bg-stone-900 text-white font-bold'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. TEXT OVERLAY ON / OFF MASTER CONTROL                  */}
        {/* ======================================================== */}
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-stone-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Text & Call-To-Action Overlay Control
                </h4>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    activeSlide.showTextAndCta !== false
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {activeSlide.showTextAndCta !== false ? 'OVERLAY: ACTIVE' : 'OVERLAY: MUTED (ARTWORK ONLY)'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Toggle text overlay and CTA buttons. When turned OFF, only clean artwork will be displayed, while all typography settings remain safely preserved.
              </p>
            </div>

            {/* Master Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={activeSlide.showTextAndCta !== false}
                onChange={(e) => updateActiveSlide({ showTextAndCta: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
            </label>
          </div>

          {activeSlide.showTextAndCta === false ? (
            <div className="p-3 bg-amber-50/70 border border-amber-200 text-amber-900 rounded text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Pure Artwork Mode Active:</strong> Storefront will render this slide without typography, buttons, or dark overlay filters.
              </span>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {/* Overlay Backdrop & Opacity Slider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-white rounded border border-stone-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800">Dark Gradient Filter:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeSlide.showOverlay !== false}
                      onChange={(e) => updateActiveSlide({ showOverlay: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900"></div>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-stone-800 shrink-0">Filter Darkness:</span>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="5"
                    value={activeSlide.overlayOpacity ?? 35}
                    onChange={(e) => updateActiveSlide({ overlayOpacity: parseInt(e.target.value, 10) })}
                    className="w-full accent-stone-900 cursor-pointer"
                  />
                  <span className="font-mono text-stone-600 w-8 text-right font-bold">
                    {activeSlide.overlayOpacity ?? 35}%
                  </span>
                </div>
              </div>

              {/* Text Alignment & Theme Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white rounded border border-stone-200 text-xs">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Horizontal Position</label>
                  <div className="flex items-center gap-1">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={`h-align-${align}`}
                        type="button"
                        onClick={() => updateActiveSlide({ horizontalAlignment: align })}
                        className={`flex-1 py-1.5 rounded text-[11px] font-medium capitalize cursor-pointer transition-colors border ${
                          (activeSlide.horizontalAlignment || 'center') === align
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Vertical Position</label>
                  <div className="flex items-center gap-1">
                    {(['top', 'center', 'bottom'] as const).map((valign) => (
                      <button
                        key={`v-align-${valign}`}
                        type="button"
                        onClick={() => updateActiveSlide({ verticalAlignment: valign })}
                        className={`flex-1 py-1.5 rounded text-[11px] font-medium capitalize cursor-pointer transition-colors border ${
                          (activeSlide.verticalAlignment || 'center') === valign
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {valign}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Text Color Palette</label>
                  <div className="flex items-center gap-1">
                    {(['light', 'dark'] as const).map((th) => (
                      <button
                        key={`th-${th}`}
                        type="button"
                        onClick={() => updateActiveSlide({ textTheme: th })}
                        className={`flex-1 py-1.5 rounded text-[11px] font-medium capitalize cursor-pointer transition-colors border ${
                          (activeSlide.textTheme || 'light') === th
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {th === 'light' ? 'Light (White)' : 'Dark (Charcoal)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Text Fields with Sub-Toggles */}
              <div className="space-y-3 pt-2">
                {/* Eyebrow / Badge */}
                <div className="p-3 bg-white rounded border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-800">Eyebrow / Collection Tag</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-500">Show Tag:</span>
                      <input
                        type="checkbox"
                        checked={activeSlide.showEyebrow !== false}
                        onChange={(e) => updateActiveSlide({ showEyebrow: e.target.checked })}
                        className="accent-stone-900 cursor-pointer"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={activeSlide.eyebrow || activeSlide.badge || ''}
                    onChange={(e) => updateActiveSlide({ eyebrow: e.target.value, badge: e.target.value })}
                    placeholder="e.g. GULPASH COUTURE 2026"
                    className="w-full p-2 border border-stone-300 rounded font-mono text-xs"
                  />
                </div>

                {/* Main Heading */}
                <div className="p-3 bg-white rounded border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-800">Main Headline (Font: Rush Driver)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-500">Show Headline:</span>
                      <input
                        type="checkbox"
                        checked={activeSlide.showHeading !== false}
                        onChange={(e) => updateActiveSlide({ showHeading: e.target.checked })}
                        className="accent-stone-900 cursor-pointer"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={activeSlide.heading || ''}
                    onChange={(e) => updateActiveSlide({ heading: e.target.value })}
                    placeholder="e.g. GulPash Luxury Collection"
                    className="w-full p-2 border border-stone-300 rounded font-medium text-sm"
                  />
                </div>

                {/* Description */}
                <div className="p-3 bg-white rounded border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-800">Subheading / Description</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-500">Show Description:</span>
                      <input
                        type="checkbox"
                        checked={activeSlide.showDescription !== false}
                        onChange={(e) => updateActiveSlide({ showDescription: e.target.checked })}
                        className="accent-stone-900 cursor-pointer"
                      />
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={activeSlide.description || activeSlide.subheading || ''}
                    onChange={(e) => updateActiveSlide({ description: e.target.value, subheading: e.target.value })}
                    placeholder="e.g. Discover the pinnacle of Pakistani craftsmanship..."
                    className="w-full p-2 border border-stone-300 rounded text-xs"
                  />
                </div>

                {/* Primary CTA */}
                <div className="p-3 bg-white rounded border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-800">Primary Button (CTA)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-500">Show Primary Button:</span>
                      <input
                        type="checkbox"
                        checked={activeSlide.showCta !== false}
                        onChange={(e) => updateActiveSlide({ showCta: e.target.checked })}
                        className="accent-stone-900 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-stone-500 block mb-1">Button Label</span>
                      <input
                        type="text"
                        value={activeSlide.ctaLabel || activeSlide.buttonText || ''}
                        onChange={(e) => updateActiveSlide({ ctaLabel: e.target.value, buttonText: e.target.value })}
                        placeholder="e.g. EXPLORE TRENDING"
                        className="w-full p-2 border border-stone-300 rounded text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block mb-1">Link Destination</span>
                      <input
                        type="text"
                        value={activeSlide.ctaUrl || activeSlide.buttonUrl || ''}
                        onChange={(e) => updateActiveSlide({ ctaUrl: e.target.value, buttonUrl: e.target.value })}
                        placeholder="e.g. /collections/best-selling or /shop"
                        className="w-full p-2 border border-stone-300 rounded font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Secondary CTA */}
                <div className="p-3 bg-white rounded border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-stone-800">Secondary Button (Ghost/Outline)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-500">Show Secondary Button:</span>
                      <input
                        type="checkbox"
                        checked={!!activeSlide.showSecondaryCta}
                        onChange={(e) => updateActiveSlide({ showSecondaryCta: e.target.checked })}
                        className="accent-stone-900 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-stone-500 block mb-1">Button Label</span>
                      <input
                        type="text"
                        value={activeSlide.secondaryCtaLabel || activeSlide.secondaryButtonText || ''}
                        onChange={(e) => updateActiveSlide({ secondaryCtaLabel: e.target.value, secondaryButtonText: e.target.value })}
                        placeholder="e.g. SHOP ALL"
                        className="w-full p-2 border border-stone-300 rounded text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-500 block mb-1">Link Destination</span>
                      <input
                        type="text"
                        value={activeSlide.secondaryCtaUrl || activeSlide.secondaryButtonUrl || ''}
                        onChange={(e) => updateActiveSlide({ secondaryCtaUrl: e.target.value, secondaryButtonUrl: e.target.value })}
                        placeholder="e.g. /shop"
                        className="w-full p-2 border border-stone-300 rounded font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 5. GLOBAL CAROUSEL / SLIDER SETTINGS                     */}
        {/* ======================================================== */}
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-stone-600" />
                <span>Global Slider & Carousel Controls</span>
              </h4>
              <p className="text-[11px] text-stone-500">
                Applied when multiple slides are enabled on the storefront.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
            {/* Autoplay Toggle */}
            <div className="p-2.5 bg-white rounded border border-stone-200 flex items-center justify-between">
              <span className="font-medium text-stone-700">Autoplay:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sliderSettings.autoPlay}
                  onChange={(e) => setSliderSettings({ ...sliderSettings, autoPlay: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-stone-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-stone-900"></div>
              </label>
            </div>

            {/* Slide Duration */}
            <div className="p-2.5 bg-white rounded border border-stone-200 flex items-center justify-between">
              <span className="font-medium text-stone-700">Interval:</span>
              <select
                value={sliderSettings.slideDuration}
                onChange={(e) => setSliderSettings({ ...sliderSettings, slideDuration: parseInt(e.target.value, 10) })}
                className="bg-stone-50 border border-stone-300 rounded px-2 py-1 font-mono text-xs cursor-pointer"
              >
                <option value={3}>3 Seconds</option>
                <option value={4}>4 Seconds</option>
                <option value={5}>5 Seconds (Recommended)</option>
                <option value={6}>6 Seconds</option>
                <option value={8}>8 Seconds</option>
              </select>
            </div>

            {/* Show Arrows */}
            <div className="p-2.5 bg-white rounded border border-stone-200 flex items-center justify-between">
              <span className="font-medium text-stone-700">Prev/Next Arrows:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sliderSettings.showArrows}
                  onChange={(e) => setSliderSettings({ ...sliderSettings, showArrows: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-stone-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-stone-900"></div>
              </label>
            </div>

            {/* Show Dots */}
            <div className="p-2.5 bg-white rounded border border-stone-200 flex items-center justify-between">
              <span className="font-medium text-stone-700">Slide Dots:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sliderSettings.showDots}
                  onChange={(e) => setSliderSettings({ ...sliderSettings, showDots: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-stone-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-stone-900"></div>
              </label>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 6. ANNOUNCEMENT / HEADER TEXT VISIBILITY CONTROL         */}
        {/* ======================================================== */}
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider text-xs">
              <Layers className="w-3.5 h-3.5 text-stone-600" />
              <span>Announcement Bar / Header Text Visibility</span>
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Independent master toggle for customer-facing top announcement text above the header.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-stone-600 font-medium text-[11px]">
              {announcementBarActive ? 'HEADER TEXT: LIVE' : 'HEADER TEXT: HIDDEN'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={announcementBarActive}
                onChange={(e) => setAnnouncementBarActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
            </label>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 7. LIVE EXACT CANVAS PREVIEW FRAME                       */}
        {/* ======================================================== */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Exact Canvas Live Preview
              </h4>
              <span className="text-[10px] font-mono text-stone-500">
                {previewDevice === 'desktop' ? '16:7 Desktop Viewport' : '4:5 Mobile Portrait Viewport'}
              </span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded border border-stone-200">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                  previewDevice === 'desktop'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (16:7)</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                  previewDevice === 'mobile'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (4:5)</span>
              </button>
            </div>
          </div>

          {/* Frame Container */}
          <div className="bg-stone-900 p-3 sm:p-6 rounded-xl overflow-hidden flex items-center justify-center border border-stone-800">
            <div
              className={`relative overflow-hidden bg-[#181818] shadow-2xl transition-all duration-300 border border-stone-700/50 ${
                previewDevice === 'desktop'
                  ? 'w-full aspect-[16/7] max-w-4xl'
                  : 'w-full max-w-xs aspect-[4/5]'
              }`}
            >
              {/* Media layer */}
              {activeSlide.mediaType === 'video' && (previewDevice === 'desktop' ? activeSlide.videoUrl : activeSlide.mobileVideoUrl || activeSlide.videoUrl) ? (
                <video
                  src={previewDevice === 'desktop' ? activeSlide.videoUrl : (activeSlide.mobileVideoUrl || activeSlide.videoUrl)}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={
                    previewDevice === 'mobile'
                      ? (activeSlide.mobileImageUrl || activeSlide.mobileImage || activeSlide.desktopImageUrl || activeSlide.image)
                      : (activeSlide.desktopImageUrl || activeSlide.image)
                  }
                  alt={activeSlide.heading}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Dynamic Overlay */}
              {activeSlide.showOverlay !== false && activeSlide.showTextAndCta !== false && (
                <>
                  <div
                    className="absolute inset-0 bg-black pointer-events-none transition-opacity"
                    style={{ opacity: (activeSlide.overlayOpacity ?? 35) / 100 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                </>
              )}

              {/* Text Layer */}
              {activeSlide.showTextAndCta !== false && (
                <div
                  className={`absolute inset-0 p-4 sm:p-6 flex flex-col pointer-events-none ${
                    activeSlide.horizontalAlignment === 'left'
                      ? 'items-start text-left'
                      : activeSlide.horizontalAlignment === 'right'
                      ? 'items-end text-right'
                      : 'items-center text-center'
                  } ${
                    activeSlide.verticalAlignment === 'top'
                      ? 'justify-start pt-6'
                      : activeSlide.verticalAlignment === 'bottom'
                      ? 'justify-end pb-6'
                      : 'justify-center'
                  }`}
                >
                  {/* Badge */}
                  {activeSlide.showEyebrow !== false && (activeSlide.eyebrow || activeSlide.badge) && (
                    <span className="text-[8px] uppercase tracking-widest bg-white/20 text-white px-2 py-0.5 rounded-full mb-1 sm:mb-2">
                      {activeSlide.eyebrow || activeSlide.badge}
                    </span>
                  )}

                  {/* Heading */}
                  {activeSlide.showHeading !== false && activeSlide.heading && (
                    <h2
                      className={`font-rush-driver font-bold tracking-wide leading-tight drop-shadow-sm ${
                        previewDevice === 'desktop' ? 'text-2xl sm:text-4xl' : 'text-lg sm:text-xl'
                      } ${activeSlide.textTheme === 'dark' ? 'text-stone-900' : 'text-white'}`}
                    >
                      {activeSlide.heading}
                    </h2>
                  )}

                  {/* Subtitle */}
                  {activeSlide.showDescription !== false && (activeSlide.description || activeSlide.subheading) && (
                    <p
                      className={`mt-1 text-[10px] sm:text-xs line-clamp-2 max-w-sm ${
                        activeSlide.textTheme === 'dark' ? 'text-stone-800' : 'text-stone-200'
                      }`}
                    >
                      {activeSlide.description || activeSlide.subheading}
                    </p>
                  )}

                  {/* Buttons */}
                  {activeSlide.showCta !== false && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="bg-stone-900 text-white text-[9px] uppercase tracking-widest font-semibold px-3 py-1.5 border border-stone-700 shadow-xs">
                        {activeSlide.ctaLabel || activeSlide.buttonText || 'EXPLORE TRENDING'}
                      </span>
                      {activeSlide.showSecondaryCta && (
                        <span className="bg-transparent text-white text-[9px] uppercase tracking-widest font-semibold px-3 py-1.5 border border-white/40">
                          {activeSlide.secondaryCtaLabel || 'SHOP ALL'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Carousel Indicators Preview */}
              {slides.length > 1 && sliderSettings.showDots && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 rounded-full bg-black/40">
                  {slides.map((s, idx) => (
                    <span
                      key={`preview-dot-${s.id}`}
                      className={`rounded-full transition-all ${
                        s.id === activeSlide.id ? 'w-4 h-1 bg-white' : 'w-1 h-1 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Save Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Changes will be instantly synced to Supabase database upon saving.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSaveAll(false)}
              disabled={isSaving}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider px-6 py-2.5 rounded shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Hero Configuration'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
