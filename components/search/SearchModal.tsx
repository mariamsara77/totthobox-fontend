"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { getSearchUrl } from "@/lib/searchRoutes";
import type { SearchItem } from "@/types/search";
import SearchInput from "./SearchInput";
import SearchPrefixes from "./SearchPrefixes";
import SearchResults from "./SearchResults";

interface SearchModalProps {
  onClose: () => void;
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const {
    search,
    setSearch,
    results,
    scope,
    total,
    hasMore,
    loading,
    metaLoading,
    selectedIndex,
    setSelectedIndex,
    prefixes,
    hints,
    showInitial,
    showResults,
    showNoResults,
    loadMore,
    clearSearch,
    choosePrefix,
    abort,
    limit,
    fetchResults,
  } = useGlobalSearch();

  // Enter animation
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Focus + body scroll lock + ESC
  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
      abort();
    };
  }, [abort]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setEntered(false);
    setTimeout(() => {
      onClose();
    }, 220);
  }, [onClose]);

  const openItem = useCallback(
    (item: SearchItem) => {
      handleClose();
      const url = getSearchUrl(item);
      if (url.startsWith("http://") || url.startsWith("https://")) {
        window.location.assign(url);
        return;
      }
      router.push(url);
    },
    [handleClose, router],
  );

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (!results.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(Math.min(selectedIndex + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(Math.max(selectedIndex - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        openItem(results[selectedIndex]);
      }
    },
    [results, selectedIndex, setSelectedIndex, openItem],
  );

  const handleChoosePrefix = (prefix: string) => {
    choosePrefix(prefix);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleClear = () => {
    clearSearch();
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSearch = () => {
    if (search.trim().length >= 2) {
      fetchResults(search, limit);
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="সাইটে অনুসন্ধান"
      className="fixed inset-0 z-100 flex items-start justify-center p-3 pt-[6vh] sm:p-6 sm:pt-[10vh]"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-all duration-800 ease-out ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-400/25 shadow-2xl backdrop-blur-xl transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          entered
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-[0.97] opacity-0"
        }`}
      >
        {/* Header */}
        <div className="relative border-b border-zinc-400/25">
          <SearchInput
            value={search}
            onChange={setSearch}
            onKeyDown={handleKeyDown}
            onClear={handleClear}
            onSearch={handleSearch}
            onClose={handleClose}
            loading={loading}
            inputRef={inputRef}
          />

          {showInitial && (
            <div
              className={`transition-all duration-300 ${
                entered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              }`}
            >
              <SearchPrefixes
                prefixes={prefixes}
                hints={hints}
                metaLoading={metaLoading}
                onChoose={handleChoosePrefix}
              />
            </div>
          )}
        </div>

        {/* Body */}
        <div
          className={`transition-all duration-300 delay-75 ${
            entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <SearchResults
            results={results}
            scope={scope}
            query={search}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            hasMore={hasMore}
            loading={loading}
            showResults={showResults}
            showNoResults={showNoResults}
            onSelect={openItem}
            onLoadMore={loadMore}
            onClear={handleClear}
          />
        </div>

        {/* Footer */}
        {(showResults || showNoResults) && (
          <div
            className={`flex items-center justify-between border-t border-zinc-400/15 px-4 py-2 text-[11px] text-zinc-500 transition-all duration-300 delay-100 ${
              entered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <span>
              {showResults
                ? `${total || results.length}টি ফলাফল`
                : "কোনো ফলাফল নেই"}
            </span>

            <div className="hidden items-center gap-3 sm:flex">
              <span className="flex items-center gap-1">
                <kbd className="inline-flex gap-0.5 rounded border border-zinc-200 bg-white px-1.5 py-0.5 dark:border-zinc-800 dark:bg-zinc-950">
                  <ArrowUpIcon className="size-2.5" />
                  <ArrowDownIcon className="size-2.5" />
                </kbd>
                নেভিগেট
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 dark:border-zinc-800 dark:bg-zinc-950">
                  ↵
                </kbd>
                খুলুন
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 dark:border-zinc-800 dark:bg-zinc-950">
                  Esc
                </kbd>
                বন্ধ
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
