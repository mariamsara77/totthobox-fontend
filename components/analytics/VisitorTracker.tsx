"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  trackVisitorPageView,
  sendVisitorHeartbeat,
  sendPageDurationBeacon,
  flushOfflineTrackingQueue,
} from "@/lib/visitor-tracker";

function VisitorTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams?.toString() || "";
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const enteredAtRef = useRef<number>(Date.now());
  const durationSentRef = useRef<boolean>(false);

  // Track pageview immediately on mount and every route change
  useEffect(() => {
    enteredAtRef.current = Date.now();
    durationSentRef.current = false;
    trackVisitorPageView(pathname);
    void flushOfflineTrackingQueue();
  }, [pathname, searchKey]);

  // Heartbeat, offline queue sync, and pagehide/visibilitychange duration beacon
  useEffect(() => {
    const flushDuration = () => {
      if (durationSentRef.current) return;
      durationSentRef.current = true;
      const durationMs = Date.now() - enteredAtRef.current;
      sendPageDurationBeacon(pathname, durationMs);
    };

    const startHeartbeat = () => {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);

      heartbeatTimerRef.current = setInterval(() => {
        if (document.visibilityState === "visible") {
          sendVisitorHeartbeat(pathname);
        }
      }, 60_000);
    };

    const stopHeartbeat = () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        enteredAtRef.current = Date.now();
        durationSentRef.current = false;
        sendVisitorHeartbeat(pathname);
        startHeartbeat();
      } else {
        stopHeartbeat();
        flushDuration();
      }
    };

    const handlePageHide = () => {
      stopHeartbeat();
      flushDuration();
    };

    const handleOnline = () => {
      void flushOfflineTrackingQueue();
    };

    if (document.visibilityState === "visible") {
      startHeartbeat();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("online", handleOnline);

    // If user changes consent dynamically: trigger pageview on grant, stop on deny
    const handleConsent = (event: Event) => {
      const customEvent = event as CustomEvent<{ analytics?: boolean }>;
      const isGranted = customEvent?.detail?.analytics === true;
      if (isGranted) {
        trackVisitorPageView(pathname);
        void flushOfflineTrackingQueue();
        if (document.visibilityState === "visible") {
          startHeartbeat();
        }
      } else {
        stopHeartbeat();
      }
    };
    window.addEventListener("totthobox:consent-updated", handleConsent);

    return () => {
      stopHeartbeat();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("totthobox:consent-updated", handleConsent);
    };
  }, [pathname]);

  return null;
}

export default function VisitorTracker() {
  return (
    <Suspense fallback={null}>
      <VisitorTrackerInner />
    </Suspense>
  );
}
