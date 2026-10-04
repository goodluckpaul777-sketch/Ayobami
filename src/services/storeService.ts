import { 
  collection, 
  doc, 
  getDocs, 
  getDocsFromCache,
  getDocsFromServer,
  query,
  limit,
  setDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product, OrderDetails } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';
import { compressImageFile } from '../utils/imageCompressor';

const LOCAL_STORAGE_KEY = 'ayobami_sam_products_v3';
const LAST_SERVER_SYNC_KEY = 'ayobami_sam_last_sync_v3';
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

// Cache TTL: 20 minutes before checking server again (saves thousands of reads)
const CACHE_TTL_MS = 20 * 60 * 1000;

export class StoreService {
  private static inFlightFetch: Promise<{ products: Product[]; fromFirestore: boolean; fromCache: boolean }> | null = null;

  /**
   * Upload / process an image file.
   * Compresses the image in <50ms so it never hangs or fails on mobile/desktop,
   * returning an optimized lightweight JPEG ready to sync to Firestore Cloud.
   */
  static async uploadImage(file: File): Promise<string> {
    return await compressImageFile(file, 750, 750, 0.72);
  }

  /**
   * Get products from localStorage first for instant UI response,
   * with fallback to INITIAL_PRODUCTS.
   */
  static getLocalProducts(): Product[] {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse local products:', e);
    }
    return INITIAL_PRODUCTS;
  }

  /**
   * Save products to local storage.
   */
  static saveLocalProducts(products: Product[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('LocalStorage quota issue, attempting trimmed storage:', e);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products.slice(0, 50)));
      } catch (err) {
        console.error('Cannot save to localStorage:', err);
      }
    }
  }

  /**
   * Check if our cached data is considered fresh.
   */
  static isCacheFresh(): boolean {
    try {
      const lastSyncStr = localStorage.getItem(LAST_SERVER_SYNC_KEY);
      if (!lastSyncStr) return false;
      const lastSync = Number(lastSyncStr);
      return Date.now() - lastSync < CACHE_TTL_MS;
    } catch {
      return false;
    }
  }

  /**
   * Record a successful sync timestamp.
   */
  static markCacheSynced(): void {
    try {
      localStorage.setItem(LAST_SERVER_SYNC_KEY, String(Date.now()));
    } catch {
      // Ignore storage write issues
    }
  }

  /**
   * Optimized catalog fetcher:
   * 1. In-flight Deduplication: If already fetching, reuse the ongoing promise.
   * 2. Persistent Cache First: Reads from IndexedDB cache via getDocsFromCache (0 cloud reads).
   * 3. TTL Throttling: If cache is fresh (<20 min) and non-empty, skips server completely.
   * 4. Bounded Queries: When contacting server, uses query(..., limit(60)).
   * 5. Graceful Fallback: On Quota exceeded or offline, seamlessly serves cached products.
   */
  static async fetchFirestoreProducts(
    forceServerRefresh = false
  ): Promise<{ products: Product[]; fromFirestore: boolean; fromCache: boolean }> {
    // If a request is already in-flight, reuse it to avoid duplicate parallel reads
    if (this.inFlightFetch) {
      return this.inFlightFetch;
    }

    this.inFlightFetch = this._executeFetch(forceServerRefresh);
    try {
      const result = await this.inFlightFetch;
      return result;
    } finally {
      this.inFlightFetch = null;
    }
  }

  private static async _executeFetch(
    forceServerRefresh: boolean
  ): Promise<{ products: Product[]; fromFirestore: boolean; fromCache: boolean }> {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const localProducts = this.getLocalProducts();

    // 1. Try reading from Firestore's persistent local cache (IndexedDB)
    try {
      const cacheSnap = await getDocsFromCache(productsRef);
      if (!cacheSnap.empty) {
        const cachedProducts: Product[] = [];
        cacheSnap.forEach((docSnap) => {
          const data = docSnap.data() as Product;
          cachedProducts.push({
            ...data,
            id: docSnap.id || data.id,
          });
        });

        if (cachedProducts.length > 0) {
          this.saveLocalProducts(cachedProducts);
          // If cache is fresh and we didn't explicitly force a refresh, return immediately (0 cloud reads!)
          if (!forceServerRefresh && this.isCacheFresh()) {
            return { products: cachedProducts, fromFirestore: true, fromCache: true };
          }
        }
      }
    } catch {
      // Cache empty or still initializing, proceed
    }

    // If cache is fresh and not forcing refresh, localProducts is sufficient (0 cloud reads!)
    if (!forceServerRefresh && this.isCacheFresh() && localProducts.length > 0) {
      return { products: localProducts, fromFirestore: true, fromCache: true };
    }

    // 2. Fetch from server with bounded query (limit 60)
    try {
      const boundedQuery = query(productsRef, limit(60));
      const serverSnap = await getDocsFromServer(boundedQuery);
      if (!serverSnap.empty) {
        const serverProducts: Product[] = [];
        serverSnap.forEach((docSnap) => {
          const data = docSnap.data() as Product;
          serverProducts.push({
            ...data,
            id: docSnap.id || data.id,
          });
        });

        if (serverProducts.length > 0) {
          this.saveLocalProducts(serverProducts);
          this.markCacheSynced();
          return { products: serverProducts, fromFirestore: true, fromCache: false };
        }
      }
    } catch (err) {
      console.warn('Firestore server notice (quota or offline, serving from local cache):', err);
    }

    // 3. Graceful offline/quota fallback to local cache
    return { products: localProducts, fromFirestore: false, fromCache: true };
  }

  /**
   * Save or update a product in both local storage and Firestore.
   * Returns immediately with updated list so the user is never blocked,
   * while syncing to Firestore in the background.
   */
  static async saveProduct(product: Product): Promise<Product[]> {
    const current = this.getLocalProducts();
    const index = current.findIndex(p => p.id === product.id);
    let updated: Product[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = product;
    } else {
      updated = [product, ...current];
    }
    this.saveLocalProducts(updated);
    this.markCacheSynced();

    // Non-blocking background sync to Firestore (adebisi-store-live)
    setDoc(doc(db, PRODUCTS_COLLECTION, product.id), {
      ...product,
      updatedAt: serverTimestamp(),
    }, { merge: true })
      .then(() => console.log('Product synced to Firestore:', product.id))
      .catch((err) => console.warn('Firestore sync note:', err));

    return updated;
  }

  /**
   * Delete a product.
   */
  static async deleteProduct(productId: string): Promise<Product[]> {
    const current = this.getLocalProducts();
    const updated = current.filter(p => p.id !== productId);
    this.saveLocalProducts(updated);
    this.markCacheSynced();

    try {
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
    } catch (err) {
      console.warn('Firestore delete product failed:', err);
    }

    return updated;
  }

  /**
   * Reset local catalog back to standard INITIAL_PRODUCTS.
   */
  static resetToDefault(): Product[] {
    this.saveLocalProducts(INITIAL_PRODUCTS);
    this.markCacheSynced();
    return INITIAL_PRODUCTS;
  }

  /**
   * Record customer order/inquiry in Firestore.
   */
  static async recordOrder(order: OrderDetails): Promise<boolean> {
    try {
      const orderId = `ord-${Date.now()}`;
      await setDoc(doc(db, ORDERS_COLLECTION, orderId), {
        ...order,
        id: orderId,
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      console.warn('Firestore order recording error:', err);
      return false;
    }
  }
}
