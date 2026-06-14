import { api, setToken } from "@/lib/api";
import { create } from "zustand";

interface AppUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string | null;
  verified?: boolean;
  role?: "student" | "teacher" | "alumni" | "fresher" | "admin";
  mustChangePassword?: boolean;
}

type AuthState = {
  user: AppUser | null;
  initializing: boolean;
  error: string | null;
};
type AuthActions = {
  signIn: (identifier: string, password: string) => Promise<void>;
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
      // /api/auth/me returns the user object directly (not wrapped in { user })
      const user = await api.get<AppUser>("/api/auth/me");
      set({ user, initializing: false });
    } catch {
      setToken(null);
      set({ user: null, initializing: false });
    }
  },
  signIn: async (identifier, password) => {
    set({ error: null });
    try {
      // If identifier is 10 digits → student enrollment number
      // Otherwise → full email (teacher / alumni)
      const isEnrollment = /^\d{10}$/.test(identifier.trim());
      const loginPayload = isEnrollment
        ? { prn: identifier.trim(), password }
        : { email: identifier.trim(), password };

      const data = await api.post<{ user: AppUser; token: string }>(
        "/api/auth/login",
        loginPayload,
        { auth: false },
      );
      setToken(data.token);
      set({ user: data.user });
    } catch (e: any) {
      set({ error: e?.message ?? "Sign-in failed" });
      throw e;
    }
  },
  signOut: () => {
    setToken(null);
    set({ user: null });
  },
  clearError: () => set({ error: null }),
}));

export type { AppUser };

