import { EditorialCampaignItem, EditorialCampaignSectionConfig, HomepageCMS } from '../types';

export const DEFAULT_ROYAL_COUTURE_CAMPAIGN: EditorialCampaignItem = {
  id: 'campaign-1-royal-couture',
  order: 1,
  enabled: true,
  name: 'Royal Couture Campaign',
  mediaType: 'image',
  desktopImageUrl: 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/4_65e648be-58bb-4b95-a22c-a2b130e9d6d7.png?v=1787217112',
  mobileImageUrl: 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/4_65e648be-58bb-4b95-a22c-a2b130e9d6d7.png?v=1787217112',
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
  overlayOpacity: 45,

  // Text & CTA master toggle
  showTextAndCta: true,

  // Sub-elements
  showEyebrow: true,
  eyebrow: 'ROYAL COUTURE CAMPAIGN',
  showHeading: true,
  heading: 'The Sovereign Craft of Pakistani Embroidery',
  showDescription: true,
  description: 'Witness the intricate zardozi, hand-tilla motifs, and fine pure threadwork brought to life in our Lahore ateliers.',
  showCta: true,
  ctaLabel: 'EXPLORE TRENDING ENSEMBLES',
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
  campaigns: [DEFAULT_ROYAL_COUTURE_CAMPAIGN]
};

/**
 * Normalizes and migrates any CMS config to ensure editorialCampaign is populated,
 * preserving existing royal couture content or custom legacy banner content.
 */
export function normalizeEditorialCampaign(cms?: Partial<HomepageCMS>): EditorialCampaignSectionConfig {
  if (!cms) {
    return JSON.parse(JSON.stringify(DEFAULT_EDITORIAL_CAMPAIGN_CONFIG));
  }

  // Check if editorialCampaign is already configured with campaigns
  if (cms.editorialCampaign && Array.isArray(cms.editorialCampaign.campaigns) && cms.editorialCampaign.campaigns.length > 0) {
    const rawConfig = cms.editorialCampaign;
    const normalizedCampaigns: EditorialCampaignItem[] = rawConfig.campaigns.map((c, idx) => ({
      ...DEFAULT_ROYAL_COUTURE_CAMPAIGN,
      ...c,
      id: c.id || `campaign-${idx + 1}-${Date.now()}`,
      order: typeof c.order === 'number' ? c.order : idx + 1,
      name: c.name || `Campaign ${idx + 1}`,
      mediaType: c.mediaType === 'video' ? 'video' : 'image',
      overlayOpacity: typeof c.overlayOpacity === 'number' ? c.overlayOpacity : 45,
      showTextAndCta: c.showTextAndCta !== false,
      showOverlay: c.showOverlay !== false,
      showEyebrow: c.showEyebrow !== false,
      showHeading: c.showHeading !== false,
      showDescription: c.showDescription !== false,
      showCta: c.showCta !== false,
      horizontalAlignment: c.horizontalAlignment || 'center',
      verticalAlignment: c.verticalAlignment || 'center',
      textTheme: c.textTheme || 'light',
      objectPositionDesktop: c.objectPositionDesktop || 'center',
      objectPositionMobile: c.objectPositionMobile || 'center'
    }));

    const activeId = rawConfig.activeCampaignId || normalizedCampaigns.find(c => c.enabled)?.id || normalizedCampaigns[0].id;

    return {
      enabled: rawConfig.enabled !== false && cms.showEditorialBanner !== false && cms.showEditorialCampaign !== false,
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

  // Otherwise, create Campaign 1 based on legacy editorialBanner if available or default
  const legacyBanner = cms.editorialBanner;
  const legacyImg = legacyBanner?.imageUrl || '';
  const legacyHeading = legacyBanner?.heading;
  const legacySubheading = legacyBanner?.subheading;
  const legacyBtn = legacyBanner?.buttonText;
  const legacyUrl = legacyBanner?.buttonUrl;

  const campaign1: EditorialCampaignItem = {
    ...DEFAULT_ROYAL_COUTURE_CAMPAIGN,
    desktopImageUrl: legacyImg || DEFAULT_ROYAL_COUTURE_CAMPAIGN.desktopImageUrl,
    mobileImageUrl: legacyImg || DEFAULT_ROYAL_COUTURE_CAMPAIGN.mobileImageUrl,
    heading: legacyHeading || DEFAULT_ROYAL_COUTURE_CAMPAIGN.heading,
    description: legacySubheading || DEFAULT_ROYAL_COUTURE_CAMPAIGN.description,
    ctaLabel: legacyBtn || DEFAULT_ROYAL_COUTURE_CAMPAIGN.ctaLabel,
    ctaUrl: legacyUrl || DEFAULT_ROYAL_COUTURE_CAMPAIGN.ctaUrl
  };

  const isEnabled = cms.showEditorialBanner !== false && (cms as any).showEditorial !== false;

  return {
    enabled: isEnabled,
    displayMode: 'single',
    activeCampaignId: campaign1.id,
    sliderSettings: {
      autoPlay: true,
      slideDuration: 6,
      showArrows: true,
      showDots: true,
      pauseOnHover: true
    },
    campaigns: [campaign1]
  };
}

/**
 * Keeps legacy editorialBanner structure synchronized with the active campaign for backwards compatibility.
 */
export function syncCampaignToLegacyBanner(campaign: EditorialCampaignItem): {
  heading: string;
  subheading: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
} {
  return {
    heading: campaign.heading || 'The Art of Pakistani Luxury Fashion',
    subheading: campaign.description || 'Each GulPash creation embodies centuries-old Pakistani artisan heritage.',
    buttonText: campaign.ctaLabel || 'DISCOVER THE CATALOG',
    buttonUrl: campaign.ctaUrl || '/shop',
    imageUrl: campaign.desktopImageUrl || campaign.posterImageUrl || ''
  };
}

/**
 * Creates a new blank campaign item with sensible defaults.
 */
export function createNewCampaign(order: number, name?: string): EditorialCampaignItem {
  return {
    ...DEFAULT_ROYAL_COUTURE_CAMPAIGN,
    id: `campaign-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    order,
    enabled: false, // created as draft
    name: name || `Campaign ${order}`,
    mediaType: 'image',
    desktopImageUrl: '',
    mobileImageUrl: '',
    videoUrl: '',
    mobileVideoUrl: '',
    posterImageUrl: '',
    mobilePosterImageUrl: '',
    eyebrow: 'ROYAL COUTURE CAMPAIGN',
    heading: 'New Campaign Heading',
    description: 'Enter editorial campaign description for this seasonal release.',
    ctaLabel: 'EXPLORE COLLECTION',
    ctaUrl: '/shop'
  };
}
