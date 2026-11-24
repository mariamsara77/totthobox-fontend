"use client";

import { Search } from "lucide-react";
import { useSearchModal } from "@/context/SearchModalContext";

/**
 * Big, obvious search entry for the hero.
 * It looks like an input but opens the global search modal (same as Ctrl/Cmd+K).
 */
export default function HeroSearch() {
  const { openSearchModal } = useSearchModal();

  return (
    <button
      type="button"
      onClick={openSearchModal}
      aria-label="সেবা, টুল বা তথ্য খুঁজুন"
      className="group mx-auto flex h-14 w-full max-w-2xl items-center gap-3 rounded-2xl bg-zinc-400/10 px-4 text-left shadow-sm transition-colors hover:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 motion-reduce:transition-none dark:hover:border-emerald-400"
    >
      <Search
        className="size-5 shrink-0 text-zinc-500 transition-colors group-hover:text-emerald-600 dark:text-zinc-400 dark:group-hover:text-emerald-400"
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate text-sm text-zinc-500 sm:text-base dark:text-zinc-400">
        ক্যালকুলেটর, কনভার্টার, ছুটি বা হটলাইন খুঁজুন…
      </span>
      <kbd className="hidden shrink-0 rounded-md border border-zinc-300 bg-zinc-50 px-2 py-1 font-mono text-xs text-zinc-500 md:inline-block dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
        Ctrl K
      </kbd>
    </button>
  );
}
