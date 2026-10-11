"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ADSENSE_ID =
  process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-9522604367420521";
const SCRIPT_SELECTOR = 'script[data-totthobox-adsense="1"]';

function hasMarketingConsent(): boolean {
  try {
    const saved = window.localStorage.getItem("cookie_consent");
    if (!saved) return false;
    return JSON.parse(saved)?.marketing === true;
  } catch {
    return false;
  }
}

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
    let loaded = false;
    let fallbackTimer = 0;
    const interactionEvents = [
      "pointerdown",
      "touchstart",
      "keydown",
      "scroll",
    ] as const;

    const removeTriggers = () => {
      interactionEvents.forEach((event) =>
        window.removeEventListener(event, start, true),
      );
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("load", armFallback);
    };

    const start = () => {
      if (loaded || !hasMarketingConsent() || pathname.startsWith("/news")) return;
      loaded = true;
      removeTriggers();
      loadAdSense();
    };

    const armFallback = () => {
      if (!hasMarketingConsent() || pathname.startsWith("/news")) return;
      fallbackTimer = window.setTimeout(start, 12000);
    };

    const handleConsentUpdated = () => {
      if (hasMarketingConsent()) {
        if (!pathname.startsWith("/news")) start();
        return;
      }

      // Reload after revocation so the next document no longer executes AdSense.
      if (document.querySelector(SCRIPT_SELECTOR)) window.location.reload();
    };

    window.addEventListener("cookie-consent-updated", handleConsentUpdated);

    if (!pathname.startsWith("/news") && hasMarketingConsent()) {
      interactionEvents.forEach((event) =>
        window.addEventListener(event, start, {
          capture: true,
          passive: true,
        }),
      );

      if (document.readyState === "complete") {
        armFallback();
      } else {
        window.addEventListener("load", armFallback, { once: true });
      }
    }

    return () => {
      removeTriggers();
      window.removeEventListener("cookie-consent-updated", handleConsentUpdated);
    };
  }, [pathname]);

  return null;
}
