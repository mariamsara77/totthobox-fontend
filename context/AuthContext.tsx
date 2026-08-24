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
import { useRouter } from "next/navigation";
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

// Helper Function: ব্যাকএন্ডের বিভিন্ন ফরম্যাট থেকে সঠিক User অবজেক্ট এক্সট্র্যাক্ট করা
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
      const { pathname } = window.location;
      if (pathname !== "/login" && pathname !== "/register") {
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

  // প্রোটেক্টেড রাউটগুলির একটি লিস্ট (যেসব পেজে লগইন ছাড়া থাকা যাবে না)
const PROTECTED_ROUTES = ["/profile", "/messages", "/settings", "/dashboard", "/admin"];

// 1. Single-page reactive login (No Full Page Reload)
const login = useCallback(
  async (email: string, password: string): Promise<void> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
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

    // ক্লায়েন্ট সাইড স্টেট আপডেট (পেজ রিফ্রেশ ছাড়া প্রোফাইল চেঞ্জ হবে)
    const loggedInUser = extractUser(data);
    if (loggedInUser) {
      if (isMounted.current) setUser(loggedInUser);
    } else {
      await refreshUser();
    }

    // সার্ভার কম্পোনেন্টের ক্যাশ আপডেট (সিমলেস ব্যাকগ্রাউন্ড রিফ্রেশ)
   window.location.href = "/";
  },
  []
);

// 2. Smart Logout (Stay on Public Pages, Redirect on Protected Pages)
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

  // চেক করবে বর্তমান পেজটি প্রোটেক্টেড কি না
  const isProtected = PROTECTED_ROUTES.some((route) =>
    currentPath.startsWith(route)
  );

  router.refresh();

  // যদি প্রোটেক্টেড পেজ হয় তবে লগইন পেজে পাঠাবে, অন্যথায় বর্তমান পেজেই থাকবে
  if (isProtected) {
    router.push("/login");
  }
}, [router]);

  return (
  <AuthContext.Provider
    value={{
      user,
      loading,
      isLoading: loading,   // ← এটা যোগ করুন
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