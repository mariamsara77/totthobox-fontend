"use client";

import { FaceFrownIcon } from "@heroicons/react/24/outline";

interface SearchEmptyProps {
  type: "initial" | "no-results" | "skeleton";
  search?: string;
  onClear?: () => void;
}

export default function SearchEmpty({
  type,
  search = "",
  onClear,
}: SearchEmptyProps) {
  if (type === "skeleton") {
    return (
      <div className="space-y-1 p-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5">
            <span className="size-9 shrink-0 animate-pulse rounded-xl bg-zinc-400/10" />
            <span className="flex-1 space-y-2">
              <span
                className="block h-3 animate-pulse rounded bg-zinc-400/10"
                style={{ width: `${55 + (i % 3) * 12}%` }}
              />
              <span
                className="block h-2.5 animate-pulse rounded bg-zinc-400/10"
                style={{ width: `${35 + (i % 3) * 10}%` }}
              />
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (type === "no-results") {
    return (
      <div className="flex min-h-65 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="mb-3.5 flex size-11 items-center justify-center rounded-full bg-zinc-400/10">
          <FaceFrownIcon className="size-5 opacity-50" />
        </div>
        <h2 className="text-[13px] font-semibold ">কোনো ফলাফল পাওয়া যায়নি</h2>
        <p className="mt-1.5 max-w-xs text-xs leading-relaxed ">
          <strong className="text-lg">&ldquo;{search}&rdquo;</strong>
          <span className="font-medium opacity-50">
            {" "}
            দিয়ে কিছু পাওয়া যায়নি। অন্য শব্দ চেষ্টা করুন।{" "}
          </span>
        </p>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="mt-4 rounded-xl border border-zinc-400/25 bg-zinc-400/10 hover:bg-zinc-400/25 px-4 py-2"
          >
            নতুন করে খুঁজুন
          </button>
        )}
      </div>
    );
  }

  // initial
  return (
    <div className="flex min-h-65 items-center justify-center px-6 text-center">
      <p className="text-[12px] text-zinc-400 dark:text-zinc-600">
        অন্তত ২টি অক্ষর লিখে অনুসন্ধান শুরু করুন
      </p>
    </div>
  );
}
