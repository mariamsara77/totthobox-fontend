"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Sparkles, X, ChevronRight } from "lucide-react";

export interface FavoriteTool {
  id: string;
  title: string;
  path: string;
  category?: string;
}

const DEFAULT_FAVORITES: FavoriteTool[] = [
  { id: "bangla-calendar", title: "বাংলা ক্যালেন্ডার", path: "/bangla/calendar", category: "ক্যালেন্ডার" },
  { id: "currency-converter", title: "কারেন্সি কনভার্টার", path: "/converter/currency", category: "কনভার্টার" },
  { id: "age-calculator", title: "স্মার্ট এজ ক্যালকুলেটর", path: "/tools/age-calculator", category: "টুলস" },
  { id: "speed-test", title: "স্পিড টেস্ট", path: "/tools/internet-speed-test", category: "ইউটিলিটি" },
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
        updated = [tool, ...prev].slice(0, 8); // max 8 favorites
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
        aria-label={active ? "প্রিয় তালিকা থেকে সরান" : "প্রিয় তালিকায় যোগ করুন"}
        title={active ? "প্রিয় তালিকাভুক্ত (ক্লিক করে সরান)" : "প্রিয় তালিকায় রাখুন"}
        className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 transition-all active:scale-95 ${
          active
            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs"
            : "border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        } ${className}`}
      >
        <Star
          size={18}
          className={`transition-transform duration-200 ${
            active ? "fill-amber-500 stroke-amber-500 scale-110" : "stroke-current"
          }`}
        />
      </button>

      {showToast && (
        <div className="absolute right-0 top-full mt-2 z-50 whitespace-nowrap rounded-lg bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-xs font-medium text-white dark:text-zinc-900 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          {active ? "প্রিয় তালিকা থেকে সরানো হয়েছে" : "প্রিয় তালিকায় যোগ হয়েছে! ★"}
        </div>
      )}
    </div>
  );
}

export function QuickFavoritesBar() {
  const { favorites, isLoaded } = useFavorites();

  if (!isLoaded || favorites.length === 0) return null;

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-gradient-to-r from-zinc-50 via-white to-zinc-50 dark:from-zinc-900/60 dark:via-zinc-900/90 dark:to-zinc-900/60 p-3 sm:p-4 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            আপনার প্রিয় টুলস (Quick Shortcuts)
          </h3>
        </div>
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
          পিন করুন ★
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {favorites.map((fav) => (
          <Link
            key={fav.id}
            href={fav.path}
            className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-xs"
          >
            <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
            <span>{fav.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
