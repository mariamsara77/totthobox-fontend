"use client";

import { Monitor, Moon, SlidersHorizontal, Sun } from "lucide-react";
import { useAppearance } from "@/context/AppearanceContext";
import { THEME_MODE_OPTIONS, type ThemeMode } from "@/lib/appearance";

const MODE_ICONS: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const MODE_ORDER: ThemeMode[] = ["light", "dark", "system"];

interface SidebarThemeControlProps {
  collapsed?: boolean;
  touchFriendly?: boolean;
  onOpenSettings: () => void;
  onHover?: (e: React.MouseEvent<HTMLElement>, label: string) => void;
  onLeave?: () => void;
}

/**
 * Sticky sidebar footer control for switching Light / Dark / System mode
 * and opening the full Appearance Settings dialog across expanded, rail, and drawer views.
 */
export default function SidebarThemeControl({
  collapsed = false,
  touchFriendly = false,
  onOpenSettings,
  onHover,
  onLeave,
}: SidebarThemeControlProps) {
  const { mode, mounted, setMode } = useAppearance();
  const minBtnH = touchFriendly ? "min-h-11" : "min-h-9";

  const activeOption =
    THEME_MODE_OPTIONS.find((item) => item.id === mode) ??
    THEME_MODE_OPTIONS[0];
  const ActiveIcon = MODE_ICONS[mode];

  const handleCycleMode = () => {
    const idx = MODE_ORDER.indexOf(mode);
    const next = MODE_ORDER[(idx + 1) % MODE_ORDER.length];
    setMode(next);
  };

  if (collapsed) {
    return (
      <div className="space-y-1">
        <button
          type="button"
          onClick={handleCycleMode}
          onMouseEnter={(e) =>
            onHover?.(e, `থিম: ${activeOption.label} (বদলান)`)
          }
          onMouseLeave={onLeave}
          aria-label={`থিম মোড পরিবর্তন করুন (বর্তমান: ${activeOption.label})`}
          title={`থিম: ${activeOption.label}`}
          className="flex min-h-10 w-full items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          {mounted ? (
            <ActiveIcon className="size-4.5" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Sun className="size-4.5 opacity-50" strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          onMouseEnter={(e) => onHover?.(e, "থিম ও সেটিংস")}
          onMouseLeave={onLeave}
          aria-label="থিম ও অ্যাপিয়ারেন্স সেটিংস খুলুন"
          title="থিম ও সেটিংস"
          className="flex min-h-10 w-full items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <SlidersHorizontal className="size-4.5" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {mounted ? (
        <div
          role="radiogroup"
          aria-label="থিম মোড নির্বাচন"
          className="grid grid-cols-3 gap-1 rounded-lg bg-[var(--surface-raised)] p-1"
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
                className={`flex ${minBtnH} items-center justify-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors active:scale-[0.98] ${
                  isActive
                    ? "bg-[var(--surface-card)] text-[var(--accent-ink)] shadow-[var(--shadow-xs)]"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                <Icon className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div
          aria-hidden="true"
          className={`w-full rounded-lg bg-[var(--surface-raised)] ${
            touchFriendly ? "h-13" : "h-11"
          }`}
        />
      )}

      <button
        type="button"
        onClick={onOpenSettings}
        className={`flex ${minBtnH} w-full items-center gap-2.5 rounded-lg px-2.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200/70 hover:text-zinc-900 active:scale-[0.99] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100`}
      >
        <SlidersHorizontal
          className="size-4 shrink-0 text-zinc-500 dark:text-zinc-400"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <span className="flex-1 truncate text-left">অ্যাপিয়ারেন্স ও থিম সেটিংস</span>
      </button>
    </div>
  );
}
