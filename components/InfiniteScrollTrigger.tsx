"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type InfiniteScrollTriggerProps = {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  label?: string;
  basePath?: string;
  currentPage?: number;
  totalPages?: number;
};

export default function InfiniteScrollTrigger({
  hasMore,
  isLoading,
  onLoadMore,
  label = "আরও তথ্য লোড হচ্ছে...",
  basePath,
  currentPage = 1,
  totalPages,
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const loadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    loadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    const node = triggerRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasMore &&
          !loadingRef.current
        ) {
          loadingRef.current = true;
          loadMoreRef.current();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore]);

  if (!hasMore) return null;

  return (
    <div className="py-6 space-y-4">
      {/* Visual trigger / loading indicator */}
      <div
        ref={triggerRef}
        className="flex min-h-[52px] items-center justify-center"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
            <span>{label}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (!loadingRef.current) {
                loadingRef.current = true;
                onLoadMore();
              }
            }}
            className="px-5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            আরও লোড করুন
          </button>
        )}
      </div>

      {/* Crawlable pagination links for search crawlers */}
      {basePath && (
        <nav aria-label="Pagination Navigation" className="sr-only">
          {currentPage > 1 && (
            <Link href={`${basePath}?page=${currentPage - 1}`} rel="prev">
              পূর্ববর্তী পৃষ্ঠা ({currentPage - 1})
            </Link>
          )}
          {hasMore && (
            <Link href={`${basePath}?page=${currentPage + 1}`} rel="next">
              পরবর্তী পৃষ্ঠা ({currentPage + 1})
            </Link>
          )}
          {totalPages && (
            <span>
              পৃষ্ঠা {currentPage} / {totalPages}
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
