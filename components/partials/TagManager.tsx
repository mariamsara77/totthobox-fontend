"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __totthoboxGA4Initialized?: boolean;
  }
}

// This is a direct GA4 Google tag, not a Google Tag Manager container.
// The configured GA4 measurement ID is the existing production ID.
const ANALYTICS_ID = "G-HGE2T2J8ZT";

function loadAnalytics() {
  // Queue the configuration before loading gtag.js so the first page view
  // retains the landing URL and attribution. Do not gate analytics on clicks
  // or a long fallback timer.
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  // React Strict Mode can run effects more than once in development. This
  // global guard also prevents duplicate config/page_view initialization.
  if (!window.__totthoboxGA4Initialized) {
    window.gtag("js", new Date());
    window.gtag("config", ANALYTICS_ID);
    window.__totthoboxGA4Initialized = true;
  }

  // Reuse an existing gtag.js loader if another integration has already
  // added it; otherwise load Google's library exactly once.
  const existingScript = document.querySelector(
    'script[src*="googletagmanager.com/gtag/js"]',
  );
  if (existingScript) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
  script.dataset.totthoboxAnalytics = "1";
  document.head.appendChild(script);
}

export default function TagManager() {
  useEffect(() => {
    loadAnalytics();
  }, []);

  return null;
}
