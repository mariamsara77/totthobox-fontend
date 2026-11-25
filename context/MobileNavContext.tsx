"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface MobileNavContextValue {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  isSavedOpen: boolean;
  openSaved: () => void;
  closeSaved: () => void;
}

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);

  const openDrawer = useCallback(() => {
    setIsSavedOpen(false);
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const openSaved = useCallback(() => {
    setIsDrawerOpen(false);
    setIsSavedOpen(true);
  }, []);

  const closeSaved = useCallback(() => {
    setIsSavedOpen(false);
  }, []);

  useEffect(() => {
    setIsDrawerOpen(false);
    setIsSavedOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isDrawerOpen || isSavedOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, isSavedOpen]);

  return (
    <MobileNavContext.Provider
      value={{
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        isSavedOpen,
        openSaved,
        closeSaved,
      }}
    >
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav(): MobileNavContextValue {
  const ctx = useContext(MobileNavContext);
  if (!ctx) {
    return {
      isDrawerOpen: false,
      openDrawer: () => {},
      closeDrawer: () => {},
      isSavedOpen: false,
      openSaved: () => {},
      closeSaved: () => {},
    };
  }
  return ctx;
}
