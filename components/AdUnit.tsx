"use client";

import { useEffect, useRef, useState } from "react";

type AdFormat = "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";

interface AdUnitProps {
  slotId?: string;
  clientId?: string;
  enabled?: boolean;
  eligible?: boolean;
  format?: AdFormat;
  responsive?: boolean;
  layoutKey?: string;
  className?: string;
  minHeight?: number | string;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[] & { push: (value: Record<string, unknown>) => number };
  }
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

export default function AdUnit({
  slotId,
  clientId,
  enabled = false,
  eligible = false,
  format = "auto",
  responsive = true,
  layoutKey,
  className = "",
  minHeight,
  label = "বিজ্ঞাপন",
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);
  const [adBlocked, setAdBlocked] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const validClient = /^ca-pub-\d{16}$/.test(clientId ?? "");
  const canRender = enabled && eligible && !!slotId && validClient;

  useEffect(() => {
    const updateConsent = () => setMarketingConsent(hasMarketingConsent());
    updateConsent();
    window.addEventListener("totthobox:consent-updated", updateConsent);
    return () =>
      window.removeEventListener("totthobox:consent-updated", updateConsent);
  }, []);

  useEffect(() => {
    if (!canRender || !marketingConsent || pushedRef.current) return;
    if (!adRef.current || adRef.current.innerHTML !== "") return;

    try {
      const adsbygoogle = (window.adsbygoogle = window.adsbygoogle || []);
      adsbygoogle.push({});
      pushedRef.current = true;
    } catch {
      setAdBlocked(true);
    }
  }, [canRender, marketingConsent]);

  if (!canRender || !marketingConsent || adBlocked) return null;

  const reservedHeight =
    minHeight ??
    (format === "rectangle"
      ? 280
      : format === "horizontal"
        ? 90
        : format === "vertical"
          ? 600
          : 100);

  const styleMinHeight =
    typeof reservedHeight === "number" ? `${reservedHeight}px` : reservedHeight;

  return (
    <div
      className={`relative mx-auto my-6 w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-2 text-center dark:border-zinc-800/80 dark:bg-zinc-900/40 ${className}`}
      style={{ minHeight: styleMinHeight }}
      aria-label="বিজ্ঞাপন অংশ"
    >
      <div className="mb-1 flex items-center justify-center">
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      </div>
      <ins
        ref={adRef}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      />
    </div>
  );
}
