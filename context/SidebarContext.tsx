"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import { useAppearance } from "@/context/AppearanceContext";

type SidebarContextType = {
  isOpen: boolean; // mobile overlay
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean; // desktop icon-only mode
  setIsCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

const AUTO_RAIL_BREAKPOINT = 1280;

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [autoCollapsed, setAutoCollapsed] = useState(false);
  const pathname = usePathname();
  const { sidebarStyle, setSidebarStyle, mounted } = useAppearance();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => {
      setAutoCollapsed(window.innerWidth < AUTO_RAIL_BREAKPOINT);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isCollapsed = !mounted
    ? false
    : sidebarStyle === "rail"
      ? true
      : sidebarStyle === "expanded"
        ? false
        : autoCollapsed;

  const setIsCollapsed = useCallback(
    (collapsed: boolean) => {
      setSidebarStyle(collapsed ? "rail" : "expanded");
    },
    [setSidebarStyle],
  );

  const toggleCollapsed = useCallback(() => {
    setSidebarStyle(isCollapsed ? "expanded" : "rail");
  }, [isCollapsed, setSidebarStyle]);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isCollapsed,
        setIsCollapsed,
        toggleCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
};
