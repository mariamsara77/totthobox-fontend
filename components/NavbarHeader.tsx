"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { MessageCircle, Settings } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useSettingsModal } from "@/context/SettingsModalContext";
import { useNotificationModal } from "@/context/NotificationModalContext";
import { useAuth } from "@/context/AuthContext";
import BrandIcon from "@/components/BrandIcon";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { getUnreadCount } from "@/lib/notifications";
import { SearchTrigger } from "@/components/search";

const LiveNotificationSync = dynamic(
  () => import("@/components/notifications/LiveNotificationSync"),
  { ssr: false },
);

export default function NavbarHeader() {
  const { openSettingsModal } = useSettingsModal();
  const { openNotificationModal, unreadCount, setUnreadCount } =
    useNotificationModal();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }

    getUnreadCount().then(setUnreadCount).catch(() => undefined);
  }, [isLoggedIn, setUnreadCount]);

  return (
    <header className="pwa-safe-top z-40 w-full border-b border-zinc-200 bg-white transition-colors dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            aria-label="Totthobox Home"
            className="flex min-h-11 items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100"
          >
            <BrandIcon className="size-6" />
            <span>Totthobox</span>
          </Link>

          <nav aria-label="প্রাথমিক নেভিগেশন" className="hidden items-center gap-1 lg:flex">
            <Link
              href="/services"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              সকল সেবা
            </Link>
            <Link
              href="/bangla/calendar"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              ক্যালেন্ডার
            </Link>
            <Link
              href="/converter/land"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              জমি পরিমাপ
            </Link>
            <Link
              href="/news/headlines"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              সংবাদ
            </Link>
            <Link
              href="/contact/police"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              জরুরি সেবা
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <SearchTrigger />

          {isLoggedIn && (
            <>
              <Link
                href="/messages"
                aria-label="মেসেজ"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                <MessageCircle className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </Link>

              <NotificationBell
                count={unreadCount}
                onClick={openNotificationModal}
              />
              <LiveNotificationSync />
            </>
          )}

          <button
            type="button"
            onClick={openSettingsModal}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label="থিম ও সেটিংস মেনু খুলুন"
            title="থিম ও সেটিংস"
          >
            <Settings className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </button>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
