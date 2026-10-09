"use client";

import { useState } from "react";
import { Newspaper } from "lucide-react";

type Props = {
  src?: string | null;
  alt: string;
};

export default function NewsThumbnail({ src, alt }: Props) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-zinc-400/15 sm:size-24">
      {src && !hasError ? (
        // Publisher-hosted thumbnails are intentionally rendered directly; each publisher can use its own image CDN.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          width={96}
          height={96}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
          onError={() => setHasError(true)}
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
