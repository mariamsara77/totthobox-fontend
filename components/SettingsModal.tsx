"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSelect from "./LanguageSelect";
import { IoSettings } from "react-icons/io5";

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
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 px-4 py-6 backdrop-blur-[2px] transition-opacity duration-300 dark:bg-black/50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md transform rounded-2xl border border-zinc-200/80 bg-white/95 p-4 shadow-2xl backdrop-blur-xl transition-transform dark:border-zinc-700/80 dark:bg-zinc-900/95"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-700">
          <div className="flex items-center gap-2 text-lg font-medium">
            <IoSettings className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            <span id="settings-modal-title">সেটিংস</span>
          </div>

          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="সেটিংস বন্ধ করুন"
            className="rounded-lg p-1.5 opacity-50 transition-colors hover:bg-zinc-400/10 hover:opacity-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 py-5">
          <ThemeToggle />
          <LanguageSelect />
        </div>

        <div className="flex justify-end border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-zinc-400/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-400/25"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
