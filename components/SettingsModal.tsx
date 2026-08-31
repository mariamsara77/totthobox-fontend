"use client";

import { useEffect, useRef } from "react";
import { X, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageSelect from "./LanguageSelect"; // আপনার কম্পোনেন্ট

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
    // স্ট্যান্ডার্ড ব্লার এবং ব্যাকড্রপ কালার
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md p-4 bg-zinc-200 dark:bg-zinc-700 rounded-2xl shadow-xl transform transition-transform"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-2 text-lg font-medium">
            <Settings className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            <span id="settings-modal-title">সেটিংস</span>
          </div>
          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="সেটিংস বন্ধ করুন"
            className="p-1.5 rounded-lg opacity-50 hover:opacity-100 hover:bg-zinc-400/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4">
          <ThemeToggle />
          <LanguageSelect />
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-zinc-400/10 hover:bg-zinc-400/25 rounded-xl transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
