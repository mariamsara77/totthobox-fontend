"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useSettingsModal } from "@/context/SettingsModalContext";
import { useAuth } from "@/context/AuthContext";
import BrandIcon from "@/components/BrandIcon";
import { SearchTrigger } from "@/components/search";

export default function Navbar() {
  const { openSettingsModal } = useSettingsModal();
  const { isLoggedIn } = useAuth();

  return (
    <header className="pwa-safe-top z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl transition-colors">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Totthobox Home"
            className="flex min-h-[44px] items-center gap-2 text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100"
          >
            <BrandIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="inline-block">Totthobox</span>
          </Link>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <SearchTrigger />

          {isLoggedIn && (
            <button
              type="button"
              onClick={openSettingsModal}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="সেটিংস মেনু খুলুন"
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
            </button>
          )}

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
