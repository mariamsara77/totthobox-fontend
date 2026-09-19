"use client";

interface SearchPrefixesProps {
  prefixes: string[];
  hints: Record<string, string>;
  metaLoading: boolean;
  onChoose: (prefix: string) => void;
}

export default function SearchPrefixes({
  prefixes,
  hints,
  metaLoading,
  onChoose,
}: SearchPrefixesProps) {
  const visiblePrefixes = prefixes.slice(0, 8);
  const visibleHints = Object.entries(hints).slice(0, 6);

  return (
    <div className="px-4 pb-4 pt-0.5 sm:px-5">
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-[11px] font-medium tracking-wide text-zinc-400 dark:text-zinc-600">
          দ্রুত বিভাগ বেছে নিন
        </p>
        <span className="text-[10px] text-zinc-300 dark:text-zinc-700">
          ২+ অক্ষর লিখলেই সার্চ শুরু
        </span>
      </div>

      {metaLoading ? (
        <div className="flex flex-wrap gap-1.5">
          {[64, 78, 56, 72, 60, 80].map((w) => (
            <span
              key={w}
              style={{ width: w }}
              className="h-7 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {visiblePrefixes.map((prefix) => (
            <button
              key={prefix}
              type="button"
              onClick={() => onChoose(prefix)}
              className="rounded-lg border border-zinc-200/80 bg-zinc-50 px-2.5 py-1.5 text-[11.5px] font-medium text-zinc-600 transition-all hover:border-zinc-300 hover:bg-white hover:text-zinc-900 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              {prefix}:
            </button>
          ))}
        </div>
      )}

      {visibleHints.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1 text-[11px] leading-5 text-zinc-400">
          <span className="text-zinc-300 dark:text-zinc-600">উদাহরণ:</span>
          {visibleHints.map(([bangla, english]) => (
            <button
              key={english}
              type="button"
              onClick={() => onChoose(english)}
              className="rounded px-1.5 py-0.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
            >
              {english}:
            </button>
          ))}
          <span className="text-zinc-300 dark:text-zinc-600">লিখে খুঁজুন</span>
        </div>
      )}
    </div>
  );
}
