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
import { ApiError } from "@/lib/api-client";
import { User, setAuthUser } from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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
  return typeof object?.message === "string" && object.message.trim()
    ? object.message
    : fallback;
}

function extractUser(value: unknown): User | null {
  const source = asObject(value);
  if (!source) return null;

  const candidate = asObject(source.user ?? source.data ?? value);
  if (!candidate) return null;

  const id = Number(candidate.id);
  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    typeof candidate.name !== "string" ||
    typeof candidate.email !== "string"
  ) {
    return null;
  }

  return {
    id,
    name: candidate.name,
    email: candidate.email,
    slug: typeof candidate.slug === "string" ? candidate.slug : "",
    avatar_url:
      typeof candidate.avatar_url === "string" ? candidate.avatar_url : null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(false);
  const requestRef = useRef<AbortController | null>(null);
  const loginRef = useRef(false);

  const applyUser = useCallback((nextUser: User | null) => {
    setUser(nextUser);
    setAuthUser(nextUser);
  }, []);

  const refreshUser = useCallback(async (): Promise<boolean> => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
      });

      if (!mountedRef.current) return false;

      if (response.status === 401) {
        applyUser(null);
        return false;
      }

      if (!response.ok) return false;

      const payload = await response.json().catch(() => null);
      const nextUser = extractUser(payload);

      if (!nextUser) {
        applyUser(null);
        return false;
      }

      applyUser(nextUser);
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return false;
      }
      return false;
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
    }
  }, [applyUser]);

  useEffect(() => {
    mountedRef.current = true;
    void refreshUser().finally(() => {
      if (mountedRef.current) setLoading(false);
    });

    return () => {
      mountedRef.current = false;
      requestRef.current?.abort();
    };
  }, [refreshUser]);

  useEffect(() => {
    const handleUnauthorized = () => {
      applyUser(null);
      window.location.replace("/login");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [applyUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      if (loginRef.current) {
        throw new ApiError("লগইন ইতিমধ্যে প্রক্রিয়াধীন।", 409);
      }

      loginRef.current = true;
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({ email, password }),
        });

        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          throw new ApiError(
            messageFrom(payload, "লগইন ব্যর্থ হয়েছে।"),
            response.status,
            payload,
          );
        }

        if (!(await refreshUser())) {
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
            cache: "no-store",
          }).catch(() => undefined);
          throw new ApiError(
            "লগইনের পর ব্যবহারকারীর তথ্য যাচাই করা যায়নি।",
            502,
          );
        }
      } finally {
        loginRef.current = false;
      }
    },
    [refreshUser],
  );

  const logout = useCallback(async () => {
    applyUser(null);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Accept: "application/json" },
        credentials: "include",
        cache: "no-store",
        keepalive: true,
      });
    } finally {
      window.location.replace("/login");
    }
  }, [applyUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoading: loading,
        isLoggedIn: Boolean(user),
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
