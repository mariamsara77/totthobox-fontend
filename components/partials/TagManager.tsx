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

function hasAnalyticsConsent(): boolean {
  try {
    const saved = window.localStorage.getItem("cookie_consent");
    if (!saved) return false;
    return JSON.parse(saved)?.analytics === true;
  } catch {
    return false;
  }
}

function setAnalyticsDisabled(disabled: boolean) {
  const gaWindow = window as unknown as Record<string, unknown>;
  gaWindow[`ga-disable-${ANALYTICS_ID}`] = disabled;
}

function loadAnalytics() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("js", new Date());
  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" + ANALYTICS_ID;
    script.dataset.totthoboxAnalytics = "1";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }

  window.gtag("config", ANALYTICS_ID, { send_page_view: false });
  setAnalyticsDisabled(false);
}

export default function TagManager() {
  const pathname = usePathname();
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const lastPagePath = useRef<string | null>(null);

  useEffect(() => {
    let started = false;
    let fallbackTimer = 0;
    const events = ["pointerdown", "touchstart", "keydown", "scroll"] as const;

    const removeTriggers = () => {
      events.forEach((event) => window.removeEventListener(event, start, true));
      window.clearTimeout(fallbackTimer);
    };

    const start = () => {
      if (!hasAnalyticsConsent()) return;

      if (started) {
        setAnalyticsDisabled(false);
        window.gtag?.("consent", "update", { analytics_storage: "granted" });
        setAnalyticsReady(true);
        return;
      }

      started = true;
      removeTriggers();
      loadAnalytics();
      setAnalyticsReady(true);
    };

    const handleConsentUpdated = () => {
      if (hasAnalyticsConsent()) {
        start();
        return;
      }

      setAnalyticsDisabled(true);
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      lastPagePath.current = null;
      setAnalyticsReady(false);
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
    window.addEventListener("cookie-consent-updated", handleConsentUpdated);

    return () => {
      removeTriggers();
      window.removeEventListener("load", armFallback);
      window.removeEventListener("cookie-consent-updated", handleConsentUpdated);
    };
  }, []);

  useEffect(() => {
    if (!analyticsReady || !pathname || !window.gtag || !hasAnalyticsConsent()) return;
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
