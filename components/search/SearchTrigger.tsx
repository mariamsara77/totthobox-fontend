"use client";

import { useSearchModal } from "@/context/SearchModalContext";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface SearchTriggerProps {
  className?: string;
  /** Used in Sidebar when collapsed */
  collapsed?: boolean;
  /** Tooltip handlers (for collapsed sidebar) */
  onHover?: (e: React.MouseEvent<HTMLElement>, label: string) => void;
  onLeave?: () => void;
  /** Optional label (mainly for sidebar expanded state) */
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
      className={`
        nav-icon-button group flex items-center gap-3 rounded-2xl p-2 text-sm
        transition-colors duration-200
        hover:bg-[var(--brand-surface)]
        ${collapsed ? "justify-center px-2" : ""}
        ${className}
      `}
    >
      <FaMagnifyingGlass className="h-4.5 w-4.5 shrink-0" />

      {/* Label only when sidebar is expanded and showLabel is true */}
      {!collapsed && showLabel && <span className="truncate">অনুসন্ধান</span>}
    </button>
  );
}
