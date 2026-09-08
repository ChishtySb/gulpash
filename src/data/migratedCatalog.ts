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
  image: c.imageUrl,
  visibleInNav: c.slug === 'unstitched-stitched' || c.slug === 'stitched',
  visibleOnHomepage: c.slug === 'unstitched-stitched' || c.slug === 'stitched'
}));

// Authoritative Collections from Source: Aligned with reference storefront (gulpash-eight.vercel.app)
export const MIGRATED_COLLECTIONS: Collection[] = (migratedCollectionsJson as unknown as Collection[]).map(c => {
  let name = c.name;
  if (c.slug === 'best-selling') name = 'TRENDING';
  if (c.slug === 'short-length-article') name = 'SHORT LENGTH';
  if (c.slug === 'all') name = 'ALL ENSEMBLES';
  if (c.slug === 'new-arrivals') name = 'NEW ARRIVALS';
  if (c.slug === 'winter-collection') name = 'WINTER COLLECTION';
  if (c.slug === 'co-ords') name = 'CO-ORDS';

  return {
    ...c,
    name,
    imageUrl: c.imageUrl || c.image,
    image: c.imageUrl || c.image
  };
});

