"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getTracker, trackPageView, startNavigation } from "@/lib/tracker";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://admin.totthobox.com/api";

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastSyncedPwa = useRef<boolean | null>(null);
  const isSyncing = useRef(false);

  const getIsPwa = (): boolean => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    );
  };

  const syncPwaStatus = async (force = false) => {
    if (isSyncing.current) return;

    const isPWA = getIsPwa();
    if (!force && lastSyncedPwa.current === isPWA) return;

    isSyncing.current = true;

    console.log("[PWA] Trying to sync...", {
      isPWA,
      url: `${API_BASE_URL}/tracking/sync-pwa`,
    });

    try {
      const res = await fetch(`${API_BASE_URL}/tracking/sync-pwa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-App-Mode": isPWA ? "standalone" : "browser",
        },
        credentials: "include",
        body: JSON.stringify({ is_pwa: isPWA }),
      });

      const data = await res.json().catch(() => null);

      console.log("[PWA] Response:", {
        status: res.status,
        ok: res.ok,
        data,
        headers: Object.fromEntries(res.headers.entries()),
      });

      if (res.ok) {
        lastSyncedPwa.current = isPWA;
      } else {
        lastSyncedPwa.current = null;
      }
    } catch (error: any) {
      console.error("[PWA] Fetch Error:", error?.message || error);
      lastSyncedPwa.current = null;
    } finally {
      isSyncing.current = false;
    }
  };

  // Initial + display-mode change
  useEffect(() => {
    // একটু delay দিয়ে চালাই যাতে cookie/session set হয়ে যায়
    const timer = setTimeout(() => {
      syncPwaStatus(true);
    }, 300);

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = () => {
      lastSyncedPwa.current = null;
      syncPwaStatus(true);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Pathname change হলেও একবার চেক (SPA navigation)
  useEffect(() => {
    if (!pathname) return;
    // হালকা delay
    const t = setTimeout(() => syncPwaStatus(), 200);
    return () => clearTimeout(t);
  }, [pathname]);

  // ========== Existing tracker logic (অপরিবর্তিত) ==========
  useEffect(() => {
    getTracker().init();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    const timer = window.setTimeout(() => {
      trackPageView(pathname);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;

      if (
        anchor.href &&
        anchor.origin === window.location.origin &&
        !anchor.target &&
        !anchor.hasAttribute("download") &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        !event.altKey
      ) {
        startNavigation();
      }
    };

    document.addEventListener("click", onClick, {
      capture: true,
      passive: true,
    });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    const onPopState = () => startNavigation();
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return null;
}
