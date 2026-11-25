"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { PanelLeft, PanelLeftClose, MessageCircle, Settings } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useSidebar } from "@/context/SidebarContext";
import { useSettingsModal } from "@/context/SettingsModalContext";
import { useNotificationModal } from "@/context/NotificationModalContext";
import { useAuth } from "@/context/AuthContext";
import BrandIcon from "@/components/BrandIcon";
import { SearchTrigger } from "@/components/search";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { getUnreadCount } from "@/lib/notifications";

const LiveNotificationSync = dynamic(
  () => import("@/components/notifications/LiveNotificationSync"),
  { ssr: false },
);

export default function Navbar() {
  const { isCollapsed, toggleCollapsed } = useSidebar();
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
    <header className="pwa-safe-top z-40 w-full bg-[var(--surface-topbar)] shadow-[0_1px_0_var(--surface-hairline)] backdrop-blur-md transition-colors">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden min-h-11 min-w-11 items-center justify-center rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900 md:flex dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            title={isCollapsed ? "সাইডবার প্রসারিত করুন" : "সাইডবার সংকুচিত করুন"}
            aria-label={isCollapsed ? "সাইডবার প্রসারিত করুন" : "সাইডবার সংকুচিত করুন"}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? (
              <PanelLeft className="size-5" strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <PanelLeftClose className="size-5" strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>

          <Link
            href="/"
            aria-label="Totthobox Home"
            className="flex min-h-11 items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100"
          >
            <BrandIcon className="size-6" />
            <span>Totthobox</span>
          </Link>
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
            aria-label="থিম ও সেটিংস খুলুন"
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
