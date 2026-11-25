"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Clock, Star, Trash2, X } from "lucide-react";
import { useMobileNav } from "@/context/MobileNavContext";
import { useFavorites } from "@/components/tools/QuickFavorites";
import {
  clearRecentVisits,
  getRecentVisits,
  recordRecentVisit,
  type RecentVisitItem,
} from "@/lib/recent-history";

export default function SavedHistorySheet() {
  const pathname = usePathname();
  const { isSavedOpen, closeSaved } = useMobileNav();
  const { favorites } = useFavorites();
  const [recent, setRecent] = useState<RecentVisitItem[]>([]);

  useEffect(() => {
    recordRecentVisit(pathname, typeof document !== "undefined" ? document.title : "");
  }, [pathname]);

  useEffect(() => {
    if (isSavedOpen) {
      setRecent(getRecentVisits());
    }
  }, [isSavedOpen]);

  useEffect(() => {
    if (!isSavedOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSaved();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSavedOpen, closeSaved]);

  if (!isSavedOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="সংরক্ষিত এবং সাম্প্রতিক ইতিহাস"
      className="fixed inset-0 z-[80] flex items-end justify-center md:hidden"
    >
      <button
        type="button"
        aria-label="বন্ধ করুন"
        onClick={closeSaved}
        className="fixed inset-0 bg-black/45 transition-opacity"
      />

      <div className="pb-safe relative z-10 flex max-h-[82dvh] w-full flex-col rounded-t-2xl border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <Bookmark className="size-4 text-[var(--accent-ink)]" strokeWidth={1.75} aria-hidden="true" />
            <span>সংরক্ষিত ও সাম্প্রতিক</span>
          </div>
          <button
            type="button"
            onClick={closeSaved}
            aria-label="বন্ধ করুন"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          {/* Favorites */}
          <section className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <Star className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              <span>প্রিয় টুলস</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {favorites.map((fav) => (
                <Link
                  key={fav.id}
                  href={fav.path}
                  onClick={closeSaved}
                  className="flex min-h-11 items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-300 active:scale-[0.99] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  <span className="truncate">{fav.title}</span>
                  {fav.category && (
                    <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                      {fav.category}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>

          {/* Recent History */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <Clock className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                <span>সাম্প্রতিক পরিদর্শন</span>
              </div>
              {recent.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    clearRecentVisits();
                    setRecent([]);
                  }}
                  className="inline-flex min-h-8 items-center gap-1 rounded-lg px-2 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  <Trash2 className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                  <span>মুছুন</span>
                </button>
              )}
            </div>

            {recent.length === 0 ? (
              <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-4 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                এখনো কোনো সাম্প্রতিক পাতা সংরক্ষিত হয়নি
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-1.5">
                {recent.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSaved}
                    className="flex min-h-11 items-center justify-between rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-800 transition-colors hover:border-zinc-300 active:scale-[0.99] dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200"
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="shrink-0 font-mono text-xs text-zinc-400">
                      {item.href}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
