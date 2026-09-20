import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroSlideConfig, HeroSlideItem, HeroSliderSettings } from '../../types';
import { migrateHeroToSlides } from '../../lib/heroHelper';

interface HeroSectionProps {
  config?: HeroSlideConfig;
  slides?: HeroSlideItem[];
  settings?: HeroSliderSettings;
  onNavigate: (view: string, param?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  slides: propSlides,
  settings: propSettings,
  onNavigate,
}) => {
  // Normalize slides and slider settings
  const { slides: normalizedSlides, settings: normalizedSettings } = React.useMemo(() => {
    if (propSlides && propSlides.length > 0) {
      return {
        slides: propSlides,
        settings: propSettings || {
          autoPlay: true,
          slideDuration: 5,
          showArrows: true,
          showDots: true,
          pauseOnHover: true,
        },
      };
    }
    return migrateHeroToSlides({
      hero: config as HeroSlideConfig,
      heroSlides: (config as any)?.heroSlides,
      heroSliderSettings: propSettings || (config as any)?.heroSliderSettings,
      announcements: [],
      announcementBarActive: true,
      showFeaturedCollections: true,
      showBestSellers: true,
      showNewArrivals: true,
      showCategories: true,
      showEditorialBanner: true,
      showCustomerReviews: false,
      showInstagramFeed: true,
      editorialBanner: { heading: '', subheading: '', buttonText: '', buttonUrl: '', imageUrl: '' },
    });
  }, [config, propSlides, propSettings]);

  // Filter only enabled slides
  const activeSlides = React.useMemo(() => {
    const enabled = normalizedSlides.filter((s) => s.enabled !== false && s.isActive !== false);
    return enabled.length > 0 ? enabled : normalizedSlides.slice(0, 1);
  }, [normalizedSlides]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSlides = activeSlides.length;
  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay management
  useEffect(() => {
    if (totalSlides <= 1 || !normalizedSettings.autoPlay || isPaused) return;

    const intervalSeconds = Math.max(2, normalizedSettings.slideDuration || 5);
    const timer = setInterval(() => {
      goToNext();
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [totalSlides, normalizedSettings.autoPlay, normalizedSettings.slideDuration, isPaused, goToNext]);

  // Video autoplay when current slide is video
  useEffect(() => {
    if (currentSlide?.mediaType === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy prevented playback
      });
    }
  }, [currentSlide?.mediaType, currentSlide?.videoUrl, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (totalSlides <= 1) return;
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides, goToPrev, goToNext]);

  // Touch swipe support
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleCtaClick = (url?: string) => {
    if (!url) {
      onNavigate('shop');
      return;
    }
    if (url.startsWith('/collections/')) {
      const slug = url.replace('/collections/', '');
      onNavigate('collection', slug);
    } else if (url.startsWith('/categories/')) {
      const slug = url.replace('/categories/', '');
      onNavigate('collection', slug);
    } else if (url === '/shop' || url.startsWith('/shop')) {
      onNavigate('shop');
    } else {
      onNavigate('collection', 'best-selling');
    }
  };

  // Object position helper
  const getObjectPositionClass = (pos?: string, isMobile = false) => {
    switch (pos) {
      case 'top': return isMobile ? 'object-top' : 'sm:object-top';
      case 'bottom': return isMobile ? 'object-bottom' : 'sm:object-bottom';
      case 'left': return isMobile ? 'object-left' : 'sm:object-left';
      case 'right': return isMobile ? 'object-right' : 'sm:object-right';
      default: return isMobile ? 'object-center' : 'sm:object-center';
    }
  };

  // Alignment helpers
  const getHorizontalAlignClass = (align?: string) => {
    switch (align) {
      case 'left': return 'items-start text-left';
      case 'right': return 'items-end text-right';
      default: return 'items-center text-center';
    }
  };

  const getVerticalAlignClass = (align?: string) => {
    switch (align) {
      case 'top': return 'justify-start pt-12 sm:pt-20';
      case 'bottom': return 'justify-end pb-12 sm:pb-20';
      default: return 'justify-center';
    }
  };

  const isTextOverlayOn = currentSlide?.showTextAndCta !== false;
  const isLightText = currentSlide?.textTheme !== 'dark';

  return (
    <section
      ref={containerRef}
      id="hero-storefront-section"
      onMouseEnter={() => normalizedSettings.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => normalizedSettings.pauseOnHover && setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
      aria-label="Homepage Luxury Carousel"
      className="relative w-full overflow-hidden bg-[#181818] flex items-center justify-center font-sans aspect-[4/5] sm:aspect-[16/9] lg:aspect-[16/7] max-h-[840px] select-none outline-none"
    >
      {/* 1. SLIDE MEDIA BACKGROUND */}
      {currentSlide?.mediaType === 'video' && currentSlide?.videoUrl ? (
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            key={`video-${currentSlide.id}-${currentIndex}`}
            src={currentSlide.videoUrl}
            poster={currentSlide.posterImageUrl || currentSlide.desktopImageUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className={`w-full h-full object-cover ${getObjectPositionClass(currentSlide.objectPositionMobile, true)} ${getObjectPositionClass(currentSlide.objectPositionDesktop, false)}`}
          />
          {/* Sound Toggle Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-6 right-6 z-30 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white p-2.5 rounded-full border border-white/20 transition-all cursor-pointer shadow-lg"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            title={isMuted ? 'Play Sound' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full">
          <picture>
            {currentSlide?.mobileImageUrl && (
              <source media="(max-width: 640px)" srcSet={currentSlide.mobileImageUrl} />
            )}
            <img
              key={`img-${currentSlide?.id}-${currentIndex}`}
              src={currentSlide?.desktopImageUrl || currentSlide?.image}
              alt={currentSlide?.heading || 'GulPash Luxury Couture'}
              fetchPriority={currentIndex === 0 ? 'high' : 'auto'}
              loading={currentIndex === 0 ? 'eager' : 'lazy'}
              className={`w-full h-full object-cover transition-opacity duration-500 ${getObjectPositionClass(currentSlide?.objectPositionMobile, true)} ${getObjectPositionClass(currentSlide?.objectPositionDesktop, false)}`}
            />
          </picture>
        </div>
      )}

      {/* 2. DYNAMIC OVERLAY (Rendered only if showOverlay is true AND text overlay is active) */}
      {currentSlide?.showOverlay !== false && isTextOverlayOn && (
        <>
          <div
            className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300 z-10"
            style={{ opacity: (currentSlide?.overlayOpacity ?? 35) / 100 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none z-10" />
        </>
      )}

      {/* 3. EDITORIAL TEXT & CTA OVERLAY (Rendered ONLY if showTextAndCta is ON) */}
      {isTextOverlayOn && (
        <div
          className={`absolute inset-0 z-20 w-full h-full max-w-5xl mx-auto px-6 sm:px-10 flex flex-col pointer-events-none ${getHorizontalAlignClass(
            currentSlide?.horizontalAlignment
          )} ${getVerticalAlignClass(currentSlide?.verticalAlignment)}`}
        >
          <div className="flex flex-col max-w-2xl pointer-events-auto">
            {/* Eyebrow / Collection Badge */}
            {currentSlide?.showEyebrow !== false && (currentSlide?.eyebrow || currentSlide?.badge) && (
              <div
                className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-medium py-1.5 px-4 rounded-full mb-3 sm:mb-4 w-fit shadow-xs backdrop-blur-md transition-all ${
                  isLightText
                    ? 'bg-white/15 border border-white/25 text-stone-200'
                    : 'bg-stone-900/80 border border-stone-800 text-stone-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{currentSlide.eyebrow || currentSlide.badge}</span>
              </div>
            )}

            {/* Main Headline */}
            {currentSlide?.showHeading !== false && currentSlide?.heading && (
              <h1
                className={`font-rush-driver text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider leading-tight sm:leading-none drop-shadow-md ${
                  isLightText ? 'text-white' : 'text-stone-900'
                }`}
              >
                {currentSlide.heading}
              </h1>
            )}

            {/* Description / Subheading */}
            {currentSlide?.showDescription !== false && (currentSlide?.description || currentSlide?.subheading) && (
              <p
                className={`mt-3 sm:mt-4 text-xs sm:text-sm md:text-base font-light tracking-wide leading-relaxed drop-shadow-xs max-w-xl ${
                  isLightText ? 'text-stone-200' : 'text-stone-800'
                }`}
              >
                {currentSlide.description || currentSlide.subheading}
              </p>
            )}

            {/* Action Buttons */}
            {(currentSlide?.showCta !== false || currentSlide?.showSecondaryCta) && (
              <div
                className={`mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 ${
                  currentSlide?.horizontalAlignment === 'left'
                    ? 'justify-start'
                    : currentSlide?.horizontalAlignment === 'right'
                    ? 'justify-end'
                    : 'justify-center sm:justify-center'
                }`}
              >
                {currentSlide?.showCta !== false && (currentSlide?.ctaLabel || currentSlide?.buttonText) && (
                  <button
                    id="hero-primary-cta"
                    onClick={() => handleCtaClick(currentSlide.ctaUrl || currentSlide.buttonUrl)}
                    className="bg-stone-900 hover:bg-stone-800 text-white text-[11px] uppercase tracking-[0.25em] font-medium py-3.5 px-8 border border-stone-700 shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>{currentSlide.ctaLabel || currentSlide.buttonText || 'EXPLORE TRENDING'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {currentSlide?.showSecondaryCta && (currentSlide?.secondaryCtaLabel || currentSlide?.secondaryButtonText) && (
                  <button
                    id="hero-secondary-cta"
                    onClick={() => handleCtaClick(currentSlide.secondaryCtaUrl || currentSlide.secondaryButtonUrl)}
                    className={`text-[11px] uppercase tracking-[0.25em] font-medium py-3.5 px-8 backdrop-blur-xs transition-all duration-200 cursor-pointer active:scale-98 border ${
                      isLightText
                        ? 'bg-transparent hover:bg-white/15 text-white border-white/40 hover:border-white'
                        : 'bg-white/80 hover:bg-white text-stone-900 border-stone-300'
                    }`}
                  >
                    <span>{currentSlide.secondaryCtaLabel || currentSlide.secondaryButtonText || 'SHOP ALL'}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. CAROUSEL NAVIGATION ARROWS (Shown ONLY if > 1 slide AND showArrows is true) */}
      {totalSlides > 1 && normalizedSettings.showArrows && (
        <>
          <button
            onClick={goToPrev}
            aria-label="Previous Hero Slide"
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/30 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={goToNext}
            aria-label="Next Hero Slide"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/30 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </>
      )}

      {/* 5. CAROUSEL PAGINATION DOTS (Shown ONLY if > 1 slide AND showDots is true) */}
      {totalSlides > 1 && normalizedSettings.showDots && (
        <div
          role="tablist"
          aria-label="Hero Slides"
          className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/15"
        >
          {activeSlides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={`dot-${slide.id}-${idx}`}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${idx + 1}: ${slide.heading || 'Hero slide'}`}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-7 sm:w-8 h-2 bg-white shadow-sm'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            );
          })}
        </div>
      )}

      {/* 6. SUBTLE LUXURY ATELIER WATERMARK (Only if only 1 slide or if text overlay is on) */}
      {totalSlides === 1 && isTextOverlayOn && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[9px] text-white/50 tracking-[0.3em] uppercase font-zaslia pointer-events-none z-20">
          <span className="w-6 h-px bg-white/30" />
          <span>GULPASH COUTURE</span>
          <span className="w-6 h-px bg-white/30" />
        </div>
      )}
    </section>
  );
};
