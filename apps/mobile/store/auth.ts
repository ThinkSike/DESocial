import { api, setToken } from "@/lib/api";
import { create } from "zustand";

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
  signIn: (prn: string, password: string) => Promise<void>;
  signUp: (data: { prn: string; password: string; username: string; displayName: string }) => Promise<void>;
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
  signIn: async (prn, password) => {
    set({ error: null });
    try {
      const data = await api.post<{ user: AppUser; token: string }>(
        "/api/auth/login",
        { prn: prn.trim(), password },
        { auth: false },
      );
      setToken(data.token);
      set({ user: data.user });
    } catch (e: any) {
      set({ error: e?.message ?? "Sign-in failed" });
      throw e;
    }
  },
  signUp: async ({ prn, password, username, displayName }) => {
    set({ error: null });
    try {
      const data = await api.post<{ user: AppUser; token: string }>(
        "/api/auth/register",
        { prn: prn.trim(), password, username, displayName },
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
