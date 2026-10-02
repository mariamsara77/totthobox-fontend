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
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#06201c]/35 px-4 py-6 backdrop-blur-lg transition-opacity duration-300 dark:bg-black/70"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="surface-panel w-full max-w-md transform rounded-[1.6rem] p-4 shadow-[0_28px_90px_rgb(6_32_28_/_0.22)] transition-transform sm:p-5"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-700">
          <div className="flex items-center gap-2 text-lg font-extrabold">
            <IoSettings className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            <span id="settings-modal-title">সেটিংস</span>
          </div>

          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="সেটিংস বন্ধ করুন"
            className="nav-icon-button flex size-9 items-center justify-center rounded-xl"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 py-5">
          <ThemeToggle />
          <LanguageSelect />
        </div>

        <div className="flex justify-end border-t border-[var(--brand-border)] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_20px_var(--brand-glow)] transition hover:bg-[var(--brand-primary-strong)]"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
