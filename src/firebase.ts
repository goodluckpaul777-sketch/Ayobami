import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const storage = getStorage(app);

export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
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
