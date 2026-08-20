'use client';

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
  fallbackSrc = 'https://flagcdn.com/w640/un.png',
  alt,
  className = '',
  width,
  height,
}: FlagImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        const target = e.currentTarget;
        if (target.src !== fallbackSrc) {
          target.src = fallbackSrc;
        }
      }}
    />
  );
}