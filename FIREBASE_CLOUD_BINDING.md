# Firebase Cloud Database Binding & Configuration

This document specifies the exact configuration, API credentials, and development prompt for binding the **Ayobami SAM Venture** web app with its live Google Cloud Firebase Firestore database.

---

## 1. System Prompt for Future AI & Development

Copy and use this prompt in any development turn, AI build tool, or deployment environment:

```text
You are developing for Ayobami SAM Venture (Balogun Market Fabrics & Tailoring).
This application is strictly bound to a live Google Cloud Firebase Firestore database.

DATABASE BINDING:
- Firebase Project ID: ferrous-alcove-xghtt
- Firestore Database ID: adebisi-store-live
- Auth Domain: ferrous-alcove-xghtt.firebaseapp.com
- Config File Path: /firebase-applet-config.json
- Collection Name for Products: "products"
- Collection Name for Orders: "orders"

RULES FOR DEVELOPMENT:
1. Always load configuration from "/firebase-applet-config.json".
2. Always initialize Firestore with the explicit database ID: 
   getFirestore(app, "adebisi-store-live").
3. Do not create mock offline fallbacks or remove Firestore connectivity.
4. When products or photos are added/edited in the Merchant Admin, sync them immediately to Firestore collection "products" using setDoc() with merge: true.
5. In-place photos are compressed client-side (under 50KB) and stored directly in the product document's "images" array for instant rendering on all customer devices.
```

---

## 2. Where the Configuration & API Key Is Bound

The binding file is located at the root of the project:
**`/firebase-applet-config.json`**

Current credentials in `/firebase-applet-config.json`:

```json
{
  "projectId": "ferrous-alcove-xghtt",
  "appId": "1:52216001947:web:91637a45940c14f4195d3e",
  "apiKey": "AIzaSyBfstXFNoGmWpVZm49rTtbH0xoo27F2e-E",
  "authDomain": "ferrous-alcove-xghtt.firebaseapp.com",
  "firestoreDatabaseId": "adebisi-store-live",
  "storageBucket": "ferrous-alcove-xghtt.firebasestorage.app",
  "messagingSenderId": "52216001947",
  "measurementId": "",
  "oAuthClientId": "52216001947-4o8cnqg3b09v405570b422quqc5k46l3.apps.googleusercontent.com",
  "recaptchaSiteKey": ""
}
```

---

## 3. How the Code Connects to Firebase

Located in **`/src/firebase.ts`**:

```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initializes Firebase with the credentials above
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Binds specifically to the 'adebisi-store-live' Firestore database
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || 'adebisi-store-live');
```

---

## 4. How to View Your Database in Firebase Console

1. Open the [Firebase Console](https://console.firebase.google.com).
2. Select the project: **`ferrous-alcove-xghtt`**.
3. In the left navigation menu, click **Firestore Database**.
4. In the top database selector, select **`adebisi-store-live`**.
5. You can view all saved products under the **`products`** collection.
6. To view your Web API key and App credentials:
   * Click the **Gear icon (⚙️) -> Project settings**.
   * Under the **General** tab, scroll down to **Your apps -> Web app**.
