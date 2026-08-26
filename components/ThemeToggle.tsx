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
    return <div className="h-10 w-full rounded-xl bg-zinc-400/10 animate-pulse" />;
  }

  const themes = [
    { id: "light", label: "লাইট", icon: Sun },
    { id: "dark", label: "ডার্ক", icon: Moon },
    { id: "system", label: "সিস্টেম", icon: Monitor },
  ];

  return (
    <div className="flex w-full gap-2 items-center rounded-xl p-1 bg-zinc-400/10 border border-zinc-400/25">
      {themes.map(({ id, label, icon: Icon }) => {
        const isActive = theme === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setTheme(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl p-2 text-sm ${
              isActive
                ? "bg-zinc-400/25"
                : "hover:bg-zinc-400/25 opacity-50"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
