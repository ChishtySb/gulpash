import { Product, Category, Collection, SiteSettings, HomepageCMS, Order, Review } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-unstitched',
    name: 'Unstitched Luxury Lawn',
    slug: 'unstitched-luxury-lawn',
    description: '3-Piece embroidered lawn suits with pure chiffon, silk & organza dupattas.',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
    productCount: 8,
    isVisible: true,
    order: 1
  },
  {
    id: 'cat-pret',
    name: 'Ready-to-Wear Pret',
    slug: 'ready-to-wear-pret',
    description: 'Masterfully stitched contemporary tunics, co-ord sets, and 2-piece silhouettes.',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
    productCount: 6,
    isVisible: true,
    order: 2
  },
  {
    id: 'cat-festive-chiffon',
    name: 'Festive Chiffon & Net',
    slug: 'festive-chiffon',
    description: 'Intricately embellished formal wear for weddings, evening soirees, and Eid.',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80',
    productCount: 5,
    isVisible: true,
    order: 3
  },
  {
    id: 'cat-silk-formals',
    name: 'Raw Silk & Velvet Formals',
    slug: 'silk-formals',
    description: 'Pure Korean raw silk and velvet ensembles with hand-worked zardozi and tilla.',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80',
    productCount: 4,
    isVisible: true,
    order: 4
  },
  {
    id: 'cat-coords',
    name: 'Luxury Co-ords & Kurtis',
    slug: 'coords-and-kurtis',
    description: 'Effortless everyday statement kurtis and monochrome tailored co-ord sets.',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
    productCount: 4,
    isVisible: true,
    order: 5
  }
];

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-nur-jahan',
    name: "Nur Jahan Festive Lawn '26",
    slug: 'nur-jahan-festive-lawn',
    description: 'The definitive summer luxury statement featuring laser-cut embroidery, schiffli borders, and hand-woven organza dupattas.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
    isVisible: true,
    order: 1
  },
  {
    id: 'col-zehra-pret',
    name: 'Zehra Pret Edit',
    slug: 'zehra-pret-edit',
    description: 'Pret silhouettes handcrafted for modern Pakistani women with an eye for effortless heritage luxury.',
    imageUrl: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80',
    isVisible: true,
    order: 2
  },
  {
    id: 'col-mehtaab-chiffon',
    name: 'Mehtaab Chiffon Luxe',
    slug: 'mehtaab-chiffon-luxe',
    description: 'Ethereal pastel and jewel tones embroidered with sequins, pearls, and resham on pure crinkle chiffon.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1600&q=80',
    isVisible: true,
    order: 3
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'gp-001',
    title: 'Gul-e-Rana Embroidered 3-Piece Luxury Lawn',
    slug: 'gul-e-rana-embroidered-3-piece-luxury-lawn',
    description: 'A timeless ivory and blush ensemble featuring intricate threadwork, cutwork hem borders, and a pure printed crinkle chiffon dupatta. Detailed with delicate schiffli embroidery across the neckline and sleeve cuffs.',
    shortDescription: 'Embroidered Lawn Shirt with Chiffon Dupatta & Dyed Cambric Trouser',
    sku: 'GP-LWN-001',
    category: 'Unstitched Luxury Lawn',
    collection: "Nur Jahan Festive Lawn '26",
    price: 8950,
    compareAtPrice: 10500,
    costPrice: 5200,
    stock: 24,
    sizes: ['Unstitched', 'S', 'M', 'L', 'XL'],
    fabric: 'Pure Lawn & Crinkle Chiffon',
    colors: ['Blush Ivory', 'Dusty Rose'],
    tags: ['Luxury Lawn', 'Festive', '3-Piece', 'Summer 2026', 'Best Seller'],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-an-outdoors-photoshoot-42643-large.mp4',
    isVisible: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isSoldOut: false,
    rating: 4.9,
    reviewCount: 38,
    details: {
      shirt: '3.15 Meters Embroidered Digital Printed Lawn Front, Back & Sleeves with Organza Embroidered Patches',
      dupatta: '2.5 Meters Pure Crinkle Chiffon Dupatta with 4-Sided Embroidered Lace',
      trouser: '2.5 Meters Dyed Solid Cambric Trouser with Schiffli Border Lace',
      careInstructions: 'Dry clean recommended. Iron at medium temperature. Do not bleach or tumble dry.',
      stitchingDetails: 'Unstitched suit includes all embellishment patches, laces, and buttons as shown in editorial catalog.'
    },
    seoTitle: 'Gul-e-Rana Embroidered Luxury Lawn 3-Piece | GulPash Pakistan',
    seoDescription: 'Shop Gul-e-Rana Embroidered Luxury Lawn suit online at GulPash. Fast delivery all over Pakistan with Cash on Delivery.',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-05T12:00:00Z'
  },
  {
    id: 'gp-002',
    title: 'Mehtaab Jade Raw Silk 2-Piece Ready to Wear',
    slug: 'mehtaab-jade-raw-silk-2-piece-ready-to-wear',
    description: 'A regal emerald jade Korean raw silk kurta styled in a flared relaxed silhouette. Adorned with delicate hand-embellished marori work, antique sequins, and finished with scalloped raw silk trousers.',
    shortDescription: 'Stitched Korean Raw Silk Kurta with Embellished Trouser',
    sku: 'GP-PRT-002',
    category: 'Ready-to-Wear Pret',
    collection: 'Zehra Pret Edit',
    price: 14500,
    compareAtPrice: 16800,
    costPrice: 8500,
    stock: 15,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Korean Raw Silk',
    colors: ['Emerald Jade', 'Deep Pine'],
    tags: ['Pret', 'Raw Silk', 'Wedding Guest', 'Emerald', 'Festive'],
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-a-traditional-dress-walking-in-a-palace-42562-large.mp4',
    isVisible: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isSoldOut: false,
    rating: 5.0,
    reviewCount: 42,
    details: {
      shirt: 'Stitched Pure 80g Korean Raw Silk Kurta with hand-attached pearl buttons and tilla cuff embroidery',
      trouser: 'Stitched Raw Silk Cigarette Pants with scalloped organza border',
      careInstructions: 'Strictly dry clean only to preserve fine zari and delicate pearl embellishments.',
      stitchingDetails: 'Tailored with internal pure cotton lining for maximum comfort and crisp structure.'
    },
    seoTitle: 'Mehtaab Jade Raw Silk Ready to Wear Pret | GulPash',
    seoDescription: 'Buy luxury stitched raw silk festive pret by GulPash. Premium Pakistani designer fashion delivered to your doorstep.',
    createdAt: '2026-03-02T11:00:00Z',
    updatedAt: '2026-03-05T14:30:00Z'
  },
  {
    id: 'gp-003',
    title: 'Noor-e-Kashmir Organza & Chiffon Festive Suit',
    slug: 'noor-e-kashmir-organza-chiffon-festive-suit',
    description: 'Draped in soft lilac and silver, Noor-e-Kashmir is an ode to Kashmiri tilla craftsmanship. Crafted on fine crinkle chiffon with an ethereal embroidered organza jacquard dupatta.',
    shortDescription: 'Embroidered Chiffon 3-Piece Festive Formal Suit',
    sku: 'GP-CHF-003',
    category: 'Festive Chiffon & Net',
    collection: 'Mehtaab Chiffon Luxe',
    price: 18900,
    compareAtPrice: 22500,
    costPrice: 11000,
    stock: 9,
    sizes: ['Unstitched', 'Custom Stitch', 'S', 'M', 'L'],
    fabric: 'Pure Crinkle Chiffon & Organza',
    colors: ['Lilac Fog', 'Silver Mist'],
    tags: ['Chiffon', 'Festive Formals', 'Wedding Edit', 'Luxury'],
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=85'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-an-outdoors-photoshoot-42643-large.mp4',
    isVisible: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isSoldOut: false,
    rating: 4.8,
    reviewCount: 19,
    details: {
      shirt: 'Pure Crinkle Chiffon Front & Back with Heavy Resham & Tilla Embroidery + Embroidered Neckline Yoke',
      dupatta: 'Woven Organza Jacquard Dupatta with 4-Side Cutwork Borders',
      trouser: 'Dyed Raw Silk Trouser with Embroidered Motifs',
      careInstructions: 'Dry clean only. Store wrapped in muslin cloth.',
      stitchingDetails: 'Includes full unstitched fabric, lining fabric, and complete accessory packet.'
    },
    seoTitle: 'Noor-e-Kashmir Organza Chiffon Formal Suit | GulPash',
    seoDescription: 'Order luxury wedding formal suits online in Pakistan. Handcrafted festive wear by GulPash.',
    createdAt: '2026-03-03T09:00:00Z',
    updatedAt: '2026-03-05T08:00:00Z'
  },
  {
    id: 'gp-004',
    title: 'Zarmineh Mustard Embroidered Lawn with Silk Dupatta',
    slug: 'zarmineh-mustard-embroidered-lawn-with-silk-dupatta',
    description: 'A vibrant turmeric mustard shade brought to life with intricate floral threadwork in terracotta and mint. Paired with a luscious medium silk printed dupatta with gold foil details.',
    shortDescription: 'Festive 3-Piece Lawn with Medium Silk Dupatta',
    sku: 'GP-LWN-004',
    category: 'Unstitched Luxury Lawn',
    collection: "Nur Jahan Festive Lawn '26",
    price: 7950,
    compareAtPrice: 9200,
    costPrice: 4600,
    stock: 32,
    sizes: ['Unstitched', 'S', 'M', 'L', 'XL'],
    fabric: 'Premium 80s Lawn with Medium Silk',
    colors: ['Turmeric Mustard', 'Terracotta'],
    tags: ['Lawn', 'Silk Dupatta', 'Summer', '3-Piece', 'Featured'],
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85'
    ],
    isVisible: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isSoldOut: false,
    rating: 4.9,
    reviewCount: 51,
    details: {
      shirt: '3.15m Digital Printed & Embroidered Fine 80s Lawn',
      dupatta: '2.5m Pure Medium Silk Printed Dupatta',
      trouser: '2.5m Dyed Cambric Trouser with Embroidered Patti',
      careInstructions: 'Hand wash in cold water or dry clean. Do not dry in direct sunlight.'
    },
    seoTitle: 'Zarmineh Mustard Embroidered Lawn 3-Piece | GulPash',
    seoDescription: 'Buy authentic Pakistani lawn suit with silk dupatta online. GulPash premium women wear with easy cash on delivery.',
    createdAt: '2026-02-20T12:00:00Z',
    updatedAt: '2026-03-04T15:00:00Z'
  },
  {
    id: 'gp-005',
    title: 'Surayya Black Crimson Jacquard Co-ord Set',
    slug: 'surayya-black-crimson-jacquard-co-ord-set',
    description: 'An elevated monochrome silhouette crafted in self-textured woven cotton jacquard. Features subtle band collar, contrast ivory piping, and tailored cigarette trousers.',
    shortDescription: 'Stitched 2-Piece Woven Jacquard Co-ord Set',
    sku: 'GP-CRD-005',
    category: 'Luxury Co-ords & Kurtis',
    collection: 'Zehra Pret Edit',
    price: 6850,
    compareAtPrice: 7990,
    costPrice: 3800,
    stock: 18,
    sizes: ['XS', 'S', 'M', 'L'],
    fabric: 'Woven Cotton Jacquard',
    colors: ['Onyx Black', 'Ivory'],
    tags: ['Co-ords', 'Pret', 'Casual Chic', 'Black Suit'],
    images: [
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85'
    ],
    isVisible: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    isSoldOut: false,
    rating: 4.7,
    reviewCount: 27,
    details: {
      shirt: 'Stitched A-line Kurta with Chinese collar and fabric tassel buttons',
      trouser: 'Stitched straight cut matching jacquard trouser',
      careInstructions: 'Machine wash delicate cycle in cold water.'
    },
    seoTitle: 'Surayya Black Jacquard Co-ord Set | GulPash Pret',
    seoDescription: 'Explore ready to wear women co-ord sets by GulPash. Modern Pakistani pret online.',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-05T09:00:00Z'
  },
  {
    id: 'gp-006',
    title: 'Shehnai Crimson Velvet Handcrafted Bridal Shawl Ensemble',
    slug: 'shehnai-crimson-velvet-bridal-shawl-ensemble',
    description: 'A masterpiece from our couture atelier: deep ruby micro velvet embellished with antique dabka, kora, French knots, and shimmering nakshi work. Paired with a hand-woven tissue raw silk shirt and peshwaz.',
    shortDescription: 'Micro Velvet Bridal & Wedding Formal 3-Piece',
    sku: 'GP-BRL-006',
    category: 'Raw Silk & Velvet Formals',
    collection: 'Mehtaab Chiffon Luxe',
    price: 28500,
    compareAtPrice: 34000,
    costPrice: 17000,
    stock: 4,
    sizes: ['Unstitched', 'Custom Stitch', 'M', 'L'],
    fabric: 'Pure 9000 Micro Velvet & Tissue Silk',
    colors: ['Deep Ruby Crimson', 'Antique Gold'],
    tags: ['Bridal', 'Velvet Shawl', 'Wedding Wear', 'Luxury Couture'],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-a-traditional-dress-walking-in-a-palace-42562-large.mp4',
    isVisible: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isSoldOut: false,
    rating: 5.0,
    reviewCount: 14,
    details: {
      shirt: '3.25m Raw Silk Hand Embellished Shirt Front, Back & Sleeves',
      dupatta: '2.75m Heavy Pure Micro Velvet Shawl with 4-sided zardozi borders',
      trouser: '2.5m Jamawar Brocade Trouser Fabric',
      careInstructions: 'Specialist dry clean only.'
    },
    seoTitle: 'Shehnai Crimson Velvet Handcrafted Bridal Ensemble | GulPash',
    seoDescription: 'Exquisite bridal & wedding couture wear in Pakistan by GulPash. Handcrafted Pakistani heritage fashion.',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-02T11:00:00Z'
  },
  {
    id: 'gp-007',
    title: 'Falaknuma Sky Blue Schiffli Embroidered Lawn',
    slug: 'falaknuma-sky-blue-schiffli-embroidered-lawn',
    description: 'Cool pastel sky blue lawn designed with intricate all-over eyelet schiffli embroidery. Accented with French lace panels and paired with an ombre digital silk dupatta.',
    shortDescription: 'Schiffli Lawn 3-Piece with Pure Silk Dupatta',
    sku: 'GP-LWN-007',
    category: 'Unstitched Luxury Lawn',
    collection: "Nur Jahan Festive Lawn '26",
    price: 8450,
    compareAtPrice: 9800,
    costPrice: 4900,
    stock: 0,
    sizes: ['Unstitched', 'S', 'M', 'L'],
    fabric: 'Fine Schiffli Lawn & Silk',
    colors: ['Sky Blue', 'Ivory'],
    tags: ['Schiffli', 'Lawn', 'Sold Out', 'Summer Pastel'],
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85'
    ],
    isVisible: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    isSoldOut: true,
    rating: 4.8,
    reviewCount: 31,
    details: {
      shirt: '3m Schiffli Lawn with Embroidered Organza Ghera Border',
      dupatta: '2.5m Silk Dupatta with Hand-finished pico borders',
      trouser: '2.5m Dyed Cambric Trouser'
    },
    seoTitle: 'Falaknuma Sky Blue Schiffli Lawn 3-Piece | GulPash',
    seoDescription: 'Schiffli embroidered lawn suit by GulPash. Fast dispatch across Pakistan.',
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-03-01T14:00:00Z'
  },
  {
    id: 'gp-008',
    title: 'Roshaneh Pearl White Chikankari Tunic',
    slug: 'roshaneh-pearl-white-chikankari-tunic',
    description: 'A breezy, poetic summer tunic crafted in heritage Lucknowi chikankari on soft cotton lawn. Lined with breathable mulmul and highlighted with pearl button plackets.',
    shortDescription: 'Stitched 1-Piece Pure Chikankari Kurti',
    sku: 'GP-KRT-008',
    category: 'Luxury Co-ords & Kurtis',
    collection: 'Zehra Pret Edit',
    price: 4950,
    compareAtPrice: 5800,
    costPrice: 2800,
    stock: 22,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: 'Pure Cotton Chikankari with Mulmul Lining',
    colors: ['Pearl White'],
    tags: ['Chikankari', 'Pret', 'Kurti', 'White Kurta', 'Summer Essential'],
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85'
    ],
    isVisible: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isSoldOut: false,
    rating: 4.9,
    reviewCount: 47,
    details: {
      shirt: 'Stitched 1-Piece Chikankari Kurti with attached soft cotton mulmul lining',
      careInstructions: 'Hand wash gently. Dry inside out in shade.'
    },
    seoTitle: 'Roshaneh Pearl White Chikankari Kurti | GulPash',
    seoDescription: 'Authentic chikankari cotton kurti for women. GulPash online fashion shop.',
    createdAt: '2026-03-04T07:00:00Z',
    updatedAt: '2026-03-05T16:00:00Z'
  }
];

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
        productId: 'gp-001',
        title: 'Gul-e-Rana Embroidered 3-Piece Luxury Lawn',
        size: 'Unstitched',
        price: 8950,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
        sku: 'GP-LWN-001'
      }
    ],
    subtotal: 8950,
    shippingFee: 0,
    discount: 0,
    total: 8950,
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'Unpaid',
    status: 'Processing',
    trackingNumber: 'TCS-89230491',
    courierName: 'TCS Express',
    createdAt: '2026-03-05T14:20:00Z',
    updatedAt: '2026-03-05T16:00:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'GP-94822',
    customer: {
      fullName: 'Dr. Fatima Tariq',
      email: 'dr.fatima@yahoo.com',
      phone: '03009876543',
      whatsapp: '03009876543',
      address: 'Plot 18-C, 5th Zamzama Commercial Lane, DHA Phase 5',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '75500'
    },
    items: [
      {
        productId: 'gp-002',
        title: 'Mehtaab Jade Raw Silk 2-Piece Ready to Wear',
        size: 'M',
        price: 14500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=300&q=80',
        sku: 'GP-PRT-002'
      }
    ],
    subtotal: 14500,
    shippingFee: 0,
    discount: 500,
    total: 14000,
    paymentMethod: 'Direct Bank Transfer',
    paymentStatus: 'Paid',
    status: 'Shipped',
    trackingNumber: 'LCS-5491028',
    courierName: 'Leopards Courier',
    createdAt: '2026-03-04T09:15:00Z',
    updatedAt: '2026-03-05T11:30:00Z'
  },
  {
    id: 'ord-1003',
    orderNumber: 'GP-94823',
    customer: {
      fullName: 'Zainab Qureshi',
      email: 'zainab.q@gmail.com',
      phone: '03335123456',
      whatsapp: '03335123456',
      address: '23-K Gulberg III',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '54000'
    },
    items: [
      {
        productId: 'gp-004',
        title: 'Zarmineh Mustard Embroidered Lawn with Silk Dupatta',
        size: 'Unstitched',
        price: 7950,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80',
        sku: 'GP-LWN-004'
      },
      {
        productId: 'gp-008',
        title: 'Roshaneh Pearl White Chikankari Tunic',
        size: 'S',
        price: 4950,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        sku: 'GP-KRT-008'
      }
    ],
    subtotal: 12900,
    shippingFee: 0,
    discount: 0,
    total: 12900,
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'Paid',
    status: 'Delivered',
    trackingNumber: 'TCS-77219904',
    courierName: 'TCS Express',
    createdAt: '2026-03-02T11:45:00Z',
    updatedAt: '2026-03-04T17:20:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'gp-001',
    author: 'Sana Farhan',
    city: 'Lahore',
    rating: 5,
    comment: 'The quality of the lawn and embroidery blew me away. The chiffon dupatta is so soft and flows gracefully. Got countless compliments at family dinner! 10/10.',
    date: 'March 2, 2026',
    verifiedPurchase: true
  },
  {
    id: 'rev-02',
    productId: 'gp-002',
    author: 'Mariam Baig',
    city: 'Karachi',
    rating: 5,
    comment: 'Ordered the jade raw silk for a festive dholki. The stitching finish is haute couture level. Arrived within 2 days in Karachi via TCS.',
    date: 'February 28, 2026',
    verifiedPurchase: true
  },
  {
    id: 'rev-03',
    productId: 'gp-004',
    author: 'Hina Rizvi',
    city: 'Islamabad',
    rating: 5,
    comment: 'The mustard color is even more stunning in person than on camera. Pure medium silk dupatta feels luxurious and lightweight.',
    date: 'February 25, 2026',
    verifiedPurchase: true
  },
  {
    id: 'rev-04',
    productId: 'gp-008',
    author: 'Mahnoor Shah',
    city: 'Rawalpindi',
    rating: 5,
    comment: 'A staple white chikankari tunic with the perfect inner lining. GulPash customer support was very helpful on WhatsApp assisting with sizing.',
    date: 'March 1, 2026',
    verifiedPurchase: true
  }
];

