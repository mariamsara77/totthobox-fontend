"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Menu, PanelLeft, MessageCircle } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useSidebar } from "@/context/SidebarContext";
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
  const { setIsOpen, isCollapsed, toggleCollapsed } = useSidebar();
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
    <header className="pwa-safe-top z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl transition-colors">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile menu button with 44px touch target */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="সাইডবার খুলুন"
            className="flex min-h-11 items-center justify-center rounded-xl p-2 text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop: show expand button when collapsed */}
          {isCollapsed && (
            <button
              onClick={toggleCollapsed}
              className="hidden min-h-11 items-center justify-center rounded-xl p-2 text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 md:flex"
              title="Expand sidebar"
              aria-label="সাইডবার বড় করুন"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          )}

          <Link
            href="/"
            aria-label="Totthobox Home"
            className="flex min-h-11 items-center gap-2 text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100"
          >
            <BrandIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="inline-block">Totthobox</span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <SearchTrigger />

          {isLoggedIn && (
            <>
              <Link
                href="/messages"
                aria-label="মেসেজ"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-xl p-2 text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </Link>

              <NotificationBell
                count={unreadCount}
                onClick={openNotificationModal}
              />
              <LiveNotificationSync />
            </>
          )}

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
