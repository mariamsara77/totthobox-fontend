"use client";

import type { KeyboardEvent } from "react";
import {
  Check,
  Monitor,
  Moon,
  Palette,
  PanelLeft,
  RotateCcw,
  Sliders,
  Sparkles,
  Sun,
  Type,
} from "lucide-react";
import { useAppearance } from "@/context/AppearanceContext";
import {
  ACCENT_OPTIONS,
  DENSITY_OPTIONS,
  FONT_SIZE_OPTIONS,
  RADIUS_OPTIONS,
  SIDEBAR_STYLE_OPTIONS,
  THEME_MODE_OPTIONS,
  type ThemeMode,
} from "@/lib/appearance";

const MODE_ICONS: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

function handleRadioKeyDown<T extends string>(
  e: KeyboardEvent<HTMLButtonElement>,
  options: ReadonlyArray<{ id: T }>,
  current: T,
  onChange: (next: T) => void,
) {
  const idx = options.findIndex((o) => o.id === current);
  if (idx === -1) return;

  let nextIdx = -1;
  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    nextIdx = (idx + 1) % options.length;
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    nextIdx = (idx - 1 + options.length) % options.length;
  } else if (e.key === "Home") {
    nextIdx = 0;
  } else if (e.key === "End") {
    nextIdx = options.length - 1;
  }

  if (nextIdx !== -1) {
    e.preventDefault();
    onChange(options[nextIdx].id);
    const parent = e.currentTarget.parentElement;
    const buttons = parent?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    buttons?.[nextIdx]?.focus();
  }
}

interface AppearanceSettingsProps {
  compact?: boolean;
}

