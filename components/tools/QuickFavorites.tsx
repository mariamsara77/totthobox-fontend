"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Star } from "lucide-react";

export interface FavoriteTool {
  id: string;
  title: string;
  path: string;
  category?: string;
}

const DEFAULT_FAVORITES: FavoriteTool[] = [
  {
    id: "bangla-calendar",
    title: "বাংলা ক্যালেন্ডার",
    path: "/bangla/calendar",
    category: "ক্যালেন্ডার",
  },
  {
    id: "currency-converter",
    title: "কারেন্সি কনভার্টার",
    path: "/converter/currency",
    category: "কনভার্টার",
  },
  {
    id: "age-calculator",
    title: "বয়স ক্যালকুলেটর",
    path: "/tools/age-calculator",
    category: "টুলস",
  },
  {
    id: "speed-test",
    title: "স্পিড টেস্ট",
    path: "/tools/internet-speed-test",
    category: "ইউটিলিটি",
  },
];

const STORAGE_KEY = "totthobox_favorite_tools";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteTool[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites(DEFAULT_FAVORITES);
      }
    } catch {
      setFavorites(DEFAULT_FAVORITES);
    }
    setIsLoaded(true);
  }, []);

  const isFavorite = (id: string) => favorites.some((f) => f.id === id);

  const toggleFavorite = (tool: FavoriteTool) => {
    setFavorites((prev) => {
      let updated: FavoriteTool[];
      if (prev.some((f) => f.id === tool.id)) {
        updated = prev.filter((f) => f.id !== tool.id);
      } else {
        updated = [tool, ...prev].slice(0, 8);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return { favorites, isFavorite, toggleFavorite, isLoaded };
}

export function FavoriteButton({
  tool,
  className = "",
}: {
  tool: FavoriteTool;
  className?: string;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(tool.id);
  const [showToast, setShowToast] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleClick}
        aria-label={
          active ? "প্রিয় তালিকা থেকে সরান" : "প্রিয় তালিকায় যোগ করুন"
        }
        title={
          active
            ? "প্রিয় তালিকাভুক্ত (ক্লিক করে সরান)"
            : "প্রিয় তালিকায় রাখুন"
        }
        className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl border p-2.5 transition-colors active:scale-95 ${
          active
            ? "border-[var(--accent-soft-border)] bg-[var(--accent-soft)] text-[var(--accent-ink)]"
            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        } ${className}`}
      >
        <Star
          size={18}
          strokeWidth={1.75}
          className={active ? "fill-current" : ""}
        />
      </button>

      {showToast && (
        <div className="absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-lg border border-zinc-200 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-md dark:border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900">
          {active
            ? "প্রিয় তালিকা থেকে সরানো হয়েছে"
            : "প্রিয় তালিকায় যোগ হয়েছে"}
        </div>
      )}
    </div>
  );
}

export function QuickFavoritesBar() {
  const { favorites, isLoaded } = useFavorites();

  if (!isLoaded || favorites.length === 0) return null;

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-3.5 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-2.5 flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2">
          <Bookmark
            className="size-4 text-[var(--accent-ink)]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <h3 className="text-xs font-semibold text-zinc-800 sm:text-sm dark:text-zinc-200">
            দ্রুত শর্টকাট
          </h3>
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          সংরক্ষিত টুলস
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {favorites.map((fav) => (
          <Link
            key={fav.id}
            href={fav.path}
            className="flex min-h-11 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-800 transition-colors hover:border-[var(--accent-soft-border)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-ink)] active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
          >
            <Star
              className="size-3.5 text-[var(--accent-ink)]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span>{fav.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
