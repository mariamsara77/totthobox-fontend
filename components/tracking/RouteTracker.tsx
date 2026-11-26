"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  clearCachedAuthToken,
  flushQueue,
  syncPwa,
  trackPageLeave,
  trackPageView,
  trackSystem,
} from "@/lib/tracking/client";
import { getQueueLength } from "@/lib/tracking/queue";

const DEDUPE_WINDOW_MS = 1000;

function RouteTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams?.toString() || "";
  const fullRouteKey = searchKey ? `${pathname}?${searchKey}` : pathname;

  const isFirstRouteRef = useRef<boolean>(true);
  const lastTrackedRef = useRef<{ routeKey: string; at: number } | null>(null);
  const currentViewUrlRef = useRef<string>("");
  const visibleSinceRef = useRef<number | null>(null);
  const accumulatedVisibleMsRef = useRef<number>(0);
  const pendingNavStartPerfRef = useRef<number | null>(null);

  // App start: system event, initial PWA sync, queue flush, online/60s flush, auth sync, nav timing
  useEffect(() => {
    trackSystem();
    void syncPwa();
    void flushQueue();

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const anchor = target?.closest?.("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("/") && !href.startsWith("//")) {
        pendingNavStartPerfRef.current = performance.now();
      }
    };

    const handlePopState = () => {
      pendingNavStartPerfRef.current = performance.now();
    };

    const handleAppInstalled = () => {
      void syncPwa(true);
    };

    const standaloneMql =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(display-mode: standalone)")
        : null;

    const handleDisplayModeChange = () => {
      void syncPwa();
    };

    const handleOnline = () => {
      void flushQueue();
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "totthobox_auth_sync") {
        clearCachedAuthToken();
      }
    };

    const flushInterval = window.setInterval(() => {
      if (getQueueLength() > 0) {
        void flushQueue();
      }
    }, 60_000);

    document.addEventListener("click", handleLinkClick, true);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("appinstalled", handleAppInstalled);
    standaloneMql?.addEventListener("change", handleDisplayModeChange);
    window.addEventListener("online", handleOnline);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.clearInterval(flushInterval);
      document.removeEventListener("click", handleLinkClick, true);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("appinstalled", handleAppInstalled);
      standaloneMql?.removeEventListener("change", handleDisplayModeChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Route navigation tracking: page.leave for previous view + page.view for new route
  useEffect(() => {
    const nowPerf = performance.now();
    const nowWall = Date.now();

    if (
      lastTrackedRef.current &&
      lastTrackedRef.current.routeKey === fullRouteKey &&
      nowWall - lastTrackedRef.current.at < DEDUPE_WINDOW_MS
    ) {
      return;
    }

    // Flush leave for the previous route before starting the new one
    if (currentViewUrlRef.current) {
      const activeMs =
        accumulatedVisibleMsRef.current +
        (visibleSinceRef.current !== null
          ? Math.max(0, nowPerf - visibleSinceRef.current)
          : 0);
      if (activeMs > 0) {
        trackPageLeave(currentViewUrlRef.current, activeMs);
      }
    }

    lastTrackedRef.current = { routeKey: fullRouteKey, at: nowWall };

    const isSpa = !isFirstRouteRef.current;
    isFirstRouteRef.current = false;
    const navStartPerf = pendingNavStartPerfRef.current ?? nowPerf;
    pendingNavStartPerfRef.current = null;

    let rafId = 0;
    rafId = window.requestAnimationFrame(() => {
      const transitionMs = isSpa
        ? Math.max(1, Math.round(performance.now() - navStartPerf))
        : undefined;

      const { sanitizedUrl } = trackPageView(pathname, {
        isSpaNavigation: isSpa,
        transitionMs,
      });
      currentViewUrlRef.current = sanitizedUrl;
      accumulatedVisibleMsRef.current = 0;
      visibleSinceRef.current =
        document.visibilityState === "visible" ? performance.now() : null;
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      if (!pendingNavStartPerfRef.current) {
        pendingNavStartPerfRef.current = performance.now();
      }
    };
  }, [pathname, fullRouteKey]);

  // Visibility & pagehide handling: count only active visible time
  useEffect(() => {
    const sendLeaveIfAny = () => {
      if (!currentViewUrlRef.current) return;
      const nowPerf = performance.now();
      const activeMs =
        accumulatedVisibleMsRef.current +
        (visibleSinceRef.current !== null
          ? Math.max(0, nowPerf - visibleSinceRef.current)
          : 0);

      if (activeMs > 0) {
        trackPageLeave(currentViewUrlRef.current, activeMs);
      }
      accumulatedVisibleMsRef.current = 0;
      visibleSinceRef.current = null;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (visibleSinceRef.current !== null) {
          accumulatedVisibleMsRef.current += Math.max(
            0,
            performance.now() - visibleSinceRef.current,
          );
          visibleSinceRef.current = null;
        }
        sendLeaveIfAny();
      } else {
        visibleSinceRef.current = performance.now();
      }
    };

    const handlePageHide = () => {
      sendLeaveIfAny();
    };

    const handleConsentUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ analytics?: boolean }>;
      if (customEvent?.detail?.analytics === true) {
        trackSystem();
        void syncPwa();
        const { sanitizedUrl } = trackPageView(pathname);
        currentViewUrlRef.current = sanitizedUrl;
        accumulatedVisibleMsRef.current = 0;
        visibleSinceRef.current =
          document.visibilityState === "visible" ? performance.now() : null;
        void flushQueue();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("totthobox:consent-updated", handleConsentUpdated);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener(
        "totthobox:consent-updated",
        handleConsentUpdated,
      );
    };
  }, [pathname]);

  return null;
}

export default function RouteTracker() {
  return (
    <Suspense fallback={null}>
      <RouteTrackerInner />
    </Suspense>
  );
}
