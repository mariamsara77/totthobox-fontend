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
    <header className="site-header pwa-safe-top w-full border-b bg-transparent">
      <div className="flex h-[4.25rem] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="সাইডবার খুলুন"
            className="nav-icon-button flex size-10 items-center justify-center rounded-2xl md:hidden"
          >
            <Menu className="size-6" />
          </button>

          {isCollapsed && (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="nav-icon-button hidden size-10 items-center justify-center rounded-2xl md:flex"
              title="Expand sidebar"
            >
              <PanelLeft className="size-5" />
            </button>
          )}

          <Link href="/" className="group flex items-center gap-2.5" aria-label="Totthobox হোম">
            <span className="brand-mark size-9 rounded-[0.9rem] transition duration-200 group-hover:-translate-y-0.5">
              <BrandIcon className="size-6" />
            </span>
            <span className="brand-wordmark hidden text-base font-black tracking-[-0.02em] sm:inline">
              Totthobox
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <SearchTrigger />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
