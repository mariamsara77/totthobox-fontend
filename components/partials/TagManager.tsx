"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const ANALYTICS_ID = "G-HGE2T2J8ZT";

function loadAnalytics() {
  if (document.querySelector('script[data-totthobox-analytics="1"]')) return;
  if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return;

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
}

export default function TagManager() {
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

  return null;
}