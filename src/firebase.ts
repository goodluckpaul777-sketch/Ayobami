import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

export interface CustomFirebaseConfig {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  firestoreDatabaseId?: string;
}

// Check if user has explicitly supplied a fresh custom Firebase configuration
export function hasCustomFirebaseProject(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem('asv_custom_firebase_project');
    if (!saved) return false;
    const parsed = JSON.parse(saved);
    return Boolean(parsed.apiKey && parsed.projectId && parsed.appId);
  } catch {
    return false;
  }
}

export function getCustomFirebaseConfig(): CustomFirebaseConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('asv_custom_firebase_project');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (parsed.apiKey && parsed.projectId && parsed.appId) {
      return parsed;
    }
  } catch {}
  return null;
}

// Safe singleton instances only created when a valid custom project is provided
let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;

export function getFirebaseInstance(): { app: FirebaseApp | null; db: Firestore | null } {
  const customConfig = getCustomFirebaseConfig();
  if (!customConfig) {
    return { app: null, db: null };
  }

  if (!_app) {
    const apps = getApps();
    _app = apps.length > 0 ? getApp() : initializeApp(customConfig);
    _db = customConfig.firestoreDatabaseId ? getFirestore(_app, customConfig.firestoreDatabaseId) : getFirestore(_app);
  }

  return { app: _app, db: _db };
}
