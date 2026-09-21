export type CurrencyCode = 'PKR' | 'USD' | 'GBP' | 'AED' | 'EUR' | 'CAD';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  rateAgainstPKR: number; // 1 USD = ~280 PKR, so rate is 1/280
}

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Unstitched' | 'Custom Stitch' | string;

export type ProductStatus = 'active' | 'draft' | 'archived';

export type MigrationStatus = 'pending' | 'imported' | 'verified' | 'needs_review' | 'failed';

export interface ProductImageDetailed {
  id: string;
  productId: string;
  sourceImageId?: number;
  storagePath: string;
  sourceUrl: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface ProductVariantDetailed {
  id: string;
  productId?: string;
  sourceVariantId?: number;
  title: string;
  size: string;
  color?: string;
  fabric?: string;
  length?: string;
  optionValues?: Record<string, string>;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  available: boolean;
  stock: number;
  position?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  id: string;
  size: ProductSize;
  color?: string;
  sku: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  category: string; // e.g. "Unstitched / Stitched", "Stitched", etc.
  categoryId?: string;
  categorySlug?: string;
  collection?: string;
  collectionSlug?: string;
  collectionIds?: string[];
  collectionNames?: string[];
  price: number; // in PKR
  compareAtPrice?: number | null; // original price in PKR
  costPrice?: number;
  stock: number;
  inventoryMode?: 'quantity' | 'availability';
  lowStockThreshold?: number;
  sizes: (ProductSize | string)[];
  fabric: string;
  fabricDetails?: string;
  pieceCount?: string;
  colors?: string[];
  tags: string[];
  images: string[];
  primaryImageIndex?: number;
  productImages?: ProductImageDetailed[];
  variants?: ProductVariantDetailed[];
  videoUrl?: string; // MP4 or WebM video
  videoPoster?: string;
  status?: 'Draft' | 'Active' | 'Archived';
  isVisible: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isSoldOut?: boolean;
  rating: number;
  reviewCount: number;
  details?: {
    shirt?: string;
    dupatta?: string;
    trouser?: string;
    work?: string;
    careInstructions?: string;
    stitchingDetails?: string;
  };
  sizeGuideMode?: 'standard' | 'custom';
  customMeasurements?: Record<string, {
    chest?: string;
    waist?: string;
    hip?: string;
    length?: string;
    trouserLength?: string;
  }>;
  seoTitle?: string;
  seoDescription?: string;
  sourceUrl?: string;
  sourceProductId?: number | string;
  sourceSlug?: string;
  migrationStatus?: MigrationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  productCount?: number;
  isVisible: boolean;
  visibleInNav?: boolean;
  visibleOnHomepage?: boolean;
  order: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  image?: string;
  bannerUrl?: string;
  productCount?: number;
  productIds?: string[];
  productSlugs?: string[];
  productSourceIds?: (string | number)[];
  isVisible: boolean;
  visibleInNav?: boolean;
  visibleOnHomepage?: boolean;
  order: number;
  displayOrder?: number;
  bannerEnabled?: boolean;
  bannerType?: 'text' | 'image' | 'image_text';
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerDesktopImage?: string;
  bannerMobileImage?: string;
  bannerBgColor?: string;
  bannerTextColor?: string;
  bannerAlignment?: 'left' | 'center' | 'right';
  bannerOverlayStrength?: number;
  bannerCtaText?: string;
  bannerCtaLink?: string;
  altText?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  size: ProductSize;
  quantity: number;
  price: number;
}

export type OrderStatus = 
  | 'Payment Verification Pending'
  | 'Payment Action Required'
  | 'Ready to Dispatch'
  | 'Pending'
  | 'Confirmed'
  | 'In Production'
  | 'Processing'
  | 'Shipped'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Exchange Requested';

export type PaymentMethod = 
  | 'Cash on Delivery (COD)' 
  | 'JazzCash' 
  | 'Easypaisa' 
  | 'Direct Bank Transfer' 
  | 'Card Payment'
  | 'jazzcash'
  | 'easypaisa'
  | 'bank_transfer';

export interface OrderPaymentProof {
  screenshotUrl?: string;
  transactionReference?: string;
  submittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  size: ProductSize;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode?: string;
  orderNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "GP-1082"
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  shippingDiscount?: number;
  shippingDiscountReason?: 'FULL_ADVANCE_PAYMENT' | 'FREE_SHIPPING_THRESHOLD' | 'PROMO_CODE' | string;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentType?: 'Full Advance' | 'Cash on Delivery';
  paymentStatus: 'Unpaid' | 'Paid' | 'Under Verification' | 'Rejected' | 'Failed';
  status: OrderStatus;
  paymentProof?: OrderPaymentProof;
  trackingNumber?: string;
  courierName?: string;
  carrier?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface HeroSlideItem {
  id: string;
  order: number;
  enabled: boolean;
  mediaType: 'image' | 'video';
  desktopImageUrl: string;
  mobileImageUrl?: string;
  videoUrl?: string;
  mobileVideoUrl?: string;
  posterImageUrl?: string;
  
  // Text Overlay Toggles
  showOverlay: boolean;
  overlayOpacity: number; // 0 to 100
  showTextAndCta: boolean; // Main ON/OFF for text & CTA
  showEyebrow: boolean;
  showHeading: boolean;
  showDescription: boolean;
  showCta: boolean;
  showSecondaryCta?: boolean;
  
  // Text Content
  eyebrow?: string;
  heading: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  
  // Alignment & Styling
  horizontalAlignment: 'left' | 'center' | 'right';
  verticalAlignment: 'top' | 'center' | 'bottom';
  textTheme: 'light' | 'dark';
  objectPositionDesktop: 'center' | 'top' | 'bottom' | 'left' | 'right';
  objectPositionMobile: 'center' | 'top' | 'bottom' | 'left' | 'right';
  
  createdAt?: string;
  updatedAt?: string;

  // Compatibility aliases with legacy HeroSlideConfig
  image?: string;
  mobileImage?: string;
  type?: 'image' | 'video';
  isActive?: boolean;
  buttonText?: string;
  buttonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  subheading?: string;
  badge?: string;
}

export interface HeroSliderSettings {
  autoPlay: boolean;
  slideDuration: number; // in seconds (3, 4, 5, 6, 8)
  showArrows: boolean;
  showDots: boolean;
  pauseOnHover: boolean;
}

export interface HeroSlideConfig {
  type: 'video' | 'image';
  heading: string;
  subheading: string;
  badge?: string;
  buttonText: string;
  buttonUrl: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  desktopImageUrl: string;
  mobileImageUrl?: string;
  videoUrl?: string;
  mobileVideoUrl?: string;
  posterImageUrl?: string;
  overlayOpacity: number; // 0 to 100
  isActive: boolean;
  image?: string;
  mobileImage?: string;
  title?: string;
  subtitle?: string;
  linkUrl?: string;
  // Multi-slide extension
  showTextAndCta?: boolean;
  showOverlay?: boolean;
  showEyebrow?: boolean;
  showHeading?: boolean;
  showDescription?: boolean;
  showCta?: boolean;
  horizontalAlignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'center' | 'bottom';
  textTheme?: 'light' | 'dark';
  objectPositionDesktop?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  objectPositionMobile?: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

export interface AnnouncementItem {
  id: string;
  text: string;
  link?: string;
  isActive: boolean;
}

export interface EditorialCampaignItem {
  id: string;
  order: number;
  enabled: boolean;
  name: string; // e.g. "Royal Couture Campaign", "Festive Edit"
  mediaType: 'image' | 'video';
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  videoUrl?: string;
  mobileVideoUrl?: string;
  posterImageUrl?: string;
  mobilePosterImageUrl?: string;
  mobileVideoFallback?: 'mobile_poster' | 'desktop_video' | 'mobile_image';
  altText?: string;

