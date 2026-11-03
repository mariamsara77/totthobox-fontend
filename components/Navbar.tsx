"use client";

import Link from "next/link";
import { Menu, PanelLeft } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useSidebar } from "@/context/SidebarContext";
import BrandIcon from "@/components/BrandIcon";
import { SearchTrigger } from "@/components/search";

export default function Navbar() {
  const { setIsOpen, isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <header className="pwa-safe-top z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl transition-colors">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile menu button with 44px touch target */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="সাইডবার খুলুন"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop: show expand button when collapsed */}
          {isCollapsed && (
            <button
              onClick={toggleCollapsed}
              className="hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2 text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 md:flex"
              title="Expand sidebar"
              aria-label="সাইডবার বড় করুন"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          )}

          <Link
            href="/"
            aria-label="Totthobox Home"
            className="flex min-h-[44px] items-center gap-2 text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100"
          >
            <BrandIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="inline-block">Totthobox</span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <SearchTrigger />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
