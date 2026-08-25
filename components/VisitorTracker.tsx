"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  getTracker,
  trackPageView,
  startNavigation,
} from "@/lib/tracker";

export default function VisitorTracker() {
  const pathname = usePathname();

  // Initialize tracker once
  useEffect(() => {
    getTracker().init();
  }, []);

  // Track page view on route change
  useEffect(() => {
    if (!pathname) return;

    const timer = window.setTimeout(() => {
      trackPageView(pathname);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  // Track internal navigation start
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");

      if (!anchor) return;

      if (
        anchor.href &&
        anchor.origin === window.location.origin &&
        !anchor.target &&
        !anchor.hasAttribute("download") &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        !event.altKey
      ) {
        startNavigation();
      }
    };

    document.addEventListener("click", onClick, {
      capture: true,
      passive: true,
    });

    return () => {
      document.removeEventListener("click", onClick, {
        capture: true,
      });
    };
  }, []);

  // Browser back / forward
  useEffect(() => {
    const onPopState = () => {
      startNavigation();
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return null;
}