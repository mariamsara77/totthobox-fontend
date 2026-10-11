"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const VisitorTracker = dynamic(() => import("@/components/VisitorTracker"), {
  ssr: false,
});

function hasAnalyticsConsent(): boolean {
  try {
    const saved = window.localStorage.getItem("cookie_consent");
    if (!saved) return false;
    return JSON.parse(saved)?.analytics === true;
  } catch {
    return false;
  }
}

function scheduleIdle(callback: () => void) {
  const requestIdle = (
    window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
    }
  ).requestIdleCallback;

  if (requestIdle) return requestIdle(callback, { timeout: 8000 });
  return window.setTimeout(callback, 3500);
}

function cancelIdle(handle: number) {
  const cancelIdle = (
    window as Window & {
      cancelIdleCallback?: (handle: number) => void;
    }
  ).cancelIdleCallback;

  if (cancelIdle) cancelIdle(handle);
  else window.clearTimeout(handle);
}

export default function DeferredVisitorTracker() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleHandle = 0;
    let loadListenerAttached = false;

    const handleLoad = () => {
      loadListenerAttached = false;
      if (!hasAnalyticsConsent()) return;
      if (idleHandle) cancelIdle(idleHandle);
      idleHandle = scheduleIdle(() => {
        idleHandle = 0;
        setReady(hasAnalyticsConsent());
      });
    };

    const syncConsent = () => {
      if (!hasAnalyticsConsent()) {
        if (idleHandle) cancelIdle(idleHandle);
        idleHandle = 0;
        setReady(false);
        return;
      }

      if (document.readyState === "complete") {
        handleLoad();
      } else if (!loadListenerAttached) {
        loadListenerAttached = true;
        window.addEventListener("load", handleLoad, { once: true });
      }
    };

    window.addEventListener("cookie-consent-updated", syncConsent);
    syncConsent();

    return () => {
      window.removeEventListener("cookie-consent-updated", syncConsent);
      window.removeEventListener("load", handleLoad);
      if (idleHandle) cancelIdle(idleHandle);
    };
  }, []);

  if (!ready) return null;
  return <VisitorTracker />;
}
