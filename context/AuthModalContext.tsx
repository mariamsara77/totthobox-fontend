"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
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

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
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
      await action();
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
      {isLoginModalOpen && (
        <LoginModal
          open
          reason={reason}
          onClose={closeLoginModal}
          onLoginSuccess={completeLogin}
        />
      )}
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
