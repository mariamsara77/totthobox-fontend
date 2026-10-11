"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const ANALYTICS_ID = "G-HGE2T2J8ZT";

function loadAnalytics() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" + ANALYTICS_ID;
    script.dataset.totthoboxAnalytics = "1";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  // Disable automatic page_view so SPA navigation can send exactly one event.
  window.gtag("config", ANALYTICS_ID, { send_page_view: false });
}

export default function TagManager() {
  const pathname = usePathname();
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const lastPagePath = useRef<string | null>(null);

  useEffect(() => {
    let started = false;
    let fallbackTimer = 0;
    const events = ["pointerdown", "touchstart", "keydown", "scroll"] as const;

    const start = () => {
      if (started) return;
      started = true;
      events.forEach((event) => window.removeEventListener(event, start, true));
      window.clearTimeout(fallbackTimer);
      loadAnalytics();
      setAnalyticsReady(true);
    };

    events.forEach((event) =>
      window.addEventListener(event, start, {
        capture: true,
        passive: true,
      }),
    );

    const armFallback = () => {
      fallbackTimer = window.setTimeout(start, 15000);
    };

    if (document.readyState === "complete") {
      armFallback();
    } else {
      window.addEventListener("load", armFallback, { once: true });
    }

    return () => {
      events.forEach((event) => window.removeEventListener(event, start, true));
      window.removeEventListener("load", armFallback);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (!analyticsReady || !pathname || !window.gtag) return;
    if (lastPagePath.current === pathname) return;

    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
    lastPagePath.current = pathname;
  }, [analyticsReady, pathname]);

  return null;
}