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
  // PWA Detection (সব case cover)
  // ==========================================
  const getIsPwa = (): boolean => {
    if (typeof window === "undefined") return false;

    // display-mode: standalone / fullscreen / minimal-ui
    const isDisplayMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches;

    // iOS Safari
    const isIosStandalone = (window.navigator as any).standalone === true;

    // Manifest start_url query
    const params = new URLSearchParams(window.location.search);
    const fromStartUrl =
      params.get("install") === "true" ||
      params.get("utm_medium") === "pwa_app" ||
      params.get("utm_source") === "pwa";

    // localStorage flag
    const hasFlag = localStorage.getItem("pwa_installed") === "true";

    return isDisplayMode || isIosStandalone || fromStartUrl || hasFlag;
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
    const hasInstalled = getHasInstalled() || isPWA; // standalone হলে installed ধরে নিন

    if (
      !force &&
      lastSynced.current.isPwa === isPWA &&
      lastSynced.current.hasInstalled === hasInstalled
    ) {
      return;
    }

    isSyncing.current = true;

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

      if (res.ok && data?.status === "success") {
        lastSynced.current = {
          isPwa: isPWA,
          hasInstalled: hasInstalled,
        };
      } else {
        lastSynced.current = { isPwa: null, hasInstalled: null };
      }
    } catch {
      lastSynced.current = { isPwa: null, hasInstalled: null };
    } finally {
      isSyncing.current = false;
    }
  };

  // ==========================================
  // PWA Install + Display Mode listeners
  // ==========================================
  useEffect(() => {
    // 1) start_url দিয়ে খুললে flag সেট
    const params = new URLSearchParams(window.location.search);
    if (
      params.get("install") === "true" ||
      params.get("utm_medium") === "pwa_app" ||
      params.get("utm_source") === "pwa"
    ) {
      localStorage.setItem("pwa_installed", "true");
    }

    // 2) এখনই display-mode PWA হলে flag সেট
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches ||
      (window.navigator as any).standalone === true
    ) {
      localStorage.setItem("pwa_installed", "true");
    }

    // 3) appinstalled event
    const handleAppInstalled = () => {
      localStorage.setItem("pwa_installed", "true");
      lastSynced.current = { isPwa: null, hasInstalled: null };
      syncPwaStatus(true);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    // 4) Initial sync
    const timer = setTimeout(() => {
      syncPwaStatus(true);
    }, 400);

    // 5) display-mode change
    const modes = ["standalone", "fullscreen", "minimal-ui"] as const;
    const mediaQueries = modes.map((m) =>
      window.matchMedia(`(display-mode: ${m})`),
    );

    const handleChange = () => {
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
