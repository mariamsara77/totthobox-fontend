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
  { id: "trending", label: "জনপ্রিয় সেবা", iconName: "Sparkles" },
  ...NAVIGATION_REGISTRY.map((cat) => ({
    id: cat.id,
    label: cat.shortTitle,
    iconName: cat.icon,
  })),
];

// Main navbar (64px) + this bar (~56px) + breathing room. Matches `scroll-mt-32` on sections.
const HEADER_OFFSET = 128;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function StickyCategoryNav() {
  const [activeTab, setActiveTab] = useState<string>(CATEGORY_TABS[0].id);
  const { openSearchModal } = useSearchModal();

  const listRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false); // pause scrollspy while a click-scroll is animating
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({
      top: y,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  // Scrollspy: highlight the last section whose top has passed under the sticky bars
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      if (lockRef.current) return;

      let current = CATEGORY_TABS[0].id;
      for (const tab of CATEGORY_TABS) {
        const el = document.getElementById(tab.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= HEADER_OFFSET + 8) {
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

  // Keep the active pill centered inside the horizontal list (without moving the page)
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
      className="sticky top-16 z-30 bg-zinc-400/10 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex w-full min-w-0 items-center gap-3 py-2">
          {/* Scrollable category pills with soft fade at the edges */}
          <div
            ref={listRef}
            className="no-scrollbar relative flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0, #000 12px, #000 calc(100% - 20px), transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0, #000 12px, #000 calc(100% - 20px), transparent 100%)",
            }}
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
                  className={`flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 motion-reduce:transition-none ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm dark:bg-emerald-500 dark:text-zinc-950"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  }`}
                >
                  <Icon
                    name={tab.iconName}
                    size={16}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search shortcut (desktop; phones use the bottom bar) */}
          <div className="hidden shrink-0 items-center border-l border-zinc-200 pl-3 md:flex dark:border-zinc-800">
            <button
              type="button"
              onClick={openSearchModal}
              title="সার্চ করুন (Ctrl+K)"
              className="flex min-h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-600 transition-colors hover:border-emerald-500/60 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 motion-reduce:transition-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <Icon name="Search" size={16} />
              <span className="font-medium">অনুসন্ধান</span>
              <kbd className="hidden rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-mono text-xs text-zinc-500 lg:inline-block dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                Ctrl K
              </kbd>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
