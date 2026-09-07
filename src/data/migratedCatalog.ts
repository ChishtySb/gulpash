// Auto-generated GulPash Normalized Catalog Migration Layer
// Authoritative snapshot from source: https://tawakalcloset.com/ -> https://gulpash.online/
// Verified Products: 68, Variants: 269, Images: 397

import { Product, Category, Collection } from '../types';
import migratedProductsJson from './migratedProducts.json';
import migratedCategoriesJson from './migratedCategories.json';
import migratedCollectionsJson from './migratedCollections.json';

export const MIGRATED_PRODUCTS: Product[] = migratedProductsJson as unknown as Product[];
export const MIGRATED_CATEGORIES: Category[] = (migratedCategoriesJson as unknown as Category[]).map(c => ({
  ...c,
  imageUrl: c.imageUrl,
  image: c.imageUrl
}));

// Authoritative Collections from Source: Map customer-facing display name BEST SELLING -> TRENDING while preserving IDs, handles, and underlying product relationships
export const MIGRATED_COLLECTIONS: Collection[] = (migratedCollectionsJson as unknown as Collection[]).map(c => {
  const col = {
    ...c,
    imageUrl: c.imageUrl,
    image: c.imageUrl
  };
  if (c.slug === 'best-selling' || c.name === 'BEST SELLING') {
    return { ...col, name: 'TRENDING' };
  }
  return col;
});