export const INITIAL_CMS: HomepageCMS = {
  hero: {
    type: 'video', // toggleable between 'video' and 'image'
    heading: 'Nur Jahan Festive Luxury',
    subheading: 'Spring / Summer 2026 Couture Lawn & Festive Silhouettes',
    badge: 'NEW COLLECTION 2026',
    buttonText: 'EXPLORE COLLECTION',
    buttonUrl: '/collections/nur-jahan-festive-lawn',
    secondaryButtonText: 'SHOP PRET',
    secondaryButtonUrl: '/categories/ready-to-wear-pret',
    desktopImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85',
    mobileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-an-outdoors-photoshoot-42643-large.mp4',
    mobileVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-an-outdoors-photoshoot-42643-large.mp4',
    posterImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=85',
    overlayOpacity: 35,
    isActive: true
  },
  announcements: [
    {
      id: 'ann-1',
      text: '✨ FREE NATIONWIDE DELIVERY ON ALL ORDERS ABOVE PKR 5,000 ✨',
      link: '/shop',
      isActive: true
    },
    {
      id: 'ann-2',
      text: 'DISPATCH WITHIN 24-48 HOURS • EASY 7-DAY EXCHANGE POLICY',
      link: '/shipping-policy',
      isActive: true
    },
    {
      id: 'ann-3',
      text: 'NEED STYLING OR SIZE ASSISTANCE? CHAT ON WHATSAPP +92 321 8489999',
      link: 'https://wa.me/923218489999',
      isActive: true
    }
  ],
  announcementBarActive: true,
  showFeaturedCollections: true,
  showBestSellers: true,
  showNewArrivals: true,
  showCategories: true,
  showEditorialBanner: true,
  showCustomerReviews: true,
  showInstagramFeed: true,
  editorialBanner: {
    heading: 'The Art of Pakistani Craftsmanship',
    subheading: 'From the handlooms of Multan to the zardozi masters of Lahore, every GulPash thread celebrates timeless royal grace.',
    buttonText: 'DISCOVER THE EDIT',
    buttonUrl: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=85'
  }
};

