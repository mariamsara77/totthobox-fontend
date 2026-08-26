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

export default function ProfileMenu() {
  const { user, loading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  if (loading) {
    return <div className="h-10 w-10 animate-pulse rounded-xl bg-zinc-400/10" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 rounded-xl border border-zinc-400/25 bg-zinc-400/10 px-4 py-2 hover:bg-zinc-400/25"
      >
        <UserIcon size={16} />
        লগইন
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsDropdownOpen((open) => !open)}
        aria-label="প্রোফাইল মেনু"
        aria-expanded={isDropdownOpen}
        className="flex items-center"
      >
        <img
          src={
            user.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=71717a&color=fff`
          }
          alt={user.name}
          className="h-10 w-10 rounded-xl border border-zinc-400/25 object-cover"
        />
      </button>

      <div
        className={`absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-zinc-400/25 bg-zinc-200 bg-zinc-400/10 p-2 transition-all ${
          isDropdownOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="flex items-center gap-4 p-2">
          <img
            src={
              user.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=71717a&color=fff`
            }
            alt={user.name}
            className="h-12 w-12 rounded-xl border border-zinc-400/25 object-cover"
          />
          <div className="flex min-w-0 flex-col">
            <span className="truncate">{user.name}</span>
            <span className="truncate text-sm opacity-50">{user.email}</span>
          </div>
        </div>

        <div className="my-2 border-t border-zinc-400/25" />

        <div className="space-y-1">
          <Link
            href="/profile/settings"
            className="flex items-center gap-4 rounded-xl p-2 hover:bg-zinc-400/25"
            onClick={() => setIsDropdownOpen(false)}
          >
            <Settings size={18} />
            Settings
          </Link>

          <Link
            href={`/messages/${user.slug}`}
            className="flex items-center gap-4 rounded-xl p-2 hover:bg-zinc-400/25"
            onClick={() => setIsDropdownOpen(false)}
          >
            <MessageSquare size={18} />
            Messages
          </Link>
        </div>

        <div className="my-2 border-t border-zinc-400/25" />

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-xl p-2 hover:bg-zinc-400/25"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
}
