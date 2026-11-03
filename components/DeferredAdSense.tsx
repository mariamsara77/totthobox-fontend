"use client";

import { useEffect } from "react";

const ADSENSE_ID =
  process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-9522604367420521";
const SCRIPT_SELECTOR = 'script[data-totthobox-adsense="1"]';

export function loadAdSense() {
  if (typeof document === "undefined") return;
  if (document.querySelector(SCRIPT_SELECTOR)) return;
  if (
    document.querySelector(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
    )
  )
    return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`;
  script.crossOrigin = "anonymous";
  script.dataset.totthoboxAdsense = "1";
  document.head.appendChild(script);
}

export default function DeferredAdSense() {
  useEffect(() => {
    let loaded = false;
    const interactionEvents = [
      "pointerdown",
      "touchstart",
      "keydown",
      "scroll",
    ] as const;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    const start = () => {
      if (loaded) return;
      loaded = true;

      interactionEvents.forEach((event) =>
        window.removeEventListener(event, start, true),
      );
      if (fallbackTimer) clearTimeout(fallbackTimer);

      loadAdSense();
    };

    interactionEvents.forEach((event) =>
      window.addEventListener(event, start, {
        capture: true,
        passive: true,
        once: true,
      }),
    );

    // Guaranteed execution within 1.5s so Google AdSense verification bots detect the script immediately
    const win = window as unknown as {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout: number },
      ) => number;
    };

    if (typeof win.requestIdleCallback === "function") {
      win.requestIdleCallback(start, { timeout: 2000 });
    } else {
      fallbackTimer = setTimeout(start, 1500);
    }

    return () => {
      interactionEvents.forEach((event) =>
        window.removeEventListener(event, start, true),
      );
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, []);

  return null;
}
