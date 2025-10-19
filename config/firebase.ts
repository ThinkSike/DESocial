// config/firebase.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use the provided Firebase config (pre-provisioned in Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDMoC-SVMa_07albYuM4FvgyxyMxsKzW2o",
  authDomain: "desocial-59d43.firebaseapp.com",
  projectId: "desocial-59d43",
  storageBucket: "desocial-59d43.firebasestorage.app",
  messagingSenderId: "293972474683",
  appId: "1:293972474683:web:867f576daf141fed1a551e",
  measurementId: "G-J9F7GPY5NF",
};

const app = initializeApp(firebaseConfig);

// Use `initializeAuth` for React Native to specify persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
