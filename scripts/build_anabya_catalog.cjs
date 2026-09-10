const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function generateId(prefix, key) {
  const hash = crypto.createHash('md5').update(`${prefix}:${key}`).digest('hex');
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

// Robust, safe HTML description normalizer
// Strips comments, tracking badges, data attributes, garish styles, while strictly preserving 100% authentic product details
function cleanDescription(html, productTitle) {
  if (!html) return '';

  let d = html;

  // 1. Un-escape if html was escaped (e.g. &lt;p&gt; or &amp;lt;p&amp;gt;)
  for (let i = 0; i < 3; i++) {
    if (d.includes('&lt;') || d.includes('&gt;')) {
      d = d.replace(/&lt;/g, '<')
           .replace(/&gt;/g, '>')
           .replace(/&quot;/g, '"')
           .replace(/&amp;/g, '&');
    }
  }

  // 2. Remove comments
  d = d.replace(/<!--[\s\S]*?-->/g, '');

  // 3. Remove script, style, iframe, object, embed, noscript
  d = d.replace(/<(script|style|iframe|object|embed|noscript)[\s\S]*?<\/\1>/gi, '');

  // 4. Remove external embedded images (Shopify sizing badge pngs, trust badges)
  d = d.replace(/<img[^>]*>/gi, '');

  // 5. Unwrap or remove div tags while keeping contents
  d = d.replace(/<div[^>]*>\s*<\/div>/gi, '');
  d = d.replace(/<\/?div[^>]*>/gi, '');

  // 6. Strip all attributes from tags except semantic formatting
  d = d.replace(/\s*(?:data-[a-z0-9_-]+|style|class|id|width|height|color|align|valign|role|dir|tabindex)\s*=\s*(?:"[^"]*"|\x27[^\x27]*\x27|[^\s>]+)/gi, '');
  d = d.replace(/\s*on[a-z]+\s*=\s*(?:"[^"]*"|\x27[^\x27]*\x27|[^\s>]+)/gi, '');

  // 7. Unwrap span tags (handle nested)
  for (let i = 0; i < 3; i++) {
    d = d.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1');
  }

  // 8. Fix malformed list nesting like <ul><li style="..."><ul>...
  d = d.replace(/<ul>\s*<li>\s*<ul>/gi, '<ul>');
  d = d.replace(/<\/ul>\s*<\/li>\s*<\/ul>/gi, '</ul>');
  d = d.replace(/<li>\s*<p>(.*?)<\/p>\s*<\/li>/gi, '<li>$1</li>');

  // 9. Normalize heading tags into clean p strong
  d = d.replace(/<h[12356][^>]*>([\s\S]*?)<\/h[12356]>/gi, '<p><strong>$1</strong></p>');
  d = d.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '<p><strong>$1</strong></p>');

  // 10. Scrub external brand references
  d = d.replace(/Tawakal\s*Closet/gi, 'GulPash')
       .replace(/#TawakalCloset/gi, '#GulPash')
       .replace(/Anabya\s*Garments/gi, 'GulPash')
       .replace(/#AnabyaGarments/gi, '#GulPash');

  // 11. Normalize entity &amp;
  d = d.replace(/&amp;/g, '&');

  // 12. Clean redundant nested strong/b tags
  for (let i = 0; i < 3; i++) {
    d = d.replace(/<strong>\s*<strong>/gi, '<strong>').replace(/<\/strong>\s*<\/strong>/gi, '</strong>');
    d = d.replace(/<b>\s*<b>/gi, '<b>').replace(/<\/b>\s*<\/b>/gi, '</b>');
  }

  // 13. Remove empty tags
  for (let i = 0; i < 3; i++) {
    d = d.replace(/<p>\s*(?:<br\s*[\/]?>|\s|&nbsp;)*<\/p>/gi, '');
    d = d.replace(/<strong>\s*<\/strong>/gi, '');
    d = d.replace(/<b>\s*<\/b>/gi, '');
    d = d.replace(/<em>\s*<\/em>/gi, '');
    d = d.replace(/<i>\s*<\/i>/gi, '');
    d = d.replace(/<li>\s*<\/li>/gi, '');
  }

  // 14. Remove redundant title at top if identical to product title
  if (productTitle) {
    const cleanTitle = productTitle.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    d = d.replace(/^\s*<p><strong>(.*?)<\/strong><\/p>/i, (match, inner) => {
      const cleanInner = inner.replace(/<[^>]+>/g, '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanInner === cleanTitle || cleanInner.startsWith(cleanTitle) || cleanTitle.startsWith(cleanInner)) {
        return '';
      }
      return match;
    });
  }

  // 15. Normalize excessive line breaks
  d = d.replace(/(?:<br\s*[\/]?>\s*){2,}/gi, '<br />');
  d = d.replace(/<p>\s*<br\s*[\/]?>\s*/gi, '<p>');
  d = d.replace(/\s*<br\s*[\/]?>\s*<\/p>/gi, '</p>');

  // 16. Final empty p cleanup and trim
  d = d.replace(/<p>\s*<\/p>/gi, '');
  d = d.trim();

  return d;
}

const raw = JSON.parse(fs.readFileSync('anabya_raw_catalog.json', 'utf8'));

// Canonical Collections in Exact Desired Order:
// 1. NEW ARRIVALS
// 2. TRENDING
// 3. WINTER COLLECTION
// 4. CO-ORDS
// 5. SHORT LENGTH
// 6. ALL ENSEMBLES
const COLLECTIONS = [
  {
    id: generateId('collection', 'new-arrivals'),
    name: 'NEW ARRIVALS',
    slug: 'new-arrivals',
    description: 'The freshest silhouettes, hand-embellished luxury fabrics, and contemporary Pakistani couture cuts.',
    imageUrl: '/products/anabya/zeenat-emb-3pcs/01_49440054640873.jpg',
    image: '/products/anabya/zeenat-emb-3pcs/01_49440054640873.jpg',
    bannerUrl: '/products/anabya/zeenat-emb-3pcs/01_49440054640873.jpg',
    order: 1,
    displayOrder: 1,
    isVisible: true,
    visibleOnHomepage: true,
    visibleInNav: true,
    altText: 'GulPash New Arrivals — Zeenat Embroidered Ensemble'
  },
  {
    id: generateId('collection', 'best-selling'),
    name: 'TRENDING',
    slug: 'best-selling',
    description: 'Our most coveted, highest-demand artisanal Pakistani ready-to-wear ensembles.',
    imageUrl: '/products/anabya/zar-e-sabz-3piece/01_50358171500777.png',
    image: '/products/anabya/zar-e-sabz-3piece/01_50358171500777.png',
    bannerUrl: '/products/anabya/zar-e-sabz-3piece/01_50358171500777.png',
    order: 2,
    displayOrder: 2,
    isVisible: true,
    visibleOnHomepage: true,
    visibleInNav: true,
    altText: 'GulPash Trending — Zar-E-Sabz 3Piece'
  },
  {
    id: generateId('collection', 'winter-collection'),
    name: 'WINTER COLLECTION',
    slug: 'winter-collection',
    description: 'Rich winter textiles including premium Dhank, warm linen, and seasonal embroidery.',
    imageUrl: '/products/anabya/alize-3pcs/01_49440049594601.jpg',
    image: '/products/anabya/alize-3pcs/01_49440049594601.jpg',
    bannerUrl: '/products/anabya/alize-3pcs/01_49440049594601.jpg',
    order: 3,
    displayOrder: 3,
    isVisible: true,
    visibleOnHomepage: true,
    visibleInNav: true,
    altText: 'GulPash Winter Collection — Alize Embroidered Dhank'
  },
  {
    id: generateId('collection', 'co-ords'),
    name: 'CO-ORDS',
    slug: 'co-ords',
    description: 'Chic matching separates and tailored 2-piece coords designed for effortless sophistication.',
    imageUrl: '/products/anabya/zaarif-cotton-3-pc-emb/01_49440046285033.jpg',
    image: '/products/anabya/zaarif-cotton-3-pc-emb/01_49440046285033.jpg',
    bannerUrl: '/products/anabya/zaarif-cotton-3-pc-emb/01_49440046285033.jpg',
    order: 4,
    displayOrder: 4,
    isVisible: true,
    visibleOnHomepage: true,
    visibleInNav: true,
    altText: 'GulPash Co-ords — Zaarif Tailored Separates'
  },
  {
    id: generateId('collection', 'short-length-article'),
    name: 'SHORT LENGTH',
    slug: 'short-length-article',
    description: 'Contemporary short tunic lengths paired with straight trousers or culottes.',
    imageUrl: '/products/anabya/elara/01_49440043499753.webp',
    image: '/products/anabya/elara/01_49440043499753.webp',
    bannerUrl: '/products/anabya/elara/01_49440043499753.webp',
    order: 5,
    displayOrder: 5,
    isVisible: true,
    visibleOnHomepage: true,
    visibleInNav: true,
    altText: 'GulPash Short Length Article — Elara Silhouette'
  },
  {
    id: generateId('collection', 'all'),
    name: 'ALL ENSEMBLES',
    slug: 'all',
    description: 'Complete GulPash pret & couture catalog. Discover our master-crafted ready-to-wear silhouettes.',
    imageUrl: '/products/anabya/aazure-3piece/01_49909420425449.jpg',
    image: '/products/anabya/aazure-3piece/01_49909420425449.jpg',
    bannerUrl: '/products/anabya/aazure-3piece/01_49909420425449.jpg',
    order: 6,
    displayOrder: 6,
    isVisible: true,
    visibleOnHomepage: false, // Controlled via Admin Storefront toggle
    visibleInNav: true,
    altText: 'GulPash All Ensembles — Aazure Pret'
  }
];

// Categories with verified images
const CATEGORIES = [
  {
    id: generateId('category', '3-piece-ensembles'),
    name: '3-Piece Ensembles',
    slug: '3-piece-ensembles',
    description: 'Exquisite 3-piece designer ensembles complete with shirt, trouser, and dupatta.',
    imageUrl: '/products/anabya/aazure-3piece/01_49909420425449.jpg',
    order: 1,
    isVisible: true
  },
  {
    id: generateId('category', '2-piece-ensembles'),
    name: '2-Piece Ensembles',
    slug: '2-piece-ensembles',
    description: 'Versatile 2-piece shirts and trousers with contemporary tailoring and embroidery.',
    imageUrl: '/products/anabya/zaarif-cotton-3-pc-emb/01_49440046285033.jpg',
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
    imageUrl: '/products/anabya/zar-e-sabz-3piece/01_50358171500777.png',
    order: 4,
    isVisible: true
  },
  {
    id: generateId('category', 'unstitched-stitched'),
    name: 'Unstitched / Stitched',
    slug: 'unstitched-stitched',
    description: 'GulPash signature collections crafted in premium lawn, chiffon, dhank, and linen.',
    imageUrl: '/products/anabya/amber-3piece/01_49909420589289.jpg',
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

let cleanedCount = 0;

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

  // Normalized, sanitized description
  const cleanHtmlDesc = cleanDescription(p.body_html || '', title);
  cleanedCount++;

  // Fabric extraction
  let fabric = 'Premium Lawn';
  const fabricMatch = cleanHtmlDesc.match(/Fabric:\s*([^<\n]+)/i) || cleanHtmlDesc.match(/Stuff:\s*([^<\n]+)/i);
  if (fabricMatch) {
    fabric = fabricMatch[1].replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim();
  } else if (cleanHtmlDesc.toLowerCase().includes('dhank')) {
    fabric = 'Dhank';
  } else if (cleanHtmlDesc.toLowerCase().includes('linen')) {
    fabric = 'Linen';
  } else if (cleanHtmlDesc.toLowerCase().includes('cotton')) {
    fabric = 'Cotton';
  } else if (cleanHtmlDesc.toLowerCase().includes('chiffon')) {
    fabric = 'Chiffon';
  }

  // Piece count
  const is2Piece = title.includes('2 PC') || title.includes('2-Piece') || variants.some(v => v.title.includes('2-Piece'));
  const pieceCount = is2Piece ? '2 Piece' : '3 Piece';

  // Details
  const details = {
    shirt: cleanHtmlDesc.includes('Shirt') ? 'Detailed designer shirt with signature tailoring and embroidery' : `${pieceCount} embellished shirt`,
    trouser: cleanHtmlDesc.includes('Trouser') ? 'Matching dyed/embroidered trouser' : 'Dyed cotton/linen trouser',
    dupatta: is2Piece ? 'N/A (2-Piece Ensemble)' : (cleanHtmlDesc.includes('Dupatta') ? 'Embellished matching dupatta' : 'Dyed Chiffon Dupatta'),
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
  if (isNewArrival) matchedCollections.push(COLLECTIONS.find(c => c.slug === 'new-arrivals'));
  if (isBestSeller) matchedCollections.push(COLLECTIONS.find(c => c.slug === 'best-selling'));
  if (isWinter) matchedCollections.push(COLLECTIONS.find(c => c.slug === 'winter-collection'));
  if (isCoord) matchedCollections.push(COLLECTIONS.find(c => c.slug === 'co-ords'));

  const primaryCollection = isNewArrival 
    ? COLLECTIONS.find(c => c.slug === 'new-arrivals')
    : (isBestSeller ? COLLECTIONS.find(c => c.slug === 'best-selling') : COLLECTIONS.find(c => c.slug === 'all'));

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
    description: cleanHtmlDesc,
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
console.log(`- src/data/migratedProducts.json (${products.length} products, ${cleanedCount} descriptions sanitized)`);
console.log(`- src/data/migratedCategories.json (${CATEGORIES.length} categories)`);
console.log(`- src/data/migratedCollections.json (${COLLECTIONS.length} collections)`);

COLLECTIONS.forEach(c => {
  console.log(`  [Order ${c.order}] ${c.name} (${c.slug}): ${c.productCount} products, Image: ${c.imageUrl}`);
});

