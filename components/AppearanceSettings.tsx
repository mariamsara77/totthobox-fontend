"use client";

import { Check, Monitor, Moon, Palette, RotateCcw, Sun } from "lucide-react";
import { useAppearance } from "@/context/AppearanceContext";
import {
  ACCENT_OPTIONS,
  THEME_MODE_OPTIONS,
  type ThemeMode,
} from "@/lib/appearance";

const MODE_ICONS: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

interface AppearanceSettingsProps {
  compact?: boolean;
}

export default function AppearanceSettings({
  compact = false,
}: AppearanceSettingsProps) {
  const { mode, accent, mounted, setMode, setAccent, resetAppearance } =
    useAppearance();

  if (!mounted) {
    return (
      <div className="space-y-3" aria-hidden="true">
        <div className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-800/40" />
        <div className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-800/40" />
      </div>
    );
  }

  return (
    <section
      aria-label="থিম ও রঙের পছন্দ"
      className={
        compact
          ? "space-y-4"
          : "space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
      }
    >
      {/* Mode Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            পঠন ও স্ক্রিন মোড
          </span>
          <button
            type="button"
            onClick={resetAppearance}
            className="inline-flex min-h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <RotateCcw className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            <span>ডিফল্ট</span>
          </button>
        </div>

        <div
          role="radiogroup"
          aria-label="থিম মোড নির্বাচন"
          className="grid grid-cols-3 gap-1.5 rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950"
        >
          {THEME_MODE_OPTIONS.map((option) => {
            const Icon = MODE_ICONS[option.id];
            const isActive = mode === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => setMode(option.id)}
                className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors active:scale-[0.98] ${
                  isActive
                    ? "bg-[var(--accent-primary)] text-[var(--accent-foreground)]"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-Color Accent Palette Picker */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <Palette className="size-3.5 text-zinc-500 dark:text-zinc-400" strokeWidth={1.75} aria-hidden="true" />
          <span>অ্যাকসেন্ট রঙ</span>
        </div>

        <div
          role="radiogroup"
          aria-label="অ্যাকসেন্ট রঙ নির্বাচন"
          className="flex flex-wrap items-center gap-2"
        >
          {ACCENT_OPTIONS.map((option) => {
            const isActive = accent === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-label={`${option.labelBn} (${option.labelEn})`}
                title={`${option.labelBn} (${option.labelEn})`}
                onClick={() => setAccent(option.id)}
                className={`flex min-h-11 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors active:scale-[0.98] ${
                  isActive
                    ? "border-[var(--accent-primary)] bg-[var(--accent-soft)] text-[var(--accent-ink)]"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="flex size-4 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: option.swatch }}
                >
                  {isActive && (
                    <Check className="size-2.5 text-white" strokeWidth={2.5} />
                  )}
                </span>
                <span>{option.labelBn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
