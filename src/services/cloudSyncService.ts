import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { getFirebaseInstance, hasCustomFirebaseProject } from '../firebase';
import { FabricProduct, StoreSettings, InquiryRecord } from '../types';
import { INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS } from '../data/initialData';

// Helper to remove any undefined fields before sending to Firestore
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        sanitized[key] = value.filter(v => v !== undefined);
      } else if (value !== null && typeof value === 'object') {
        sanitized[key] = sanitizeForFirestore(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  return sanitized;
}

/**
 * Listens for real-time product catalog changes across all devices
 * If no custom Firebase project is configured, stays silent and safe
 */
export function subscribeToProducts(
  onSuccess: (products: FabricProduct[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!hasCustomFirebaseProject()) {
    // Zero network calls to exhausted demo projects — clean and silent
    return () => {};
  }

  const { db } = getFirebaseInstance();
  if (!db) return () => {};

  try {
    const productsRef = collection(db, 'products');

    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        if (snapshot.empty) {
          onSuccess(INITIAL_PRODUCTS);
          return;
        }

        const remoteProducts: FabricProduct[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as FabricProduct;
          remoteProducts.push({
            ...data,
            id: docSnap.id,
          });
        });

        remoteProducts.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return a.name.localeCompare(b.name);
        });

        onSuccess(remoteProducts);
      },
      (error) => {
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    return () => {};
  }
}

/**
 * Saves or updates a single product to Cloud Firestore if connected
 */
export async function saveProductToCloud(product: FabricProduct): Promise<{ success: boolean; isCustomConnected: boolean; error?: string }> {
  if (!hasCustomFirebaseProject()) {
    return { success: true, isCustomConnected: false };
  }

  const { db } = getFirebaseInstance();
  if (!db) {
    return { success: true, isCustomConnected: false };
  }

  try {
    const productRef = doc(db, 'products', product.id);
    const payload = sanitizeForFirestore({
      ...product,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(productRef, payload, { merge: true });
    return { success: true, isCustomConnected: true };
  } catch (err: any) {
    return { success: false, isCustomConnected: true, error: err?.message };
  }
}

/**
 * Deletes a product from Cloud Firestore if connected
 */
export async function deleteProductFromCloud(productId: string): Promise<{ success: boolean; isCustomConnected: boolean; error?: string }> {
  if (!hasCustomFirebaseProject()) {
    return { success: true, isCustomConnected: false };
  }

  const { db } = getFirebaseInstance();
  if (!db) {
    return { success: true, isCustomConnected: false };
  }

  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    return { success: true, isCustomConnected: true };
  } catch (err: any) {
    return { success: false, isCustomConnected: true, error: err?.message };
  }
}

/**
 * Subscribes to store settings across all devices if custom project is configured
 */
export function subscribeToSettings(
  onSuccess: (settings: StoreSettings) => void,
  onError?: (err: Error) => void
): () => void {
  if (!hasCustomFirebaseProject()) {
    return () => {};
  }

  const { db } = getFirebaseInstance();
  if (!db) return () => {};

  try {
    const settingsDocRef = doc(db, 'settings', 'store');

    const unsubscribe = onSnapshot(
      settingsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as StoreSettings;
          onSuccess({
            ...INITIAL_STORE_SETTINGS,
            ...data,
          });
        }
      },
      (error) => {
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch {
    return () => {};
  }
}

/**
 * Saves store settings to Cloud Firestore if connected
 */
export async function saveSettingsToCloud(settings: StoreSettings): Promise<{ success: boolean }> {
  if (!hasCustomFirebaseProject()) {
    return { success: true };
  }

  const { db } = getFirebaseInstance();
  if (!db) return { success: true };

  try {
    const settingsRef = doc(db, 'settings', 'store');
    const payload = sanitizeForFirestore({
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(settingsRef, payload, { merge: true });
    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * Saves customer inquiry if connected
 */
export async function saveInquiryToCloud(inquiry: InquiryRecord): Promise<void> {
  if (!hasCustomFirebaseProject()) return;
  const { db } = getFirebaseInstance();
  if (!db) return;

  try {
    const inquiryRef = doc(db, 'inquiries', inquiry.id);
    const payload = sanitizeForFirestore({
      ...inquiry,
      createdAt: inquiry.createdAt || new Date().toISOString(),
    });
    await setDoc(inquiryRef, payload, { merge: true });
  } catch {}
}

export async function testFirestoreConnection(): Promise<boolean> {
  return hasCustomFirebaseProject();
}
