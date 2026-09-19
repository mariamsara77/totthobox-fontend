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
import { useAuth } from "@/context/AuthContext";
import LoginModal from "@/components/auth/LoginModal";

type LoginModalOptions = {
  reason?: string;
  onSuccess?: () => void | Promise<void>;
};

type AuthModalContextValue = {
  isLoginModalOpen: boolean;
  openLoginModal: (options?: LoginModalOptions) => void;
  closeLoginModal: () => void;
  requireAuth: (
    onAuthenticated?: () => void | Promise<void>,
    reason?: string,
  ) => boolean;
};

const AuthModalContext = createContext<AuthModalContextValue | undefined>(
  undefined,
);

function getSafeReturnTo(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [reason, setReason] = useState<string | undefined>();
  const pendingActionRef = useRef<(() => void | Promise<void>) | undefined>();

  const openLoginModal = useCallback((options?: LoginModalOptions) => {
    pendingActionRef.current = options?.onSuccess;
    setReason(options?.reason);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    pendingActionRef.current = undefined;
    setReason(undefined);
    setIsLoginModalOpen(false);
  }, []);

  const completeLogin = useCallback(async () => {
    const action = pendingActionRef.current;
    pendingActionRef.current = undefined;
    setReason(undefined);
    setIsLoginModalOpen(false);

    if (action) {
      try {
        await action();
      } catch (error) {
        console.error("Pending authenticated action failed:", error);
      }
    }
  }, []);

  const requireAuth = useCallback(
    (
      onAuthenticated?: () => void | Promise<void>,
      authReason?: string,
    ) => {
      if (isLoggedIn) return true;

      openLoginModal({
        reason: authReason,
        onSuccess: onAuthenticated,
      });
      return false;
    },
    [isLoggedIn, openLoginModal],
  );

  useEffect(() => {
    if (isLoggedIn || typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("login") !== "required") return;

    const returnTo = getSafeReturnTo(params.get("returnTo"));

    openLoginModal({
      reason: "এই পেজটি দেখতে লগইন করতে হবে।",
      onSuccess: returnTo ? () => router.push(returnTo) : undefined,
    });

    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("login");
    cleanUrl.searchParams.delete("returnTo");
    window.history.replaceState(
      {},
      "",
      cleanUrl.pathname + cleanUrl.search + cleanUrl.hash,
    );
  }, [isLoggedIn, openLoginModal, router]);

  return (
    <AuthModalContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        requireAuth,
      }}
    >
      {children}
      <LoginModal
        open={isLoginModalOpen}
        reason={reason}
        onClose={closeLoginModal}
        onLoginSuccess={completeLogin}
      />
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return context;
};
