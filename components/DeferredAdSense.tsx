"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ADSENSE_ID =
  process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-9522604367420521";
const SCRIPT_SELECTOR = 'script[data-totthobox-adsense="1"]';

function loadAdSense() {
  if (document.querySelector(SCRIPT_SELECTOR)) return;
  if (document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) return;

  const script = document.createElement("script");
  script.async = true;
  script.src =
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
    ADSENSE_ID;
  script.crossOrigin = "anonymous";
  script.dataset.totthoboxAdsense = "1";
  document.head.appendChild(script);
}

export default function DeferredAdSense() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/news")) return;
    let loaded = false;
    const interactionEvents = [
      "pointerdown",
      "touchstart",
      "keydown",
      "scroll",
    ] as const;
    let fallbackTimer = 0;

    const start = () => {
      if (loaded) return;
      loaded = true;

      interactionEvents.forEach((event) =>
        window.removeEventListener(event, start, true),
      );
      window.clearTimeout(fallbackTimer);

      loadAdSense();
    };

    interactionEvents.forEach((event) =>
      window.addEventListener(event, start, {
        capture: true,
        passive: true,
        once: false,
      }),
    );

    const armFallback = () => {
      fallbackTimer = window.setTimeout(start, 12000);
    };

    if (document.readyState === "complete") {
      armFallback();
    } else {
      window.addEventListener("load", armFallback, { once: true });
    }

    return () => {
      interactionEvents.forEach((event) =>
        window.removeEventListener(event, start, true),
      );
      window.removeEventListener("load", armFallback);
      window.clearTimeout(fallbackTimer);
    };
  }, [pathname]);

  return null;
}