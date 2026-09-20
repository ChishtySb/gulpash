import { HeroSlideConfig, HeroSlideItem, HeroSliderSettings, HomepageCMS } from '../types';

export const DEFAULT_HERO_SLIDER_SETTINGS: HeroSliderSettings = {
  autoPlay: true,
  slideDuration: 5,
  showArrows: true,
  showDots: true,
  pauseOnHover: true,
};

export function createEmptyHeroSlide(order: number = 1): HeroSlideItem {
  const id = `slide-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  return {
    id,
    order,
    enabled: true,
    mediaType: 'image',
    desktopImageUrl: '',
    mobileImageUrl: '',
    videoUrl: '',
    mobileVideoUrl: '',
    posterImageUrl: '',
    
    // Toggles
    showOverlay: true,
    overlayOpacity: 35,
    showTextAndCta: true,
    showEyebrow: true,
    showHeading: true,
    showDescription: true,
    showCta: true,
    showSecondaryCta: false,

    // Content
    eyebrow: 'NEW ARRIVAL • 2026',
    heading: 'Signature Luxury Edit',
    description: 'Bespoke hand embroidery on pure organza & raw silk',
    ctaLabel: 'EXPLORE COLLECTION',
    ctaUrl: '/shop',
    secondaryCtaLabel: 'VIEW LOOKBOOK',
    secondaryCtaUrl: '/collections/best-selling',

    // Visual controls
    horizontalAlignment: 'center',
    verticalAlignment: 'center',
    textTheme: 'light',
    objectPositionDesktop: 'center',
    objectPositionMobile: 'center',

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function migrateHeroToSlides(cms: HomepageCMS): {
  slides: HeroSlideItem[];
  settings: HeroSliderSettings;
} {
  const settings: HeroSliderSettings = {
    autoPlay: cms.heroSliderSettings?.autoPlay ?? DEFAULT_HERO_SLIDER_SETTINGS.autoPlay,
    slideDuration: cms.heroSliderSettings?.slideDuration ?? DEFAULT_HERO_SLIDER_SETTINGS.slideDuration,
    showArrows: cms.heroSliderSettings?.showArrows ?? DEFAULT_HERO_SLIDER_SETTINGS.showArrows,
    showDots: cms.heroSliderSettings?.showDots ?? DEFAULT_HERO_SLIDER_SETTINGS.showDots,
    pauseOnHover: cms.heroSliderSettings?.pauseOnHover ?? DEFAULT_HERO_SLIDER_SETTINGS.pauseOnHover,
  };

  if (cms.heroSlides && cms.heroSlides.length > 0) {
    const normalizedSlides = cms.heroSlides.map((s, idx) => ({
      ...s,
      order: s.order ?? idx + 1,
      enabled: s.enabled ?? s.isActive ?? true,
      mediaType: (s.mediaType || s.type || 'image') as 'image' | 'video',
      desktopImageUrl: s.desktopImageUrl || s.image || '',
      mobileImageUrl: s.mobileImageUrl || s.mobileImage || s.desktopImageUrl || s.image || '',
      showOverlay: s.showOverlay ?? true,
      overlayOpacity: s.overlayOpacity ?? 35,
      showTextAndCta: s.showTextAndCta ?? true,
      showEyebrow: s.showEyebrow ?? true,
      showHeading: s.showHeading ?? true,
      showDescription: s.showDescription ?? true,
      showCta: s.showCta ?? true,
      showSecondaryCta: s.showSecondaryCta ?? false,
      eyebrow: s.eyebrow ?? s.badge ?? '',
      heading: s.heading ?? '',
      description: s.description ?? s.subheading ?? '',
      ctaLabel: s.ctaLabel ?? s.buttonText ?? 'SHOP NOW',
      ctaUrl: s.ctaUrl ?? s.buttonUrl ?? '/shop',
      secondaryCtaLabel: s.secondaryCtaLabel ?? s.secondaryButtonText ?? '',
      secondaryCtaUrl: s.secondaryCtaUrl ?? s.secondaryButtonUrl ?? '',
      horizontalAlignment: s.horizontalAlignment || 'center',
      verticalAlignment: s.verticalAlignment || 'center',
      textTheme: s.textTheme || 'light',
      objectPositionDesktop: s.objectPositionDesktop || 'center',
      objectPositionMobile: s.objectPositionMobile || 'center',
    }));
    return { slides: normalizedSlides, settings };
  }

  // Fallback / initial migration from single hero
  const h = cms.hero || ({} as HeroSlideConfig);
  const slide1: HeroSlideItem = {
    id: 'slide-1',
    order: 1,
    enabled: h.isActive ?? true,
    mediaType: h.type === 'video' ? 'video' : 'image',
    desktopImageUrl: h.desktopImageUrl || h.image || '',
    mobileImageUrl: h.mobileImageUrl || h.mobileImage || h.desktopImageUrl || h.image || '',
    videoUrl: h.videoUrl || '',
    mobileVideoUrl: h.mobileVideoUrl || h.videoUrl || '',
    posterImageUrl: h.posterImageUrl || '',
    
    showOverlay: h.showOverlay ?? true,
    overlayOpacity: h.overlayOpacity ?? 35,
    showTextAndCta: h.showTextAndCta ?? true,
    showEyebrow: h.showEyebrow ?? !!h.badge,
    showHeading: h.showHeading ?? !!h.heading,
    showDescription: h.showDescription ?? !!h.subheading,
    showCta: h.showCta ?? !!h.buttonText,
    showSecondaryCta: !!h.secondaryButtonText,

    eyebrow: h.badge || 'GULPASH COUTURE 2026',
    heading: h.heading || 'GulPash Luxury Collection',
    description: h.subheading || 'Discover the pinnacle of Pakistani craftsmanship',
    ctaLabel: h.buttonText || 'EXPLORE TRENDING',
    ctaUrl: h.buttonUrl || '/collections/best-selling',
    secondaryCtaLabel: h.secondaryButtonText || 'SHOP ALL',
    secondaryCtaUrl: h.secondaryButtonUrl || '/shop',

    horizontalAlignment: h.horizontalAlignment || 'center',
    verticalAlignment: h.verticalAlignment || 'center',
    textTheme: h.textTheme || 'light',
    objectPositionDesktop: h.objectPositionDesktop || 'center',
    objectPositionMobile: h.objectPositionMobile || 'center',

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return { slides: [slide1], settings };
}

export function syncSlideToLegacyHero(slide: HeroSlideItem): HeroSlideConfig {
  return {
    type: slide.mediaType,
    heading: slide.heading,
    subheading: slide.description,
    badge: slide.eyebrow,
    buttonText: slide.ctaLabel,
    buttonUrl: slide.ctaUrl,
    secondaryButtonText: slide.secondaryCtaLabel,
    secondaryButtonUrl: slide.secondaryCtaUrl,
    desktopImageUrl: slide.desktopImageUrl,
    mobileImageUrl: slide.mobileImageUrl,
    videoUrl: slide.videoUrl,
    mobileVideoUrl: slide.mobileVideoUrl,
    posterImageUrl: slide.posterImageUrl,
    overlayOpacity: slide.overlayOpacity,
    isActive: slide.enabled,
    image: slide.desktopImageUrl,
    mobileImage: slide.mobileImageUrl,
    title: slide.heading,
    subtitle: slide.description,
    linkUrl: slide.ctaUrl,
    showTextAndCta: slide.showTextAndCta,
    showOverlay: slide.showOverlay,
    showEyebrow: slide.showEyebrow,
    showHeading: slide.showHeading,
    showDescription: slide.showDescription,
    showCta: slide.showCta,
    horizontalAlignment: slide.horizontalAlignment,
    verticalAlignment: slide.verticalAlignment,
    textTheme: slide.textTheme,
    objectPositionDesktop: slide.objectPositionDesktop,
    objectPositionMobile: slide.objectPositionMobile,
  };
}
