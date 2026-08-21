"use client";

import Link from "next/link";
import { Menu, PanelLeft } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useSidebar } from "@/context/SidebarContext";
import BrandIcon from "@/components/BrandIcon";

export default function Navbar() {
  const { setIsOpen, isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <header className="z-60 w-full border-b border-zinc-400/10 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 md:hidden dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop: show expand button when collapsed */}
          {isCollapsed && (
            <button
              onClick={toggleCollapsed}
              className="hidden rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 md:flex dark:hover:bg-zinc-800"
              title="Expand sidebar"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          )}

          <Link href="/" className="text-xl font-bold">
            <BrandIcon className="w-8 h-8" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