export default function AppearanceSettings({
  compact = false,
}: AppearanceSettingsProps) {
  const {
    mode,
    accent,
    radius,
    density,
    fontSize,
    reduceMotion,
    sidebarStyle,
    mounted,
    setMode,
    setAccent,
    setRadius,
    setDensity,
    setFontSize,
    setReduceMotion,
    setSidebarStyle,
    resetAppearance,
  } = useAppearance();

  if (!mounted) {
    return (
      <div className="space-y-3" aria-hidden="true">
        <div className="h-20 w-full rounded-xl bg-zinc-200/70 dark:bg-zinc-800/60" />
        <div className="h-14 w-full rounded-xl bg-zinc-200/70 dark:bg-zinc-800/60" />
        <div className="h-12 w-full rounded-xl bg-zinc-200/70 dark:bg-zinc-800/60" />
      </div>
    );
  }

  return (
    <section
      aria-label="থিম ও অ্যাপিয়ারেন্স সেটিংস"
      className={
        compact
          ? "space-y-4"
          : "space-y-5 rounded-[var(--radius-xl)] bg-[var(--surface-sunken)] p-4 shadow-[0_0_0_1px_var(--surface-hairline)]"
      }
    >
      {/* Top Row: Heading & Reset */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          থিম ও কাস্টমাইজেশন
        </span>
        <button
          type="button"
          onClick={resetAppearance}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 active:scale-[0.98] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <RotateCcw className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
          <span>ডিফল্ট রিসেট</span>
        </button>
      </div>

      {/* Live Preview */}
      {!compact && (
        <div
          aria-label="লাইভ থিম প্রিভিউ"
          className="rounded-[var(--radius-lg)] bg-[var(--surface-card)] shadow-[0_0_0_1px_var(--surface-hairline),var(--shadow-xs)]"
          style={{ padding: "var(--space-card)" }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-[var(--accent-primary)]"
                />
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  লাইভ প্রিভিউ
                </span>
              </div>
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                ১ শতাংশ জমি ={" "}
                <span className="font-mono tabular-nums text-[var(--accent-ink)]">
                  ৪৩৫.৬
                </span>{" "}
                বর্গফুট
              </p>
            </div>

            <span className="shrink-0 rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-3 py-1.5 text-xs font-medium text-[var(--accent-foreground)]">
              সক্রিয়
            </span>
          </div>
        </div>
      )}

      {/* 1. Mode Selection */}
      <div className="space-y-2">
        <span
          id="appearance-mode-label"
          className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
        >
          স্ক্রিন মোড
        </span>
        <div
          role="radiogroup"
          aria-labelledby="appearance-mode-label"
          className="grid grid-cols-3 gap-1.5 rounded-[var(--radius-lg)] bg-[var(--surface-card)] p-1 shadow-[0_0_0_1px_var(--surface-hairline)]"
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
                tabIndex={isActive ? 0 : -1}
                onKeyDown={(e) =>
                  handleRadioKeyDown(e, THEME_MODE_OPTIONS, mode, setMode)
                }
                onClick={() => setMode(option.id)}
                className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-[var(--radius-md)] px-2 py-1.5 text-xs font-medium transition-colors active:scale-[0.98] ${
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

      {/* 2. Accent Color */}
      <div className="space-y-2">
        <div
          id="appearance-accent-label"
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400"
        >
          <Palette className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
          <span>অ্যাকসেন্ট রঙ</span>
        </div>
        <div
          role="radiogroup"
          aria-labelledby="appearance-accent-label"
          className="grid grid-cols-3 gap-2"
        >
          {ACCENT_OPTIONS.map((option) => {
            const isActive = accent === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                tabIndex={isActive ? 0 : -1}
                aria-label={`${option.labelBn} (${option.labelEn})`}
                onKeyDown={(e) =>
                  handleRadioKeyDown(e, ACCENT_OPTIONS, accent, setAccent)
                }
                onClick={() => setAccent(option.id)}
                className={`flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] px-2.5 py-1.5 text-xs font-medium transition-colors active:scale-[0.98] ${
                  isActive
                    ? "bg-[var(--accent-soft)] text-[var(--accent-ink)] shadow-[0_0_0_1px_var(--accent-soft-border)]"
                    : "bg-[var(--surface-card)] text-zinc-700 shadow-[0_0_0_1px_var(--surface-hairline)] hover:bg-[var(--surface-raised)] dark:text-zinc-300"
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
                <span className="truncate">{option.labelBn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Radius & Density */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div
            id="appearance-radius-label"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            <Sliders className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            <span>কর্নার রেডিয়াস</span>
          </div>
          <div
            role="radiogroup"
            aria-labelledby="appearance-radius-label"
            className="grid grid-cols-3 gap-1 rounded-[var(--radius-lg)] bg-[var(--surface-card)] p-1 shadow-[0_0_0_1px_var(--surface-hairline)]"
          >
            {RADIUS_OPTIONS.map((option) => {
              const isActive = radius === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onKeyDown={(e) =>
                    handleRadioKeyDown(e, RADIUS_OPTIONS, radius, setRadius)
                  }
                  onClick={() => setRadius(option.id)}
                  className={`min-h-10 rounded-[var(--radius-md)] px-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent-primary)] text-[var(--accent-foreground)]"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <span
            id="appearance-density-label"
            className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            লেআউট ডেনসিটি
          </span>
          <div
            role="radiogroup"
            aria-labelledby="appearance-density-label"
            className="grid grid-cols-2 gap-1 rounded-[var(--radius-lg)] bg-[var(--surface-card)] p-1 shadow-[0_0_0_1px_var(--surface-hairline)]"
          >
            {DENSITY_OPTIONS.map((option) => {
              const isActive = density === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onKeyDown={(e) =>
                    handleRadioKeyDown(e, DENSITY_OPTIONS, density, setDensity)
                  }
                  onClick={() => setDensity(option.id)}
                  className={`min-h-10 rounded-[var(--radius-md)] px-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent-primary)] text-[var(--accent-foreground)]"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Font Size & Sidebar Style */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div
            id="appearance-fontsize-label"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            <Type className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            <span>বাংলা ফন্ট সাইজ</span>
          </div>
          <div
            role="radiogroup"
            aria-labelledby="appearance-fontsize-label"
            className="grid grid-cols-3 gap-1 rounded-[var(--radius-lg)] bg-[var(--surface-card)] p-1 shadow-[0_0_0_1px_var(--surface-hairline)]"
          >
            {FONT_SIZE_OPTIONS.map((option) => {
              const isActive = fontSize === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  tabIndex={isActive ? 0 : -1}
                  aria-label={option.label}
                  onKeyDown={(e) =>
                    handleRadioKeyDown(
                      e,
                      FONT_SIZE_OPTIONS,
                      fontSize,
                      setFontSize,
                    )
                  }
                  onClick={() => setFontSize(option.id)}
                  className={`min-h-10 rounded-[var(--radius-md)] px-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent-primary)] text-[var(--accent-foreground)]"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {option.short}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <div
            id="appearance-sidebar-label"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            <PanelLeft className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            <span>সাইডবার ধরন</span>
          </div>
          <div
            role="radiogroup"
            aria-labelledby="appearance-sidebar-label"
            className="grid grid-cols-3 gap-1 rounded-[var(--radius-lg)] bg-[var(--surface-card)] p-1 shadow-[0_0_0_1px_var(--surface-hairline)]"
          >
            {SIDEBAR_STYLE_OPTIONS.map((option) => {
              const isActive = sidebarStyle === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onKeyDown={(e) =>
                    handleRadioKeyDown(
                      e,
                      SIDEBAR_STYLE_OPTIONS,
                      sidebarStyle,
                      setSidebarStyle,
                    )
                  }
                  onClick={() => setSidebarStyle(option.id)}
                  className={`min-h-10 rounded-[var(--radius-md)] px-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent-primary)] text-[var(--accent-foreground)]"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Reduce Motion Toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={reduceMotion}
        onClick={() => setReduceMotion(!reduceMotion)}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-[var(--radius-lg)] bg-[var(--surface-card)] px-3.5 py-2.5 text-left shadow-[0_0_0_1px_var(--surface-hairline)] transition-colors hover:bg-[var(--surface-raised)]"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <Sparkles
            className="size-4 shrink-0 text-zinc-500 dark:text-zinc-400"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span className="min-w-0">
            <span className="block text-xs font-medium text-zinc-900 dark:text-zinc-100">
              মোশন ও অ্যানিমেশন কমান
            </span>
            <span className="block text-xs text-zinc-500 dark:text-zinc-400">
              দ্রুত ও স্থির স্ক্রিন অভিজ্ঞতার জন্য
            </span>
          </span>
        </span>

        <span
          aria-hidden="true"
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
            reduceMotion
              ? "bg-[var(--accent-primary)]"
              : "bg-zinc-300 dark:bg-zinc-700"
          }`}
        >
          <span
            className={`size-5 rounded-full bg-white shadow-xs transition-transform ${
              reduceMotion ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </span>
      </button>
    </section>
  );
}
