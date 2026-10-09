import Link from "next/link";
import { Newspaper, ExternalLink, Clock3, Layers3, Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { NewsItem, NewsSource, NewsSourceResponse } from "@/lib/news";
import { NEWS_CATEGORIES } from "@/lib/news";
import NewsThumbnail from "@/components/news/NewsThumbnail";

type Props = {
  items: NewsItem[];
  error?: boolean;
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
  sources: NewsSourceResponse;
  selectedSource?: NewsSource | null;
  filters: {
    source?: string;
    search?: string;
    language?: string;
    category?: string;
    hours?: string;
    page?: string;
  };
  basePath: string;
};

function formatTime(value?: string | null, language: "bn" | "en" = "bn") {
  if (!value) return "সময় পাওয়া যায়নি";

  try {
    return new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Dhaka",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

const NEWS_CATEGORY_LABELS: Record<string, string> = {
  national: "জাতীয়",
  politics: "রাজনীতি",
  international: "আন্তর্জাতিক",
  economy: "অর্থনীতি",
  business: "ব্যবসা",
  sports: "খেলাধুলা",
  entertainment: "বিনোদন",
  latest: "সর্বশেষ",
  "top news": "শীর্ষ সংবাদ",
  world: "বিশ্ব",
  technology: "প্রযুক্তি",
  health: "স্বাস্থ্য",
  education: "শিক্ষা",
  culture: "সংস্কৃতি",
};

function formatCategory(value: string, language: "bn" | "en"): string {
  if (language === "en") return value;

  return NEWS_CATEGORY_LABELS[value.trim().toLocaleLowerCase()] ?? value;
}

function buildPageUrl(basePath: string, filters: Props["filters"], page: number) {
  const params = new URLSearchParams();
  // Source-specific routes already encode the database-managed source slug.
  // Keep the source query parameter only on the all-headlines route.
  if (basePath === "/news/headlines" && filters.source) {
    params.set("source", filters.source);
  }
  if (filters.search) params.set("search", filters.search);
  if (filters.language) params.set("language", filters.language);
  if (filters.category) params.set("category", filters.category);
  if (filters.hours) params.set("hours", filters.hours);
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? basePath + "?" + query : basePath;
}

function SourceLinks({
  sources,
  selectedSource,
}: {
  sources: NewsSourceResponse;
  selectedSource?: NewsSource | null;
}) {
  const all = [...sources.bn, ...sources.en];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <Link
        href="/news/headlines"
        className={
          "shrink-0 rounded-xl px-3.5 py-2 text-sm transition " +
          (!selectedSource
            ? "bg-zinc-400/30 font-semibold"
            : "bg-zinc-400/10 hover:bg-zinc-400/20")
        }
      >
        সব সংবাদ
      </Link>

      {all.map((source) => (
        <Link
          key={source.key}
          href={"/news/" + source.slug}
          className={
            "shrink-0 rounded-xl px-3.5 py-2 text-sm transition " +
            (selectedSource?.key === source.key
              ? "bg-zinc-400/30 font-semibold"
              : "bg-zinc-400/10 hover:bg-zinc-400/20")
          }
        >
          {source.name}
        </Link>
      ))}
    </div>
  );
}

function FilterBar({ filters, basePath, sources }: Pick<Props, "filters" | "basePath" | "sources">) {
  return (
    <form action={basePath} method="get" className="space-y-3">
      <label className="flex h-11 items-center gap-2 rounded-xl bg-zinc-400/10 px-3 focus-within:bg-zinc-400/15">
        <Search className="size-4 shrink-0 opacity-50" aria-hidden="true" />
        <span className="sr-only">সংবাদ খুঁজুন</span>
        <input
          name="search"
          defaultValue={filters.search || ""}
          placeholder="সংবাদের শিরোনাম খুঁজুন..."
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:opacity-50"
        />
      </label>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <select
          name="category"
          defaultValue={filters.category || ""}
          className="min-w-[130px] rounded-xl bg-zinc-400/10 px-3 py-2.5 text-sm outline-none"
          aria-label="সংবাদ বিভাগ"
        >
          {NEWS_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        <select
          name="hours"
          defaultValue={filters.hours || ""}
          className="min-w-[130px] rounded-xl bg-zinc-400/10 px-3 py-2.5 text-sm outline-none"
          aria-label="সময়সীমা"
        >
          <option value="">যেকোনো সময়</option>
          <option value="6">শেষ ৬ ঘণ্টা</option>
          <option value="24">শেষ ২৪ ঘণ্টা</option>
          <option value="48">শেষ ৪৮ ঘণ্টা</option>
          <option value="168">শেষ ৭ দিন</option>
        </select>

        {basePath === "/news/headlines" && (
          <select
            name="source"
            defaultValue={filters.source || ""}
            className="min-w-[150px] rounded-xl bg-zinc-400/10 px-3 py-2.5 text-sm outline-none"
            aria-label="সংবাদমাধ্যম"
          >
            <option value="">সব সংবাদমাধ্যম</option>
            {[...sources.bn, ...sources.en].map((source) => (
              <option key={source.key} value={source.key}>
                {source.name}
              </option>
            ))}
          </select>
        )}

        {filters.language && (
          <input type="hidden" name="language" value={filters.language} />
        )}

        <button
          type="submit"
          className="shrink-0 rounded-xl bg-zinc-400/25 px-4 py-2.5 text-sm font-semibold transition hover:bg-zinc-400/40"
        >
          খুঁজুন
        </button>
      </div>
    </form>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="rounded-2xl bg-zinc-400/10 p-4 transition hover:bg-zinc-400/20 sm:p-5">
      <div className="flex items-start gap-4">
        <NewsThumbnail src={item.image_url} alt={item.title} />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <Link
              href={item.source_slug ? "/news/" + item.source_slug : "/news/headlines?source=" + encodeURIComponent(item.source_key)}
              className="font-semibold hover:underline"
            >
              {item.source_name}
            </Link>
            {item.category ? (
              <span className="rounded-md bg-zinc-400/15 px-2 py-0.5">
                {formatCategory(item.category, item.language)}
              </span>
            ) : null}
            <span>{formatTime(item.published_at, item.language)}</span>
          </div>

          <h2 className="text-base font-semibold leading-6 tracking-tight sm:text-lg">
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:underline focus-visible:underline"
            >
              {item.title}
            </a>
          </h2>

          {item.coverage_count > 1 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-400/15 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-300">
              <Layers3 className="size-3.5" aria-hidden="true" />
              {item.coverage_count}টি মাধ্যমে একই খবর
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-400/20 pt-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <Clock3 className="size-3.5" aria-hidden="true" />
          মূল সংবাদমাধ্যম
        </span>

        <a
          href={item.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-400/15 px-3.5 py-2 text-sm font-medium transition hover:bg-zinc-400/25"
        >
          মূল সংবাদ পড়ুন
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export default function NewsHub({
  items,
  error = false,
  meta,
  sources,
  selectedSource,
  filters,
  basePath,
}: Props) {
  const title = selectedSource ? selectedSource.name + " সংবাদ" : "সংবাদ শিরোনাম";
  const description = selectedSource
    ? selectedSource.name + " থেকে আসা সাম্প্রতিক সংবাদ শিরোনাম এক জায়গায় দেখুন। বিস্তারিত পড়তে মূল সংবাদমাধ্যমে যান।"
    : "বিভিন্ন সংবাদমাধ্যমের সাম্প্রতিক সংবাদ শিরোনাম এক জায়গায় দেখুন এবং মূল সংবাদমাধ্যমে সম্পূর্ণ প্রতিবেদন পড়ুন।";

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-6 sm:py-8">
      <header className="space-y-2">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight sm:text-3xl">
          <Newspaper className="size-7" aria-hidden="true" />
          {title}
        </h1>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </header>

      <SourceLinks sources={sources} selectedSource={selectedSource} />

      <FilterBar filters={filters} basePath={basePath} sources={sources} />

      <div className="flex items-center justify-between gap-3 text-sm text-zinc-500 dark:text-zinc-400">
        <span>{meta.total.toLocaleString("bn-BD")}টি সংবাদ</span>
        <div className="flex items-center gap-1">
          <Link
            href="/news/headlines?language=bn"
            className="rounded-lg bg-zinc-400/10 px-2.5 py-1.5 hover:bg-zinc-400/20"
          >
            বাংলা
          </Link>
          <Link
            href="/news/headlines?language=en"
            className="rounded-lg bg-zinc-400/10 px-2.5 py-1.5 hover:bg-zinc-400/20"
          >
            English
          </Link>
        </div>
      </div>

      {error ? (
        <div role="alert" className="rounded-2xl bg-zinc-400/10 px-6 py-12 text-center">
          <Newspaper className="mx-auto size-8 opacity-35" aria-hidden="true" />
          <h2 className="mt-4 text-base font-semibold">সংবাদ লোড করা যায়নি</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            সংবাদ API-তে সংযোগ পাওয়া যায়নি। একটু পরে আবার চেষ্টা করুন।
          </p>
          <a
            href={basePath}
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-zinc-400/20 px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-400/30"
          >
            আবার চেষ্টা করুন
          </a>
        </div>
      ) : items.length ? (
        <div className="space-y-4">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-zinc-400/10 px-6 py-14 text-center">
          <Newspaper className="mx-auto size-8 opacity-35" aria-hidden="true" />
          <h2 className="mt-4 text-base font-semibold">কোনো সংবাদ পাওয়া যায়নি</h2>
          <p className="mt-1 text-sm opacity-50">
            সময়সীমা বা অনুসন্ধানের শব্দ পরিবর্তন করে আবার চেষ্টা করুন।
          </p>
        </div>
      )}

      {meta.last_page > 1 ? (
        <nav className="flex items-center justify-center gap-2" aria-label="সংবাদ পৃষ্ঠা">
          {meta.current_page > 1 ? (
            <Link
              href={buildPageUrl(basePath, filters, meta.current_page - 1)}
              className="inline-flex items-center gap-1 rounded-xl bg-zinc-400/10 px-3.5 py-2 text-sm hover:bg-zinc-400/20"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              আগের
            </Link>
          ) : null}

          <span className="rounded-xl bg-zinc-400/15 px-3.5 py-2 text-sm font-semibold">
            {meta.current_page} / {meta.last_page}
          </span>

          {meta.current_page < meta.last_page ? (
            <Link
              href={buildPageUrl(basePath, filters, meta.current_page + 1)}
              className="inline-flex items-center gap-1 rounded-xl bg-zinc-400/10 px-3.5 py-2 text-sm hover:bg-zinc-400/20"
            >
              পরের
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
