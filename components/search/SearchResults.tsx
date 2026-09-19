"use client";

import { useEffect, useRef } from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import type { SearchItem } from "@/types/search";
import SearchResultItem from "./SearchResultItem";
import SearchEmpty from "./SearchEmpty";

interface SearchResultsProps {
  results: SearchItem[];
  scope: string | null;
  query: string;
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  hasMore: boolean;
  loading: boolean;
  showResults: boolean;
  showNoResults: boolean;
  onSelect: (item: SearchItem) => void;
  onLoadMore: () => void;
  onClear: () => void;
}

export default function SearchResults({
  results,
  scope,
  query,
  selectedIndex,
  setSelectedIndex,
  hasMore,
  loading,
  showResults,
  showNoResults,
  onSelect,
  onLoadMore,
  onClear,
}: SearchResultsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading || !query.trim()) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { root: listRef.current, rootMargin: "160px 0px", threshold: 0 },
    );
    const target = loadMoreRef.current;
    if (target) observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loading, query, onLoadMore]);

  // Scroll selected into view
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-search-index="${selectedIndex}"]`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  return (
    <div
      ref={listRef}
      className="max-h-[min(60vh,520px)] min-h-0 overflow-y-auto overscroll-contain scroll-smooth"
    >
      {showResults ? (
        <>
          {scope && (
            <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-zinc-400/25 px-4 py-2 backdrop-blur-2xl bg-white/90 dark:bg-zinc-700/90">
              <FunnelIcon className="size-3 shrink-0 text-zinc-400" />
              <span className="text-[11px] text-zinc-400">ফিল্টার:</span>
              <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                {scope}
              </span>
            </div>
          )}

          <div className="p-1.5 sm:p-2">
            {results.map((item, index) => (
              <SearchResultItem
                key={`${item._search_type}-${item._search_slug}-${index}`}
                item={item}
                index={index}
                selected={index === selectedIndex}
                query={query}
                onSelect={() => onSelect(item)}
                onHover={() => setSelectedIndex(index)}
              />
            ))}
          </div>

          {(hasMore || loading) && (
            <div ref={loadMoreRef} className="flex justify-center py-4">
              <span
                aria-label="আরও ফলাফল লোড হচ্ছে"
                className="size-4 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-500 dark:border-zinc-700 dark:border-t-zinc-300"
              />
            </div>
          )}
        </>
      ) : showNoResults ? (
        <SearchEmpty type="no-results" search={query} onClear={onClear} />
      ) : loading && !results.length ? (
        <SearchEmpty type="skeleton" />
      ) : (
        <SearchEmpty type="initial" />
      )}
    </div>
  );
}
