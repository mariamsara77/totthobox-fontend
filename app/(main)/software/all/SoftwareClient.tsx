"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import useSWRInfinite from "swr/infinite";
import {
  Puzzle,
  Search,
  X,
  ArrowRight,
  ChevronDown,
  Download,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type App = {
  id: number;
  name: string;
  slug: string;
  version?: string;
  platform?: string;
  description?: string;
  download_count?: number;
  icon_url?: string;
};

type Props = {
  platform?: string; // এখন prop হিসেবে আসবে
};

function AppSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4 animate-pulse">
      <div className="flex gap-4 items-start">
        <div className="w-16 h-16 rounded-xl bg-zinc-400/10 shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-5 w-3/4 rounded bg-zinc-400/10" />
          <div className="h-3 w-1/3 rounded bg-zinc-400/10" />
          <div className="h-3 w-full rounded bg-zinc-400/10" />
          <div className="h-3 w-2/3 rounded bg-zinc-400/10" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-zinc-400/25">
        <div className="h-3 w-24 rounded bg-zinc-400/10" />
      </div>
    </div>
  );
}

export default function SoftwareClient({ platform = "" }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.meta?.has_more) return null;

    const params = new URLSearchParams();
    params.set("page", String(pageIndex + 1));
    params.set("per_page", "12");

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (platform) params.set("platform", platform);

    return `${API_BASE}/api/apps?${params.toString()}`;
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher,
    { revalidateFirstPage: false, revalidateOnFocus: false },
  );

  const apps: App[] = data ? data.flatMap((page) => page.data || []) : [];
  const hasMore = data?.[data.length - 1]?.meta?.has_more ?? false;
  const total = data?.[0]?.meta?.total ?? 0;

  const isLoading = !data && !error;
  const isFiltering = isValidating && size === 1;

  useEffect(() => {
    setSize(1);
  }, [debouncedSearch, platform, setSize]);

  const resetFilters = () => {
    setSearch("");
    router.push("/software/all");
  };

  const handlePlatformChange = (value: string) => {
    if (value) {
      router.push(`/software/all/${encodeURIComponent(value)}`);
    } else {
      router.push("/software/all");
    }
  };

  const hasActiveFilters = !!(search || platform);

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 sm:p-6">
      {/* Header */}
      <header className="border-b border-zinc-400/25 pb-4">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Puzzle className="w-6 h-6 text-amber-600 dark:text-amber-500" />
          {platform
            ? `Free ${platform} Software Download`
            : "Digital Resource Library"}
        </h1>
        <p className="text-sm  mt-1">
          {platform
            ? `১০০% ফ্রি ও ভেরিফাইড ${platform} সফটওয়্যার এবং অ্যাপস — নিরাপদ, আপডেটেড ও সহজে ডাউনলোডযোগ্য`
            : "১০০% ফ্রি ও ভেরিফাইড সফটওয়্যার এবং অ্যাপস — নিরাপদ, আপডেটেড ও সহজে ডাউনলোডযোগ্য"}
        </p>
      </header>

      {/* Search + Filters */}
      <nav className="space-y-4" aria-label="অ্যাপ সার্চ ও ফিল্টার">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="অ্যাপের নামে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-400/25 bg-zinc-400/10 text-sm  focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="p-2.5 rounded-xl bg-zinc-400/10 hover:bg-zinc-400/25"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Platform Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <div className="relative min-w-36 shrink-0 p-1">
            <select
              value={platform}
              onChange={(e) => handlePlatformChange(e.target.value)}
              className="appearance-none w-full bg-zinc-100 dark:bg-zinc-700  rounded-lg p-2 outline-none"
            >
              <option value="">All Platforms</option>
              <option value="Windows">Windows</option>
              <option value="Android">Android</option>
              <option value="Mac">Mac</option>
              <option value="Fonts">Fonts</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </nav>

      {/* Results count */}
      {hasActiveFilters && !isLoading && (
        <p className="text-xs  text-zinc-400">
          {total}টি ফলাফল পাওয়া গেছে
          {platform && ` (${platform})`}
        </p>
      )}

      {/* Apps List */}
      <section className="space-y-4" aria-label="Software & Apps List">
        {isLoading || isFiltering ? (
          <>
            <AppSkeleton />
            <AppSkeleton />
            <AppSkeleton />
            <AppSkeleton />
            <AppSkeleton />
          </>
        ) : apps.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg ">কোনো অ্যাপ পাওয়া যায়নি</p>
            <p className="text-sm mt-1">
              অন্য ফিল্টার বা সার্চ দিয়ে চেষ্টা করুন
            </p>
          </div>
        ) : (
          apps.map((app) => (
            <Link
              key={app.id}
              href={`/software/${app.slug}`}
              className="block rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4 "
            >
              <div className="flex gap-4 items-start">
                <div className="shrink-0">
                  {app.icon_url ? (
                    <img
                      src={app.icon_url}
                      alt={app.name}
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-400/25"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-zinc-400/10 flex items-center justify-center">
                      <Puzzle className="w-7 h-7 text-zinc-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg line-clamp-1">{app.name}</h2>
                    {app.platform && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs  border border-zinc-400/30 ">
                        {app.platform}
                      </span>
                    )}
                  </div>

                  {app.description && (
                    <p className="text-sm  line-clamp-2">
                      {app.description.replace(/<[^>]+>/g, "")}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-400/25 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs  text-zinc-400">
                  বিস্তারিত পড়ুন
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>

                {typeof app.download_count === "number" && (
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                    <Download className="w-3.5 h-3.5" />
                    {app.download_count}+
                  </span>
                )}
              </div>
            </Link>
          ))
        )}
      </section>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center py-6">
          <button
            onClick={() => setSize(size + 1)}
            disabled={isValidating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-400/10 text-sm   hover:bg-zinc-400/25  disabled:opacity-50"
          >
            {isValidating ? "লোড হচ্ছে..." : "আরও দেখুন"}
          </button>
        </div>
      )}

      {/* SEO Content */}
      <section className="space-y-4 pt-8 border-t border-zinc-400/25">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
          {platform
            ? `ফ্রি ${platform} সফটওয়্যার ও অ্যাপ ডাউনলোড`
            : "ফ্রি সফটওয়্যার ও অ্যাপ রিসোর্স লাইব্রেরি"}
        </h2>

        <div className="space-y-4 text-sm  leading-relaxed">
          {platform ? (
            <>
              <p>
                এই পেজে আপনি পাবেন{" "}
                <strong>১০০% ফ্রি ও ভেরিফাইড {platform}</strong> প্ল্যাটফর্মের
                সফটওয়্যার ও অ্যাপ। আমরা প্রতিটি রিসোর্স সাবধানে যাচাই করি যাতে
                নিরাপদ ডাউনলোড নিশ্চিত থাকে এবং ব্যবহারকারীরা ম্যালওয়্যার বা
                অপ্রয়োজনীয় সফটওয়্যার থেকে মুক্ত থাকেন।
              </p>
              <p>
                এখানে প্রোডাকটিভিটি টুল, মিডিয়া প্লেয়ার, সিস্টেম ইউটিলিটি,
                অ্যান্টিভাইরাস, ডিজাইন সফটওয়্যার এবং ডেভেলপমেন্ট টুলসহ বিভিন্ন
                ক্যাটাগরির {platform} অ্যাপ রয়েছে। প্রতিটি আইটেমের সাথে
                সংক্ষিপ্ত বিবরণ এবং ডাউনলোড অপশন দেওয়া আছে।
              </p>
              <p>
                সার্চ বক্স ব্যবহার করে দ্রুত আপনার প্রয়োজনীয় {platform} টুল
                খুঁজে নিন। “বিস্তারিত পড়ুন” বাটনে ক্লিক করলে বিস্তারিত পেজে
                যাবেন, যেখানে সফটওয়্যারের ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং
                ডাউনলোড অপশন পাবেন।
              </p>
            </>
          ) : (
            <>
              <p>
                এই পেজে আপনি পাবেন <strong>১০০% ফ্রি ও ভেরিফাইড</strong>{" "}
                Windows, Android এবং Mac প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপ। আমরা
                প্রতিটি রিসোর্স সাবধানে যাচাই করি যাতে নিরাপদ ডাউনলোড নিশ্চিত
                থাকে এবং ব্যবহারকারীরা ম্যালওয়্যার বা অপ্রয়োজনীয় সফটওয়্যার থেকে
                মুক্ত থাকেন।
              </p>
              <p>
                লাইব্রেরিতে প্রোডাকটিভিটি টুল, মিডিয়া প্লেয়ার, সিস্টেম ইউটিলিটি,
                অ্যান্টিভাইরাস, ডিজাইন সফটওয়্যার, ডেভেলপমেন্ট টুলসহ বিভিন্ন
                ক্যাটাগরির অ্যাপ রয়েছে। প্রতিটি আইটেমের সাথে সংক্ষিপ্ত বিবরণ,
                প্ল্যাটফর্ম সাপোর্ট এবং অফিসিয়াল সোর্সের লিংক দেওয়া থাকে।
              </p>
              <p>
                সার্চ বক্স বা প্ল্যাটফর্ম ফিল্টার ব্যবহার করে দ্রুত আপনার
                প্রয়োজনীয় টুল খুঁজে নিন। “বিস্তারিত পড়ুন” বাটনে ক্লিক করলে
                বিস্তারিত পেজে যাবেন, যেখানে সফটওয়্যারের ফিচার, সিস্টেম
                রিকোয়ারমেন্ট এবং ডাউনলোড অপশন পাবেন।
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
