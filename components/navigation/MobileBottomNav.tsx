"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, PhoneCall, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSearchModal } from "@/context/SearchModalContext";
import { useSettingsModal } from "@/context/SettingsModalContext";

const ITEM_BASE =
  "relative flex h-full min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500 motion-reduce:transition-none";

const IDLE =
  "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100";

interface NavLinkProps {
  href: string;
  label: string;
  Icon: LucideIcon;
  active: boolean;
  tone?: "brand" | "danger";
}

function NavLink({ href, label, Icon, active, tone = "brand" }: NavLinkProps) {
  const activeColor =
    tone === "danger"
      ? "text-rose-600 dark:text-rose-400"
      : "text-emerald-700 dark:text-emerald-400";
  const barColor =
    tone === "danger"
      ? "bg-rose-600 dark:bg-rose-400"
      : "bg-emerald-600 dark:bg-emerald-400";

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`${ITEM_BASE} ${active ? activeColor : IDLE}`}
    >
      {active && (
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 top-0 mx-auto h-0.5 w-8 rounded-full ${barColor}`}
        />
      )}
      <Icon
        className="size-5"
        strokeWidth={active ? 2.5 : 1.75}
        aria-hidden="true"
      />
      <span className="max-w-full truncate">{label}</span>
    </Link>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { openSearchModal } = useSearchModal();
  const { openSettingsModal } = useSettingsModal();

  // Hide on messaging / AI chat routes so the composer is never covered on mobile
  const isChatRoute =
    pathname.startsWith("/messages") || pathname.startsWith("/ai/chat");
  if (isChatRoute) return null;

  const isHome = pathname === "/";
  const isServices = pathname.startsWith("/services");
  // "/contact-us" is a different page, so only match /contact and /contact/...
  const isEmergency =
    pathname === "/contact" || pathname.startsWith("/contact/");

  return (
    <nav
      aria-label="মোবাইল বটম নেভিগেশন"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl md:hidden dark:border-zinc-800 dark:bg-zinc-950/90 dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="grid h-16 grid-cols-5 items-stretch">
        <NavLink href="/" label="হোম" Icon={Home} active={isHome} />
        <NavLink
          href="/services"
          label="সকল সেবা"
          Icon={LayoutGrid}
          active={isServices}
        />

        {/* Center action: search */}
        <button
          type="button"
          onClick={openSearchModal}
          aria-label="সন্ধান করুন"
          className="relative flex h-full min-w-0 flex-col items-center justify-center focus-visible:outline-none"
        >
          <span className="-mt-5 flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-4 ring-white transition-transform active:scale-95 motion-reduce:transition-none dark:bg-emerald-500 dark:text-zinc-950 dark:ring-zinc-950">
            <Search className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span className="mt-0.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            সন্ধান
          </span>
        </button>

        <NavLink
          href="/contact/police"
          label="জরুরি"
          Icon={PhoneCall}
          active={isEmergency}
          tone="danger"
        />

        <button
          type="button"
          onClick={openSettingsModal}
          aria-label="সেটিংস ও থিম পরিবর্তন"
          className={`${ITEM_BASE} ${IDLE}`}
        >
          <Settings className="size-5" strokeWidth={1.75} aria-hidden="true" />
          <span>সেটিংস</span>
        </button>
      </div>
    </nav>
  );
}
