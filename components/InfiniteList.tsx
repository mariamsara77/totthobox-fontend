"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Loader2, RefreshCw, CheckCircle2 } from "lucide-react";

export interface InfiniteListProps<T> {
  initialItems: T[];
  type: string;
  pageSize?: number;
  totalItems?: number;
  hasMoreInitial?: boolean;
  basePath?: string;
  extraParams?: Record<string, string>;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderSkeleton?: () => React.ReactNode;
  emptyMessage?: string;
  gridClassName?: string;
}

export default function InfiniteList<T extends { id?: string | number }>({
  initialItems,
  type,
  pageSize = 15,
  totalItems,
  hasMoreInitial = true,
  basePath,
  extraParams = {},
  renderItem,
  renderSkeleton,
  emptyMessage = "কোনো তথ্য পাওয়া যায়নি",
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
}: InfiniteListProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(hasMoreInitial);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const prefetchedPageRef = useRef<number | null>(null);
  const prefetchedDataRef = useRef<T[] | null>(null);

  // Sync initialItems when prop changes
  useEffect(() => {
    setItems(initialItems);
    setPage(1);
    setHasMore(hasMoreInitial);
    prefetchedPageRef.current = null;
    prefetchedDataRef.current = null;
  }, [initialItems, hasMoreInitial]);

  // Idle prefetching for page N+1
  const prefetchNextPage = useCallback(
    (nextPage: number) => {
      if (prefetchedPageRef.current === nextPage || !hasMore) return;

      const runPrefetch = async () => {
        try {
          const params = new URLSearchParams({
            page: String(nextPage),
            per_page: String(pageSize),
            ...extraParams,
          });
          const res = await fetch(`/api/feed/${type}?${params.toString()}`);
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
              prefetchedPageRef.current = nextPage;
              prefetchedDataRef.current = json.data;
            }
          }
        } catch {
          // Ignore prefetch failures
        }
      };

      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        (window as any).requestIdleCallback(() => runPrefetch());
      } else {
        setTimeout(runPrefetch, 1000);
      }
    },
    [type, pageSize, extraParams, hasMore],
  );

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setError(null);

    const nextPage = page + 1;

    // Use prefetched data if available
    if (
      prefetchedPageRef.current === nextPage &&
      prefetchedDataRef.current !== null
    ) {
      const newItems = prefetchedDataRef.current;
      setItems((prev) => [...prev, ...newItems]);
      setPage(nextPage);
      setHasMore(newItems.length >= pageSize);
      prefetchedPageRef.current = null;
      prefetchedDataRef.current = null;
      setIsLoading(false);
      prefetchNextPage(nextPage + 1);
      return;
    }

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        per_page: String(pageSize),
        ...extraParams,
      });

      const res = await fetch(`/api/feed/${type}?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const newItems = json.data;
        setItems((prev) => [...prev, ...newItems]);
        setPage(nextPage);
        setHasMore(json.meta?.has_more ?? newItems.length >= pageSize);
        prefetchNextPage(nextPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      setError("পরবর্তী পৃষ্ঠা লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, pageSize, extraParams, type, prefetchNextPage]);

  // IntersectionObserver trigger with rootMargin: 600px
  useEffect(() => {
    const node = triggerRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  if (items.length === 0 && !isLoading) {
    return (
      <div className="py-16 text-center text-zinc-500 space-y-2">
        <p className="text-base font-medium">{emptyMessage}</p>
      </div>
    );
  }

  const totalPages = totalItems ? Math.ceil(totalItems / pageSize) : undefined;

  return (
    <div className="space-y-6">
      {/* Live Item Grid */}
      <div
        className={gridClassName}
        role="feed"
        aria-busy={isLoading}
        aria-live="polite"
      >
        {items.map((item, idx) => (
          <React.Fragment key={item.id ?? idx}>
            {renderItem(item, idx)}
          </React.Fragment>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className={gridClassName} aria-hidden="true">
          {renderSkeleton ? (
            <>
              {renderSkeleton()}
              {renderSkeleton()}
              {renderSkeleton()}
            </>
          ) : (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/50 dark:bg-zinc-900/40 animate-pulse"
              />
            ))
          )}
        </div>
      )}

      {/* Error Retry */}
      {error && (
        <div className="py-4 text-center space-y-3">
          <p className="text-sm text-rose-500 font-medium">{error}</p>
          <button
            onClick={loadMore}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      )}

      {/* End of List State */}
      {!hasMore && items.length > 0 && (
        <div className="py-8 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>সকল তথ্য প্রদর্শিত হয়েছে ({items.length}টি)</span>
        </div>
      )}

      {/* Manual Keyboard Accessible Trigger & Fallback */}
      {hasMore && !isLoading && (
        <div className="flex justify-center pt-2">
          <button
            onClick={loadMore}
            className="px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition"
          >
            আরও লোড করুন (পৃষ্ঠা {page + 1})
          </button>
        </div>
      )}

      {/* Invisible Trigger for IntersectionObserver */}
      <div ref={triggerRef} className="h-4 w-full" aria-hidden="true" />

      {/* SEO-Safe Crawlable Pagination Fallback for Search Crawlers */}
      {basePath && (
        <nav
          aria-label="Pagination Navigation"
          className="sr-only"
        >
          {page > 1 && (
            <Link href={`${basePath}?page=${page - 1}`} rel="prev">
              পূর্ববর্তী পৃষ্ঠা ({page - 1})
            </Link>
          )}
          {hasMore && (
            <Link href={`${basePath}?page=${page + 1}`} rel="next">
              পরবর্তী পৃষ্ঠা ({page + 1})
            </Link>
          )}
          {totalPages && (
            <span>
              পৃষ্ঠা {page} / {totalPages}
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
