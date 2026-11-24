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
      className="scroll-mt-32 space-y-4"
      aria-labelledby={`${id}-heading`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
            <Icon name={iconName} size={20} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h2
              id={`${id}-heading`}
              className="truncate text-lg font-bold leading-snug text-zinc-900 sm:text-xl dark:text-zinc-100"
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
            className="group flex min-h-10 shrink-0 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 motion-reduce:transition-none dark:text-emerald-300 dark:hover:bg-emerald-400/10"
          >
            <span>সব দেখুন</span>
            <Icon
              name="ArrowRight"
              size={14}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </Link>
        )}
      </div>

      {/* Grid: 2 cols phone, 3 tablet, 4 laptop, 5 wide desktop */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item) => (
          <ServiceCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
