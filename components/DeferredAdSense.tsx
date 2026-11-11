"use client";

import { useEffect } from "react";

interface DeferredAdSenseProps {
  enabled?: boolean;
  clientId?: string;
}

function hasMarketingConsent(): boolean {
  try {
    const raw = window.localStorage.getItem("cookie_consent");
    if (!raw) return false;
    const saved = JSON.parse(raw) as Record<string, unknown>;
    return saved.marketing === true;
  } catch {
    return false;
  }
}

export function loadAdSense(clientId?: string) {
  if (
    typeof document === "undefined" ||
    !/^ca-pub-\d{16}$/.test(clientId ?? "") ||
    document.querySelector(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
    )
  ) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  script.crossOrigin = "anonymous";
  script.dataset.totthoboxAdsense = "1";
  document.head.appendChild(script);
}

export default function DeferredAdSense({
  enabled = false,
  clientId,
}: DeferredAdSenseProps) {
  useEffect(() => {
    if (!enabled || !clientId) return;

    const syncAdSense = () => {
      if (hasMarketingConsent()) loadAdSense(clientId);
    };

    // A consent choice must exist before the advertising script is requested.
    syncAdSense();
    window.addEventListener("totthobox:consent-updated", syncAdSense);
    return () =>
      window.removeEventListener("totthobox:consent-updated", syncAdSense);
  }, [enabled, clientId]);

  return null;
}
