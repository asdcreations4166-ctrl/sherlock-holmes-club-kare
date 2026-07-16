import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if minimum environment configuration is available
const isConfigAvailable = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
);

// Initialize Firebase with environment variables. 
// Uses non-functional safe structures during static build pre-rendering if variables are not yet injected.
const app = getApps().length === 0
  ? initializeApp(
      isConfigAvailable
        ? firebaseConfig
        : {
            apiKey: "build-placeholder-key",
            authDomain: "build-placeholder.firebaseapp.com",
            projectId: "build-placeholder",
            storageBucket: "build-placeholder.appspot.com",
            messagingSenderId: "000000000000",
            appId: "1:000000000000:web:000000000000",
          }
    )
  : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
