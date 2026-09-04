"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Settings,
  MessageSquare,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ProfileMenuProps {
  variant?: "default" | "sidebar";
  collapsed?: boolean;
  onHover?: (e: React.MouseEvent<HTMLElement>, label: string) => void;
  onLeave?: () => void;
}

export default function ProfileMenu({
  variant = "default",
  collapsed = false,
  onHover,
  onLeave,
}: ProfileMenuProps) {
  const { user, loading, isLoading, logout } = useAuth();
  const isAuthLoading = loading ?? isLoading;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLoginFallback, setShowLoginFallback] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const isSidebar = variant === "sidebar";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Loading fallback
  useEffect(() => {
    if (isAuthLoading) {
      const timer = setTimeout(() => setShowLoginFallback(true), 2500);
      return () => clearTimeout(timer);
    }
    setShowLoginFallback(false);
  }, [isAuthLoading]);

  // Position calculator
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = 256;

    if (isSidebar) {
      // Sidebar → opens upward
      setStyle({
        position: "fixed",
        bottom: `${window.innerHeight - rect.top + 8}px`,
        left: collapsed
          ? `${rect.left}px`
          : `${Math.max(8, rect.right - dropdownWidth)}px`,
        width: `${dropdownWidth}px`,
      });
    } else {
      // Default → opens downward
      setStyle({
        position: "fixed",
        top: `${rect.bottom + 8}px`,
        left: `${Math.max(8, rect.right - dropdownWidth)}px`,
        width: `${dropdownWidth}px`,
      });
    }
  }, [isSidebar, collapsed]);

  const toggleDropdown = () => {
    if (!isDropdownOpen) updatePosition();
    setIsDropdownOpen((prev) => !prev);
  };

  // Click outside + scroll/resize
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleScrollOrResize = () => updatePosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isDropdownOpen, updatePosition]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setIsDropdownOpen(false);

    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ========== Loading ==========
  if (isAuthLoading && !showLoginFallback) {
    return isSidebar ? (
      <div className="h-10 w-full animate-pulse bg-zinc-400/10 rounded-lg" />
    ) : (
      <div className="h-10 w-10 animate-pulse bg-zinc-400/20 rounded-full" />
    );
  }

  // ========== Not logged in ==========
  if (!user) {
    if (isSidebar) {
      return (
        <Link
          href="/login"
          onMouseEnter={(e) => collapsed && onHover?.(e, "লগইন")}
          onMouseLeave={onLeave}
          className={`flex items-center gap-4 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-zinc-400/25 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <UserIcon size={18} />
          {!collapsed && <span>লগইন</span>}
        </Link>
      );
    }

    return (
      <Link
        href="/login"
        className="flex items-center gap-2 text-sm px-4 py-2.5 bg-zinc-400/10 hover:bg-zinc-400/25 rounded-xl transition-all"
      >
        <UserIcon size={16} />
        লগইন
      </Link>
    );
  }

  const avatarSrc =
    user.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name,
    )}&background=10b981&color=fff`;

  return (
    <>
      {/* ========== Trigger Button ========== */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        onMouseEnter={(e) => isSidebar && collapsed && onHover?.(e, user.name)}
        onMouseLeave={isSidebar ? onLeave : undefined}
        aria-label="প্রোফাইল মেনু"
        aria-expanded={isDropdownOpen}
        className={
          isSidebar
            ? `flex w-full items-center gap-2 rounded-lg px-2 py-2 bg-zinc-400/10 hover:bg-zinc-400/25 transition-colors ${
                collapsed ? "justify-center" : "text-left"
              }`
            : "block"
        }
      >
        <img
          src={avatarSrc}
          alt={user.name}
          referrerPolicy="no-referrer"
          className={
            isSidebar
              ? "h-8 w-8 rounded-full object-cover border border-zinc-400/25 dark:border-zinc-700 shrink-0"
              : "size-10 rounded-full object-cover hover:border-2 border-zinc-400/25 cursor-pointer"
          }
        />

        {isSidebar && !collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm">{user.name}</span>
            <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {user.email}
            </span>
          </div>
        )}
      </button>

      {/* ========== Portal Dropdown ========== */}
      {mounted &&
        createPortal(
          <div
            ref={dropdownRef}
            style={style}
            className={`
              z-[9999]
              transition-all duration-200 ease-out
              ${isSidebar ? "origin-bottom" : "origin-top-right"}
              ${
                isDropdownOpen
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto visible"
                  : isSidebar
                    ? "opacity-0 scale-95 translate-y-2 pointer-events-none invisible"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none invisible"
              }
            `}
          >
            <div
              style={{
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
              }}
              className="rounded-2xl border border-zinc-400/25 shadow-2xl overflow-hidden"
            >
              {/* Header */}
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

              <div className="h-px bg-zinc-400/25" />

              {/* Menu Items */}
              <div className="p-2 space-y-1">
                <Link
                  href="/settings/profile"
                  className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-zinc-500/10 rounded-xl transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="size-5" />
                  Settings
                </Link>

                <Link
                  href={`/messages/${user.slug || user.id}`}
                  className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-zinc-500/10 rounded-xl transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <MessageSquare className="size-5" />
                  Messages
                </Link>
              </div>

              <div className="h-px bg-zinc-400/25" />

              {/* Logout */}
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50"
                >
                  <LogOut className="size-5" />
                  {isLoggingOut ? "লগআউট হচ্ছে..." : "Log Out"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
