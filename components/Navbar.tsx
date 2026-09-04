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
    <header className="z-60 w-full border-b border-zinc-400/25 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="সাইডবার খুলুন"
            className="rounded-lg p-2 hover:opacity-50 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop: show expand button when collapsed */}
          {isCollapsed && (
            <button
              onClick={toggleCollapsed}
              className="hidden rounded-lg p-2  hover:opacity-50 md:flex"
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
          <SearchTrigger />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
