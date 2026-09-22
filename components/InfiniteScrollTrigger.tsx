"use client";

import { useEffect, useRef } from "react";

type InfiniteScrollTriggerProps = {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  label?: string;
};

export default function InfiniteScrollTrigger({
  hasMore,
  isLoading,
  onLoadMore,
  label = "আরও তথ্য লোড হচ্ছে...",
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
      { rootMargin: "500px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore]);

  if (!hasMore) return null;

  return (
    <div
      ref={triggerRef}
      className="flex min-h-12 items-center justify-center py-4"
      aria-live="polite"
      aria-busy={isLoading}
    >
      <span className="text-sm opacity-60">
        {isLoading ? label : "আরও তথ্যের জন্য নিচে স্ক্রল করুন"}
      </span>
    </div>
  );
}
