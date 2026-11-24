"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface NotificationModalContextType {
  isNotificationOpen: boolean;
  openNotificationModal: () => void;
  closeNotificationModal: () => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

const NotificationModalContext = createContext<
  NotificationModalContextType | undefined
>(undefined);

export function NotificationModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const openNotificationModal = useCallback(
    () => setIsNotificationOpen(true),
    [],
  );
  const closeNotificationModal = useCallback(
    () => setIsNotificationOpen(false),
    [],
  );

  return (
    <NotificationModalContext.Provider
      value={{
        isNotificationOpen,
        openNotificationModal,
        closeNotificationModal,
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </NotificationModalContext.Provider>
  );
}

export function useNotificationModal() {
  const context = useContext(NotificationModalContext);
  if (!context) {
    throw new Error(
      "useNotificationModal must be used within NotificationModalProvider",
    );
  }
  return context;
}
