"use client";

import { FaBell } from "react-icons/fa";

interface Props {
  count: number;
  onClick: () => void;
  className?: string;
}

export function NotificationBell({ count, onClick, className = "" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Notifications"
      className={`relative flex items-center gap-2 rounded-xl p-2 hover:bg-zinc-400/25 transition-colors ${className}`}
    >
      <FaBell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-zinc-900">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
