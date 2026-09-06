import https from 'https';
import fs from 'fs';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message} (Status: ${res.statusCode})`));
        }
      });
    }).on('error', reject);
  });
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function audit() {
  console.log('Auditing https://tawakalcloset.com/...');

  // 1. Fetch collections
  let collections = [];
  let page = 1;
  while (true) {
    try {
      const data = await fetchJson(`https://tawakalcloset.com/collections.json?page=${page}&limit=250`);
      if (!data.collections || data.collections.length === 0) break;
      collections.push(...data.collections);
      if (data.collections.length < 250) break;
      page++;
    } catch (e) {
      console.error('Error fetching collections:', e.message);
      break;
    }
  }

  console.log(`Found ${collections.length} collections.`);

  // 2. Fetch all products (paginated)
  let allProducts = [];
  let productPage = 1;
  while (true) {
    try {
      const data = await fetchJson(`https://tawakalcloset.com/products.json?page=${productPage}&limit=250`);
      if (!data.products || data.products.length === 0) break;
      allProducts.push(...data.products);
      console.log(`Fetched page ${productPage}, accumulated ${allProducts.length} products`);
      if (data.products.length < 250) break;
      productPage++;
    } catch (e) {
      console.error('Error fetching products:', e.message);
      break;
    }
  }

  // Also check sitemap to see if there are any products not in products.json
  const sitemapIndex = await fetchText('https://tawakalcloset.com/sitemap.xml');
  const sitemapProductMatches = sitemapIndex.match(/https:\/\/tawakalcloset\.com\/sitemap_products_[0-9]+\.xml/g) || [];
  let sitemapProductUrls = new Set();
  for (const smUrl of sitemapProductMatches) {
    const smContent = await fetchText(smUrl);
    const locMatches = smContent.match(/<loc>(https:\/\/tawakalcloset\.com\/products\/[^<]+)<\/loc>/g) || [];
    for (const loc of locMatches) {
      const u = loc.replace('<loc>', '').replace('</loc>', '');
      sitemapProductUrls.add(u);
    }
  }
  console.log(`Sitemap contains ${sitemapProductUrls.size} product URLs`);

  // Count images, categories (product_type), variants, videos
  let totalImages = 0;
  let totalVariants = 0;
  let videoProducts = [];
  const categories = new Set();
  const productTypes = new Set();
  const tags = new Set();

  for (const p of allProducts) {
    if (p.images) totalImages += p.images.length;
    if (p.variants) totalVariants += p.variants.length;
    if (p.product_type) productTypes.add(p.product_type);
    if (p.tags) {
      const tagList = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? p.tags.split(',').map(t => t.trim()) : []);
      tagList.forEach(t => tags.add(t));
    }
    // Check if description or media has video
    if (p.body_html && (p.body_html.includes('<video') || p.body_html.includes('iframe') || p.body_html.includes('youtube') || p.body_html.includes('vimeo') || p.body_html.includes('mp4'))) {
      videoProducts.push(p.handle);
    }
  }

  // Save audit data to file
  const auditReport = {
    totalProducts: allProducts.length,
    sitemapProductCount: sitemapProductUrls.size,
    totalCollections: collections.length,
    collectionsList: collections.map(c => ({ id: c.id, title: c.title, handle: c.handle, products_count: c.products_count })),
    totalImages,
    totalVariants,
    totalProductTypes: productTypes.size,
    productTypes: Array.from(productTypes),
    tagsCount: tags.size,
    videoProductsCount: videoProducts.length,
    videoProducts
  };

  fs.writeFileSync('source_audit_report.json', JSON.stringify(auditReport, null, 2));
  fs.writeFileSync('source_products_cache.json', JSON.stringify(allProducts, null, 2));
  fs.writeFileSync('source_collections_cache.json', JSON.stringify(collections, null, 2));

  console.log('AUDIT COMPLETE:', JSON.stringify(auditReport, null, 2));
}

audit().catch(console.error);
