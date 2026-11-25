import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { NavItem } from "@/config/navigation";

interface ServiceCardProps {
  item: NavItem;
  tone?: "default" | "trending";
}

/**
 * Editorial utility tile with crisp 1px border and accent hover indicator.
 */
export default function ServiceCard({
  item,
  tone = "default",
}: ServiceCardProps) {
  const iconTone =
    tone === "trending"
      ? "bg-[var(--accent-soft)] text-[var(--accent-ink)]"
      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

  return (
    <Link
      href={item.href}
      className="group flex min-h-14 items-center gap-3 rounded-[var(--radius-lg)] border border-zinc-200 bg-[var(--surface-card)] p-3 transition-colors hover:border-[var(--accent-soft-border)] hover:bg-[var(--surface-raised)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] motion-reduce:transition-none dark:border-zinc-800"
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--accent-foreground)] sm:size-10 ${iconTone}`}
      >
        <Icon name={item.icon} size={18} strokeWidth={1.75} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <span className="line-clamp-2 text-sm font-medium leading-snug text-zinc-900 dark:text-zinc-100">
            {item.label}
          </span>
          {item.badge && (
            <span className="shrink-0 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-2xs font-medium leading-none text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {item.badge}
            </span>
          )}
        </span>
        {item.description && (
          <span className="mt-0.5 hidden text-xs leading-relaxed text-zinc-600 sm:line-clamp-2 dark:text-zinc-400">
            {item.description}
          </span>
        )}
      </span>
    </Link>
  );
}
