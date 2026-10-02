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
import { getEcho } from "@/lib/echo";
import { SearchTrigger } from "@/components/search";

export default function Navbar() {
  const { openSettingsModal } = useSettingsModal();
  const { openNotificationModal, unreadCount, setUnreadCount } =
    useNotificationModal();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }

    getUnreadCount()
      .then(setUnreadCount)
      .catch(() => undefined);
  }, [isLoggedIn, setUnreadCount]);

  useEffect(() => {
    if (!user?.id || !isLoggedIn) return;
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`user.${user.id}`);
    const refresh = () =>
      getUnreadCount()
        .then(setUnreadCount)
        .catch(() => undefined);

    channel.notification(refresh);
    channel.listen(".NotificationCreated", refresh);

    return () => {
      channel.stopListening(
        ".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
      );
      channel.stopListening(".NotificationCreated");
    };
  }, [user?.id, isLoggedIn, setUnreadCount]);

  return (
    <header className="site-header w-full border-b bg-transparent">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Totthobox হোম"
        >
          <span className="brand-mark size-10 rounded-[1rem] transition duration-200 group-hover:-translate-y-0.5">
            <BrandIcon className="size-6" />
          </span>
          <span className="brand-wordmark text-base font-black tracking-[-0.02em] sm:text-lg">
            Totthobox
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <SearchTrigger />

          {isLoggedIn && (
            <>
              <Link
                href="/messages"
                aria-label="মেসেজ"
                className="nav-icon-button flex size-10 items-center justify-center rounded-2xl"
              >
                <IoChatbubble className="size-5" />
              </Link>

              <NotificationBell
                count={unreadCount}
                onClick={openNotificationModal}
              />
            </>
          )}

          <button
            type="button"
            onClick={openSettingsModal}
            className="flex size-10 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-[var(--brand-surface)] hover:text-[var(--brand-primary-strong)] dark:text-zinc-300"
            aria-label="Settings"
          >
            <IoSettings className="size-5" />
          </button>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
