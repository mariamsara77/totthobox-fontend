"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";

type SidebarContextType = {
  isOpen: boolean; // mobile overlay
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean; // desktop icon-only mode
  setIsCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Hydration + localStorage থেকে collapsed state load
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setIsCollapsed(true);
  }, []);

  // Route change হলে mobile sidebar বন্ধ
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  // SSR mismatch এড়াতে mounted না হলে default
  const value: SidebarContextType = {
    isOpen,
    setIsOpen,
    isCollapsed: mounted ? isCollapsed : false,
    setIsCollapsed,
    toggleCollapsed,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
};