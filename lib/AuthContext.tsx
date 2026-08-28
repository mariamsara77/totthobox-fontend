"use client";

// lib/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────
// Global Auth State — app-wide user session management
// ─────────────────────────────────────────────────────────────────

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  fetchMe,
  getStoredUser,
  getToken,
  logoutApi,
  removeToken,
  setStoredUser,
  User,
} from "./auth";

// ─── Context Type ─────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUserFromToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // App load হলে stored token/user দিয়ে session restore করো
  useEffect(() => {
    const init = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      // প্রথমে cached user দেখাও (fast)
      const cached = getStoredUser();
      if (cached) setUser(cached);

      // তারপর fresh data নাও server থেকে
      try {
        const fresh = await fetchMe();
        setUser(fresh);
        setStoredUser(fresh);
      } catch {
        // Token expired বা invalid হলে clear করো
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  /** Google callback-এ token পেলে এটা call করো */
  const setUserFromToken = useCallback(async (token: string) => {
    const { setToken } = await import("./auth");
    setToken(token);

    const me = await fetchMe();
    setUser(me);
    setStoredUser(me);
  }, []);

  /** Logout */
  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
  }, []);

  /** Manually refresh user (profile update sonst) */
  const refreshUser = useCallback(async () => {
    try {
      const me = await fetchMe();
      setUser(me);
      setStoredUser(me);
    } catch {
      removeToken();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      setUserFromToken,
      logout,
      refreshUser,
    }),
    [user, loading, setUserFromToken, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
