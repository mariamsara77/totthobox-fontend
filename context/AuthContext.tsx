"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/lib/saved-profiles";

interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
  slug?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loading: boolean; // এটি যোগ করুন
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithRefresh: () => Promise<boolean>;
  logout: () => Promise<void>;
  mutateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const applyUser = useCallback((nextUser: User | null) => {
    setUser(nextUser);
    if (nextUser) {
      saveProfile({
        id: nextUser.id,
        name: nextUser.name,
        email: nextUser.email,
        slug: nextUser.slug,
        avatar_url: nextUser.avatar_url,
      });
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      applyUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [applyUser]);

  useEffect(() => {
    fetchUser();
    window.addEventListener("focus", fetchUser);
    return () => window.removeEventListener("focus", fetchUser);
  }, [fetchUser]);

  // ── Email + password login ─────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    applyUser(data.user);
  };

  // ── One-click saved profile login (refresh token) ──────────────────────
  // returns true = সফল, false = refresh token নেই/expired → UI password চাইবে
  const loginWithRefresh = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      const data = await res.json();
      if (!res.ok) return false;
      applyUser(data.user);
      return true;
    } catch {
      return false;
    }
  }, [applyUser]);

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    setUser(null);
    router.refresh(); // রিডাইরেক্ট না করে বর্তমান পেজটি রিফ্রেশ করবে
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loading: isLoading, // এটি যোগ করুন
        isLoggedIn: Boolean(user),
        login,
        loginWithRefresh,
        logout,
        mutateUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
