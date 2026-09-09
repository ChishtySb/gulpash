import { Product, Category, Collection, SiteSettings, HomepageCMS, Order, Review } from '../types';
import { MIGRATED_PRODUCTS, MIGRATED_CATEGORIES, MIGRATED_COLLECTIONS } from './migratedCatalog';

// 1. AUTHORITATIVE MIGRATED CATEGORIES (5 Categories from Source Catalog)
export const INITIAL_CATEGORIES: Category[] = MIGRATED_CATEGORIES;

// 2. AUTHORITATIVE MIGRATED COLLECTIONS (6 Collections from Source Catalog)
export const INITIAL_COLLECTIONS: Collection[] = MIGRATED_COLLECTIONS;

// 3. AUTHORITATIVE MIGRATED PRODUCTS (68 Products, 269 Variants, 397 Images)
export const INITIAL_PRODUCTS: Product[] = MIGRATED_PRODUCTS;

// 4. ORDERS (Initial sample order referencing verified migrated catalog)
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'GP-94821',
    customer: {
      fullName: 'Ayesha Malik',
      email: 'ayesha.malik@gmail.com',
      phone: '03214567890',
      whatsapp: '03214567890',
      address: 'House 42, Street 15, Sector F-8/3',
      city: 'Islamabad',
      province: 'Islamabad Capital Territory',
      postalCode: '44000',
      orderNotes: 'Please deliver after 2 PM.'
    },
    items: [
      {
        productId: MIGRATED_PRODUCTS[0]?.id || 'prod-default',
        title: MIGRATED_PRODUCTS[0]?.title || 'Plum 3Piece',
        size: 'Medium',
        price: MIGRATED_PRODUCTS[0]?.price || 5499,
        quantity: 1,
        image: MIGRATED_PRODUCTS[0]?.images[0] || '',
        sku: MIGRATED_PRODUCTS[0]?.sku || 'GP-10523493630267'
      }
    ],
    subtotal: MIGRATED_PRODUCTS[0]?.price || 5499,
    shippingFee: 0,
    discount: 0,
    total: MIGRATED_PRODUCTS[0]?.price || 5499,
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'Unpaid',
    status: 'Processing',
    trackingNumber: 'TCS-89230491',
    courierName: 'TCS Express',
    createdAt: '2026-03-05T14:20:00Z',
    updatedAt: '2026-03-05T16:00:00Z'
  }
];

// 5. REVIEWS: Strictly 0 fake reviews (Phase 11 Compliance).
// Admin can import real reviews later via CSV or manual entry.
export const INITIAL_REVIEWS: Review[] = [];

// 6. HOMEPAGE CMS (Video Hero / Image Hero toggleable, pointing to Migrated Catalog)
export const INITIAL_CMS: HomepageCMS = {
  hero: {
    type: 'image', // toggleable between 'video' and 'image' by admin
    heading: 'GulPash Luxury Collection',
    subheading: 'Discover the pinnacle of Pakistani craftsmanship, hand-embroidered silhouettes & signature formals',
    badge: 'GULPASH COUTURE 2026',
    buttonText: 'EXPLORE TRENDING',
    buttonUrl: '/collections/best-selling',
    secondaryButtonText: 'SHOP ALL',
    secondaryButtonUrl: '/shop',
    desktopImageUrl: MIGRATED_PRODUCTS[0]?.images[0] || 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/17_22ba13c3-6eda-4dde-a515-e01030c718f6.png?v=1787217341',
    mobileImageUrl: MIGRATED_PRODUCTS[0]?.images[0] || 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/17_22ba13c3-6eda-4dde-a515-e01030c718f6.png?v=1787217341',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-an-outdoors-photoshoot-42643-large.mp4',
    mobileVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-an-outdoors-photoshoot-42643-large.mp4',
    posterImageUrl: MIGRATED_PRODUCTS[0]?.images[0] || '',
    overlayOpacity: 35,
    isActive: true
  },
  announcements: [
    {
      id: 'ann-1',
      text: 'FAST DISPATCH WITHIN 24-48 HOURS • EASY EXCHANGE POLICY',
      link: '/shipping-policy',
      isActive: true
    },
    {
      id: 'ann-2',
      text: 'NEED SIZING ASSISTANCE? CHAT WITH OUR LUXURY STYLISTS',
      link: '/shop',
      isActive: true
    }
  ],
  announcementBarActive: true,
  showFeaturedCollections: true,
  showBestSellers: true,
  showNewArrivals: true,
  showCategories: true,
  showEditorialBanner: true,
  showCustomerReviews: false, // Hidden until authentic reviews are imported
  showInstagramFeed: true,
  editorialBanner: {
    heading: 'The Art of Pakistani Luxury Fashion',
    subheading: 'Each GulPash creation embodies centuries-old Pakistani artisan heritage, exquisite hand embroidery, and premium pure textiles.',
    buttonText: 'DISCOVER THE CATALOG',
    buttonUrl: '/shop',
    imageUrl: MIGRATED_PRODUCTS[4]?.images[0] || 'https://cdn.shopify.com/s/files/1/0935/5368/8891/files/4_65e648be-58bb-4b95-a22c-a2b130e9d6d7.png?v=1787217112'
  }
};

