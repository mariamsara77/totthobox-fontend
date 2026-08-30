"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  MessageSquare,
  LogOut,
  User as UserIcon,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileMenu() {
  // loading এর জায়গায় isLoading ব্যবহার করা হয়েছে, যা আমাদের AuthContext এর সাথে সামঞ্জস্যপূর্ণ
  const { user, isLoading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ড্রপডাউনের বাইরে ক্লিক করলে বন্ধ করার লজিক
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
    setIsDropdownOpen(false);
    await logout();
  };

  if (isLoading) {
    return (
      <div className="h-10 w-10 animate-pulse bg-zinc-400/20 rounded-full"></div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 text-sm px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all"
      >
        <UserIcon size={16} />
        লগইন
      </Link>
    );
  }

  // অ্যাভাটারের URL জেনারেট করা
  const avatarSrc =
    user.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="প্রোফাইল মেনু"
        aria-expanded={isDropdownOpen}
      >
        <img
          src={avatarSrc}
          alt={user.name}
          referrerPolicy="no-referrer" // গুগল ইমেজের 403 এরর প্রতিরোধ করার জন্য
          className="size-10 rounded-full object-cover hover:border-2 border-zinc-400/25"
        />
      </button>

      {/* Always render the dropdown */}
      <div
        className={`
          absolute right-0 mt-3 w-64
          bg-zinc-200 dark:bg-zinc-700
          rounded-2xl border border-zinc-400/25 z-50
          origin-top-right
          transition-all duration-200 ease-out
          ${
            isDropdownOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto visible"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none invisible"
          }
        `}
      >
        <div className="px-4 py-3 flex items-center gap-3">
          <img
            src={avatarSrc}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="h-12 w-12 rounded-xl object-cover"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
              {user.name}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {user.email}
            </span>
          </div>
        </div>

        <div className="h-px bg-zinc-400/25"></div>

        <div className="p-2 space-y-1">
          <Link
            href="/settings/profile"
            className="flex items-center gap-4 px-4 py-2 text-sm hover:bg-zinc-400/25 rounded-xl transition-colors"
            onClick={() => setIsDropdownOpen(false)}
          >
            <Settings size={18} />
            সেটিংস
          </Link>

          <Link
            href={`/messages/${user.slug}`}
            className="flex items-center gap-4 px-4 py-2 text-sm hover:bg-zinc-400/25 rounded-xl transition-colors"
            onClick={() => setIsDropdownOpen(false)}
          >
            <MessageCircle size={18} />
            মেসেজ
          </Link>
        </div>

        <div className="h-px bg-zinc-400/25 my-1"></div>

        <div className="p-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            লগআউট
          </button>
        </div>
      </div>
    </div>
  );
}
