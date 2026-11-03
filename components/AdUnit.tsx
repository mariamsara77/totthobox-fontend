"use client";

import { useEffect, useRef, useState } from "react";

type AdFormat = "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";

interface AdUnitProps {
  slotId?: string;
  format?: AdFormat;
  responsive?: boolean;
  layoutKey?: string;
  className?: string;
  minHeight?: number | string;
  label?: string;
}

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-9522604367420521";

export default function AdUnit({
  slotId,
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

  // Default reserved heights to avoid Cumulative Layout Shift (CLS)
  const defaultMinHeight =
    minHeight ??
    (format === "rectangle"
      ? 280
      : format === "horizontal"
        ? 90
        : format === "vertical"
          ? 600
          : 100);

  useEffect(() => {
    if (pushedRef.current) return;

    try {
      if (typeof window !== "undefined") {
        const isClientLoaded = Boolean(
          (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle,
        );

        // If ad slot is mounted and not yet filled
        if (adRef.current && adRef.current.innerHTML === "") {
          const adsbygoogle = ((
            window as unknown as { adsbygoogle?: unknown[] }
          ).adsbygoogle =
            (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle ||
            []);
          adsbygoogle.push({});
          pushedRef.current = true;
        }
      }
    } catch {
      // Gracefully handle adblockers or Google AdSense fill errors without crashing React
      setAdBlocked(true);
    }
  }, []);

  const styleMinHeight =
    typeof defaultMinHeight === "number"
      ? `${defaultMinHeight}px`
      : defaultMinHeight;

  return (
    <div
      className={`relative my-6 mx-auto w-full overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-2 text-center transition-all ${className}`}
      style={{ minHeight: styleMinHeight }}
      aria-label="বিজ্ঞাপন অংশ"
    >
      {/* Subtle Ad Badge to strictly comply with AdSense label guidelines */}
      <div className="mb-1 flex items-center justify-center">
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {label}
        </span>
      </div>

      {slotId ? (
        <ins
          ref={adRef}
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
          {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
        />
      ) : (
        /* Placeholder zone when slotId is pending approval or in dev */
        <div className="flex h-full min-h-[70px] flex-col items-center justify-center text-xs text-zinc-400 dark:text-zinc-500">
          <span className="font-medium">Totthobox Advertising Zone</span>
          <span className="text-[10px] opacity-75">
            নিরাপদ ও প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শনের জন্য সংরক্ষিত
          </span>
        </div>
      )}
    </div>
  );
}