// 7. SITE SETTINGS (Centralized GulPash Branding)
export const INITIAL_SETTINGS: SiteSettings = {
  brandName: 'GulPash',
  tagline: 'Luxury Pakistani Women Fashion & Haute Couture',
  domain: 'gulpash.online',
  logoUrl: '',
  faviconUrl: '',
  contactEmail: 'care@gulpash.online',
  whatsappNumber: '923218489999',
  whatsappDefaultMessage: 'Assalam o Alaikum GulPash, I am inquiring about your luxury collection on gulpash.online',
  supportPhone: '+92 42 3578 9922',
  address: 'Flagship Studio: 14-L, Mini Market, Gulberg II, Lahore, Pakistan',
  city: 'Lahore',
  country: 'Pakistan',
  socialLinks: {
    instagram: 'https://instagram.com/gulpash.online',
    facebook: 'https://facebook.com/gulpash.online',
    tiktok: 'https://tiktok.com/@gulpash.online',
    youtube: 'https://youtube.com/@gulpashofficial',
    pinterest: 'https://pinterest.com/gulpashonline'
  },
  shipping: {
    standardFee: 250,
    freeShippingThreshold: 5000,
    freeCodEnabled: false,
    codAnnouncementText: 'FREE NATIONWIDE CASH ON DELIVERY ON ALL ORDERS ABOVE PKR {amount}',
    estimatedDeliveryDays: '2 - 4 Working Days (Nationwide)',
    codEnabled: true,
    bankTransferEnabled: true,
    bankDetails: 'Bank: Meezan Bank Ltd\nAccount Title: GulPash Luxury Apparel\nIBAN: PK45MEZN0001892019283746\nBranch: Gulberg Lahore\n(Please send transfer receipt screenshot to our WhatsApp Concierge)',
    advanceFreeDelivery: {
      enabled: true,
      eligiblePaymentMethods: ['JazzCash', 'Easypaisa', 'Direct Bank Transfer'],
      minimumOrderAmount: 0,
      customerMessage: 'Pay Full in Advance & Enjoy FREE Nationwide Delivery!'
    }
  },
  payments: {
    cod: {
      enabled: true
    },
    jazzCash: {
      enabled: true,
      accountTitle: 'GulPash Luxury Apparel',
      accountNumber: '03218489999',
      instructions: 'Please transfer total order amount to our official JazzCash account. Enter the 12-digit TID and upload payment receipt screenshot.'
    },
    easypaisa: {
      enabled: true,
      accountTitle: 'GulPash Luxury Apparel',
      accountNumber: '03218489999',
      instructions: 'Please transfer total order amount to our official Easypaisa account. Enter the TRX ID and upload payment receipt screenshot.'
    },
    bankTransfer: {
      enabled: true,
      bankName: 'Meezan Bank Ltd',
      accountTitle: 'GulPash Luxury Apparel',
      accountNumber: '01082019283746',
      iban: 'PK45MEZN0001892019283746',
      branchName: 'Gulberg Lahore Branch (0108)',
      instructions: 'Transfer through online banking app or ATM. Enter transfer reference number and upload receipt screenshot.'
    }
  },
  notifications: {
    soundEnabled: true,
    browserNotificationsEnabled: true,
    events: {
      newOrder: true,
      newPaymentProof: true,
      paymentResubmitted: true,
      paymentVerified: true,
      paymentActionRequired: true,
      readyToDispatch: true,
      lowStock: true
    },
    lowStockThreshold: 3
  },
  seo: {
    siteTitle: 'GulPash | Luxury Pakistani Fashion | Unstitched & Stitched Ensembles',
    metaDescription: 'Shop GulPash for authentic Pakistani luxury women fashion. Unstitched & Stitched collections delivered nationwide with Cash on Delivery.',
    ogImage: MIGRATED_PRODUCTS[0]?.images[0] || ''
  }
};
