"use client";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { SearchItem } from "@/types/search";

function highlightMatch(text: string, query: string) {
  const cleanQuery = query.trim();
  if (!cleanQuery || cleanQuery.length < 2) return <>{text}</>;

  const tokens = cleanQuery
    .replace(/^[^:]+:/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4);

  if (!tokens.length) return <>{text}</>;

  const pattern = new RegExp(
    `(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "giu",
  );

  return (
    <>
      {text.split(pattern).map((part, i) =>
        tokens.some(
          (t) => part.toLocaleLowerCase() === t.toLocaleLowerCase(),
        ) ? (
          <mark
            key={i}
            className="rounded-[3px] bg-amber-100 px-0.5 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

interface SearchResultItemProps {
  item: SearchItem;
  index: number;
  selected: boolean;
  query: string;
  onSelect: () => void;
  onHover: () => void;
}

export default function SearchResultItem({
  item,
  index,
  selected,
  query,
  onSelect,
  onHover,
}: SearchResultItemProps) {
  return (
    <button
      type="button"
      data-search-index={index}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-zinc-300/60 dark:focus:ring-zinc-600 ${
        selected
          ? "bg-zinc-100/90 dark:bg-zinc-800/70"
          : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
      }`}
      aria-current={selected ? "true" : undefined}
    >
      <div
        className={`flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border text-sm transition-colors ${
          selected
            ? "border-zinc-300/70 bg-white dark:border-zinc-600 dark:bg-zinc-900"
            : "border-zinc-200/70 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60"
        }`}
      >
        {item._search_image ? (
          <img
            src={item._search_image}
            alt=""
            loading="lazy"
            className="size-full object-cover"
          />
        ) : item._search_icon ? (
          <span aria-hidden="true">{item._search_icon}</span>
        ) : (
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-600">
            {item._search_title?.charAt(0)?.toUpperCase() || "?"}
          </span>
        )}
      </div>

      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-[13.5px] font-medium leading-snug ${
            selected
              ? "text-zinc-950 dark:text-white"
              : "text-zinc-800 dark:text-zinc-200"
          }`}
        >
          {highlightMatch(item._search_title, query)}
        </span>
        {item._search_subtitle && (
          <span className="mt-0.5 block truncate text-[11.5px] text-zinc-400 dark:text-zinc-500">
            {item._search_subtitle}
          </span>
        )}
      </span>

      <span className="hidden shrink-0 rounded-md border border-zinc-200/70 bg-zinc-50 px-2 py-0.5 text-[10.5px] font-medium text-zinc-400 sm:block dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-500">
        {item._search_label}
      </span>

      <ChevronRightIcon
        className={`size-3.5 shrink-0 transition-all duration-100 ${
          selected
            ? "translate-x-0.5 text-zinc-500 dark:text-zinc-300"
            : "text-zinc-300 dark:text-zinc-700"
        }`}
      />
    </button>
  );
}
