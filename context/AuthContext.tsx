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

function extractUser(data: unknown): User | null {
  if (!data || typeof data !== "object") return null;

  const source = data as Record<string, unknown>;
  const candidateValue = source.user ?? source.data ?? data;
  if (!candidateValue || typeof candidateValue !== "object") return null;

  const candidate = candidateValue as Record<string, unknown>;
  if (!candidate.id || !candidate.email || !candidate.name) return null;

  return candidate as unknown as User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const mountedRef = useRef(false);
  const generationRef = useRef(0);
  const refreshControllerRef = useRef<AbortController | null>(null);
  const loginInProgressRef = useRef(false);

  const invalidate = useCallback(() => {
    generationRef.current += 1;
    refreshControllerRef.current?.abort();
    refreshControllerRef.current = null;
    return generationRef.current;
  }, []);

  const clearAllClientState = useCallback(async () => {
    clearClientAuthState();
    await clearClientCaches();
  }, []);

  const refreshUser = useCallback(async (): Promise<boolean> => {
    const generation = generationRef.current;

    refreshControllerRef.current?.abort();
    const controller = new AbortController();
    refreshControllerRef.current = controller;

    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
      });

      if (!mountedRef.current || generation !== generationRef.current) return false;

      if (response.status === 401) {
        setUser(null);
        return false;
      }

      if (!response.ok) return false;

      const data = await response.json().catch(() => null);
      const nextUser = extractUser(data);

      if (!nextUser) {
        setUser(null);
        return false;
      }

      setUser(nextUser);
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return false;
      return false;
    } finally {
      if (refreshControllerRef.current === controller) {
        refreshControllerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    void (async () => {
      await refreshUser();
      if (mountedRef.current) setLoading(false);
    })();

    return () => {
      mountedRef.current = false;
      refreshControllerRef.current?.abort();
    };
  }, [refreshUser]);

  useEffect(() => {
    const handleUnauthorized = async () => {
      invalidate();
      setUser(null);
      await clearAllClientState();
      window.location.replace("/login");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [clearAllClientState, invalidate]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      if (loginInProgressRef.current) {
        throw new ApiError("লগইন ইতিমধ্যে প্রক্রিয়াধীন।", 409);
      }

      loginInProgressRef.current = true;
      const generation = invalidate();

      try {
        setUser(null);
        await clearAllClientState();

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new ApiError(data?.message || "লগইন ব্যর্থ হয়েছে", response.status, data);
        }

        if (generation !== generationRef.current) {
          throw new ApiError("লগইন সেশন পরিবর্তিত হয়েছে। আবার চেষ্টা করুন।", 409);
        }

        // The login response is never used as the profile source. The current
        // user is always resolved from the newly-created HttpOnly cookie.
        const authenticated = await refreshUser();

        if (!authenticated || generation !== generationRef.current) {
          invalidate();
          setUser(null);
          await clearAllClientState();
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
            cache: "no-store",
          }).catch(() => {});
          throw new ApiError("লগইনের পর বর্তমান ব্যবহারকারীর তথ্য পাওয়া যায়নি।", 401);
        }
      } finally {
        loginInProgressRef.current = false;
      }
    },
    [clearAllClientState, invalidate, refreshUser]
  );

  const logout = useCallback(async (): Promise<void> => {
    invalidate();
    setUser(null);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
        keepalive: true,
      });
    } catch {
      // Local state is still cleared below.
    } finally {
      await clearAllClientState();
    }

    // Hard navigation destroys the current React tree and Next.js client/RSC
    // router state, preventing the previous account from being reused.
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    } else {
      router.replace("/login");
    }
  }, [clearAllClientState, invalidate, router]);

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
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
