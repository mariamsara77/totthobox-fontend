"use client";

import React from "react";
import Icon from "./Icon";

export interface TabItem {
  id: string;
  label: string;
  iconName?: string;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = "" }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="ক্যাটাগরি ট্যাব"
      className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-zinc-200/80 dark:border-zinc-800 pb-1 ${className}`}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const nextIdx =
                e.key === "ArrowRight"
                  ? (index + 1) % tabs.length
                  : (index - 1 + tabs.length) % tabs.length;
              onChange(tabs[nextIdx].id);
              const buttons = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
              buttons?.[nextIdx]?.focus();
            }}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[var(--radius-md)] transition-colors duration-150 shrink-0 min-h-11 cursor-pointer ${
              isActive
                ? "bg-[var(--accent-primary)] text-[var(--accent-foreground)] shadow-[var(--shadow-xs)]"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            {tab.iconName && (
              <Icon
                name={tab.iconName}
                size="xs"
                strokeWidth={isActive ? 2 : 1.75}
              />
            )}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`px-1.5 py-0.5 text-2xs rounded-full font-semibold tabular-nums ${
                  isActive
                    ? "bg-white/20 text-[var(--accent-foreground)]"
                    : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
