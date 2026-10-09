"use client";

import { useEffect, useState } from "react";
import { Newspaper } from "lucide-react";

type Props = {
  src?: string | null;
  fallbackSrc?: string | null;
  alt: string;
};

export default function NewsThumbnail({ src, fallbackSrc, alt }: Props) {
  const [primaryFailed, setPrimaryFailed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const usableFallback = fallbackSrc && fallbackSrc !== src ? fallbackSrc : null;

  useEffect(() => {
    setPrimaryFailed(false);
    setFallbackFailed(false);
  }, [src, usableFallback]);

  const displayedSrc =
    src && !primaryFailed
      ? src
      : usableFallback && !fallbackFailed
        ? usableFallback
        : null;

  const handleImageError = () => {
    if (displayedSrc && displayedSrc === src) {
      setPrimaryFailed(true);
    } else {
      setFallbackFailed(true);
    }
  };

  return (
    <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-zinc-400/15 sm:size-24">
      {displayedSrc ? (
        // Publisher images are served directly to support the different publisher CDNs.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={displayedSrc}
          src={displayedSrc}
          alt={alt}
          width={96}
          height={96}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div
          className="flex size-full items-center justify-center text-zinc-500/70"
          role="img"
          aria-label={alt}
        >
          <Newspaper className="size-7" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
