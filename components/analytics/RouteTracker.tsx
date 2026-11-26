"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  isBot,
  isIgnoredRoute,
  hasAnalyticsConsent,
  sanitizeAnalyticsUrl,
} from "@/lib/analytics";

const DEDUPE_WINDOW_MS = 1000;

function RouteTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams?.toString() || "";
  const fullRouteKey = searchKey ? `${pathname}?${searchKey}` : pathname;

  const isFirstLoadRef = useRef(true);
  const lastPushedRef = useRef<{ routeKey: string; at: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || isBot()) return;
    if (isIgnoredRoute(pathname)) return;

    // GTM container automatically captures initial pageview on load.
    // Skip first load to avoid double-counting.
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      return;
    }

    if (!hasAnalyticsConsent()) return;

    const now = Date.now();
    if (
      lastPushedRef.current &&
      lastPushedRef.current.routeKey === fullRouteKey &&
      now - lastPushedRef.current.at < DEDUPE_WINDOW_MS
    ) {
      return;
    }
    lastPushedRef.current = { routeKey: fullRouteKey, at: now };

    const rafId = window.requestAnimationFrame(() => {
      const pageLocation = sanitizeAnalyticsUrl(window.location.href);
      let pagePath = pathname;
      try {
        if (pageLocation) {
          const parsed = new URL(pageLocation);
          pagePath = `${parsed.pathname}${parsed.search}`;
        }
      } catch {
        pagePath = pathname;
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "page_view",
        page_path: pagePath,
        page_title: document.title || "",
        page_location: pageLocation || window.location.origin + pathname,
      });
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [pathname, fullRouteKey]);

  // Immediately emit page_view when user grants analytics consent on current page
  useEffect(() => {
    const handleConsent = (event: Event) => {
      const customEvent = event as CustomEvent<{ analytics?: boolean }>;
      if (customEvent?.detail?.analytics !== true) return;
      if (isBot() || isIgnoredRoute(pathname)) return;

      const pageLocation = sanitizeAnalyticsUrl(window.location.href);
      let pagePath = pathname;
      try {
        if (pageLocation) {
          const parsed = new URL(pageLocation);
          pagePath = `${parsed.pathname}${parsed.search}`;
        }
      } catch {
        pagePath = pathname;
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "page_view",
        page_path: pagePath,
        page_title: document.title || "",
        page_location: pageLocation || window.location.origin + pathname,
      });
    };

    window.addEventListener("totthobox:consent-updated", handleConsent);
    return () =>
      window.removeEventListener("totthobox:consent-updated", handleConsent);
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
