import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { FabricProduct, StoreSettings, InquiryRecord } from './types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

// Initialize Firestore with robust local caching and auto long-polling for iframe/sandboxed environments
let dbInstance;
try {
  dbInstance = initializeFirestore(
    app,
    {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      experimentalAutoDetectLongPolling: true,
    },
    firebaseConfig.firestoreDatabaseId
  );
} catch {
  dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db = dbInstance;
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  // Silently handle transient offline / connection unavailable warnings
  if (errMsg.includes('unavailable') || errMsg.includes('client is offline') || errMsg.includes('Could not reach Cloud Firestore')) {
    console.info(`Firestore operation running in offline mode [${operationType} on ${path}]`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Warning: ', JSON.stringify(errInfo));
}

// Test connectivity on initial load without disrupting app startup
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error) {
      console.info('Firestore initialized (operating in online/offline state).');
    }
  }
}
testConnection();

import { INITIAL_PRODUCTS } from './data/initialData';

let isSeeding = false;

// Products Firestore Helpers
export function subscribeToProducts(
  onUpdate: (products: FabricProduct[]) => void,
  onError?: (error: unknown) => void
) {
  const productsCol = collection(db, 'products');
  return onSnapshot(
    productsCol,
    (snapshot) => {
      const prods: FabricProduct[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as FabricProduct;
        prods.push({
          ...data,
          id: docSnap.id || data.id,
        });
      });

      if (prods.length === 0 && !isSeeding) {
        isSeeding = true;
        console.info('Auto-seeding Firestore database with initial product items...');
        Promise.all(INITIAL_PRODUCTS.map((p) => saveProductToFirestore(p)))
          .catch(console.error)
          .finally(() => {
            isSeeding = false;
          });
      } else if (prods.length > 0) {
        onUpdate(prods);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'products');
      if (onError) onError(err);
    }
  );
}

export async function saveProductToFirestore(product: FabricProduct) {
  const cleanId = String(product.id || `prod-${Date.now()}`);
  const productToSave = { ...product, id: cleanId };
  const productRef = doc(db, 'products', cleanId);
  try {
    await setDoc(productRef, productToSave);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `products/${cleanId}`);
    throw err;
  }
}

export async function deleteProductFromFirestore(productId: string) {
  if (!productId) return;
  const cleanId = String(productId);
  const productRef = doc(db, 'products', cleanId);
  try {
    await deleteDoc(productRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `products/${cleanId}`);
    throw err;
  }
}

// Settings Firestore Helpers
export function subscribeToSettings(
  onUpdate: (settings: StoreSettings) => void
) {
  const settingsDocRef = doc(db, 'settings', 'store_config');
  return onSnapshot(
    settingsDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as StoreSettings);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'settings/store_config');
    }
  );
}

export async function saveSettingsToFirestore(settings: StoreSettings) {
  const settingsDocRef = doc(db, 'settings', 'store_config');
  try {
    await setDoc(settingsDocRef, settings);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/store_config');
    throw err;
  }
}

// Inquiries Firestore Helpers
export function subscribeToInquiries(
  onUpdate: (inquiries: InquiryRecord[]) => void
) {
  const inqCol = collection(db, 'inquiries');
  return onSnapshot(
    inqCol,
    (snapshot) => {
      const records: InquiryRecord[] = [];
      snapshot.forEach((docSnap) => {
        records.push(docSnap.data() as InquiryRecord);
      });
      // Sort newest first
      records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(records);
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'inquiries');
    }
  );
}

export async function saveInquiryToFirestore(inquiry: InquiryRecord) {
  const inqRef = doc(db, 'inquiries', inquiry.id);
  try {
    await setDoc(inqRef, inquiry);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `inquiries/${inquiry.id}`);
    throw err;
  }
}
