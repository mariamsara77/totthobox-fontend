"use client";

import { useEffect, useRef } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import AppearanceSettings from "./AppearanceSettings";
import LanguageSelect from "./LanguageSelect";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      closeButtonRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-6 transition-opacity"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3.5 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            <SlidersHorizontal className="size-4 text-zinc-500 dark:text-zinc-400" strokeWidth={1.75} aria-hidden="true" />
            <span id="settings-modal-title">অ্যাপিয়ারেন্স ও সেটিংস</span>
          </div>

          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="সেটিংস বন্ধ করুন"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 py-4">
          <AppearanceSettings />
          <LanguageSelect />
        </div>

        <div className="flex justify-end border-t border-zinc-200 pt-3.5 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
