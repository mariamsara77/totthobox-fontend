"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: ReactKeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onSearch: () => void;
  onClose: () => void;
  loading: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
}

export default function SearchInput({
  value,
  onChange,
  onKeyDown,
  onClear,
  onSearch,
  onClose,
  loading,
  inputRef,
}: SearchInputProps) {
  return (
    <div className="flex min-h-15 items-center gap-2.5 px-4 sm:px-5">
      <MagnifyingGlassIcon
        aria-hidden="true"
        className="size-4 shrink-0 text-zinc-400 dark:text-zinc-500"
      />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="কী খুঁজছেন? বাংলা বা English..."
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="অনুসন্ধান"
        className="min-w-0 flex-1 bg-transparent text-[14.5px] leading-none text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600"
      />

      {loading && (
        <span
          aria-label="খোঁজা হচ্ছে"
          className="size-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-500 dark:border-zinc-700 dark:border-t-zinc-300"
        />
      )}

      {value && !loading && (
        <button
          type="button"
          onClick={onClear}
          aria-label="মুছুন"
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <XMarkIcon className="size-3.5" />
        </button>
      )}

      <button
        type="button"
        onClick={onSearch}
        aria-label="অনুসন্ধান করুন"
        className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-3 text-[12px] font-medium text-white transition-all hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        <MagnifyingGlassIcon className="size-3.5" />
      </button>

      <button
        type="button"
        onClick={onClose}
        aria-label="বন্ধ করুন"
        className="flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 sm:hidden"
      >
        <XMarkIcon className="size-4" />
      </button>

      <kbd className="hidden shrink-0 rounded-md border border-zinc-200/80 bg-zinc-50 px-2 py-1 text-[10px] font-medium text-zinc-400 sm:block dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500">
        ESC
      </kbd>
    </div>
  );
}
