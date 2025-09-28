// Firebase configuration for DESocial app
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

// Firebase configuration object - Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyB4WQWLBrUa7R1nUOEYtIlH9s9wqRF9buA",
  authDomain: "desocial-e18a6.firebaseapp.com",
  projectId: "desocial-e18a6",
  storageBucket: "desocial-e18a6.firebasestorage.app",
  messagingSenderId: "142157207751",
  appId: "1:142157207751:web:0f0cc3fc90d97b17c606e2",
  measurementId: "G-FY52C4HHK0"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
// Note: Firebase v9+ handles persistence automatically in React Native
// AsyncStorage is used automatically when available
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firebase Functions
const functions = getFunctions(app);

// Development emulator setup (uncomment for local development)
// if (__DEV__) {
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectFunctionsEmulator(functions, 'localhost', 5001);
// }

export { app, auth, db, functions, storage };

