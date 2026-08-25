"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Settings,
  MessageSquare,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // গ্লোবাল হুক ইম্পোর্ট করা হলো

export default function ProfileMenu() {
  const { user, loading, logout } = useAuth(); // গ্লোবাল স্টেট থেকে ডাটা নেওয়া হচ্ছে
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    await logout(); // AuthContext এর logout ফাংশন কল করা হলো
    setIsDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="h-10 w-10 animate-pulse bg-zinc-400/10 rounded-full"></div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 text-sm px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white  rounded-full transition-all  hover:"
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
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      aria-label="প্রোফাইল মেনু"
      aria-expanded={isDropdownOpen}
      className="flex items-center"
    >
      <img
        src={
          user.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`
        }
        alt={user.name}
        className="h-10 w-10 rounded-full object-cover border-2 border-zinc-400/25"
      />
    </button>

    {/* Always render the dropdown */}
    <div
      className={`
        absolute right-0 mt-2 w-64
        bg-zinc-100 dark:bg-zinc-700
        rounded-2xl border border-zinc-400/25 z-50
        origin-top-right
        transition-all duration-200 ease-out
        ${
          isDropdownOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto visible"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none invisible"
        }
      `}
    >
      <div className="px-4 py-2 flex items-center gap-4">
        <img
          src={
            user.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`
          }
          alt={user.name}
          className="h-12 w-12 rounded-full object-cover border border-zinc-400/25"
        />
        <div className="flex flex-col overflow-hidden">
          <span className="truncate">{user.name}</span>
          <span className="truncate text-xs">{user.email}</span>
        </div>
      </div>

      <div className="h-px bg-zinc-400/25 my-1"></div>

      <div className="px-2 space-y-1 mt-2">
        <Link
          href="/profile/settings"
          className="flex items-center gap-4 px-3 py-2 text-sm hover:bg-zinc-400/25 rounded-xl"
          onClick={() => setIsDropdownOpen(false)}
        >
          <Settings size={18} className="text-zinc-400" />
          Settings
        </Link>

        <Link
          href={`/messages/${user.slug}`}
          className="flex items-center gap-4 px-3 py-2 text-sm hover:bg-zinc-400/25 rounded-xl"
          onClick={() => setIsDropdownOpen(false)}
        >
          <MessageSquare size={18} className="text-zinc-400" />
          Messages
        </Link>
      </div>

      <div className="h-px bg-zinc-400/25 my-2"></div>

      <div className="px-2 mb-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  </div>
);
}