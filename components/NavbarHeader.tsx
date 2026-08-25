"use client";

import Link from "next/link";
import { MessageCircle, Settings } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useSettingsModal } from "@/context/SettingsModalContext";
import { useAuth } from "@/context/AuthContext";
import BrandIcon from "@/components/BrandIcon";

export default function Navbar() {
  const { openSettingsModal } = useSettingsModal();
  const { isLoggedIn } = useAuth();

  return (
    <header className="z-60 w-full border-b border-zinc-400/25 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold">
            <BrandIcon className="h-6 w-6" />
            Totthobox
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {isLoggedIn ? (
            <Link
              href="/messages"
              aria-label="মেসেজ"
              className="flex items-center gap-2 rounded-xl p-2 text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="hidden sm:inline-block">মেসেজ</span>
            </Link>
          ) : null}

          <button
            type="button"
            onClick={openSettingsModal}
            className="flex items-center gap-2 rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <Settings className="h-5 w-5" />
            <span className="hidden sm:inline-block">সেটিংস</span>
          </button>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
