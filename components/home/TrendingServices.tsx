import { ALL_NAV_ITEMS, type NavItem } from "@/config/navigation";
import Icon from "@/components/ui/Icon";
import ServiceCard from "@/components/home/ServiceCard";

const TRENDING_ITEM_IDS = [
  "bd-calendar",
  "conv-land",
  "tool-tax",
  "conv-number-word",
  "tool-resizer",
  "tool-age",
  "emg-999",
  "intl-world-clock",
];

const trendingList: NavItem[] = TRENDING_ITEM_IDS.map((id) =>
  ALL_NAV_ITEMS.find((item) => item.id === id),
).filter(Boolean) as NavItem[];

export default function TrendingServices() {
  if (!trendingList.length) return null;

  return (
    <section
      id="trending"
      className="scroll-mt-20 space-y-4 md:scroll-mt-32"
      aria-labelledby="trending-heading"
    >
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--accent-soft-border)] bg-[var(--accent-soft)] text-[var(--accent-ink)]">
          <Icon name="TrendingUp" size={18} strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <h2
            id="trending-heading"
            className="text-lg font-semibold leading-snug text-zinc-900 sm:text-xl dark:text-zinc-100"
          >
            জনপ্রিয় ও সর্বাধিক ব্যবহৃত সেবা
          </h2>
          <p className="truncate text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            প্রতিদিন যেসব সেবা সবচেয়ে বেশি ব্যবহার হয়
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
        {trendingList.map((item) => (
          <ServiceCard key={item.id} item={item} tone="trending" />
        ))}
      </div>
    </section>
  );
}
