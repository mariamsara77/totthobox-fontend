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

const extractUser = (data: any): User | null => {
  if (!data || typeof data !== "object") return null;
  const u = data.user || data.data || data;
  if (u && typeof u === "object" && (u.id || u.email || u.name)) {
    return u as User;
  }
  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isMounted = useRef(true);

  const refreshUser = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        const fetchedUser = extractUser(data);
        if (fetchedUser) {
          if (isMounted.current) setUser(fetchedUser);
          return true;
        }
      }

      if (isMounted.current) setUser(null);
      return false;
    } catch {
      if (isMounted.current) setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    const handleUnauthorized = () => {
      if (isMounted.current) setUser(null);
      const { pathname: currentPath } = window.location;
      if (currentPath !== "/login" && currentPath !== "/register") {
        fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
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
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [refreshUser]);

  // Re-read the authenticated user after client-side navigation. This keeps
  // the profile synchronized immediately after OTP registration because the
  // HttpOnly auth cookie is updated by the verify proxy while this provider
  // remains mounted.
  useEffect(() => {
    if (loading) return;
    void refreshUser();
  }, [pathname, loading, refreshUser]);

  const PROTECTED_ROUTES = ["/profile", "/messages", "/settings", "/dashboard", "/admin"];

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
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

      // /api/auth/me is the canonical source of the active account. Do not
      // rely on a potentially stale user object returned by the login API.
      const refreshed = await refreshUser();
      if (!refreshed) {
        throw new ApiError("লগইনের পর প্রোফাইল তথ্য পাওয়া যায়নি।", 401);
      }
    },
    [refreshUser]
  );

  const logout = useCallback(async (): Promise<void> => {
    if (isMounted.current) setUser(null);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
    } catch {
      // ignore
    }

    const currentPath = window.location.pathname;
    const isProtected = PROTECTED_ROUTES.some((route) =>
      currentPath.startsWith(route)
    );

    router.refresh();

    if (isProtected) {
      router.push("/login");
    }
  }, [router]);

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