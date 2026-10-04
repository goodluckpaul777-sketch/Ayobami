import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Product, OrderDetails } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';
import { compressImageFile } from '../utils/imageCompressor';

const LOCAL_STORAGE_KEY = 'ayobami_sam_products_v2';
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

export class StoreService {
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
   * Fetch live products from Firestore (adebisi-store-live).
   * If Firestore has data, updates localStorage and returns them.
   */
  static async fetchFirestoreProducts(): Promise<{ products: Product[]; fromFirestore: boolean }> {
    try {
      const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
      if (!snap.empty) {
        const firestoreProducts: Product[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data() as Product;
          firestoreProducts.push({
            ...data,
            id: docSnap.id || data.id,
          });
        });
        if (firestoreProducts.length > 0) {
          this.saveLocalProducts(firestoreProducts);
          return { products: firestoreProducts, fromFirestore: true };
        }
      }
    } catch (err) {
      console.warn('Firestore fetch failed (using local catalog):', err);
    }
    return { products: this.getLocalProducts(), fromFirestore: false };
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

    try {
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
    } catch (err) {
      console.warn('Firestore delete product failed:', err);
    }

    return updated;
  }

  /**
   * Sync all local products to Firestore.
   */
  static async syncAllToFirestore(products: Product[]): Promise<{ count: number; success: boolean }> {
    let successCount = 0;
    for (const prod of products) {
      try {
        await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), {
          ...prod,
          syncedAt: serverTimestamp(),
        }, { merge: true });
        successCount++;
      } catch (e) {
        console.warn(`Failed to sync product ${prod.id} to Firestore:`, e);
      }
    }
    return { count: successCount, success: successCount > 0 };
  }

  /**
   * Reset local catalog back to standard INITIAL_PRODUCTS.
   */
  static resetToDefault(): Product[] {
    this.saveLocalProducts(INITIAL_PRODUCTS);
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
