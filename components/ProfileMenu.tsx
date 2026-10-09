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
import { useAuthModal } from "@/context/AuthModalContext";

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
  const { openLoginModal } = useAuthModal();
  const isAuthLoading = loading ?? isLoading;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLoginFallback, setShowLoginFallback] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    position: "fixed",
    top: 0,
    left: 0,
    width: 256,
    visibility: "hidden",
    pointerEvents: "none",
  });

  const isSidebar = variant === "sidebar";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthLoading) {
      const timer = setTimeout(() => setShowLoginFallback(true), 2500);
      return () => clearTimeout(timer);
    }
    setShowLoginFallback(false);
  }, [isAuthLoading]);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = 256;

    if (isSidebar) {
      setStyle({
        position: "fixed",
        bottom: `${window.innerHeight - rect.top + 8}px`,
        left: collapsed
          ? `${rect.left}px`
          : `${Math.max(8, rect.right - dropdownWidth)}px`,
        width: `${dropdownWidth}px`,
        zIndex: 9999,
      });
    } else {
      setStyle({
        position: "fixed",
        top: `${rect.bottom + 8}px`,
        left: `${Math.max(8, rect.right - dropdownWidth)}px`,
        width: `${dropdownWidth}px`,
        zIndex: 9999,
      });
    }
  }, [isSidebar, collapsed]);

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      updatePosition();
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

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

  // ESC বন্ধ
  useEffect(() => {
    if (!isDropdownOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDropdownOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDropdownOpen]);

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
      <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-400/10" />
    ) : (
      <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-400/20" />
    );
  }

  // ========== Not logged in ==========
  if (!user) {
    if (isSidebar) {
      return (
        <button
          type="button"
          onClick={() => openLoginModal()}
          onMouseEnter={(e) => collapsed && onHover?.(e, "লগইন")}
          onMouseLeave={onLeave}
          className={`flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-left text-sm transition-all hover:bg-zinc-400/25 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <UserIcon size={18} />
          {!collapsed && <span>লগইন</span>}
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => openLoginModal()}
        className="flex items-center gap-2 rounded-xl bg-zinc-400/10 px-4 py-2.5 text-sm transition-all hover:bg-zinc-400/25"
      >
        <UserIcon size={16} />
        লগইন
      </button>
    );
  }

  const avatarSrc =
    user.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name,
    )}&background=10b981&color=fff`;

  return (
    <>
      {/* Trigger */}
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
            ? `flex w-full items-center gap-2 rounded-xl px-2 py-2 transition-colors hover:bg-zinc-400/25 ${
                collapsed ? "justify-center" : "bg-zinc-400/10 text-left"
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
              ? "h-8 w-8 shrink-0 rounded-full border border-zinc-400/25 object-cover dark:border-zinc-700"
              : "size-10 cursor-pointer rounded-full border border-zinc-400/25 object-cover hover:border-2"
          }
        />

        {isSidebar && !collapsed && (
          <div className="flex min-w-0 flex-col overflow-hidden">
            <span className="truncate text-sm">{user.name}</span>
            <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {user.email}
            </span>
          </div>
        )}
      </button>

      {/*
        ✅ শুধু খোলা থাকলে portal মাউন্ট — বন্ধ থাকলে DOM-এ কিছু নেই,
        তাই পেজের নিচে ফাঁকা সেকশন তৈরি হবে না
      */}
      {mounted &&
        isDropdownOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={style}
            className="z-9999 origin-top-right animate-in fade-in zoom-in-95 duration-150"
            role="menu"
          >
            <div
              style={{
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
              }}
              className="overflow-hidden rounded-2xl border border-zinc-400/25  shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <img
                  src={avatarSrc}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div className="flex min-w-0 flex-col overflow-hidden">
                  <span className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="h-px bg-zinc-400/25" />

              <div className="space-y-1 p-2">
                <Link
                  href="/settings/profile"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-zinc-500/10"
                  onClick={() => setIsDropdownOpen(false)}
                  role="menuitem"
                >
                  <Settings className="size-5" />
                  Settings
                </Link>

                <Link
                  href={`/messages/${user.slug || user.id}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-zinc-500/10"
                  onClick={() => setIsDropdownOpen(false)}
                  role="menuitem"
                >
                  <MessageSquare className="size-5" />
                  Messages
                </Link>
              </div>

              <div className="h-px bg-zinc-400/25" />

              <div className="p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-500/10"
                  role="menuitem"
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
