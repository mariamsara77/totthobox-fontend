"use client";

interface CoatOfArmsProps {
  src: string;
  alt: string;
}

export function CoatOfArms({ src, alt }: CoatOfArmsProps) {
  if (!src) {
    return null;
  }

  return (
    <div className="p-6 flex justify-center bg-zinc-900/50 dark:bg-zinc-950/30">
      <img
        src={src}
        alt={alt}
        width={256}
        height={256}
        loading="lazy"
        decoding="async"
        className="h-32 w-32 object-contain"
        onError={(event) => {
          const image = event.currentTarget;

          image.style.display = "none";
        }}
      />
    </div>
  );
}
