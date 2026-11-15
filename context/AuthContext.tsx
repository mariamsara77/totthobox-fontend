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
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithRefresh: () => Promise<boolean>;
  logout: () => Promise<void>;
  mutateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "totthobox_auth_user_cache";
const AUTH_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getStoredAuth(): { user: User | null } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.timestamp === "number" &&
      Date.now() - parsed.timestamp < AUTH_CACHE_TTL
    ) {
      return { user: parsed.user ?? null };
    }
  } catch {
    // sessionStorage disabled or unavailable
  }
  return null;
}

function storeAuth(user: User | null) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ user, timestamp: Date.now() }),
    );
  } catch {
    // ignore
  }
}

function clearStoredAuth() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

function broadcastAuthSync(action: "login" | "logout" | "sync") {
  if (typeof window === "undefined") return;
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel("totthobox-auth");
      channel.postMessage({ type: "auth-sync", action, timestamp: Date.now() });
      channel.close();
    }
  } catch {
    // BroadcastChannel unsupported
  }
  try {
    localStorage.setItem(
      "totthobox_auth_sync",
      JSON.stringify({ action, timestamp: Date.now() }),
    );
  } catch {
    // localStorage unsupported
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const lastFetchAt = useRef(0);

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

  const fetchUser = useCallback(
    async (force = false) => {
      const now = Date.now();
      // If not forced, check sessionStorage cache and visibility
      if (!force) {
        if (
          typeof document !== "undefined" &&
          document.visibilityState !== "visible"
        ) {
          return;
        }
        const cached = getStoredAuth();
        if (cached !== null) {
          applyUser(cached.user);
          setIsLoading(false);
          return;
        }
        if (lastFetchAt.current && now - lastFetchAt.current < 60000) {
          return;
        }
      }

      lastFetchAt.current = now;
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json().catch(() => null);
          const nextUser = data?.user ?? null;
          applyUser(nextUser);
          storeAuth(nextUser);
        } else if (res.status === 401) {
          applyUser(null);
          clearStoredAuth();
        }
      } catch {
        // Retain existing state on transient failure
      } finally {
        setIsLoading(false);
      }
    },
    [applyUser],
  );

  useEffect(() => {
    // Immediate hydration from cache if present
    const cached = getStoredAuth();
    if (cached !== null) {
      applyUser(cached.user);
      setIsLoading(false);
    } else {
      void fetchUser(true);
    }

    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        void fetchUser(false);
      }
    };

    window.addEventListener("focus", handleFocus);

    // Cross-tab / cross-window synchronization
    let broadcastChannel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        broadcastChannel = new BroadcastChannel("totthobox-auth");
        broadcastChannel.onmessage = (event) => {
          if (
            event.data?.type === "auth-sync" ||
            event.data?.type === "github-auth-success"
          ) {
            clearStoredAuth();
            void fetchUser(true);
          }
        };
      } catch {
        broadcastChannel = null;
      }
    }

    const handleStorageEvent = (event: StorageEvent) => {
      if (
        event.key === "totthobox_auth_sync" ||
        event.key === "totthobox_auth_event"
      ) {
        clearStoredAuth();
        void fetchUser(true);
      }
    };
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorageEvent);
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, [applyUser, fetchUser]);

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
    storeAuth(data.user);
    broadcastAuthSync("login");
  };

  // ── One-click saved profile login (refresh token) ──────────────────────
  const loginWithRefresh = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      const data = await res.json();
      if (!res.ok) return false;
      applyUser(data.user);
      storeAuth(data.user);
      broadcastAuthSync("login");
      return true;
    } catch {
      return false;
    }
  }, [applyUser]);

  // ── Logout ─────────────────────────────────────────────────────────────
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    clearStoredAuth();
    applyUser(null);
    broadcastAuthSync("logout");
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loading: isLoading,
        isLoggedIn: Boolean(user),
        login,
        loginWithRefresh,
        logout,
        mutateUser: async () => {
          clearStoredAuth();
          await fetchUser(true);
          broadcastAuthSync("sync");
        },
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
