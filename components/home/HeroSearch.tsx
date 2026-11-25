"use client";

import { Search } from "lucide-react";
import { useSearchModal } from "@/context/SearchModalContext";

/**
 * Search entry for the hero.
 * Opens the global search modal (same as Ctrl/Cmd+K).
 */
export default function HeroSearch() {
  const { openSearchModal } = useSearchModal();

  return (
    <button
      type="button"
      onClick={openSearchModal}
      aria-label="সেবা, টুল বা তথ্য খুঁজুন"
      className="group mx-auto flex min-h-13 w-full max-w-2xl items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 text-left shadow-xs transition-colors hover:border-[var(--accent-primary)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-900"
    >
      <Search
        className="size-4.5 shrink-0 text-zinc-500 transition-colors group-hover:text-[var(--accent-ink)] dark:text-zinc-400"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate text-base text-zinc-500 dark:text-zinc-400">
        ক্যালকুলেটর, কনভার্টার, ছুটি বা হটলাইন খুঁজুন
      </span>
      <kbd className="hidden shrink-0 rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-xs text-zinc-500 md:inline-block dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
        Ctrl K
      </kbd>
    </button>
  );
}
