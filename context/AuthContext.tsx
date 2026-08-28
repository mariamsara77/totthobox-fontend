"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-client";
import { User, setAuthUser } from "@/lib/auth";
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

interface JsonObject {
  [key: string]: unknown;
}

function asObject(value: unknown): JsonObject | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as JsonObject)
    : null;
}

function messageFrom(value: unknown, fallback: string): string {
  const object = asObject(value);
  const message = object?.message;
  return typeof message === "string" && message.trim() ? message : fallback;
}

function extractUser(data: unknown): User | null {
  const source = asObject(data);
  if (!source) return null;

  const candidateValue = source.user ?? source.data ?? data;
  const candidate = asObject(candidateValue);
  if (!candidate) return null;

  const id = candidate.id;
  const email = candidate.email;
  const name = candidate.name;

  if (
    (typeof id !== "number" && typeof id !== "string") ||
    typeof email !== "string" ||
    typeof name !== "string"
  ) {
    return null;
  }

  const numericId = Number(id);
  if (!Number.isSafeInteger(numericId) || numericId <= 0) return null;

  return { ...candidate, id: numericId, email, name } as User;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const mountedRef = useRef(false);
  const generationRef = useRef(0);
  const refreshControllerRef = useRef<AbortController | null>(null);
  const loginInProgressRef = useRef(false);

  const applyUser = useCallback((nextUser: User | null) => {
    setUser(nextUser);
    setAuthUser(nextUser);
  }, []);

  const invalidate = useCallback(() => {
    generationRef.current += 1;
    refreshControllerRef.current?.abort();
    refreshControllerRef.current = null;
    return generationRef.current;
  }, []);

  const clearAllClientState = useCallback(async () => {
    applyUser(null);
    clearClientAuthState();
    await clearClientCaches();
  }, [applyUser]);

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

      if (!mountedRef.current || generation !== generationRef.current) {
        return false;
      }

      if (response.status === 401) {
        applyUser(null);
        return false;
      }

      if (!response.ok) return false;

      const data: unknown = await response.json().catch(() => null);
      const nextUser = extractUser(data);

      if (!nextUser) {
        applyUser(null);
        return false;
      }

      applyUser(nextUser);
      return true;
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return false;
      }
      return false;
    } finally {
      if (refreshControllerRef.current === controller) {
        refreshControllerRef.current = null;
      }
    }
  }, [applyUser]);

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
      await clearAllClientState();
      window.location.replace("/login");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [clearAllClientState, invalidate]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      if (loginInProgressRef.current) {
        throw new ApiError("লগইন ইতিমধ্যে প্রক্রিয়াধীন।", 409);
      }

      loginInProgressRef.current = true;
      const generation = invalidate();

      try {
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

        const data: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          throw new ApiError(
            messageFrom(data, "লগইন ব্যর্থ হয়েছে"),
            response.status,
            data,
          );
        }

        if (generation !== generationRef.current) {
          throw new ApiError("লগইন সেশন পরিবর্তিত হয়েছে। আবার চেষ্টা করুন।", 409);
        }

        if (!(await refreshUser())) {
          invalidate();
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
            cache: "no-store",
          }).catch(() => undefined);
          throw new ApiError(
            "লগইনের পর বর্তমান ব্যবহারকারীর তথ্য পাওয়া যায়নি।",
            401,
          );
        }
      } finally {
        loginInProgressRef.current = false;
      }
    },
    [clearAllClientState, invalidate, refreshUser],
  );

  const logout = useCallback(async (): Promise<void> => {
    invalidate();
    applyUser(null);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
        keepalive: true,
      });
    } catch {
      // Local state is cleared even when the network is unavailable.
    } finally {
      await clearAllClientState();
    }

    if (typeof window !== "undefined") {
      window.location.replace("/login");
    } else {
      router.replace("/login");
    }
  }, [applyUser, clearAllClientState, invalidate, router]);

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
