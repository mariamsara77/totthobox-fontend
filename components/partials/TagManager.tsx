"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const ANALYTICS_ID = "G-HGE2T2J8ZT";

function scheduleIdle(callback: () => void) {
  const requestIdle = (
    window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
    }
  ).requestIdleCallback;

  if (requestIdle) return requestIdle(callback, { timeout: 7000 });
  return window.setTimeout(callback, 3000);
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

export default function TagManager() {
  useEffect(() => {
    let idleHandle = 0;
    let cancelled = false;

    const start = () => {
      if (
        cancelled ||
        document.querySelector('script[data-totthobox-analytics="1"]')
      ) {
        return;
      }

      window.dataLayer = window.dataLayer || [];
      window.gtag =
        window.gtag ||
        function gtag(...args: unknown[]) {
          window.dataLayer?.push(args);
        };

      window.gtag("js", new Date());
      window.gtag("config", ANALYTICS_ID);

      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://www.googletagmanager.com/gtag/js?id=" + ANALYTICS_ID;
      script.dataset.totthoboxAnalytics = "1";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    };

    const handleLoad = () => {
      idleHandle = scheduleIdle(start);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", handleLoad);
      if (idleHandle) cancelIdle(idleHandle);
    };
  }, []);

  return null;
}
