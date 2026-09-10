const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync('src/data/migratedProducts.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('src/data/migratedCategories.json', 'utf8'));
const collections = JSON.parse(fs.readFileSync('src/data/migratedCollections.json', 'utf8'));

let sql = `-- ==========================================================
-- GULPASH.PK — SUPABASE CATALOG MIGRATION SQL SCRIPT
-- Authorized Source: https://anabyagarments.com/ -> https://gulpash.pk/
-- Products: ${products.length} | Variants: ${products.reduce((s, p) => s + (p.variants || []).length, 0)} | Images: ${products.reduce((s, p) => s + (p.images || []).length, 0)} | Categories: ${categories.length} | Collections: ${collections.length}
-- Controlled Catalog Replacement: Tawakal Catalog Removed -> Anabya Catalog Imported
-- Brand Identity: GulPash | Domain: gulpash.pk
-- ==========================================================

-- Clean up existing Tawakal products and relations if running a fresh import
-- (Preserves users, profiles, auth, settings, orders, reviews, CMS)
TRUNCATE TABLE public.product_collections, public.product_categories, public.product_images, public.product_variants, public.products CASCADE;

-- 1. Insert Categories
`;

categories.forEach(c => {
  const desc = (c.description || '').replace(/'/g, "''");
  const name = c.name.replace(/'/g, "''");
  sql += `INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_visible)
VALUES ('${c.id}', '${name}', '${c.slug}', '${desc}', '${c.imageUrl}', ${c.order}, ${c.isVisible})
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;\n`;
});

sql += `\n-- 2. Insert Collections\n`;
collections.forEach(c => {
  const desc = (c.description || '').replace(/'/g, "''");
  const name = c.name.replace(/'/g, "''");
  sql += `INSERT INTO public.collections (id, name, slug, description, image_url, banner_url, display_order, is_visible)
VALUES ('${c.id}', '${name}', '${c.slug}', '${desc}', '${c.imageUrl}', '${c.bannerUrl}', ${c.displayOrder}, ${c.isVisible})
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url, banner_url = EXCLUDED.banner_url;\n`;
});

sql += `\n-- 3. Insert Products\n`;
products.forEach(p => {
  const title = p.title.replace(/'/g, "''");
  const desc = p.description.replace(/'/g, "''");
  const shortDesc = (p.shortDescription || '').replace(/'/g, "''");
  const catName = p.category.replace(/'/g, "''");
  const colName = p.collection ? p.collection.replace(/'/g, "''") : null;
  const compareAt = p.compareAtPrice !== null && p.compareAtPrice !== undefined ? p.compareAtPrice : 'NULL';
  const fabric = p.fabric.replace(/'/g, "''");
  const tagsStr = (p.tags || []).map(t => `"${t.replace(/"/g, '""')}"`).join(',');
  const sizesStr = (p.sizes || []).map(s => `"${s.replace(/"/g, '""')}"`).join(',');

  sql += `INSERT INTO public.products (id, title, slug, description, short_description, sku, category_id, collection_id, category_name, collection_name, price, compare_at_price, stock, sizes, fabric, is_visible, is_featured, is_best_seller, is_new_arrival, rating, review_count, seo_title, seo_description)
VALUES ('${p.id}', '${title}', '${p.slug}', '${desc}', '${shortDesc}', '${p.sku}', '${p.categoryId}', ${p.collectionIds[0] ? `'${p.collectionIds[0]}'` : 'NULL'}, '${catName}', ${colName ? `'${colName}'` : 'NULL'}, ${p.price}, ${compareAt}, ${p.stock}, '{${sizesStr}}', '${fabric}', ${p.isVisible}, ${p.isFeatured || false}, ${p.isBestSeller || false}, ${p.isNewArrival || false}, ${p.rating}, ${p.reviewCount}, '${(p.seoTitle || '').replace(/'/g, "''")}', '${(p.seoDescription || '').replace(/'/g, "''")}')
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, stock = EXCLUDED.stock, is_visible = EXCLUDED.is_visible;\n`;
});

sql += `\n-- 4. Insert Product Variants\n`;
products.forEach(p => {
  (p.variants || []).forEach(v => {
    const vTitle = v.title.replace(/'/g, "''");
    const vSize = v.size.replace(/'/g, "''");
    const vCompare = v.compareAtPrice !== null && v.compareAtPrice !== undefined ? v.compareAtPrice : 'NULL';
    sql += `INSERT INTO public.product_variants (id, product_id, title, size, sku, price, compare_at_price, available, stock, position)
VALUES ('${v.id}', '${p.id}', '${vTitle}', '${vSize}', '${v.sku}', ${v.price}, ${vCompare}, ${v.available}, ${v.stock}, ${v.position})
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, available = EXCLUDED.available;\n`;
  });
});

sql += `\n-- 5. Insert Product Images\n`;
products.forEach(p => {
  (p.productImages || []).forEach(img => {
    const alt = (img.altText || '').replace(/'/g, "''");
    sql += `INSERT INTO public.product_images (id, product_id, storage_path, source_url, alt_text, sort_order, is_primary, width, height)
VALUES ('${img.id}', '${p.id}', '${img.storagePath}', '${img.sourceUrl}', '${alt}', ${img.sortOrder}, ${img.isPrimary}, ${img.width}, ${img.height})
ON CONFLICT (id) DO UPDATE SET storage_path = EXCLUDED.storage_path;\n`;
  });
});

sql += `\n-- 6. Insert Product Collections (Junction)\n`;
products.forEach(p => {
  (p.collectionIds || []).forEach(cId => {
    sql += `INSERT INTO public.product_collections (product_id, collection_id)
VALUES ('${p.id}', '${cId}')
ON CONFLICT (product_id, collection_id) DO NOTHING;\n`;
  });
});

fs.writeFileSync('supabase/migration_seed.sql', sql);
console.log(`Generated supabase/migration_seed.sql (${Math.round(sql.length / 1024)} KB)`);
