"use client";

import Link from "next/link";
import { Menu, PanelLeft } from "lucide-react";
import ProfileMenu from "./ProfileMenu";
import { useSidebar } from "@/context/SidebarContext";
import BrandIcon from "@/components/BrandIcon";

export default function Navbar() {
  const { setIsOpen, isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <header className="w-full border-b border-zinc-400/25 bg-zinc-200 bg-zinc-400/10">
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="সাইডবার খুলুন"
            className="rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 hover:bg-zinc-400/25 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {isCollapsed && (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="hidden rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 hover:bg-zinc-400/25 md:flex"
              title="Expand sidebar"
              aria-label="সাইডবার প্রসারিত করুন"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          )}

          <Link href="/" aria-label="Totthobox হোম" className="rounded-xl p-4 hover:bg-zinc-400/25">
            <BrandIcon className="h-6 w-6" />
          </Link>
        </div>

        <ProfileMenu />
      </div>
    </header>
  );
}
