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
  width = 640,
  height = 427,
}: FlagImageProps) {
  const imageUrl = src || fallbackSrc;

  return (
    <div className={`rounded-xl overflow-hidden ${className}`}>
      <MediaGallery
        media={[
          {
            url: imageUrl,
            caption: alt,
          },
        ]}
      />
    </div>
  );
}
