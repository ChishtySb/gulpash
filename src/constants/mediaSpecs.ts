export interface MediaSpecification {
  id: string;
  label: string;
  subLabel?: string;
  recommendedWidth: number;
  recommendedHeight: number;
  aspectRatio: string;
  ratioValue: number; // width / height
  ratioTolerance: number; // allowed margin e.g. 0.15
  acceptedFormats: string[]; // e.g. ['WebP', 'JPG', 'PNG']
  mediaType: 'image' | 'video';
  description: string;
  storageFolder: string;
}

export const MEDIA_SPECS: Record<string, MediaSpecification> = {
  // HOMEPAGE HERO
  HOMEPAGE_HERO_DESKTOP_IMAGE: {
    id: 'hero_desktop_image',
    label: 'Desktop Hero Image',
    subLabel: 'Primary full-width hero canvas for desktop and laptop displays',
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    aspectRatio: '16:9',
    ratioValue: 1920 / 1080, // 1.777
    ratioTolerance: 0.15,
    acceptedFormats: ['WebP', 'JPG', 'PNG'],
    mediaType: 'image',
    description: 'Rendered full-bleed on large displays. Focus key subject in center-right safe zone.',
    storageFolder: 'hero'
  },
  HOMEPAGE_HERO_MOBILE_IMAGE: {
    id: 'hero_mobile_image',
    label: 'Mobile Hero Image',
    subLabel: 'Optimized portrait orientation for smartphones and compact touch screens',
    recommendedWidth: 1080,
    recommendedHeight: 1350,
    aspectRatio: '4:5',
    ratioValue: 1080 / 1350, // 0.8
    ratioTolerance: 0.15,
    acceptedFormats: ['WebP', 'JPG', 'PNG'],
    mediaType: 'image',
    description: 'Vertical 4:5 portrait crop ensuring full visibility without cropping heads or hems on mobile devices.',
    storageFolder: 'hero'
  },
  HOMEPAGE_HERO_DESKTOP_VIDEO: {
    id: 'hero_desktop_video',
    label: 'Desktop Hero Runway Video',
    subLabel: 'High-definition runway cinematic loop for desktop screens',
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    aspectRatio: '16:9',
    ratioValue: 1920 / 1080,
    ratioTolerance: 0.15,
    acceptedFormats: ['MP4', 'WebM'],
    mediaType: 'video',
    description: 'Muted autoplay loop. Recommended bitrate under 5 Mbps for instant streaming cold-starts.',
    storageFolder: 'hero'
  },
  HOMEPAGE_HERO_MOBILE_VIDEO: {
    id: 'hero_mobile_video',
    label: 'Mobile Hero Runway Video',
    subLabel: 'Vertical fashion video for smartphone touchscreens',
    recommendedWidth: 1080,
    recommendedHeight: 1920,
    aspectRatio: '9:16',
    ratioValue: 1080 / 1920, // 0.5625
    ratioTolerance: 0.15,
    acceptedFormats: ['MP4', 'WebM'],
    mediaType: 'video',
    description: 'Full-screen mobile story/reel format. Ensure primary garment is vertically centered.',
    storageFolder: 'hero'
  },
  HOMEPAGE_HERO_DESKTOP_POSTER: {
    id: 'hero_desktop_poster',
    label: 'Desktop Video Poster / Fallback Image',
    subLabel: 'Placeholder image displayed while the desktop video buffers',
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    aspectRatio: '16:9',
    ratioValue: 1920 / 1080,
    ratioTolerance: 0.15,
    acceptedFormats: ['WebP', 'JPG'],
    mediaType: 'image',
    description: 'First frame of the video or high-res equivalent to avoid black buffer screens.',
    storageFolder: 'hero'
  },
  HOMEPAGE_HERO_MOBILE_POSTER: {
    id: 'hero_mobile_poster',
    label: 'Mobile Video Poster / Fallback Image',
    subLabel: 'Placeholder image displayed while the mobile video buffers',
    recommendedWidth: 1080,
    recommendedHeight: 1920,
    aspectRatio: '9:16',
    ratioValue: 1080 / 1920,
    ratioTolerance: 0.15,
    acceptedFormats: ['WebP', 'JPG'],
    mediaType: 'image',
    description: 'First vertical frame to provide seamless initial paint on mobile connections.',
    storageFolder: 'hero'
  },

  // STOREFRONT COLLECTIONS
  COLLECTION_CARD_IMAGE: {
    id: 'collection_card_image',
    label: 'Collection Card Image',
    subLabel: 'Curated Collection grid card on the homepage and catalog directories',
    recommendedWidth: 1200,
    recommendedHeight: 1500,
    aspectRatio: '4:5',
    ratioValue: 1200 / 1500, // 0.8
    ratioTolerance: 0.1,
    acceptedFormats: ['WebP', 'JPG', 'PNG'],
    mediaType: 'image',
    description: 'Editorial portrait shot showcasing the signature aesthetic of the collection.',
    storageFolder: 'collection-cards'
  },
  COLLECTION_DESKTOP_BANNER: {
    id: 'collection_desktop_banner',
    label: 'Collection Desktop Header Banner',
    subLabel: 'Panoramic header banner rendered at the top of the collection catalog page',
    recommendedWidth: 1920,
    recommendedHeight: 600,
    aspectRatio: '16:5',
    ratioValue: 1920 / 600, // 3.2
    ratioTolerance: 0.25,
    acceptedFormats: ['WebP', 'JPG', 'PNG'],
    mediaType: 'image',
    description: 'Wide panorama format. Keep text and models centered to accommodate responsive viewport widths.',
    storageFolder: 'collection-banners'
  },
  COLLECTION_MOBILE_BANNER: {
    id: 'collection_mobile_banner',
    label: 'Collection Mobile Header Banner',
    subLabel: 'Compact header banner rendered on mobile devices',
    recommendedWidth: 1080,
    recommendedHeight: 1350,
    aspectRatio: '4:5',
    ratioValue: 1080 / 1350, // 0.8
    ratioTolerance: 0.2,
    acceptedFormats: ['WebP', 'JPG', 'PNG'],
    mediaType: 'image',
    description: 'Portrait ratio optimized for mobile viewports to prevent cramped text overlays.',
    storageFolder: 'collection-banners'
  },

  // PRODUCTS
  PRODUCT_IMAGE: {
    id: 'product_image',
    label: 'Product Gallery Image',
    subLabel: 'Storefront product cards and high-resolution PDP zoom gallery',
    recommendedWidth: 1200,
    recommendedHeight: 1500,
    aspectRatio: '4:5',
    ratioValue: 1200 / 1500, // 0.8
    ratioTolerance: 0.1,
    acceptedFormats: ['WebP', 'JPG'],
    mediaType: 'image',
    description: 'Clean couture studio photography with generous padding around neckline and hem.',
    storageFolder: 'product-images'
  },
  PRODUCT_VIDEO: {
    id: 'product_video',
    label: 'Product Runway Video',
    subLabel: 'Interactive model movement and drape preview in PDP media gallery',
    recommendedWidth: 1080,
    recommendedHeight: 1350,
    aspectRatio: '4:5',
    ratioValue: 1080 / 1350, // 0.8
    ratioTolerance: 0.15,
    acceptedFormats: ['MP4', 'WebM'],
    mediaType: 'video',
    description: 'Short 5-15 second smooth loop demonstrating fabric flow and drape.',
    storageFolder: 'product-videos'
  },

  // CMS & PROMOTIONAL BANNERS
  PROMOTIONAL_EDITORIAL_BANNER: {
    id: 'promotional_editorial_banner',
    label: 'Editorial Showcase Banner',
    subLabel: 'Full-width editorial split banner and seasonal promotional feature',
    recommendedWidth: 1920,
    recommendedHeight: 800,
    aspectRatio: '16:7',
    ratioValue: 1920 / 800, // 2.4
    ratioTolerance: 0.2,
    acceptedFormats: ['WebP', 'JPG', 'PNG'],
    mediaType: 'image',
    description: 'High-contrast cinematic campaign photograph for homepage luxury merchandising.',
    storageFolder: 'cms'
  }
};
