"use client";

import { useEffect, useRef } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import AppearanceSettings from "./AppearanceSettings";
import LanguageSelect from "./LanguageSelect";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab" || !modalRef.current) return;
      const focusables = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.tabIndex >= 0 || el.getAttribute("tabindex") === "0" || !el.hasAttribute("tabindex"));

      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-xl)] bg-[var(--surface-card)] p-5 shadow-[0_0_0_1px_var(--surface-hairline),var(--shadow-md)]"
      >
        <div className="flex items-center justify-between pb-3.5 shadow-[0_1px_0_var(--surface-hairline)]">
          <div className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            <SlidersHorizontal
              className="size-4 text-zinc-500 dark:text-zinc-400"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span id="settings-modal-title">অ্যাপিয়ারেন্স ও সেটিংস</span>
          </div>

          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="সেটিংস বন্ধ করুন"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-md)] text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 py-4">
          <AppearanceSettings />
          <LanguageSelect />
        </div>

        <div className="flex justify-end pt-3.5 shadow-[0_-1px_0_var(--surface-hairline)]">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-[var(--radius-lg)] bg-[var(--surface-raised)] px-4 py-2 text-sm font-medium text-zinc-800 shadow-[0_0_0_1px_var(--surface-hairline)] transition-colors hover:bg-zinc-200/70 active:scale-[0.98] dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
