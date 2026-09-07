import { Category, Collection, Product } from '../types';

/**
 * Media Resolver for GulPash Storefront
 * Enforces the strict fallback hierarchy for authentic catalog media:
 * 
 * CATEGORY IMAGE:
 * 1. Authentic existing category image if available and non-empty
 * 2. First valid authentic product image belonging to that category
 * 3. Another valid authentic catalog image only if logically appropriate
 * 4. If absolutely no valid image exists, return empty string for non-broken visual placeholder
 * 
 * NEVER generates or fetches AI or stock imagery. All media is strictly sourced
 * from the authentic catalog photography.
 */

/**
 * Finds the first authentic product image belonging to a given category.
 */
export function getCategoryProductFallback(category: Category, products: Product[]): string {
  if (!products || products.length === 0) return '';

  const catName = (category.name || '').trim().toLowerCase();
  const catSlug = (category.slug || '').trim().toLowerCase();
  const catId = category.id || '';

  // 1. Direct match on category name, categoryId, or category slug
  const matched = products.find(p => {
    const pCat = (p.category || '').trim().toLowerCase();
    const pCatId = p.categoryId || '';
    const pTags = (p.tags || []).map(t => t.trim().toLowerCase());

    return (
      (pCat && pCat === catName) ||
      (pCatId && pCatId === catId) ||
      pTags.includes(catName) ||
      pTags.includes(catSlug)
    );
  });

  if (matched && matched.images && matched.images.length > 0 && matched.images[0]) {
    return matched.images[0];
  }

  // 2. Partial substring matching if exact match wasn't found
  const partialMatch = products.find(p => {
    const pCat = (p.category || '').trim().toLowerCase();
    return pCat.includes(catName) || catName.includes(pCat);
  });

  if (partialMatch && partialMatch.images && partialMatch.images.length > 0 && partialMatch.images[0]) {
    return partialMatch.images[0];
  }

  // 3. Fallback to another authentic catalog image
  return products[0]?.images?.[0] || '';
}

/**
 * Resolves the primary image URL for a category according to the authoritative fallback hierarchy.
 */
export function resolveCategoryImage(category: Category, products: Product[] = []): string {
  if (!category) return '';

  // 1. Authentic existing category image if available and non-empty
  const directImage = category.imageUrl || category.image;
  if (directImage && typeof directImage === 'string' && directImage.trim().length > 0 && directImage.startsWith('http')) {
    return directImage.trim();
  }

  // 2. First valid authentic product image belonging to that category
  const productFallback = getCategoryProductFallback(category, products);
  if (productFallback) {
    return productFallback;
  }

  // 3. Another valid authentic catalog image if products exist
  if (products.length > 0 && products[0]?.images?.[0]) {
    return products[0].images[0];
  }

  // 4. Return empty string so UI renders a graceful visual card rather than a broken <img>
  return '';
}

/**
 * Resolves collection banner or featured image from existing authentic catalog.
 */
export function resolveCollectionImage(collection: Collection, products: Product[] = []): string {
  if (!collection) return '';

  const directImage = collection.imageUrl || collection.bannerUrl;
  if (directImage && typeof directImage === 'string' && directImage.trim().length > 0 && directImage.startsWith('http')) {
    return directImage.trim();
  }

  const colSlug = (collection.slug || '').trim().toLowerCase();
  const colName = (collection.name || '').trim().toLowerCase();
  const colId = collection.id || '';

  const matching = products.find(p => {
    const pCol = (p.collection || '').trim().toLowerCase();
    const matchId = p.collectionIds && p.collectionIds.includes(colId);
    const matchName = p.collectionNames && (
      p.collectionNames.some(cn => cn.trim().toLowerCase() === colName) ||
      (colSlug === 'best-selling' && p.collectionNames.some(cn => cn.trim().toLowerCase() === 'best selling'))
    );
    const matchSingle = pCol === colName || (colSlug === 'best-selling' && pCol === 'best selling');
    const matchSpecial = colSlug === 'best-selling' && (p.isBestSeller || p.tags?.includes('Best Seller'));

    return matchId || matchName || matchSingle || matchSpecial;
  });

  if (matching && matching.images?.[0]) {
    return matching.images[0];
  }

  return products[0]?.images?.[0] || '';
}

/**
 * Resolves a product image safely.
 */
export function resolveProductImage(product: Product, index: number = 0): string {
  if (!product || !product.images || product.images.length === 0) {
    return '';
  }
  return product.images[index] || product.images[0] || '';
}
