"use client";

import { useEffect, useRef } from "react";
import { X, Settings, Bell, Shield, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import GoogleTranslateScript from "@/components/GoogleTranslateScript";
import LanguageSelect from "./LanguageSelect";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC কি চাপলে মোডাল বন্ধ করা এবং ব্যাকগ্রাউন্ড স্ক্রল লক করা
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // ব্যাকড্রপ ও আউটসাইড ক্লিক কভার
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 animate-in fade-in duration-800"
      onClick={onClose}
    >
      {/* মোডাল বক্স (stopPropagation ব্যবহার করা হয়েছে যাতে ভেতরের ক্লিকে মোডাল বন্ধ না হয়) */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md p-6 bg-white dark:bg-zinc-700 rounded-2xl borde border-zinc-400/25 animate-in zoom-in-95 duration-500 m-4"
      >
        {/* মোডাল হেডার */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-400/25">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-semibold text-lg">
            <Settings className="w-5 h-5" />
            <span>সেটিংস</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-zinc-400/25 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* সেটিংস অপশনসমূহ */}
        <div className="py-4 space-y-2">
         <ThemeToggle />
         <LanguageSelect />
        </div>

        {/* মোডাল ফুটার */}
        <div className="pt-4 border-t border-zinc-400/25 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-zinc-400/10 text-slate-700 dark:text-slate-200 hover:bg-zinc-400/25 transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}