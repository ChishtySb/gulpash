// Auto-generated GulPash Normalized Catalog Migration Layer
// Authoritative snapshot from source: https://tawakalcloset.com/ -> https://gulpash.pk/
// Verified Products: 68, Variants: 269, Images: 397

import { Product, Category, Collection } from '../types';
import migratedProductsJson from './migratedProducts.json';
import migratedCategoriesJson from './migratedCategories.json';
import migratedCollectionsJson from './migratedCollections.json';

export const MIGRATED_PRODUCTS: Product[] = migratedProductsJson as unknown as Product[];
export const MIGRATED_CATEGORIES: Category[] = migratedCategoriesJson as unknown as Category[];
export const MIGRATED_COLLECTIONS: Collection[] = migratedCollectionsJson as unknown as Collection[];
