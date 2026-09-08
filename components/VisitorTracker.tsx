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
  // 1. Actual current PWA mode (কখনো sticky না)
  // ==========================================
  const getIsPwa = (): boolean => {
    if (typeof window === "undefined") return false;

    // শুধুমাত্র real display mode
    const isDisplayMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches;

    // iOS Safari
    const isIosStandalone = (window.navigator as any).standalone === true;

    return isDisplayMode || isIosStandalone;
  };

  // ==========================================
  // 2. Sticky install flag
  // ==========================================
  const getHasInstalled = (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("pwa_installed") === "true";
  };

  // ==========================================
  // 3. Sync to Backend
  // ==========================================
  const syncPwaStatus = async (force = false) => {
    if (typeof window === "undefined") return;
    if (isSyncing.current) return;

    const isPWA = getIsPwa(); // actual current status
    const hasInstalled = getHasInstalled(); // sticky flag

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
  // 4. Install + Display Mode Listeners
  // ==========================================
  useEffect(() => {
    // A. যদি ইতিমধ্যে standalone mode-এ থাকে → flag সেট করো
    if (getIsPwa()) {
      localStorage.setItem("pwa_installed", "true");
    }

    // B. appinstalled event (real install)
    const handleAppInstalled = () => {
      console.log("[PWA] App installed event fired");
      localStorage.setItem("pwa_installed", "true");
      lastSynced.current = { isPwa: null, hasInstalled: null };
      syncPwaStatus(true);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    // C. Initial sync
    const timer = setTimeout(() => {
      syncPwaStatus(true);
    }, 400);

    // D. display-mode পরিবর্তন হলে re-sync
    const modes = ["standalone", "fullscreen", "minimal-ui"] as const;
    const mediaQueries = modes.map((m) =>
      window.matchMedia(`(display-mode: ${m})`),
    );

    const handleChange = () => {
      // যদি নতুন করে standalone হয়ে যায় → flag সেট
      if (getIsPwa()) {
        localStorage.setItem("pwa_installed", "true");
      }

      lastSynced.current.isPwa = null;
      syncPwaStatus(true);
    };

    mediaQueries.forEach((mq) => mq.addEventListener("change", handleChange));

    return () => {
      clearTimeout(timer);
      window.removeEventListener("appinstalled", handleAppInstalled);
      mediaQueries.forEach((mq) =>
        mq.removeEventListener("change", handleChange),
      );
    };
  }, []);

  // SPA navigation → light re-check
  useEffect(() => {
    if (!pathname) return;
    const t = setTimeout(() => syncPwaStatus(), 250);
    return () => clearTimeout(t);
  }, [pathname]);

  // ==========================================
  // Existing tracker logic (অপরিবর্তিত)
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
