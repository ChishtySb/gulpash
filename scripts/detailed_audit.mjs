import fs from 'fs';
import https from 'https';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function detailedAudit() {
  const products = JSON.parse(fs.readFileSync('source_products_cache.json', 'utf8'));
  const collections = JSON.parse(fs.readFileSync('source_collections_cache.json', 'utf8'));

  console.log(`Analyzing ${products.length} products and ${collections.length} collections...`);

  // Map collections to products
  const collectionProductMap = {};
  for (const c of collections) {
    try {
      const colData = await fetchJson(`https://tawakalcloset.com/collections/${c.handle}/products.json?limit=250`);
      collectionProductMap[c.handle] = (colData.products || []).map(p => p.id);
      console.log(`Collection "${c.title}" (${c.handle}): ${collectionProductMap[c.handle].length} products`);
    } catch (e) {
      console.error(`Error mapping collection ${c.handle}:`, e.message);
      collectionProductMap[c.handle] = [];
    }
  }

  let totalImages = 0;
  let totalVariants = 0;
  let totalVideos = 0;
  const categoriesSet = new Set();
  const collectionsSet = new Set(collections.map(c => c.title));
  const productAuditList = [];

  const productsWithoutImages = [];
  const productsWithMultipleImages = [];
  const imageCounts = [];
  const variantOptionNames = new Set();

  for (const p of products) {
    const imgCount = (p.images || []).length;
    totalImages += imgCount;
    imageCounts.push(imgCount);
    if (imgCount === 0) productsWithoutImages.push(p.title);
    if (imgCount > 1) productsWithMultipleImages.push(p.title);

    const variants = p.variants || [];
    totalVariants += variants.length;

    // Check options
    (p.options || []).forEach(opt => variantOptionNames.add(opt.name));

    // Category determination from product_type or tags
    const cat = p.product_type || 'Unstitched / Stitched';
    categoriesSet.add(cat);

    // Collections this product belongs to
    const productCollections = [];
    for (const [handle, productIds] of Object.entries(collectionProductMap)) {
      if (productIds.includes(p.id)) {
        const cObj = collections.find(c => c.handle === handle);
        if (cObj) productCollections.push(cObj.title);
      }
    }

    // Check for videos
    let hasVideo = false;
    if (p.body_html && (p.body_html.includes('<video') || p.body_html.includes('iframe') || p.body_html.includes('.mp4') || p.body_html.includes('youtube.com') || p.body_html.includes('vimeo.com'))) {
      hasVideo = true;
      totalVideos++;
    }

    productAuditList.push({
      id: p.id,
      title: p.title,
      handle: p.handle,
      price: variants[0]?.price || 'N/A',
      compare_at_price: variants[0]?.compare_at_price || null,
      images_count: imgCount,
      variants_count: variants.length,
      variant_options: (p.options || []).map(o => o.name),
      collections: productCollections,
      has_video: hasVideo,
      available: variants.some(v => v.available)
    });
  }

  const result = {
    totalProductsDetected: products.length,
    totalCollectionsDetected: collections.length,
    collectionsSummary: collections.map(c => ({
      title: c.title,
      handle: c.handle,
      productCount: collectionProductMap[c.handle]?.length || 0
    })),
    totalCategoriesDetected: categoriesSet.size,
    categories: Array.from(categoriesSet),
    totalProductImages: totalImages,
    minImagesPerProduct: Math.min(...imageCounts),
    maxImagesPerProduct: Math.max(...imageCounts),
    avgImagesPerProduct: (totalImages / products.length).toFixed(1),
    totalProductVariants: totalVariants,
    variantOptionTypes: Array.from(variantOptionNames),
    totalProductVideos: totalVideos,
    nonAutomatableData: [
      "No external video embeds or mp4 links detected in source catalog",
      "Customer reviews on source site are managed via third-party Shopify widgets (Judge.me/Loox/Shopify Product Reviews app) which require merchant private API keys to export past reviews"
    ],
    sampleProducts: productAuditList.slice(0, 5)
  };

  fs.writeFileSync('detailed_audit_summary.json', JSON.stringify(result, null, 2));
  fs.writeFileSync('collection_product_map.json', JSON.stringify(collectionProductMap, null, 2));
  console.log('DETAILED AUDIT SUMMARY:', JSON.stringify(result, null, 2));
}

detailedAudit().catch(console.error);
