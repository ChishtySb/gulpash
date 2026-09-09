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
  collection?: string;
  collectionIds?: string[];
  collectionNames?: string[];
  price: number; // in PKR
  compareAtPrice?: number | null; // original price in PKR
  costPrice?: number;
  stock: number;
  sizes: (ProductSize | string)[];
  fabric: string;
  colors?: string[];
  tags: string[];
  images: string[];
  primaryImageIndex?: number;
  productImages?: ProductImageDetailed[];
  variants?: ProductVariantDetailed[];
  videoUrl?: string; // MP4 or WebM video
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
    careInstructions?: string;
    stitchingDetails?: string;
  };
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
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentMethod = 
  | 'Cash on Delivery (COD)' 
  | 'JazzCash' 
  | 'Easypaisa' 
  | 'Direct Bank Transfer' 
  | 'Card Payment';

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
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Unpaid' | 'Paid' | 'Under Verification' | 'Rejected';
  status: OrderStatus;
  paymentProof?: OrderPaymentProof;
  trackingNumber?: string;
  courierName?: string;
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
}

export interface AnnouncementItem {
  id: string;
  text: string;
  link?: string;
  isActive: boolean;
}

export interface HomepageCMS {
  hero: HeroSlideConfig;
  announcements: AnnouncementItem[];
  announcementBarActive: boolean;
  showFeaturedCollections: boolean;
  showBestSellers: boolean;
  showNewArrivals: boolean;
  showCategories: boolean;
  showEditorialBanner: boolean;
  showCustomerReviews: boolean;
  showInstagramFeed: boolean;
  editorialBanner: {
    heading: string;
    subheading: string;
    buttonText: string;
    buttonUrl: string;
    imageUrl: string;
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

export interface SiteSettings {
  brandName: string;
  tagline: string;
  domain: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  whatsappNumber: string; // e.g. "923001234567"
  whatsappDefaultMessage: string;
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
  };
  payments: PaymentGatewaysConfig;
  seo: {
    siteTitle: string;
    metaDescription: string;
    ogImage: string;
  };
}
