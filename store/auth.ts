import { create } from "zustand";
import { auth } from "@/config/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
  type Unsubscribe,
} from "firebase/auth";

type AuthState = {
  user: User | null;
  initializing: boolean;
  error: string | null;
};

type AuthActions = {
  bootstrap: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

let listenerAttached = false;
let unsubscribeAuth: Unsubscribe | null = null;

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  initializing: true,
  error: null,

  bootstrap: () => {
    if (listenerAttached) return;
    listenerAttached = true;

    unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      set({ user: u, initializing: false, error: null });
    });
  },

  signIn: async (email, password) => {
    set({ error: null });
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e: any) {
      const message = e?.message ?? "Sign-in failed";
      set({ error: message });
      throw e;
    }
  },

  signOut: async () => {
    await firebaseSignOut(auth);
  },

  clearError: () => set({ error: null }),
}));

// Optional: call this to detach the listener if you ever need to tear down manually.
export function detachAuthListener() {
  if (unsubscribeAuth) {
    unsubscribeAuth();
    unsubscribeAuth = null;
    listenerAttached = false;
  }
}
