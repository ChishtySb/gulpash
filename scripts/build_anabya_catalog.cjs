const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generateId(prefix, key) {
  const hash = crypto.createHash('md5').update(`${prefix}:${key}`).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

const raw = JSON.parse(fs.readFileSync('anabya_raw_catalog.json', 'utf8'));

// Collections
const COLLECTIONS = [
  {
    id: generateId('collection', 'all'),
    name: 'ALL ENSEMBLES',
    slug: 'all',
    description: 'Complete GulPash pret & couture catalog. Discover our master-crafted ready-to-wear silhouettes.',
    imageUrl: '/products/anabya/aazure-3piece/01_49544837890281.jpg',
    image: '/products/anabya/aazure-3piece/01_49544837890281.jpg',
    bannerUrl: '/products/anabya/aazure-3piece/01_49544837890281.jpg',
    displayOrder: 1,
    isVisible: true
  },
  {
    id: generateId('collection', 'best-selling'),
    name: 'TRENDING',
    slug: 'best-selling',
    description: 'Our most coveted, highest-demand artisanal Pakistani ready-to-wear ensembles.',
    imageUrl: '/products/anabya/zar-e-sabz-3piece/01_49544837890281.jpg',
    image: '/products/anabya/zar-e-sabz-3piece/01_49544837890281.jpg',
    bannerUrl: '/products/anabya/zar-e-sabz-3piece/01_49544837890281.jpg',
    displayOrder: 2,
    isVisible: true
  },
  {
    id: generateId('collection', 'new-arrivals'),
    name: 'NEW ARRIVALS',
    slug: 'new-arrivals',
    description: 'The freshest silhouettes, hand-embellished luxury fabrics, and contemporary Pakistani couture cuts.',
    imageUrl: '/products/anabya/zaarif-cotton-2-pc-emb/01_49440049594601.jpg',
    image: '/products/anabya/zaarif-cotton-2-pc-emb/01_49440049594601.jpg',
    bannerUrl: '/products/anabya/zaarif-cotton-2-pc-emb/01_49440049594601.jpg',
    displayOrder: 3,
    isVisible: true
  },
  {
    id: generateId('collection', 'co-ords'),
    name: 'CO-ORDS',
    slug: 'co-ords',
    description: 'Chic matching separates and tailored 2-piece coords designed for effortless sophistication.',
    imageUrl: '/products/anabya/zaarif-cotton-2-pc-emb/01_49440049594601.jpg',
    image: '/products/anabya/zaarif-cotton-2-pc-emb/01_49440049594601.jpg',
    bannerUrl: '/products/anabya/zaarif-cotton-2-pc-emb/01_49440049594601.jpg',
    displayOrder: 4,
    isVisible: true
  },
  {
    id: generateId('collection', 'winter-collection'),
    name: 'WINTER COLLECTION',
    slug: 'winter-collection',
    description: 'Rich winter textiles including premium Dhank, warm linen, and seasonal embroidery.',
    imageUrl: '/products/anabya/alize-3pcs/01_49440049594601.jpg',
    image: '/products/anabya/alize-3pcs/01_49440049594601.jpg',
    bannerUrl: '/products/anabya/alize-3pcs/01_49440049594601.jpg',
    displayOrder: 5,
    isVisible: true
  },
  {
    id: generateId('collection', 'short-length-article'),
    name: 'SHORT LENGTH',
    slug: 'short-length-article',
    description: 'Contemporary short tunic lengths paired with straight trousers or culottes.',
    imageUrl: '/products/anabya/elara/01_49440049594601.jpg',
    image: '/products/anabya/elara/01_49440049594601.jpg',
    bannerUrl: '/products/anabya/elara/01_49440049594601.jpg',
    displayOrder: 6,
    isVisible: true
  }
];

// Categories
const CATEGORIES = [
  {
    id: generateId('category', '3-piece-ensembles'),
    name: '3-Piece Ensembles',
    slug: '3-piece-ensembles',
    description: 'Exquisite 3-piece designer ensembles complete with shirt, trouser, and dupatta.',
    imageUrl: '/products/anabya/aazure-3piece/01_49544837890281.jpg',
    order: 1,
    isVisible: true
  },
  {
    id: generateId('category', '2-piece-ensembles'),
    name: '2-Piece Ensembles',
    slug: '2-piece-ensembles',
    description: 'Versatile 2-piece shirts and trousers with contemporary tailoring and embroidery.',
    imageUrl: '/products/anabya/zaarif-cotton-2-pc-emb/01_49440049594601.jpg',
    order: 2,
    isVisible: true
  },
  {
    id: generateId('category', 'stitched'),
    name: 'Stitched',
    slug: 'stitched',
    description: 'GulPash luxury Stitched ready-to-wear ensembles. Master-crafted Pakistani tailoring and premium textiles.',
    imageUrl: '/products/anabya/alize-3pcs/01_49440049594601.jpg',
    order: 3,
    isVisible: true
  },
  {
    id: generateId('category', 'luxury-pret'),
    name: 'Luxury Pret',
    slug: 'luxury-pret',
    description: 'Handcrafted festive pret with intricate embroidery and timeless silhouettes.',
    imageUrl: '/products/anabya/zar-e-sabz-3piece/01_49544837890281.jpg',
    order: 4,
    isVisible: true
  },
  {
    id: generateId('category', 'unstitched-stitched'),
    name: 'Unstitched / Stitched',
    slug: 'unstitched-stitched',
    description: 'GulPash signature collections crafted in premium lawn, chiffon, dhank, and linen.',
    imageUrl: '/products/anabya/amber-3piece/01_49544837890281.jpg',
    order: 5,
    isVisible: true
  }
];

// Live Anabya membership lists
const BEST_SELLER_TITLES = [
  'Zar-E-Sabz 3Piece',
  'Sapphire Bloom 3 Piece',
  'Ruby Grace 3 Piece',
  'Mulberry Bloom 3 Piece',
  'Noor e Naz Luxury 3 Piece',
  'Sunehri 3 Piece',
  'Aazure 3Piece',
  'Amber 3Piece',
  'Meadow Grace  3 Piece',
  'Multi Flower 3 Piece',
  'Raniya 3 Piece',
  'Elara',
  'Zohra 3 Piece',
  'Noor e Zard 3 Piece',
  'Azmeen 3 Piece',
  'Pink Hearts 3 Piece',
  'Rumi 3 Piece',
  'Lemon Blossom 3-Piece',
  'SUMMER SALE | Sweet 3Piece'
];

const NEW_ARRIVAL_TITLES = [
  'ZAARIF - COTTON 2 PC EMB',
  'Mehndi Emb 3Pc Stitched',
  'Zeenat EMB – 3PCs',
  'Rina',
  'Multi Color 3Pcs Embroidery',
  'NEW AYRA 3PCS',
  'Multi Color Black 3Pcs',
  'pistiana 3pcs',
  'Sophie 3Pcs',
  'NEW BROWNIE',
  'Kaavya Emb 3pcs',
  'Elsa Embroidery 3pcs',
  'Blackish EMB 3PCS',
  'Aleeeza Black 3pcs',
  'Parisa 3Pcs',
  'Golden Grace',
  'Armeen 3pcs',
  'Alize 3Pcs'
];

const COORDS_TITLES = [
  'ZAARIF - COTTON 2 PC EMB'
];

const WINTER_TITLES = [
  'Blackish EMB 3PCS',
  'Alize 3Pcs',
  'Aleeeza Black 3pcs',
  'Kaavya Emb 3pcs',
  'Rina',
  'Meadow Grace  3 Piece'
];

// Process products
const products = [];
const imageFilesMap = {};

// Verify local image files
const publicDir = path.join(process.cwd(), 'public', 'products', 'anabya');
for (const p of raw) {
  const pDir = path.join(publicDir, p.handle);
  if (fs.existsSync(pDir)) {
    const files = fs.readdirSync(pDir).sort();
    imageFilesMap[p.handle] = files.map(f => `/products/anabya/${p.handle}/${f}`);
  } else {
    imageFilesMap[p.handle] = [];
  }
}

for (let i = 0; i < raw.length; i++) {
  const p = raw[i];
  const productId = generateId('product', p.id);

  // Exact titles
  const title = p.title;
  const slug = p.handle;

  // Variants & Pricing
  const variants = p.variants || [];
  const variantPrices = variants.map(v => parseFloat(v.price));
  const minPrice = Math.min(...variantPrices);
  const comparePrices = variants.filter(v => v.compare_at_price).map(v => parseFloat(v.compare_at_price));
  const compareAtPrice = comparePrices.length > 0 ? Math.max(...comparePrices) : null;

  // Sizing
  const sizes = variants.map(v => v.title);

  // Local images
  let images = imageFilesMap[p.handle] || [];
  if (images.length === 0) {
    images = (p.images || []).map(img => img.src);
  }

  // Fabric extraction
  let fabric = 'Premium Lawn';
  let desc = (p.body_html || '')
    .replace(/Tawakal\s*Closet/gi, 'GulPash')
    .replace(/#TawakalCloset/gi, '#GulPash')
    .replace(/Anabya\s*Garments/gi, 'GulPash')
    .replace(/#AnabyaGarments/gi, '#GulPash');

  const fabricMatch = desc.match(/Fabric:\s*([^<\n]+)/i) || desc.match(/Stuff:\s*([^<\n]+)/i);
  if (fabricMatch) {
    fabric = fabricMatch[1].replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim();
  } else if (desc.toLowerCase().includes('dhank')) {
    fabric = 'Dhank';
  } else if (desc.toLowerCase().includes('linen')) {
    fabric = 'Linen';
  } else if (desc.toLowerCase().includes('cotton')) {
    fabric = 'Cotton';
  } else if (desc.toLowerCase().includes('chiffon')) {
    fabric = 'Chiffon';
  }

  // Piece count
  const is2Piece = title.includes('2 PC') || title.includes('2-Piece') || variants.some(v => v.title.includes('2-Piece'));
  const pieceCount = is2Piece ? '2 Piece' : '3 Piece';

  // Details
  const details = {
    shirt: desc.includes('Shirt') ? 'Detailed designer shirt with signature tailoring and embroidery' : `${pieceCount} embellished shirt`,
    trouser: desc.includes('Trouser') ? 'Matching dyed/embroidered trouser' : 'Dyed cotton/linen trouser',
    dupatta: is2Piece ? 'N/A (2-Piece Ensemble)' : (desc.includes('Dupatta') ? 'Embellished matching dupatta' : 'Dyed Chiffon Dupatta'),
    careInstructions: 'Dry clean recommended. Do not use bleach. Iron at moderate temperature. Protect embellishments.',
    stitchingDetails: 'Premium stitching with delicate piping, neat overlocking, and reinforced seams.'
  };

  // Category mapping
  const categoryObj = is2Piece 
    ? CATEGORIES.find(c => c.slug === '2-piece-ensembles') 
    : CATEGORIES.find(c => c.slug === '3-piece-ensembles');

  // Collection memberships
  const isBestSeller = BEST_SELLER_TITLES.includes(title);
  const isNewArrival = NEW_ARRIVAL_TITLES.includes(title);
  const isCoord = COORDS_TITLES.includes(title);
  const isWinter = WINTER_TITLES.includes(title);

  const matchedCollections = [COLLECTIONS.find(c => c.slug === 'all')];
  if (isBestSeller) matchedCollections.push(COLLECTIONS.find(c => c.slug === 'best-selling'));
  if (isNewArrival) matchedCollections.push(COLLECTIONS.find(c => c.slug === 'new-arrivals'));
  if (isCoord) matchedCollections.push(COLLECTIONS.find(c => c.slug === 'co-ords'));
  if (isWinter) matchedCollections.push(COLLECTIONS.find(c => c.slug === 'winter-collection'));

  const primaryCollection = isBestSeller 
    ? COLLECTIONS.find(c => c.slug === 'best-selling') 
    : (isNewArrival ? COLLECTIONS.find(c => c.slug === 'new-arrivals') : COLLECTIONS.find(c => c.slug === 'all'));

  // Detailed variants
  const detailedVariants = variants.map((v, vIdx) => {
    const vId = generateId('variant', `${p.id}:${v.id}`);
    const vPrice = parseFloat(v.price);
    const vCompare = v.compare_at_price ? parseFloat(v.compare_at_price) : null;
    return {
      id: vId,
      productId: productId,
      sourceVariantId: v.id,
      title: v.title,
      size: v.title.split('/')[0].trim(),
      sku: v.sku || `GP-ANB-${p.id}-${v.id}`,
      price: vPrice,
      compareAtPrice: vCompare,
      available: v.available,
      stock: v.available ? 25 : 0,
      position: vIdx + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  // Detailed images
  const detailedImages = (p.images || []).map((img, imgIdx) => {
    const imgId = generateId('image', `${p.id}:${img.id}`);
    const localPath = images[imgIdx] || img.src;
    return {
      id: imgId,
      productId: productId,
      sourceImageId: img.id,
      storagePath: localPath,
      sourceUrl: img.src,
      altText: `${title} - GulPash View ${imgIdx + 1}`,
      sortOrder: imgIdx + 1,
      isPrimary: imgIdx === 0,
      width: img.width || 1200,
      height: img.height || 1500,
      createdAt: new Date().toISOString()
    };
  });

  const sku = `GP-${p.id}`;

  const productItem = {
    id: productId,
    title: title,
    slug: slug,
    description: desc,
    shortDescription: `${title} — Authentic GulPash ready-to-wear ensemble with handcrafted embroidery and signature tailoring.`,
    sku: sku,
    category: categoryObj.name,
    categoryId: categoryObj.id,
    categorySlug: categoryObj.slug,
    collection: primaryCollection.name,
    collectionSlug: primaryCollection.slug,
    collectionIds: matchedCollections.map(c => c.id),
    collectionNames: matchedCollections.map(c => c.name),
    price: minPrice,
    compareAtPrice: compareAtPrice,
    stock: variants.reduce((sum, v) => sum + (v.available ? 25 : 0), 0) || 50,
    sizes: sizes,
    fabric: fabric,
    fabricDetails: `${fabric} — ${pieceCount}`,
    pieceCount: pieceCount,
    colors: ['As Shown'],
    tags: p.tags && p.tags.length > 0 ? p.tags : [pieceCount, fabric, 'Ready to Wear', 'GulPash'],
    images: images,
    primaryImageIndex: 0,
    productImages: detailedImages,
    variants: detailedVariants,
    status: 'Active',
    isVisible: true,
    isFeatured: isBestSeller,
    isBestSeller: isBestSeller,
    isNewArrival: isNewArrival,
    isSoldOut: variants.every(v => !v.available),
    rating: 5.0,
    reviewCount: 0,
    details: details,
    seoTitle: `${title} | GulPash Luxury Pret`,
    seoDescription: `Order ${title} online from GulPash. Handcrafted Pakistani pret, premium ${fabric}, fast delivery across Pakistan.`,
    sourceUrl: `https://anabyagarments.com/products/${p.handle}`,
    sourceProductId: p.id,
    sourceSlug: p.handle,
    migrationStatus: 'verified',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  products.push(productItem);
}

// Update category product counts
CATEGORIES.forEach(c => {
  c.productCount = products.filter(p => p.categoryId === c.id || p.categorySlug === c.slug).length;
});

// Update collection product counts and productIds/slugs
COLLECTIONS.forEach(c => {
  const matched = products.filter(p => p.collectionIds.includes(c.id));
  c.productCount = matched.length;
  c.productIds = matched.map(p => p.id);
  c.productSlugs = matched.map(p => p.slug);
});

// Write JSON files
fs.writeFileSync('src/data/migratedProducts.json', JSON.stringify(products, null, 2));
fs.writeFileSync('src/data/migratedCategories.json', JSON.stringify(CATEGORIES, null, 2));
fs.writeFileSync('src/data/migratedCollections.json', JSON.stringify(COLLECTIONS, null, 2));

console.log('Successfully generated:');
console.log(`- src/data/migratedProducts.json (${products.length} products)`);
console.log(`- src/data/migratedCategories.json (${CATEGORIES.length} categories)`);
console.log(`- src/data/migratedCollections.json (${COLLECTIONS.length} collections)`);

COLLECTIONS.forEach(c => {
  console.log(`  Collection [${c.name}] (${c.slug}): ${c.productCount} products`);
});
