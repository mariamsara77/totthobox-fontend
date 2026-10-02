"use client";

import Link from "next/link";
import { useEffect } from "react";
import { IoChatbubble, IoSettings } from "react-icons/io5";
import ProfileMenu from "./ProfileMenu";
import { useSettingsModal } from "@/context/SettingsModalContext";
import { useNotificationModal } from "@/context/NotificationModalContext";
import { useAuth } from "@/context/AuthContext";
import BrandIcon from "@/components/BrandIcon";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { getUnreadCount } from "@/lib/notifications";
import LiveNotificationSync from "@/components/notifications/LiveNotificationSync";
import { SearchTrigger } from "@/components/search";

export default function Navbar() {
  const { openSettingsModal } = useSettingsModal();
  const { openNotificationModal, unreadCount, setUnreadCount } =
    useNotificationModal();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }

    getUnreadCount()
      .then(setUnreadCount)
      .catch(() => undefined);
  }, [isLoggedIn, setUnreadCount]);

  return (
    <header className="z-60 w-full border-b border-zinc-400/25 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold"
          >
            <BrandIcon className="h-6 w-6" />
            Totthobox
          </Link>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <SearchTrigger />

          {isLoggedIn && (
            <>
              <Link
                href="/messages"
                aria-label="মেসেজ"
                className="flex items-center gap-2 rounded-xl p-2 transition-colors hover:bg-zinc-400/25"
              >
                <IoChatbubble className="h-5 w-5" />
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
            className="flex items-center gap-2 rounded-xl p-2 transition-colors hover:bg-zinc-400/25"
            aria-label="Settings"
          >
            <IoSettings className="h-5 w-5" />
          </button>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
