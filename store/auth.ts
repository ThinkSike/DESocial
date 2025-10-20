import { auth } from "@/config/firebase";
import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  initializing: boolean;
  error: string | null;
};
type AuthActions = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

// Guard to avoid attaching the listener multiple times (HMR-safe)
let listenerAttached = false;

export const useAuthStore = create<AuthState & AuthActions>((set) => {
  // attach listener once at module init
  if (!listenerAttached) {
    listenerAttached = true;
    onAuthStateChanged(auth, (u) =>
      set({ user: u, initializing: false, error: null }),
    );
  }

  return {
    user: null,
    initializing: true,
    error: null,
    signIn: async (email, password) => {
      set({ error: null });
      try {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } catch (e: any) {
        set({ error: e?.message ?? "Sign-in failed" });
        throw e;
      }
    },
    signOut: async () => {
      await firebaseSignOut(auth);
    },
    clearError: () => set({ error: null }),
  };
});
