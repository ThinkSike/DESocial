// Firebase configuration for DESocial app
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import {
    CACHE_SIZE_UNLIMITED,
    enableNetwork,
    Firestore,
    getFirestore,
    initializeFirestore
} from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

// Firebase configuration object - Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyB4WQWLBrUa7R1nUOEYtIlH9s9wqRF9buA",
  authDomain: "desocial-e18a6.firebaseapp.com",
  databaseURL: "https://desocial-e18a6-default-rtdb.firebaseio.com",
  projectId: "desocial-e18a6",
  storageBucket: "desocial-e18a6.firebasestorage.app",
  messagingSenderId: "142157207751",
  appId: "1:142157207751:web:0f0cc3fc90d97b17c606e2",
  measurementId: "G-FY52C4HHK0"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore with optimized settings for faster loading
let db: Firestore;
try {
  db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    experimentalForceLongPolling: false, // Disable force long polling for better performance
    // Enable offline persistence for instant loading
    localCache: {
      kind: 'persistent'
    }
  });
} catch {
  // Fallback if already initialized
  db = getFirestore(app);
  console.warn('Firestore already initialized, using existing instance');
}

// Improved network connectivity handling
const enableFirestoreNetwork = async () => {
  try {
    await enableNetwork(db);
    console.log('Firestore network enabled successfully');
  } catch (error: any) {
    if (error.code !== 'failed-precondition') {
      console.warn('Firebase network enable failed:', error.message);
    }
  }
};

// Enable network with retry logic
let networkRetryCount = 0;
const maxNetworkRetries = 3;

const initializeNetworkWithRetry = () => {
  enableFirestoreNetwork().catch((error) => {
    networkRetryCount++;
    if (networkRetryCount < maxNetworkRetries) {
      console.log(`Retrying network initialization (${networkRetryCount}/${maxNetworkRetries})`);
      setTimeout(initializeNetworkWithRetry, 2000);
    } else {
      console.warn('Failed to initialize Firestore network after retries');
    }
  });
};

// Initialize network
initializeNetworkWithRetry();

// Initialize Firebase Functions
const functions = getFunctions(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Realtime Database
const database = getDatabase(app);

// Export the initialized services
export { app, auth, database, db, functions, storage };

