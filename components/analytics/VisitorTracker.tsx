"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackVisitorPageView, sendVisitorHeartbeat } from "@/lib/visitor-tracker";

export default function VisitorTracker() {
  const pathname = usePathname();
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track pageview immediately on mount and every route change
  useEffect(() => {
    trackVisitorPageView(pathname);
  }, [pathname]);

  // Heartbeat management: every 60s while tab is visible
  useEffect(() => {
    const startHeartbeat = () => {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);

      // Send initial heartbeat after 15s if visible
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
        sendVisitorHeartbeat(pathname);
        startHeartbeat();
      } else {
        stopHeartbeat();
      }
    };

    if (document.visibilityState === "visible") {
      startHeartbeat();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // If user changes consent dynamically: trigger pageview on grant, stop on deny
    const handleConsent = (event: Event) => {
      const customEvent = event as CustomEvent<{ analytics?: boolean }>;
      const isGranted = customEvent?.detail?.analytics === true;
      if (isGranted) {
        trackVisitorPageView(pathname);
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
      window.removeEventListener("totthobox:consent-updated", handleConsent);
    };
  }, [pathname]);

  return null;
}
