"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchModal } from "@/context/SearchModalContext";
import { NAVIGATION_REGISTRY } from "@/config/navigation";
import Icon from "@/components/ui/Icon";

export interface CategoryNavTab {
  id: string;
  label: string;
  iconName: string;
}

const CATEGORY_TABS: CategoryNavTab[] = [
  { id: "trending", label: "জনপ্রিয় সেবা", iconName: "TrendingUp" },
  ...NAVIGATION_REGISTRY.map((cat) => ({
    id: cat.id,
    label: cat.shortTitle,
    iconName: cat.icon,
  })),
];

const DESKTOP_HEADER_OFFSET = 120;
const MOBILE_HEADER_OFFSET = 64;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function StickyCategoryNav() {
  const [activeTab, setActiveTab] = useState<string>(CATEGORY_TABS[0].id);
  const { openSearchModal } = useSearchModal();

  const listRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getOffset = () =>
    typeof window !== "undefined" && window.innerWidth >= 768
      ? DESKTOP_HEADER_OFFSET
      : MOBILE_HEADER_OFFSET;

  const scrollToSection = useCallback((id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (!element) return;

    lockRef.current = true;
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      lockRef.current = false;
    }, 800);

    const y =
      element.getBoundingClientRect().top + window.scrollY - getOffset();
    window.scrollTo({
      top: y,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      if (lockRef.current) return;

      const offset = getOffset();
      let current = CATEGORY_TABS[0].id;
      for (const tab of CATEGORY_TABS) {
        const el = document.getElementById(tab.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset + 8) {
          current = tab.id;
        } else {
          break;
        }
      }
      setActiveTab((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (lockTimer.current) clearTimeout(lockTimer.current);
    };
  }, []);

  useEffect(() => {
    const container = listRef.current;
    const button = container?.querySelector<HTMLElement>(
      `[data-tab="${activeTab}"]`,
    );
    if (!container || !button) return;

    const left =
      button.offsetLeft - (container.clientWidth - button.offsetWidth) / 2;
    container.scrollTo({
      left,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [activeTab]);

  return (
    <nav
      aria-label="বিভাগ অনুযায়ী দেখুন"
      className="pwa-safe-top md:pt-0 sticky top-0 z-30 bg-[var(--surface-topbar)] shadow-[0_1px_0_var(--surface-hairline)] backdrop-blur-md md:top-14"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex w-full min-w-0 items-center gap-3 py-2">
          <div
            ref={listRef}
            className="no-scrollbar relative flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto"
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  data-tab={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] motion-reduce:transition-none ${
                    isActive
                      ? "bg-[var(--accent-primary)] text-[var(--accent-foreground)]"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  }`}
                >
                  <Icon
                    name={tab.iconName}
                    size={16}
                    strokeWidth={1.75}
                  />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden shrink-0 items-center border-l border-zinc-200 pl-3 md:flex dark:border-zinc-800">
            <button
              type="button"
              onClick={openSearchModal}
              title="সার্চ করুন (Ctrl+K)"
              className="flex min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-600 transition-colors hover:border-[var(--accent-primary)] hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] motion-reduce:transition-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <Icon name="Search" size={16} strokeWidth={1.75} />
              <span className="font-medium">অনুসন্ধান</span>
              <kbd className="hidden rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-xs text-zinc-500 lg:inline-block dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                Ctrl K
              </kbd>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
