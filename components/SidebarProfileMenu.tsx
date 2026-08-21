"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  MessageSquare,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProfileMenuProps {
  collapsed?: boolean;
  onHover?: (e: React.MouseEvent<HTMLElement>, label: string) => void;
  onLeave?: () => void;
}

export default function SidebarProfileMenu({
  collapsed,
  onHover,
  onLeave,
}: SidebarProfileMenuProps) {
  const { user, loading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginFallback, setShowLoginFallback] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Loading অনেকক্ষণ ধরে true থাকলে fallback হিসেবে Login দেখাবে
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowLoginFallback(true);
      }, 2500); // ২.৫ সেকেন্ড পর
      return () => clearTimeout(timer);
    } else {
      setShowLoginFallback(false);
    }
  }, [loading]);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Loading অবস্থা (কিন্তু অনেকক্ষণ হলে আর দেখাবে না)
  if (loading && !showLoginFallback) {
    return (
      <div className="h-10 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
    );
  }

  // Login বাটন (user না থাকলে)
  if (!user) {
    return (
      <Link
        href="/login"
        onMouseEnter={(e) => collapsed && onHover?.(e, "লগইন")}
        onMouseLeave={onLeave}
        className={`flex items-center gap-3 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <UserIcon size={18} />
        {!collapsed && <span>লগইন</span>}
      </Link>
    );
  }

  // Logged in user
  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        onMouseEnter={(e) => collapsed && onHover?.(e, user.name)}
        onMouseLeave={onLeave}
        className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
          collapsed ? "justify-center" : "text-left"
        }`}
      >
        <img
          src={
            user.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name,
            )}&background=10b981&color=fff`
          }
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
        />
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              {user.name}
            </span>
            <span className="truncate text-xs text-zinc-500">{user.email}</span>
          </div>
        )}
      </button>

      {isDropdownOpen && (
        <div
          className={`absolute bottom-full mb-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-2 z-50 animate-in fade-in zoom-in-95 ${
            collapsed ? "left-14" : "left-0"
          }`}
        >
          <div className="px-2 space-y-1">
            <Link
              href="/profile/settings"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-xl transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings size={18} className="text-zinc-400" />
              Settings
            </Link>
            <Link
              href={`/messages/${user.slug}`}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-xl transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <MessageSquare size={18} className="text-zinc-400" />
              Messages
            </Link>
          </div>

          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2"></div>

          <div className="px-2 mb-1">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
