import React from "react";
import Link from "next/link";
import Icon from "./Icon";
import BreadcrumbStructuredData from "@/components/seo/BreadcrumbStructuredData";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  // Normalize items for schema: Home is always first
  const schemaItems = [
    { name: "হোম", item: "https://totthobox.com" },
    ...items
      .filter((it) => it.href)
      .map((it) => ({
        name: it.label,
        item: it.href!.startsWith("http")
          ? it.href!
          : `https://totthobox.com${it.href}`,
      })),
  ];

  return (
    <>
      <BreadcrumbStructuredData items={schemaItems} />
      <nav
        aria-label="ব্রেডক্রাম্ব নেভিগেশন"
        className={`flex items-center text-xs text-zinc-500 dark:text-zinc-400 overflow-x-auto no-scrollbar py-1 ${className}`}
      >
        <ol className="inline-flex items-center gap-1.5 flex-nowrap shrink-0">
          <li>
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors p-1 rounded"
            >
              <Icon name="Home" size="xs" />
              <span>হোম</span>
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="inline-flex items-center gap-1.5">
                <Icon
                  name="ChevronRight"
                  size={12}
                  className="text-zinc-400 dark:text-zinc-600 shrink-0"
                />
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-48 sm:max-w-none"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors truncate max-w-36 sm:max-w-none"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export default Breadcrumb;
