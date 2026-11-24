import React from "react";

export default function SectionLoadingSkeleton({
  title = "তথ্য লোড হচ্ছে...",
  cardCount = 8,
}: {
  title?: string;
  cardCount?: number;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8 animate-pulse" aria-busy="true" aria-label={title}>
      {/* Header Skeleton */}
      <div className="space-y-3 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-6">
        <div className="h-6 w-36 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-9 w-64 sm:w-96 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-48 sm:w-80 rounded-lg bg-zinc-100 dark:bg-zinc-800/60" />
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: cardCount }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-between rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-zinc-900/40 p-4 min-h-36 space-y-3"
          >
            <div className="size-11 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-28 rounded bg-zinc-100 dark:bg-zinc-800/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
