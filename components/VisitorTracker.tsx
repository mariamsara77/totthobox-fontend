"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getTracker, trackPageView, startNavigation } from "@/lib/tracker";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://admin.totthobox.com/api";

export default function VisitorTracker() {
  const pathname = usePathname();

  const lastSynced = useRef<{
    isPwa: boolean | null;
    hasInstalled: boolean | null;
  }>({
    isPwa: null,
    hasInstalled: null,
  });

  const isSyncing = useRef(false);

  // ==========================================
  // Actual current PWA mode
  // ==========================================
  const getIsPwa = (): boolean => {
    if (typeof window === "undefined") return false;

    const isDisplayMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches;

    const isIosStandalone = (window.navigator as any).standalone === true;

    return isDisplayMode || isIosStandalone;
  };

  const getHasInstalled = (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("pwa_installed") === "true";
  };

  // ==========================================
  // Sync to Backend
  // ==========================================
  const syncPwaStatus = async (force = false) => {
    if (typeof window === "undefined") return;
    if (isSyncing.current) return;

    const isPWA = getIsPwa();
    const hasInstalled = getHasInstalled();

    if (
      !force &&
      lastSynced.current.isPwa === isPWA &&
      lastSynced.current.hasInstalled === hasInstalled
    ) {
      return;
    }

    isSyncing.current = true;

    console.log("[PWA] Syncing...", { isPWA, hasInstalled });

    try {
      const res = await fetch(`${API_BASE_URL}/tracking/sync-pwa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-App-Mode": isPWA ? "standalone" : "browser",
        },
        credentials: "include",
        body: JSON.stringify({
          is_pwa: isPWA,
          has_installed: hasInstalled,
        }),
      });

      const data = await res.json().catch(() => null);

      console.log("[PWA] Response:", {
        status: res.status,
        ok: res.ok,
        data,
      });

      if (res.ok) {
        lastSynced.current = {
          isPwa: isPWA,
          hasInstalled: hasInstalled,
        };
      } else {
        lastSynced.current = { isPwa: null, hasInstalled: null };
      }
    } catch (error: any) {
      console.error("[PWA] Fetch Error:", error?.message || error);
      lastSynced.current = { isPwa: null, hasInstalled: null };
    } finally {
      isSyncing.current = false;
    }
  };

  // ==========================================
  // Install + Display Mode + Hard Refresh Handling
  // ==========================================
  useEffect(() => {
    // Already in PWA mode → set sticky flag
    if (getIsPwa()) {
      localStorage.setItem("pwa_installed", "true");
    }

    // Real install event
    const handleAppInstalled = () => {
      console.log("[PWA] App installed");
      localStorage.setItem("pwa_installed", "true");
      lastSynced.current = { isPwa: null, hasInstalled: null };
      syncPwaStatus(true);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    // Display mode change
    const modes = ["standalone", "fullscreen", "minimal-ui"] as const;
    const mediaQueries = modes.map((m) =>
      window.matchMedia(`(display-mode: ${m})`),
    );

    const handleChange = () => {
      if (getIsPwa()) {
        localStorage.setItem("pwa_installed", "true");
      }
      lastSynced.current.isPwa = null;
      syncPwaStatus(true);
    };

    mediaQueries.forEach((mq) => mq.addEventListener("change", handleChange));

    // ========== Hard Refresh / pageshow handling ==========
    const handlePageShow = (event: PageTransitionEvent) => {
      // Hard refresh বা bfcache থেকে ফিরে এলে force sync
      console.log("[PWA] pageshow fired", { persisted: event.persisted });
      lastSynced.current = { isPwa: null, hasInstalled: null };
      setTimeout(() => syncPwaStatus(true), 300);
    };

    window.addEventListener("pageshow", handlePageShow);

    // Initial sync (একটু বেশি delay hard refresh-এর জন্য)
    const timer = setTimeout(() => {
      syncPwaStatus(true);
    }, 600);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("pageshow", handlePageShow);
      mediaQueries.forEach((mq) =>
        mq.removeEventListener("change", handleChange),
      );
    };
  }, []);

  // SPA navigation
  useEffect(() => {
    if (!pathname) return;
    const t = setTimeout(() => syncPwaStatus(), 250);
    return () => clearTimeout(t);
  }, [pathname]);

  // ==========================================
  // Existing tracker logic
  // ==========================================
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
