import { create } from "zustand";
import { api, setToken } from "@/lib/api";

interface AppUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string | null;
  verified?: boolean;
}

type AuthState = {
  user: AppUser | null;
  initializing: boolean;
  error: string | null;
};
type AuthActions = {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: { email: string; password: string; username: string; displayName: string }) => Promise<void>;
  signOut: () => void;
  hydrate: () => Promise<void>;
  clearError: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  initializing: true,
  error: null,
  hydrate: async () => {
    try {
      const data = await api.get<{ user: AppUser }>("/api/auth/me");
      set({ user: data.user, initializing: false });
    } catch {
      setToken(null);
      set({ user: null, initializing: false });
    }
  },
  signIn: async (email, password) => {
    set({ error: null });
    try {
      const data = await api.post<{ user: AppUser; token: string }>(
        "/api/auth/login",
        { email: email.trim(), password },
        { auth: false },
      );
      setToken(data.token);
      set({ user: data.user });
    } catch (e: any) {
      set({ error: e?.message ?? "Sign-in failed" });
      throw e;
    }
  },
  signUp: async ({ email, password, username, displayName }) => {
    set({ error: null });
    try {
      const data = await api.post<{ user: AppUser; token: string }>(
        "/api/auth/register",
        { email: email.trim(), password, username, displayName },
        { auth: false },
      );
      setToken(data.token);
      set({ user: data.user });
    } catch (e: any) {
      set({ error: e?.message ?? "Registration failed" });
      throw e;
    }
  },
  signOut: () => {
    setToken(null);
    set({ user: null });
  },
  clearError: () => set({ error: null }),
}));
