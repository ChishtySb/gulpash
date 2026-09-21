import { EditorialCampaignItem, EditorialCampaignSectionConfig, HomepageCMS } from '../types';

export const EMPTY_CAMPAIGN_ITEM: EditorialCampaignItem = {
  id: '',
  order: 1,
  enabled: true,
  name: 'Campaign 1',
  mediaType: 'image',
  desktopImageUrl: '',
  mobileImageUrl: '',
  posterImageUrl: '',
  mobilePosterImageUrl: '',
  videoUrl: '',
  mobileVideoUrl: '',
  mobileVideoFallback: 'mobile_poster',
  altText: '',

  // Video playback
  videoAutoplay: true,
  videoLoop: true,
  videoMuted: true,
  videoPauseOnHover: false,
  videoShowControls: false,

  // Dark overlay
  showOverlay: true,
  overlayOpacity: 45,

  // Text & CTA master toggle
  showTextAndCta: true,

  // Sub-elements
  showEyebrow: true,
  eyebrow: '',
  showHeading: true,
  heading: '',
  showDescription: true,
  description: '',
  showCta: true,
  ctaLabel: '',
  ctaUrl: '',
  showSecondaryCta: false,
  secondaryCtaLabel: '',
  secondaryCtaUrl: '',

  // Alignment & appearance
  horizontalAlignment: 'center',
  verticalAlignment: 'center',
  textTheme: 'light',

  // Crop / Object position
  objectPositionDesktop: 'center',
  objectPositionMobile: 'center'
};

/**
 * Initial Canonical Royal Couture Campaign
 * Migrated one-time into canonical Supabase homepage_cms.
 */
export const INITIAL_ROYAL_COUTURE_CAMPAIGN: EditorialCampaignItem = {
  id: 'campaign-1-royal-couture',
  order: 1,
  enabled: true,
  name: 'Royal Couture Campaign',
  mediaType: 'image',
  desktopImageUrl: 'https://alzqexevrhcmzcluvatc.supabase.co/storage/v1/object/public/product-images/1789973438153_ias1z_gemini_generated_image_sl3a7usl3a7usl3a.jfif',
  mobileImageUrl: 'https://alzqexevrhcmzcluvatc.supabase.co/storage/v1/object/public/product-images/1789973463030_2pd7w_gemini_generated_image_9egzlo9egzlo9egz.jfif',
  posterImageUrl: '',
  mobilePosterImageUrl: '',
  videoUrl: '',
  mobileVideoUrl: '',
  mobileVideoFallback: 'mobile_poster',
  altText: 'The Sovereign Craft of Pakistani Embroidery - GulPash Royal Couture Atelier',

  // Video playback
  videoAutoplay: true,
  videoLoop: true,
  videoMuted: true,
  videoPauseOnHover: false,
  videoShowControls: false,

  // Dark overlay
  showOverlay: true,
  overlayOpacity: 50,

  // Text & CTA master toggle (Honoring intentional admin preference)
  showTextAndCta: false,

  // Sub-elements
  showEyebrow: false,
  eyebrow: 'ROYAL COUTURE CAMPAIGN',
  showHeading: false,
  heading: 'The Sovereign Craft of Pakistani Embroidery',
  showDescription: false,
  description: 'Witness the intricate zardozi, hand-tilla motifs, and fine pure threadwork brought to life in our Lahore ateliers.',
  showCta: true,
  ctaLabel: 'Explore Trending Ensembles',
  ctaUrl: '/collections/best-selling',
  showSecondaryCta: false,
  secondaryCtaLabel: '',
  secondaryCtaUrl: '',

  // Alignment & appearance
  horizontalAlignment: 'center',
  verticalAlignment: 'center',
  textTheme: 'light',

  // Crop / Object position
  objectPositionDesktop: 'center',
  objectPositionMobile: 'center'
};

export const DEFAULT_EDITORIAL_CAMPAIGN_CONFIG: EditorialCampaignSectionConfig = {
  enabled: true,
  displayMode: 'single',
  activeCampaignId: 'campaign-1-royal-couture',
  sliderSettings: {
    autoPlay: true,
    slideDuration: 6,
    showArrows: true,
    showDots: true,
    pauseOnHover: true
  },
  campaigns: [INITIAL_ROYAL_COUTURE_CAMPAIGN]
};

/**
 * Normalizes CMS config strictly from canonical CMS data without forcing legacy fallbacks.
 * Preserves intentional admin edits, empty text fields, and disabled states.
 */
