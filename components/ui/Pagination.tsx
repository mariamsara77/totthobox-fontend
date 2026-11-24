import React from "react";
import Link from "next/link";
import Icon from "./Icon";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  makeHref: (page: number) => string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  makeHref,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const delta = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav
      aria-label="পেজিনেশন নেভিগেশন"
      className={`flex items-center justify-center gap-1.5 py-4 ${className}`}
    >
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={makeHref(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors min-h-9"
          aria-label="আগের পাতা"
        >
          <Icon name="ChevronLeft" size={14} />
          <span className="hidden sm:inline">পূর্ববর্তী</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-100 dark:border-zinc-800/40 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-300 dark:text-zinc-600 cursor-not-allowed min-h-9">
          <Icon name="ChevronLeft" size={14} />
          <span className="hidden sm:inline">পূর্ববর্তী</span>
        </span>
      )}

      {/* Pages */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-1 text-xs text-zinc-400 select-none"
              >
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isCurrent = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={makeHref(pageNum)}
              aria-current={isCurrent ? "page" : undefined}
              className={`flex items-center justify-center min-w-9 h-9 px-2 text-xs font-semibold rounded-lg transition-colors ${
                isCurrent
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={makeHref(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors min-h-9"
          aria-label="পরের পাতা"
        >
          <span className="hidden sm:inline">পরবর্তী</span>
          <Icon name="ChevronRight" size={14} />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-100 dark:border-zinc-800/40 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-300 dark:text-zinc-600 cursor-not-allowed min-h-9">
          <span className="hidden sm:inline">পরবর্তী</span>
          <Icon name="ChevronRight" size={14} />
        </span>
      )}
    </nav>
  );
}

export default Pagination;