  // Video playback
  videoAutoplay?: boolean;
  videoLoop?: boolean;
  videoMuted?: boolean;
  videoPauseOnHover?: boolean;
  videoShowControls?: boolean;

  // Dark overlay
  showOverlay?: boolean;
  overlayOpacity?: number; // 0 to 80

  // Text & CTA master toggle
  showTextAndCta?: boolean;

  // Sub-elements
  showEyebrow?: boolean;
  eyebrow?: string;
  showHeading?: boolean;
  heading?: string;
  showDescription?: boolean;
  description?: string;
  showCta?: boolean;
  ctaLabel?: string;
  ctaUrl?: string;
  showSecondaryCta?: boolean;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;

  // Alignment & appearance
  horizontalAlignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'center' | 'bottom';
  textTheme?: 'light' | 'dark';

  // Crop / Object position
  objectPositionDesktop?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  objectPositionMobile?: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

export interface EditorialCampaignSectionConfig {
  enabled: boolean;
  displayMode: 'single' | 'slider';
  activeCampaignId?: string;
  sliderSettings?: {
    autoPlay: boolean;
    slideDuration: number;
    showArrows: boolean;
    showDots: boolean;
    pauseOnHover: boolean;
  };
  campaigns: EditorialCampaignItem[];
}

export interface HomepageCMS {
  hero: HeroSlideConfig;
  heroSlides?: HeroSlideItem[];
  heroSliderSettings?: HeroSliderSettings;
  announcements: AnnouncementItem[];
  announcementBarActive: boolean;
  showFeaturedCollections: boolean;
  showBestSellers: boolean;
  showNewArrivals: boolean;
  showCategories: boolean;
  showEditorialBanner: boolean;
  showEditorialCampaign?: boolean;
  editorialCampaign?: EditorialCampaignSectionConfig;
  showCustomerReviews: boolean;
  showInstagramFeed: boolean;
  editorialBanner: {
    heading: string;
    subheading: string;
    buttonText: string;
    buttonUrl: string;
    imageUrl: string;
  };
  editorialShowcase?: {
    heading?: string;
    subheading?: string;
    subtitle?: string;
    buttonText?: string;
    buttonUrl?: string;
    imageUrl?: string;
  };
  announcementBar?: {
    enabled?: boolean;
    messages?: string[];
  };
}

export type CMSConfig = HomepageCMS;

export interface JazzCashSettings {
  enabled: boolean;
  accountTitle: string;
  accountNumber: string;
  instructions?: string;
}

export interface EasypaisaSettings {
  enabled: boolean;
  accountTitle: string;
  accountNumber: string;
  instructions?: string;
}

export interface BankTransferSettings {
  enabled: boolean;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  branchName?: string;
  instructions?: string;
}

export interface PaymentGatewaysConfig {
  cod: {
    enabled: boolean;
  };
  jazzCash: JazzCashSettings;
  easypaisa: EasypaisaSettings;
  bankTransfer: BankTransferSettings;
}

export interface AdvanceFreeDeliverySettings {
  enabled: boolean;
  eligiblePaymentMethods?: PaymentMethod[]; // e.g. ['JazzCash', 'Easypaisa', 'Direct Bank Transfer']
  minimumOrderAmount?: number; // 0 means any order qualifies
  minOrderAmount?: number;
  customerMessage?: string; // e.g. "Pay full in advance & get FREE delivery nationwide!"
  badgeText?: string;
}

export interface AdminNotificationChannels {
  inApp: boolean;
  popup: boolean;
  sound: boolean;
  push: boolean;
}

export interface AdminNotificationEventSettings {
  newOrder: boolean;
  newPaymentProof: boolean;
  paymentResubmitted: boolean;
  paymentVerified: boolean;
  paymentActionRequired: boolean;
  readyToDispatch: boolean;
  lowStock: boolean;
}

export interface AdminNotificationSettings {
  masterEnabled?: boolean;
  channels?: AdminNotificationChannels;
  events?: AdminNotificationEventSettings;
  soundEnabled: boolean;
  browserNotificationsEnabled?: boolean;
  lowStockThreshold: number; // default 3
  browserEnabled?: boolean;
  orderAlerts?: boolean;
  paymentProofAlerts?: boolean;
  lowStockAlerts?: boolean;
  soundVolume?: number;
}

export interface AdminNotificationPreferences {
  masterEnabled: boolean;
  channels: AdminNotificationChannels;
  events: AdminNotificationEventSettings;
  lowStockThreshold: number;
  soundVolume: number;
}

export interface AdminPushSubscription {
  id: string;
  user_id?: string;
  endpoint: string;
  p256dh?: string;
  auth?: string;
  device_name?: string;
  user_agent?: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  last_success_at?: string;
  failure_count?: number;
}

export type NotificationEventType = 
  | 'NEW_ORDER'
  | 'ORDER_STATUS_CHANGED'
  | 'NEW_PAYMENT_PROOF'
  | 'PAYMENT_PROOF_SUBMITTED'
  | 'PAYMENT_PROOF_RESUBMITTED'
  | 'PAYMENT_VERIFIED'
  | 'PAYMENT_ACTION_REQUIRED'
  | 'READY_TO_DISPATCH'
  | 'LOW_STOCK';

export interface AdminNotification {
  id: string;
  type: NotificationEventType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: string;
  orderNumber?: string;
  orderTotal?: number;
  customerName?: string;
  paymentMethod?: string;
  productId?: string;
  productTitle?: string;
  stock?: number;
}

export interface MediaAsset {
  id: string;
  url: string;
  fileName: string;
  dimensions?: string; // e.g. "1200 × 1500 px"
  aspectRatio?: string; // e.g. "4:5" or "16:9"
  fileSize?: string; // e.g. "420 KB"
  uploadedAt: string;
  mediaType: 'image' | 'video';
  category: 'product-image' | 'product-video' | 'collection-image' | 'collection-banner' | 'homepage-image' | 'homepage-video' | 'brand-asset' | 'campaign-graphic';
  usedIn?: string[]; // e.g. ["TRENDING Collection Banner", "Product: Plum 3Piece"]
}

export interface WhatsAppAssistanceSettings {
  enabled?: boolean;
  number?: string; // Visible customer-facing number, e.g. "03006392025"
  destinationNumber?: string; // Click-to-chat destination, e.g. "923006392025"
  displayLabel?: string; // e.g. "WhatsApp Assistance"
  defaultMessage?: string; // Editable message template
  showFloatingButton?: boolean; // Floating button ON / OFF
  showInHeader?: boolean; // Top header link ON / OFF
  showInFooter?: boolean; // Footer assistance link ON / OFF
  showOnProductPages?: boolean; // Product detail page inquiry button ON / OFF
  showInOrderAssistance?: boolean; // Order tracking / checkout assistance ON / OFF
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  domain: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  whatsappNumber: string; // Visible default: "03006392025"
  whatsappDefaultMessage: string;
  whatsappAssistance?: WhatsAppAssistanceSettings;
  supportPhone: string;
  address: string;
  city: string;
  country: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
    youtube: string;
    pinterest: string;
  };
  shipping: {
    standardFee: number; // e.g. 250 PKR
    freeShippingThreshold: number; // e.g. 5000 PKR
    freeCodEnabled: boolean; // Free Nationwide COD toggle [ON / OFF]
    codAnnouncementText?: string; // Editable custom announcement text
    estimatedDeliveryDays: string; // e.g. "3 - 5 Business Days"
    codEnabled: boolean;
    bankTransferEnabled: boolean;
    bankDetails?: string;
    advanceFreeDelivery?: AdvanceFreeDeliverySettings;
  };
  payments: PaymentGatewaysConfig;
  notifications?: AdminNotificationSettings;
  seo: {
    siteTitle: string;
    metaDescription: string;
    ogImage: string;
  };
  showEmptyCollectionsOnStorefront?: boolean;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  action: string;
  category: 'product' | 'order' | 'media' | 'collection' | 'settings' | 'cms' | 'shipping' | 'system';
  actor: string;
  details: string;
}

export interface CatalogSyncConfig {
  autoSyncEnabled: boolean;
  syncIntervalMinutes: number;
  newProductsAsDraft: boolean;
  syncPrices: boolean;
  syncDescriptions: boolean;
  syncMedia: boolean;
  lastSyncTimestamp: string;
  lastSyncStatus: 'success' | 'failed' | 'in_progress' | 'idle';
  totalProductsChecked: number;
  totalProductsSynced: number;
}

