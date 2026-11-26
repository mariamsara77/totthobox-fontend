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

  const lastTrackedRef = useRef<{ routeKey: string; at: number } | null>(null);
  const currentViewUrlRef = useRef<string>("");
  const visibleSinceRef = useRef<number | null>(null);
  const accumulatedVisibleMsRef = useRef<number>(0);

  // App start: system event, initial PWA sync, queue flush, online/60s flush, auth sync listener
  useEffect(() => {
    trackSystem();
    void syncPwa();
    void flushQueue();

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

    window.addEventListener("appinstalled", handleAppInstalled);
    standaloneMql?.addEventListener("change", handleDisplayModeChange);
    window.addEventListener("online", handleOnline);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.clearInterval(flushInterval);
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
    const { sanitizedUrl } = trackPageView(pathname);
    currentViewUrlRef.current = sanitizedUrl;
    accumulatedVisibleMsRef.current = 0;
    visibleSinceRef.current =
      document.visibilityState === "visible" ? performance.now() : null;
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
