"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, MessageSquare, Settings, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProfileMenuProps {
  collapsed?: boolean;
  onHover?: (event: React.MouseEvent<HTMLElement>, label: string) => void;
  onLeave?: () => void;
}

const controlClass =
  "flex items-center gap-2 rounded-xl bg-zinc-400/10 p-4 hover:bg-zinc-400/25";

export default function SidebarProfileMenu({
  collapsed = false,
  onHover,
  onLeave,
}: SidebarProfileMenuProps) {
  const { user, loading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginFallback, setShowLoginFallback] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) {
      setShowLoginFallback(false);
      return;
    }

    const timeout = window.setTimeout(() => setShowLoginFallback(true), 2500);
    return () => window.clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setIsDropdownOpen(false);

    try {
      await logout();
    } catch {
      window.location.assign("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading && !showLoginFallback) {
    return <div className="h-10 w-full rounded-xl bg-zinc-400/10" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        onMouseEnter={(event) => collapsed && onHover?.(event, "লগইন")}
        onMouseLeave={onLeave}
        className={`${controlClass} w-full text-sm ${collapsed ? "justify-center" : ""}`}
      >
        <UserIcon className="h-5 w-5 shrink-0" />
        {!collapsed && <span>লগইন</span>}
      </Link>
    );
  }

  const avatarUrl =
    user.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsDropdownOpen((open) => !open)}
        onMouseEnter={(event) => collapsed && onHover?.(event, user.name)}
        onMouseLeave={onLeave}
        aria-expanded={isDropdownOpen}
        aria-haspopup="menu"
        className={`${controlClass} w-full ${collapsed ? "justify-center" : "text-left"}`}
      >
        <img
          src={avatarUrl}
          alt={user.name}
          className="h-8 w-8 shrink-0 rounded-full border border-zinc-400/25 object-cover"
        />
        {!collapsed && (
          <div className="min-w-0 space-y-2">
            <span className="block truncate text-sm">{user.name}</span>
            <span className="block truncate text-xs opacity-50">{user.email}</span>
          </div>
        )}
      </button>

      {isDropdownOpen && (
        <div
          role="menu"
          className={`absolute bottom-full z-50 mb-2 w-64 rounded-2xl border border-zinc-400/25 bg-zinc-200 p-4 dark:bg-zinc-800 ${collapsed ? "left-14" : "left-0"}`}
        >
          <div className="flex items-center gap-2 border-b border-zinc-400/25 pb-4">
            <img src={avatarUrl} alt="" className="h-10 w-10 rounded-xl object-cover" />
            <div className="min-w-0 space-y-2">
              <span className="block truncate text-sm">{user.name}</span>
              <span className="block truncate text-xs opacity-50">{user.email}</span>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <Link href="/profile/settings" className={controlClass} onClick={() => setIsDropdownOpen(false)} role="menuitem">
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <Link href={`/messages/${user.slug || user.id}`} className={controlClass} onClick={() => setIsDropdownOpen(false)} role="menuitem">
              <MessageSquare className="h-5 w-5" />
              Messages
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`${controlClass} w-full disabled:opacity-50`}
              role="menuitem"
            >
              <LogOut className="h-5 w-5" />
              {isLoggingOut ? "লগআউট হচ্ছে..." : "Log Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
