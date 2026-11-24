import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { NavItem } from "@/config/navigation";

interface ServiceCardProps {
  item: NavItem;
  /** "trending" uses a slightly stronger icon tint for popular services */
  tone?: "default" | "trending";
}

/**
 * One tappable service tile.
 * Mobile: icon + label (2 lines max), easy 56px+ tap target.
 * ≥ sm: also shows a short description so visitors understand the tool before opening it.
 */
export default function ServiceCard({
  item,
  tone = "default",
}: ServiceCardProps) {
  const iconTone =
    tone === "trending"
      ? "bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

  return (
    <Link
      href={item.href}
      className="group flex min-h-14 items-center gap-2.5 rounded-xl border border-zinc-200 bg-white p-2.5 transition-colors hover:border-emerald-500/60 hover:bg-emerald-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 motion-reduce:transition-none sm:gap-3 sm:p-3 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-emerald-400/50 dark:hover:bg-emerald-400/5"
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:bg-emerald-600 group-hover:text-white sm:size-10 dark:group-hover:bg-emerald-500 dark:group-hover:text-white ${iconTone}`}
      >
        <Icon name={item.icon} size={20} strokeWidth={2} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <span className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
            {item.label}
          </span>
          {item.badge && (
            <span className="shrink-0 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-2xs font-bold leading-none text-amber-700 dark:text-amber-300">
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
