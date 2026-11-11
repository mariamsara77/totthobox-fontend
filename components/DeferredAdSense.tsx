"use client";

import { useEffect } from "react";

interface DeferredAdSenseProps {
  enabled?: boolean;
  clientId?: string;
}

export function loadAdSense(clientId?: string) {
  if (typeof document === "undefined" || !/^ca-pub-\d{16}$/.test(clientId ?? "")) {
    return;
  }

  if (
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
    loadAdSense(clientId);
  }, [enabled, clientId]);

  return null;
}
