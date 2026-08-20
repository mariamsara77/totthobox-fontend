'use client';

interface CoatOfArmsProps {
  src: string;
  alt: string;
}

export function CoatOfArms({ src, alt }: CoatOfArmsProps) {
  return (
    <div className="p-6 flex justify-center bg-zinc-50/50 dark:bg-zinc-950/30">
      <img
        src={src}
        alt={alt}
        className="h-32 object-contain drop-shadow-sm"
        loading="lazy"
        onError={(e) => {
          const wrapper = e.currentTarget.closest('div');
          if (wrapper) wrapper.style.display = 'none';
        }}
      />
    </div>
  );
}