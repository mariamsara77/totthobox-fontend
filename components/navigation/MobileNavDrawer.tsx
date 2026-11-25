"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Globe,
  Search,
  Sparkles,
  User as UserIcon,
  X,
} from "lucide-react";
import BrandIcon from "@/components/BrandIcon";
import AppearanceSettings from "@/components/AppearanceSettings";
import Icon from "@/components/ui/Icon";
import { NAVIGATION_REGISTRY } from "@/config/navigation";
import { useMobileNav } from "@/context/MobileNavContext";
import { useSearchModal } from "@/context/SearchModalContext";
import { useSettingsModal } from "@/context/SettingsModalContext";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/context/AuthModalContext";

const POLICY_LINKS = [
  { href: "/about-us", label: "আমাদের সম্পর্কে" },
  { href: "/contact-us", label: "যোগাযোগ" },
  { href: "/privacy-policy", label: "গোপনীয়তা নীতি" },
  { href: "/terms-of-service", label: "ব্যবহারের শর্তাবলী" },
  { href: "/disclaimer", label: "দায়মুক্তি" },
];

export default function MobileNavDrawer() {
  const pathname = usePathname();
  const { isDrawerOpen, closeDrawer } = useMobileNav();
  const { openSearchModal } = useSearchModal();
  const { openSettingsModal } = useSettingsModal();
  const { user, isLoggedIn } = useAuth();
  const { openLoginModal } = useAuthModal();
  const [expandedCat, setExpandedCat] = useState<string | null>("tools");

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="পূর্ণ নেভিগেশন ও থিম মেনু"
      className="fixed inset-0 z-[80] flex md:hidden"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="মেনু বন্ধ করুন"
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/45 transition-opacity"
      />

      {/* Slide-over drawer */}
      <aside className="pwa-safe-top pb-safe relative z-10 flex h-dvh w-[86vw] max-w-sm flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
          <Link
            href="/"
            onClick={closeDrawer}
            className="flex min-h-11 items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100"
          >
            <BrandIcon className="size-6" />
            <span>Totthobox</span>
          </Link>

          <button
            type="button"
            onClick={closeDrawer}
            aria-label="মেনু বন্ধ করুন"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
          {/* Quick Search */}
          <button
            type="button"
            onClick={() => {
              closeDrawer();
              openSearchModal();
            }}
            className="flex min-h-11 w-full items-center gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-left text-sm text-zinc-600 transition-colors hover:border-zinc-300 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <Search className="size-4 shrink-0 text-zinc-500" strokeWidth={1.75} aria-hidden="true" />
            <span className="truncate">টুল, ক্যালকুলেটর বা তথ্য খুঁজুন</span>
          </button>

          {/* Appearance & Accent Engine */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              থিম ও অ্যাপিয়ারেন্স
            </h2>
            <AppearanceSettings />
          </div>

          {/* Navigation Tree */}
          <nav aria-label="বিভাগ ও সেবাসমূহ" className="space-y-1.5">
            <h2 className="pb-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              সকল বিভাগ
            </h2>

            {NAVIGATION_REGISTRY.map((cat) => {
              const isOpen = expandedCat === cat.id;
              return (
                <div
                  key={cat.id}
                  className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpandedCat(isOpen ? null : cat.id)}
                    className="flex min-h-11 w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-medium text-zinc-900 transition-colors active:scale-[0.99] dark:text-zinc-100"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Icon
                        name={cat.icon}
                        size={17}
                        strokeWidth={1.75}
                        className="shrink-0 text-zinc-500 dark:text-zinc-400"
                      />
                      <span className="truncate">{cat.shortTitle}</span>
                    </span>
                    {isOpen ? (
                      <ChevronDown className="size-4 shrink-0 text-zinc-400" strokeWidth={1.75} />
                    ) : (
                      <ChevronRight className="size-4 shrink-0 text-zinc-400" strokeWidth={1.75} />
                    )}
                  </button>

                  {isOpen && (
                    <div className="space-y-0.5 border-t border-zinc-100 px-2 py-2 dark:border-zinc-800">
                      {cat.items.map((item) => {
                        const active = pathname === item.href;
                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={closeDrawer}
                            className={`flex min-h-11 items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                              active
                                ? "bg-[var(--accent-soft)] font-semibold text-[var(--accent-ink)]"
                                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            }`}
                          >
                            <Icon
                              name={item.icon}
                              size={16}
                              strokeWidth={1.75}
                              className="shrink-0 opacity-75"
                            />
                            <span className="truncate">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/ai/chat"
              onClick={closeDrawer}
              className={`flex min-h-11 items-center gap-2.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith("/ai")
                  ? "border-[var(--accent-soft-border)] bg-[var(--accent-soft)] text-[var(--accent-ink)]"
                  : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200"
              }`}
            >
              <Sparkles className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span>Totthobox AI সহায়ক</span>
            </Link>
          </nav>

          {/* Language & Account */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                closeDrawer();
                openSettingsModal();
              }}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <Globe className="size-4" strokeWidth={1.75} aria-hidden="true" />
              <span>ভাষা ও সেটিংস</span>
            </button>

            {isLoggedIn && user ? (
              <Link
                href="/settings/profile"
                onClick={closeDrawer}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <UserIcon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                <span className="truncate">{user.name || "প্রোফাইল"}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  openLoginModal();
                }}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent-primary)] px-3 text-xs font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)] active:scale-95"
              >
                <UserIcon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                <span>লগইন</span>
              </button>
            )}
          </div>

          {/* Policy Links */}
          <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {POLICY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeDrawer}
                  className="inline-flex min-h-10 items-center text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
