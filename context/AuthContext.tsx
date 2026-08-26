"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-client";
import { User } from "@/lib/auth";
import { clearClientAuthState, clearClientCaches } from "@/lib/auth-storage";

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

const extractUser = (data: unknown): User | null => {
  if (!data || typeof data !== "object") return null;
  const source = data as Record<string, unknown>;
  const u = source.user ?? source.data ?? data;
  if (u && typeof u === "object") {
    const candidate = u as Record<string, unknown>;
    if (candidate.id || candidate.email || candidate.name) return candidate as unknown as User;
  }
  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useRef(true);
  const authGeneration = useRef(0);
  const refreshController = useRef<AbortController | null>(null);

  const invalidateAuthGeneration = useCallback(() => {
    authGeneration.current += 1;
    refreshController.current?.abort();
    refreshController.current = null;
    return authGeneration.current;
  }, []);

  const resetClientAuthState = useCallback(async () => {
    clearClientAuthState();
    await clearClientCaches();
  }, []);

  const refreshUser = useCallback(async (): Promise<boolean> => {
    const generation = authGeneration.current;
    refreshController.current?.abort();
    const controller = new AbortController();
    refreshController.current = controller;

    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        credentials: "include",
        signal: controller.signal,
      });

      if (!isMounted.current || generation !== authGeneration.current) return false;

      if (res.ok) {
        const data = await res.json();
        const fetchedUser = extractUser(data);
        if (fetchedUser) {
          setUser(fetchedUser);
          return true;
        }
      }

      setUser(null);
      return false;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return false;
      if (isMounted.current && generation === authGeneration.current) setUser(null);
      return false;
    } finally {
      if (refreshController.current === controller) refreshController.current = null;
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    const handleUnauthorized = () => {
      invalidateAuthGeneration();
      if (isMounted.current) setUser(null);
      void resetClientAuthState();

      const { pathname: currentPath } = window.location;
      if (currentPath !== "/login" && currentPath !== "/register") {
        fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        }).catch(() => {});
        window.location.replace("/login");
      }
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    (async () => {
      await refreshUser();
      if (isMounted.current) setLoading(false);
    })();

    return () => {
      isMounted.current = false;
      refreshController.current?.abort();
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [refreshUser, invalidateAuthGeneration, resetClientAuthState]);

  useEffect(() => {
    if (loading) return;
    void refreshUser();
  }, [pathname, loading, refreshUser]);

  const PROTECTED_ROUTES = ["/profile", "/messages", "/settings", "/dashboard", "/admin"];

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      invalidateAuthGeneration();
      setUser(null);
      await resetClientAuthState();

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new ApiError(
          data?.message || "লগইন ব্যর্থ হয়েছে",
          res.status,
          data
        );
      }

      const generation = authGeneration.current;
      const refreshed = await refreshUser();
      if (generation !== authGeneration.current) {
        throw new ApiError("লগইন সেশন পরিবর্তিত হয়েছে। আবার চেষ্টা করুন।", 409);
      }

      if (!refreshed) {
        invalidateAuthGeneration();
        setUser(null);
        await resetClientAuthState();
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        }).catch(() => {});
        throw new ApiError("লগইনের পর প্রোফাইল তথ্য পাওয়া যায়নি।", 401);
      }
    },
    [invalidateAuthGeneration, refreshUser, resetClientAuthState]
  );

  const logout = useCallback(async (): Promise<void> => {
    invalidateAuthGeneration();
    setUser(null);
    await resetClientAuthState();

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
    } catch {
      // Local session remains cleared even if Laravel is unavailable.
    }

    const currentPath = window.location.pathname;
    const isProtected = PROTECTED_ROUTES.some((route) =>
      currentPath.startsWith(route)
    );

    router.refresh();

    if (isProtected) {
      router.replace("/login");
    }
  }, [invalidateAuthGeneration, resetClientAuthState, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoading: loading,
        isLoggedIn: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
