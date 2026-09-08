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
  // Actual current PWA mode (কখনো sticky না)
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

    // যদি already same status sync করা থাকে এবং force না হয় → স্কিপ
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
  // Main Effect - সব event handle করে
  // ==========================================
  useEffect(() => {
    // 1. যদি এখনই PWA mode-এ থাকে → sticky flag সেট
    if (getIsPwa()) {
      localStorage.setItem("pwa_installed", "true");
    }

    // 2. Real install event
    const handleAppInstalled = () => {
      console.log("[PWA] App installed event");
      localStorage.setItem("pwa_installed", "true");
      lastSynced.current = { isPwa: null, hasInstalled: null };
      syncPwaStatus(true);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    // 3. Display mode change
    const modes = ["standalone", "fullscreen", "minimal-ui"] as const;
    const mediaQueries = modes.map((m) =>
      window.matchMedia(`(display-mode: ${m})`),
    );

    const handleDisplayChange = () => {
      if (getIsPwa()) {
        localStorage.setItem("pwa_installed", "true");
      }
      lastSynced.current = { isPwa: null, hasInstalled: null };
      syncPwaStatus(true);
    };

    mediaQueries.forEach((mq) =>
      mq.addEventListener("change", handleDisplayChange),
    );

    // 4. pageshow (hard refresh + bfcache দুটোই কভার করে)
    const handlePageShow = () => {
      lastSynced.current = { isPwa: null, hasInstalled: null };
      syncPwaStatus(true);
    };
    window.addEventListener("pageshow", handlePageShow);

    // 5. visibilitychange (tab আবার visible হলে)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        lastSynced.current = { isPwa: null, hasInstalled: null };
        syncPwaStatus(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // 6. Immediate + Delayed sync (সবচেয়ে গুরুত্বপূর্ণ)
    // সরাসরি একবার
    syncPwaStatus(true);

    // আরেকবার একটু পরে (কিছু ব্রাউজারে display-mode একটু দেরিতে ready হয়)
    const timer1 = setTimeout(() => syncPwaStatus(true), 300);
    const timer2 = setTimeout(() => syncPwaStatus(true), 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibility);
      mediaQueries.forEach((mq) =>
        mq.removeEventListener("change", handleDisplayChange),
      );
    };
  }, []);

  // SPA navigation
  useEffect(() => {
    if (!pathname) return;
    const t = setTimeout(() => syncPwaStatus(), 200);
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
