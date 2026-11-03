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

  // If no slotId is configured, NEVER render empty placeholder boxes or borders
  // (Prevents Google AdSense "Valuable Inventory: Under Construction" rejections)
  if (!slotId) {
    return null;
  }

  // Default reserved heights to avoid Cumulative Layout Shift (CLS) once live ads are loaded
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
      // Gracefully handle adblockers without crashing React
      setAdBlocked(true);
    }
  }, []);

  if (adBlocked) {
    return null;
  }

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
      <div className="mb-1 flex items-center justify-center">
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          {label}
        </span>
      </div>

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
    </div>
  );
}
