"use client";

import { Search } from "lucide-react";
import { useSearchModal } from "@/context/SearchModalContext";

interface SearchTriggerProps {
  className?: string;
  collapsed?: boolean;
  onHover?: (e: React.MouseEvent<HTMLElement>, label: string) => void;
  onLeave?: () => void;
  showLabel?: boolean;
}

export default function SearchTrigger({
  className = "",
  collapsed = false,
  onHover,
  onLeave,
  showLabel = false,
}: SearchTriggerProps) {
  const { openSearchModal } = useSearchModal();

  return (
    <button
      type="button"
      onClick={openSearchModal}
      aria-label="সাইটে অনুসন্ধান করুন"
      onMouseEnter={(e) => onHover?.(e, "অনুসন্ধান")}
      onMouseLeave={onLeave}
      className={
        "group flex min-h-[44px] items-center gap-3 rounded-xl p-2 text-sm text-zinc-700 dark:text-zinc-300 transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 " +
        (collapsed || !showLabel ? "min-w-[44px] justify-center " : "w-full px-3.5 ") +
        className
      }
    >
      <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
      {!collapsed && showLabel && <span className="truncate">অনুসন্ধান</span>}
    </button>
  );
}