export const INITIAL_SETTINGS: SiteSettings = {
  brandName: 'GulPash',
  tagline: 'Luxury Pakistani Fashion & Haute Couture',
  domain: 'gulpash.pk',
  logoUrl: '',
  faviconUrl: '',
  contactEmail: 'care@gulpash.pk',
  whatsappNumber: '923218489999',
  whatsappDefaultMessage: 'Assalam o Alaikum GulPash, I am inquiring about your latest collection on gulpash.pk',
  supportPhone: '+92 42 3578 9922',
  address: 'Flagship Studio: 14-L, Mini Market, Gulberg II, Lahore, Pakistan',
  city: 'Lahore',
  country: 'Pakistan',
  socialLinks: {
    instagram: 'https://instagram.com/gulpash.pk',
    facebook: 'https://facebook.com/gulpash.pk',
    tiktok: 'https://tiktok.com/@gulpash.pk',
    youtube: 'https://youtube.com/@gulpashofficial',
    pinterest: 'https://pinterest.com/gulpashpk'
  },
  shipping: {
    standardFee: 250,
    freeShippingThreshold: 5000,
    estimatedDeliveryDays: '2 - 4 Working Days (Nationwide)',
    codEnabled: true,
    bankTransferEnabled: true,
    bankDetails: 'Bank: Meezan Bank Ltd\nAccount Title: GulPash Luxury Apparel\nIBAN: PK45MEZN0001892019283746\nBranch: Gulberg Lahore\n(Please send transfer receipt screenshot to WhatsApp +92 321 8489999)'
  },
  seo: {
    siteTitle: 'GulPash | Luxury Pakistani Fashion | Unstitched Lawn & Ready to Wear',
    metaDescription: 'Shop GulPash for authentic Pakistani luxury women fashion. Unstitched embroidered lawn, festive chiffon, bridal velvet and pret delivered nationwide with Cash on Delivery.',
    ogImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'
  }
};