export function normalizeEditorialCampaign(cms?: Partial<HomepageCMS>): EditorialCampaignSectionConfig {
  if (!cms) {
    return { ...DEFAULT_EDITORIAL_CAMPAIGN_CONFIG };
  }

  // Check if editorialCampaign is configured
  if (cms.editorialCampaign) {
    const rawConfig = cms.editorialCampaign;
    const rawCampaigns = Array.isArray(rawConfig.campaigns) ? rawConfig.campaigns : [];

    const normalizedCampaigns: EditorialCampaignItem[] = rawCampaigns.map((c, idx) => ({
      id: c.id || `campaign-${idx + 1}-${Date.now()}`,
      order: typeof c.order === 'number' ? c.order : idx + 1,
      enabled: c.enabled !== false,
      name: c.name || `Campaign ${idx + 1}`,
      mediaType: c.mediaType === 'video' ? 'video' : 'image',
      desktopImageUrl: c.desktopImageUrl ?? '',
      mobileImageUrl: c.mobileImageUrl ?? '',
      posterImageUrl: c.posterImageUrl ?? '',
      mobilePosterImageUrl: c.mobilePosterImageUrl ?? '',
      videoUrl: c.videoUrl ?? '',
      mobileVideoUrl: c.mobileVideoUrl ?? '',
      mobileVideoFallback: c.mobileVideoFallback || 'mobile_poster',
      altText: c.altText ?? '',

      videoAutoplay: c.videoAutoplay !== false,
      videoLoop: c.videoLoop !== false,
      videoMuted: c.videoMuted !== false,
      videoPauseOnHover: c.videoPauseOnHover === true,
      videoShowControls: c.videoShowControls === true,

      showOverlay: c.showOverlay !== false,
      overlayOpacity: typeof c.overlayOpacity === 'number' ? c.overlayOpacity : 45,

      showTextAndCta: c.showTextAndCta !== false,
      showEyebrow: c.showEyebrow !== false,
      eyebrow: c.eyebrow ?? '',
      showHeading: c.showHeading !== false,
      heading: c.heading ?? '',
      showDescription: c.showDescription !== false,
      description: c.description ?? '',
      showCta: c.showCta !== false,
      ctaLabel: c.ctaLabel ?? '',
      ctaUrl: c.ctaUrl ?? '',
      showSecondaryCta: c.showSecondaryCta === true,
      secondaryCtaLabel: c.secondaryCtaLabel ?? '',
      secondaryCtaUrl: c.secondaryCtaUrl ?? '',

      horizontalAlignment: c.horizontalAlignment || 'center',
      verticalAlignment: c.verticalAlignment || 'center',
      textTheme: c.textTheme || 'light',
      objectPositionDesktop: c.objectPositionDesktop || 'center',
      objectPositionMobile: c.objectPositionMobile || 'center'
    }));

    const activeId = rawConfig.activeCampaignId || normalizedCampaigns[0]?.id || '';

    return {
      enabled: rawConfig.enabled !== false && cms.showEditorialCampaign !== false,
      displayMode: rawConfig.displayMode === 'slider' ? 'slider' : 'single',
      activeCampaignId: activeId,
      sliderSettings: rawConfig.sliderSettings || {
        autoPlay: true,
        slideDuration: 6,
        showArrows: true,
        showDots: true,
        pauseOnHover: true
      },
      campaigns: normalizedCampaigns
    };
  }

  return { ...DEFAULT_EDITORIAL_CAMPAIGN_CONFIG };
}

/**
 * Keeps legacy editorialBanner structure synchronized with the active campaign for backwards compatibility.
 */
export function syncCampaignToLegacyBanner(campaign?: EditorialCampaignItem | null): {
  heading: string;
  subheading: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
} {
  return {
    heading: campaign?.heading ?? '',
    subheading: campaign?.description ?? '',
    buttonText: campaign?.ctaLabel ?? '',
    buttonUrl: campaign?.ctaUrl ?? '',
    imageUrl: campaign?.desktopImageUrl || campaign?.posterImageUrl || ''
  };
}

/**
 * Creates a new blank campaign item.
 */
export function createNewCampaign(order: number, name?: string): EditorialCampaignItem {
  return {
    id: `campaign-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    order,
    enabled: true,
    name: name || `Campaign ${order}`,
    mediaType: 'image',
    desktopImageUrl: '',
    mobileImageUrl: '',
    posterImageUrl: '',
    mobilePosterImageUrl: '',
    videoUrl: '',
    mobileVideoUrl: '',
    mobileVideoFallback: 'mobile_poster',
    altText: '',

    videoAutoplay: true,
    videoLoop: true,
    videoMuted: true,
    videoPauseOnHover: false,
    videoShowControls: false,

    showOverlay: true,
    overlayOpacity: 45,

    showTextAndCta: true,
    showEyebrow: true,
    eyebrow: '',
    showHeading: true,
    heading: '',
    showDescription: true,
    description: '',
    showCta: true,
    ctaLabel: 'EXPLORE COLLECTION',
    ctaUrl: '/shop',
    showSecondaryCta: false,
    secondaryCtaLabel: '',
    secondaryCtaUrl: '',

    horizontalAlignment: 'center',
    verticalAlignment: 'center',
    textTheme: 'light',
    objectPositionDesktop: 'center',
    objectPositionMobile: 'center'
  };
}
