"use client";

import MediaGallery from "../MediaGallery";

interface FlagImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function FlagImage({
  src,
  fallbackSrc = "https://flagcdn.com/w640/un.png",
  alt,
  className = "",
  width,
  height,
}: FlagImageProps) {
  return (
    <div className={`rounded-xl overflow-hidden ${className}`}>
      <MediaGallery
        media={[
          {
            url: src,
            caption: alt,
          },
        ]}
        // Optional: if MediaGallery supports fallback / onError you can pass it,
        // otherwise the gallery itself should handle broken images
      />
    </div>
  );
}
