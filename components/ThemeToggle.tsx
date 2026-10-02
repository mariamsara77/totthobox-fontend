"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-12 w-full animate-pulse rounded-2xl bg-zinc-400/10" />;
  }

  const themes = [
    { id: "light", label: "লাইট", icon: Sun },
    { id: "dark", label: "ডার্ক", icon: Moon },
    { id: "system", label: "সিস্টেম", icon: Monitor },
  ];

  return (
    <div
      className="grid w-full grid-cols-3 gap-1.5 rounded-[1.25rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-1.5"
      role="group"
      aria-label="থিম নির্বাচন"
    >
      {themes.map(({ id, label, icon: Icon }) => {
        const isActive = theme === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => setTheme(id)}
            aria-pressed={isActive}
            className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-all sm:text-sm ${
              isActive
                ? "bg-[var(--brand-primary)] text-white shadow-[0_8px_18px_var(--brand-glow)]"
                : "text-zinc-600 hover:bg-white/75 dark:text-zinc-300 dark:hover:bg-white/10"
            }`}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
