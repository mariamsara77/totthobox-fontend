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

  const getIsPwa = (): boolean => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    );
  };

  const getHasInstalled = (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("pwa_installed") === "true";
  };

  const syncPwaStatus = async (force = false) => {
    if (isSyncing.current) return;

    const isPWA = getIsPwa();
    const hasInstalled = getHasInstalled();

    // একই স্ট্যাটাস হলে স্কিপ
    if (
      !force &&
      lastSynced.current.isPwa === isPWA &&
      lastSynced.current.hasInstalled === hasInstalled
    ) {
      return;
    }

    isSyncing.current = true;

    console.log("[PWA] Syncing...", {
      isPWA,
      hasInstalled,
      displayMode: window.matchMedia("(display-mode: standalone)").matches,
      navigatorStandalone: (window.navigator as any).standalone,
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

  // ========== PWA Install + Display Mode ==========
  useEffect(() => {
    // ইনস্টল হলে localStorage-এ ফ্ল্যাগ সেভ + সিঙ্ক
    const handleAppInstalled = () => {
      console.log("[PWA] App installed event fired");
      localStorage.setItem("pwa_installed", "true");
      lastSynced.current.hasInstalled = null; // force sync
      syncPwaStatus(true);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // Initial sync (cookie/session সেট হওয়ার জন্য একটু দেরি)
    const timer = setTimeout(() => {
      syncPwaStatus(true);
    }, 400);

    // display-mode পরিবর্তন হলে
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = () => {
      lastSynced.current.isPwa = null;
      syncPwaStatus(true);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("appinstalled", handleAppInstalled);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Pathname change (SPA navigation)
  useEffect(() => {
    if (!pathname) return;
    const t = setTimeout(() => syncPwaStatus(), 250);
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
