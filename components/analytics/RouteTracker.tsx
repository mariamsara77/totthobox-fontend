"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { isBot, isIgnoredRoute } from "@/lib/analytics";

function RouteTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined" || isBot()) return;
    if (isIgnoredRoute(pathname)) return;

    // GTM container automatically captures initial pageview on load.
    // Skip first load to avoid double-counting.
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const search = searchParams?.toString();
    const pagePath = search ? `${pathname}?${search}` : pathname;
    const pageLocation = window.location.href;
    const pageTitle = document.title;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: pagePath,
      page_title: pageTitle,
      page_location: pageLocation,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function RouteTracker() {
  return (
    <Suspense fallback={null}>
      <RouteTrackerInner />
    </Suspense>
  );
}
