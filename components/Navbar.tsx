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
    <header className="pwa-safe-top w-full border-b border-white/50 bg-white/75 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/70">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="সাইডবার খুলুন"
            className="flex size-10 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-[var(--brand-surface)] hover:text-[var(--brand-primary-strong)] dark:text-zinc-300 md:hidden"
          >
            <Menu className="size-6" />
          </button>

          {isCollapsed && (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="hidden size-10 items-center justify-center rounded-xl text-zinc-600 transition hover:bg-[var(--brand-surface)] hover:text-[var(--brand-primary-strong)] dark:text-zinc-300 md:flex"
              title="Expand sidebar"
            >
              <PanelLeft className="size-5" />
            </button>
          )}

          <Link href="/" className="group flex items-center gap-2" aria-label="Totthobox হোম">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[var(--brand-surface)] text-[var(--brand-primary-strong)] ring-1 ring-[var(--brand-border)] transition group-hover:scale-105">
              <BrandIcon className="size-6" />
            </span>
            <span className="hidden text-base font-bold tracking-tight sm:inline">
              Totthobox
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <SearchTrigger />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
