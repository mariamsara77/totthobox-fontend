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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Loading অনেকক্ষণ ধরে true থাকলে fallback
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowLoginFallback(true);
      }, 2500);
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

  const handleLogout = async () => {
  if (isLoggingOut) return;
  setIsLoggingOut(true);
  setIsDropdownOpen(false);

  try {
    await logout();
  } catch (error) {
    console.error("Logout failed:", error);
    window.location.href = "/"; // fallback
  } finally {
    setIsLoggingOut(false);
  }
};

  // Loading অবস্থা
  if (loading && !showLoginFallback) {
    return (
      <div className="h-10 w-full animate-pulse bg-zinc-400/10 rounded-lg"></div>
    );
  }

  // Login বাটন
  if (!user) {
    return (
      <Link
        href="/login"
        onMouseEnter={(e) => collapsed && onHover?.(e, "লগইন")}
        onMouseLeave={onLeave}
        className={`flex items-center gap-4 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm text-white transition-all hover:bg-emerald-700 ${
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
        className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 bg-zinc-400/10 hover:bg-zinc-400/25 ${
          collapsed ? "justify-center" : "text-left"
        }`}
      >
        <img
          src={
            user.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name
            )}&background=10b981&color=fff`
          }
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover border border-zinc-400/25 dark:border-zinc-700 shrink-0"
        />
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
        )}
      </button>

      {isDropdownOpen && (
        <div
          className={`absolute bottom-full mb-2 w-64 bg-zinc-100 dark:bg-zinc-700 rounded-2xl border border-zinc-400/25 animate-in fade-in slide-in-from-top-2 z-50 ${
            collapsed ? "left-14" : "left-0"
          }`}
        >
          <div className="p-2 flex gap-2 items-center">
            <img
              src={
                user.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=10b981&color=fff`
              }
              alt={user.name}
              className="rounded-xl size-12"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
 <div className="border-b border-zinc-400/25"></div>
          <div className="p-2 space-y-1">
            <Link
              href="/profile/settings"
              className="flex items-center gap-2 p-2 hover:bg-zinc-400/25 rounded-xl"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings className="size-5" />
              Settings
            </Link>
            <Link
              href={`/messages/${user.slug || user.id}`}
              className="flex items-center gap-2 p-2 hover:bg-zinc-400/25 rounded-xl"
              onClick={() => setIsDropdownOpen(false)}
            >
              <MessageSquare className="size-5" />
              Messages
            </Link>
          </div>

          <div className="border-b border-zinc-400/25"></div>

          <div className="p-2">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex gap-2 p-2 text-sm text-red-500 hover:bg-red-400/10 rounded-xl disabled:opacity-50"
            >
              <LogOut className="size-5" />
              {isLoggingOut ? "লগআউট হচ্ছে..." : "Log Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}