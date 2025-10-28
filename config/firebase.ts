import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDMoC-SVMa_07albYuM4FvgyxyMxsKzW2o",
  authDomain: "desocial-59d43.firebaseapp.com",
  projectId: "desocial-59d43",
  storageBucket: "desocial-59d43.firebasestorage.app",
  messagingSenderId: "293972474683",
  appId: "1:293972474683:web:867f576daf141fed1a551e",
  measurementId: "G-J9F7GPY5NF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Platform-specific auth initialization
let auth;

if (Platform.OS === "web") {
  // For web, use the default getAuth which uses browserLocalPersistence
  auth = getAuth(app);
} else {
  // For mobile (iOS/Android), use AsyncStorage persistence
  const { getReactNativePersistence } = require("firebase/auth");
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;

  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Initialize Analytics (only on web)
let analytics;
if (Platform.OS === "web") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { auth, db, storage, analytics };
