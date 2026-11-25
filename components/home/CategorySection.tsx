import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { NavItem } from "@/config/navigation";
import ServiceCard from "@/components/home/ServiceCard";

interface CategorySectionProps {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  viewAllHref?: string;
  items: NavItem[];
}

export default function CategorySection({
  id,
  title,
  subtitle,
  iconName,
  viewAllHref,
  items,
}: CategorySectionProps) {
  if (!items?.length) return null;

  return (
    <section
      id={id}
      className="scroll-mt-20 space-y-4 md:scroll-mt-32"
      aria-labelledby={`${id}-heading`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <Icon name={iconName} size={18} strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <h2
              id={`${id}-heading`}
              className="truncate text-lg font-semibold leading-snug text-zinc-900 sm:text-xl dark:text-zinc-100"
            >
              {title}
            </h2>
            <p className="truncate text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {subtitle}
            </p>
          </div>
        </div>

        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="group flex min-h-11 shrink-0 items-center gap-1 rounded-lg px-3 text-sm font-medium text-[var(--accent-ink)] transition-colors hover:bg-[var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] motion-reduce:transition-none"
          >
            <span>সব দেখুন</span>
            <Icon
              name="ArrowRight"
              size={14}
              strokeWidth={1.75}
              className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </Link>
        )}
      </div>

      {/* Grid: 2 cols phone, 3 tablet, 4 laptop, 5 wide desktop */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item) => (
          <ServiceCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
