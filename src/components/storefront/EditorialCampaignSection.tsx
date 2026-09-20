import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { EditorialCampaignItem, EditorialCampaignSectionConfig } from '../../types';
import { DEFAULT_ROYAL_COUTURE_CAMPAIGN } from '../../lib/campaignHelper';

interface EditorialCampaignSectionProps {
  config?: EditorialCampaignSectionConfig;
  onNavigate: (view: string, param?: string) => void;
}

export const EditorialCampaignSection: React.FC<EditorialCampaignSectionProps> = ({
  config,
  onNavigate
}) => {
  // Master Section Toggle: If disabled, completely disappear from storefront (no vertical gap)
  if (config && config.enabled === false) {
    return null;
  }

  const campaigns = config?.campaigns && config.campaigns.length > 0
    ? config.campaigns
    : [DEFAULT_ROYAL_COUTURE_CAMPAIGN];

  const displayMode = config?.displayMode || 'single';
  const sliderSettings = config?.sliderSettings || {
    autoPlay: true,
    slideDuration: 6,
    showArrows: true,
    showDots: true,
    pauseOnHover: true
  };

  // Determine active campaigns
  const activeCampaigns = displayMode === 'slider'
    ? campaigns.filter(c => c.enabled)
    : campaigns.filter(c => c.id === config?.activeCampaignId || c.enabled);

  const displayList = activeCampaigns.length > 0 ? activeCampaigns : [campaigns[0] || DEFAULT_ROYAL_COUTURE_CAMPAIGN];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isInViewport, setIsInViewport] = useState<boolean>(false);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileViewport(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer for viewport-aware playback (performance optimization)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsInViewport(entry.isIntersecting);
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Safe index bounds
  const activeIndex = currentIndex % displayList.length;
  const currentCampaign = displayList[activeIndex] || displayList[0];

  // Carousel Autoplay Timer (only in slider mode with > 1 campaign)
  useEffect(() => {
    if (displayMode !== 'slider' || displayList.length <= 1) return;
    if (!sliderSettings.autoPlay) return;
    if (sliderSettings.pauseOnHover && isHovered) return;

    const durationMs = Math.max(3, sliderSettings.slideDuration || 6) * 1000;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % displayList.length);
    }, durationMs);

    return () => clearInterval(interval);
  }, [displayMode, displayList.length, sliderSettings, isHovered]);

  // Video playback management when in viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (currentCampaign.mediaType === 'video') {
      if (isInViewport && !prefersReducedMotion && currentCampaign.videoAutoplay !== false) {
        video.play().catch(() => {
          // Autoplay blocked by browser policy without interaction, ignore
        });
      } else {
        video.pause();
      }
    }
  }, [isInViewport, prefersReducedMotion, currentCampaign, activeIndex]);

  // Handle CTA Navigation helper
  const handleCtaClick = (url?: string) => {
    if (!url) {
      onNavigate('shop');
      return;
    }

    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (url.startsWith('/collections/') || url.startsWith('/collection/')) {
      const slug = url.split('/').pop();
      onNavigate('collection', slug);
      return;
    }

    if (url.startsWith('/category/') || url.startsWith('/categories/')) {
      const slug = url.split('/').pop();
      onNavigate('category', slug);
      return;
    }

    if (url === '/shop' || url === 'shop') {
      onNavigate('shop');
      return;
    }

    // Default navigate
    onNavigate(url.replace(/^\//, ''));
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (displayMode !== 'slider' || displayList.length <= 1) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // swipe left -> next
        setCurrentIndex(prev => (prev + 1) % displayList.length);
      } else {
        // swipe right -> prev
        setCurrentIndex(prev => (prev - 1 + displayList.length) % displayList.length);
      }
    }
  };

  // Object position classes mapping
  const getObjectPositionClass = (pos?: string) => {
    switch (pos) {
      case 'top': return 'object-top';
      case 'bottom': return 'object-bottom';
      case 'left': return 'object-left';
      case 'right': return 'object-right';
      case 'center':
      default: return 'object-center';
    }
  };

  // Horizontal alignment classes
  const getHorizontalClasses = (align?: string) => {
    switch (align) {
      case 'left': return 'text-left items-start';
      case 'right': return 'text-right items-end';
      case 'center':
      default: return 'text-center items-center';
    }
  };

  // Vertical alignment classes
  const getVerticalClasses = (align?: string) => {
    switch (align) {
      case 'top': return 'justify-start pt-12 sm:pt-16 md:pt-20';
      case 'bottom': return 'justify-end pb-12 sm:pb-16 md:pb-20';
      case 'center':
      default: return 'justify-center';
    }
  };

  // Media determination
  const isVideo = currentCampaign.mediaType === 'video';
  const desktopImg = currentCampaign.desktopImageUrl || currentCampaign.posterImageUrl || '';
  const mobileImg = currentCampaign.mobileImageUrl || desktopImg;

  const desktopVideo = currentCampaign.videoUrl || '';
  const mobileVideo = currentCampaign.mobileVideoUrl || '';

  const desktopPoster = currentCampaign.posterImageUrl || desktopImg;
  const mobilePoster = currentCampaign.mobilePosterImageUrl || mobileImg || desktopPoster;

  // Decide mobile video vs fallback
  let effectiveMobileVideo = mobileVideo;
  let useMobileVideoFallbackImg = false;
  if (isMobileViewport && isVideo && !mobileVideo) {
    if (currentCampaign.mobileVideoFallback === 'mobile_image') {
      useMobileVideoFallbackImg = true;
    } else if (currentCampaign.mobileVideoFallback === 'mobile_poster') {
      useMobileVideoFallbackImg = true;
    } else {
      effectiveMobileVideo = desktopVideo;
    }
  }

  const effectiveVideoSrc = isMobileViewport ? (effectiveMobileVideo || desktopVideo) : desktopVideo;
  const effectivePosterSrc = isMobileViewport ? mobilePoster : desktopPoster;

  // Overlay calculation
  const showOverlay = currentCampaign.showOverlay !== false && (
    currentCampaign.showTextAndCta !== false || (currentCampaign.overlayOpacity && currentCampaign.overlayOpacity > 0)
  );
  const overlayOpacity = Math.min(80, Math.max(0, currentCampaign.overlayOpacity ?? 45));

  // Text theme
  const isDarkTheme = currentCampaign.textTheme === 'dark';

  return (
    <section
      ref={sectionRef}
      id="editorial-campaign-section"
      className="relative w-full aspect-[4/5] sm:aspect-[16/9] lg:aspect-[16/7] overflow-hidden bg-stone-950 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label={currentCampaign.name || 'Editorial Royal Couture Campaign'}
    >
      {/* 1. MEDIA LAYER */}
      <div className="absolute inset-0 w-full h-full">
        {isVideo && !prefersReducedMotion && !useMobileVideoFallbackImg && effectiveVideoSrc ? (
          <video
            ref={videoRef}
            key={`video-${activeIndex}-${effectiveVideoSrc}`}
            src={effectiveVideoSrc}
            poster={effectivePosterSrc}
            autoPlay={currentCampaign.videoAutoplay !== false}
            loop={currentCampaign.videoLoop !== false}
            muted={currentCampaign.videoMuted !== false}
            playsInline
            controls={currentCampaign.videoShowControls === true}
            preload="metadata"
            className={`w-full h-full object-cover ${
              isMobileViewport 
                ? getObjectPositionClass(currentCampaign.objectPositionMobile)
                : getObjectPositionClass(currentCampaign.objectPositionDesktop)
            }`}
          />
        ) : (
          <picture className="w-full h-full block">
            {mobileImg && mobileImg !== desktopImg && (
              <source media="(max-width: 639px)" srcSet={mobileImg} />
            )}
            <img
              src={isMobileViewport && mobileImg ? mobileImg : (desktopImg || effectivePosterSrc)}
              alt={currentCampaign.altText || currentCampaign.heading || 'GulPash Royal Couture Campaign'}
              loading="lazy"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-opacity duration-700 ${
                isMobileViewport
                  ? getObjectPositionClass(currentCampaign.objectPositionMobile)
                  : getObjectPositionClass(currentCampaign.objectPositionDesktop)
              }`}
            />
          </picture>
        )}
      </div>

      {/* 2. AMBIENT / DARK OVERLAY */}
      {showOverlay && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }}
        />
      )}

      {/* 3. CONTENT / TYPOGRAPHY / CTA LAYER */}
      {currentCampaign.showTextAndCta !== false && (
        <div className={`absolute inset-0 z-10 flex flex-col px-6 sm:px-12 md:px-16 lg:px-24 ${getVerticalClasses(currentCampaign.verticalAlignment)}`}>
          <div className={`max-w-3xl flex flex-col space-y-4 sm:space-y-5 ${getHorizontalClasses(currentCampaign.horizontalAlignment)}`}>
            {/* Eyebrow */}
            {currentCampaign.showEyebrow !== false && currentCampaign.eyebrow && (
              <span className={`text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-medium block transition-colors ${
                isDarkTheme ? 'text-stone-700' : 'text-stone-300'
              }`}>
                {currentCampaign.eyebrow}
              </span>
            )}

            {/* Heading */}
            {currentCampaign.showHeading !== false && currentCampaign.heading && (
              <h2 className={`font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light italic tracking-wide leading-tight sm:leading-tight transition-colors ${
                isDarkTheme ? 'text-stone-950' : 'text-white drop-shadow-xs'
              }`}>
                {currentCampaign.heading}
              </h2>
            )}

            {/* Description */}
            {currentCampaign.showDescription !== false && currentCampaign.description && (
              <p className={`text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-xl transition-colors ${
                isDarkTheme ? 'text-stone-800' : 'text-stone-200 drop-shadow-xs'
              }`}>
                {currentCampaign.description}
              </p>
            )}

            {/* CTAs */}
            {(currentCampaign.showCta !== false || currentCampaign.showSecondaryCta) && (
              <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3">
                {/* Primary CTA */}
                {currentCampaign.showCta !== false && (
                  <button
                    type="button"
                    onClick={() => handleCtaClick(currentCampaign.ctaUrl)}
                    className={`inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.25em] py-3 px-6 sm:py-3.5 sm:px-8 transition-all duration-300 cursor-pointer shadow-md ${
                      isDarkTheme
                        ? 'bg-stone-900 text-white hover:bg-stone-800'
                        : 'bg-white text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <span>{currentCampaign.ctaLabel || 'EXPLORE TRENDING ENSEMBLES'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Secondary CTA */}
                {currentCampaign.showSecondaryCta && currentCampaign.secondaryCtaLabel && (
                  <button
                    type="button"
                    onClick={() => handleCtaClick(currentCampaign.secondaryCtaUrl)}
                    className={`inline-flex items-center gap-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.25em] py-3 px-6 sm:py-3.5 sm:px-8 transition-all duration-300 cursor-pointer border ${
                      isDarkTheme
                        ? 'border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white'
                        : 'border-white text-white hover:bg-white hover:text-stone-900'
                    }`}
                  >
                    <span>{currentCampaign.secondaryCtaLabel}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. CAROUSEL CONTROLS (Only in Slider mode with > 1 campaign) */}
      {displayMode === 'slider' && displayList.length > 1 && (
        <>
          {/* Previous / Next Arrows */}
          {sliderSettings.showArrows && (
            <div className="absolute inset-y-0 inset-x-3 sm:inset-x-6 flex items-center justify-between pointer-events-none z-20">
              <button
                type="button"
                aria-label="Previous Campaign Slide"
                onClick={() => setCurrentIndex(prev => (prev - 1 + displayList.length) % displayList.length)}
                className="pointer-events-auto w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                aria-label="Next Campaign Slide"
                onClick={() => setCurrentIndex(prev => (prev + 1) % displayList.length)}
                className="pointer-events-auto w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          )}

          {/* Dots Indicator */}
          {sliderSettings.showDots && (
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2 pointer-events-auto">
              {displayList.map((_, idx) => (
                <button
                  key={`dot-${idx}`}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                    activeIndex === idx
                      ? 'w-7 sm:w-8 bg-white'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};
