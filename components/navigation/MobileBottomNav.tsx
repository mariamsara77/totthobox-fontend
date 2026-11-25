"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Home, Menu, Newspaper, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMobileNav } from "@/context/MobileNavContext";

const ITEM_BASE =
  "relative flex h-full min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 px-1 text-xs font-medium transition-[color,transform] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent-primary)] motion-reduce:transition-none";

const IDLE =
  "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100";

interface NavLinkProps {
  href: string;
  label: string;
  Icon: LucideIcon;
  active: boolean;
}

function NavLink({ href, label, Icon, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`${ITEM_BASE} ${
        active ? "font-semibold text-[var(--accent-ink)]" : IDLE
      }`}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 mx-auto h-0.5 w-8 rounded-full bg-[var(--accent-primary)]"
        />
      )}
      <Icon
        className="size-5"
        strokeWidth={active ? 2 : 1.5}
        aria-hidden="true"
      />
      <span className="max-w-full truncate">{label}</span>
    </Link>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isDrawerOpen, isSavedOpen, openDrawer, openSaved } = useMobileNav();

  // Hide on messaging / AI chat routes so the composer is never covered on mobile
  const isChatRoute =
    pathname.startsWith("/messages") || pathname.startsWith("/ai/chat");
  if (isChatRoute) return null;

  const isHome = pathname === "/";
  const isTools =
    pathname.startsWith("/services") ||
    pathname.startsWith("/tools") ||
    pathname.startsWith("/converter") ||
    pathname.startsWith("/pdf-editor");
  const isNews =
    pathname.startsWith("/news") ||
    pathname.startsWith("/bangladesh") ||
    pathname.startsWith("/international");

  return (
    <nav
      aria-label="মোবাইল বটম নেভিগেশন"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 bg-[var(--surface-topbar)] shadow-[0_-1px_0_var(--surface-hairline)] backdrop-blur-md md:hidden"
    >
      <div className="grid h-14 grid-cols-5 items-stretch">
        <NavLink href="/" label="হোম" Icon={Home} active={isHome} />
        <NavLink href="/services" label="টুলস" Icon={Wrench} active={isTools} />
        <NavLink
          href="/news/headlines"
          label="সংবাদ"
          Icon={Newspaper}
          active={isNews}
        />

        <button
          type="button"
          onClick={openSaved}
          aria-label="সংরক্ষিত ও সাম্প্রতিক"
          aria-expanded={isSavedOpen}
          className={`${ITEM_BASE} ${
            isSavedOpen ? "font-semibold text-[var(--accent-ink)]" : IDLE
          }`}
        >
          {isSavedOpen && (
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 mx-auto h-0.5 w-8 rounded-full bg-[var(--accent-primary)]"
            />
          )}
          <Bookmark
            className="size-5"
            strokeWidth={isSavedOpen ? 2 : 1.5}
            aria-hidden="true"
          />
          <span className="max-w-full truncate">সংরক্ষিত</span>
        </button>

        <button
          type="button"
          onClick={openDrawer}
          aria-label="পূর্ণ মেনু ও থিম সেটিংস"
          aria-expanded={isDrawerOpen}
          className={`${ITEM_BASE} ${
            isDrawerOpen ? "font-semibold text-[var(--accent-ink)]" : IDLE
          }`}
        >
          {isDrawerOpen && (
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 mx-auto h-0.5 w-8 rounded-full bg-[var(--accent-primary)]"
            />
          )}
          <Menu
            className="size-5"
            strokeWidth={isDrawerOpen ? 2 : 1.5}
            aria-hidden="true"
          />
          <span className="max-w-full truncate">মেনু</span>
        </button>
      </div>
    </nav>
  );
}
