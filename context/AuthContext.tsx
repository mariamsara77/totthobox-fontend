"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-client";
import { User } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function extractUser(data: unknown): User | null {
  if (!data || typeof data !== "object") return null;
  const value = data as Record<string, unknown>;
  const candidate = value.user ?? value.data ?? value;
  if (!candidate || typeof candidate !== "object") return null;
  const user = candidate as Record<string, unknown>;
  if (typeof user.id !== "number" && typeof user.email !== "string") return null;
  return user as unknown as User;
}

const PROTECTED_ROUTES = ["/profile", "/messages", "/settings", "/dashboard", "/admin"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useRef(false);
  const requestId = useRef(0);

  const refreshUser = useCallback(async (): Promise<boolean> => {
    const id = ++requestId.current;
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: { Accept: "application/json", "Cache-Control": "no-store" },
        credentials: "include",
        cache: "no-store",
      });
      if (id !== requestId.current) return false;
      if (!res.ok) {
        if (mounted.current) setUser(null);
        return false;
      }
      const currentUser = extractUser(await res.json());
      if (!currentUser) {
        if (mounted.current) setUser(null);
        return false;
      }
      if (mounted.current) setUser(currentUser);
      return true;
    } catch {
      if (id === requestId.current && mounted.current) setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void refreshUser().finally(() => {
      if (mounted.current) setLoading(false);
    });
    const handleUnauthorized = () => {
      requestId.current += 1;
      if (mounted.current) setUser(null);
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        void fetch("/api/auth/logout", { method: "POST", credentials: "include", cache: "no-store" });
        window.location.replace("/login");
      }
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      mounted.current = false;
      requestId.current += 1;
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [refreshUser]);

  useEffect(() => {
    if (!loading) void refreshUser();
  }, [pathname, loading, refreshUser]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    requestId.current += 1;
    if (mounted.current) setUser(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(data?.message || "লগইন ব্যর্থ হয়েছে", res.status, data);

    requestId.current += 1;
    const authenticated = await refreshUser();
    if (!authenticated) throw new ApiError("লগইনের পর authenticated profile পাওয়া যায়নি।", 401);
    router.refresh();
  }, [refreshUser, router]);

  const logout = useCallback(async (): Promise<void> => {
    requestId.current += 1;
    if (mounted.current) setUser(null);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
    } finally {
      requestId.current += 1;
    }
    const isProtected = PROTECTED_ROUTES.some((route) => window.location.pathname.startsWith(route));
    router.refresh();
    if (isProtected) router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, isLoading: loading, isLoggedIn: Boolean(user), login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
