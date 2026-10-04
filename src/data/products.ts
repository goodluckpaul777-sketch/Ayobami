import { Product } from '../types';
import cleanProducts from './clean_products.json';

/**
 * Permanent local product catalog.
 * Synchronized safely from Firebase via scripts/sync-firebase.ts and GitHub Actions.
 * Once synchronized, the public storefront loads directly from this file and local images,
 * operating with 100% autonomy even if Firebase is unavailable or quota-limited.
 */
export const PRODUCTS: Product[] = cleanProducts as Product[];

export default PRODUCTS;
