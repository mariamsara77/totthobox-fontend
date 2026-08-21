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
import {
  User,
  getToken,
  setToken,
  removeToken,
  fetchCurrentUser,
  logoutRequest,
  isAuthenticated,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isMounted = useRef(false);

  // Component mount হয়েছে কিনা ট্র্যাক করি
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const refreshUser = useCallback(async () => {
    const currentUser = await fetchCurrentUser();

    // শুধুমাত্র component এখনো mounted থাকলে state আপডেট করব
    if (isMounted.current) {
      setUser(currentUser);
    }
  }, []);

  // App load হলে অটো চেক
  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated()) {
        if (isMounted.current) {
          setLoading(false);
        }
        return;
      }

      await refreshUser();

      if (isMounted.current) {
        setLoading(false);
      }
    };

    init();
  }, [refreshUser]);

  const login = useCallback(
    async (token: string) => {
      setToken(token);

      if (isMounted.current) {
        setLoading(true);
      }

      await refreshUser();

      if (isMounted.current) {
        setLoading(false);
      }
    },
    [refreshUser],
  );

  const logout = useCallback(async () => {
    await logoutRequest();
    removeToken();

    if (isMounted.current) {
      setUser(null);
    }

    router.push("/login");
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
