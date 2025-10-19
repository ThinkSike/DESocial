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
  bootstrap: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

let listenerAttached = false;

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  initializing: true,
  error: null,
  bootstrap: () => {
    if (listenerAttached) return;
    listenerAttached = true;
    onAuthStateChanged(auth, (u) =>
      set({ user: u, initializing: false, error: null }),
    );
  },
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
}));
