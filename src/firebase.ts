import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  doc, 
  getDoc 
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Initialize Firestore with persistent IndexedDB local cache.
 * This ensures:
 * 1. Reads are served from local disk cache when available (0 server reads used!).
 * 2. Multi-tab synchronization is enabled.
 * 3. Products remain fully available offline and during quota limit periods.
 */
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  }, firebaseConfig.firestoreDatabaseId || 'adebisi-store-live');
} catch {
  // If already initialized, retrieve existing instance
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId || 'adebisi-store-live');
}

export const db = firestoreInstance;
export const auth = getAuth(app);
export const storage = getStorage(app);

export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await getDoc(doc(db, 'test', 'connection'));
    return { success: true, message: 'Connected to Firestore adebisi-store-live successfully.' };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    if (errMessage.includes('permission-denied')) {
      return { success: true, message: 'Firestore reachable (Security rules active).' };
    }
    if (errMessage.includes('the client is offline')) {
      return { success: false, message: 'Client is offline or database initializing.' };
    }
    return { success: false, message: errMessage };
  }
}

export { firebaseConfig };
