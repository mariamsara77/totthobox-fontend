"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWRInfinite from "swr/infinite";
import { Puzzle, Search, X, ArrowRight, ChevronDown } from "lucide-react";
import InfiniteScrollTrigger from "@/components/InfiniteScrollTrigger";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load software data");
  }

  return response.json();
};

type App = {
  id: number;
  name: string;
  slug: string;
  version?: string;
  platform?: string;
  description?: string;
  icon_url?: string;
};

type Props = {
  platform?: string;
};

function AppSkeleton() {
  return (
    <div className="rounded-2xl bg-zinc-400/10 p-4 animate-pulse">
      <div className="flex items-start gap-4">
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

function cleanDescription(description?: string) {
  if (!description) return "";

  return description
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const platformGuidance: Record<string, [string, string]> = {
  Windows: [
    "Windows সফটওয়্যার বাছাই করার সময় Windows-এর কোন সংস্করণ সমর্থিত, 32-bit বা 64-bit প্রয়োজন কি না এবং ইনস্টলেশনের জন্য পর্যাপ্ত স্টোরেজ আছে কি না—এসব তথ্য আগে যাচাই করা ভালো। একই সফটওয়্যারের ভিন্ন সংস্করণে সিস্টেম রিকোয়ারমেন্টও আলাদা হতে পারে।",
    "ইনস্টল করার আগে সফটওয়্যারটির প্রকাশক, লাইসেন্স এবং অফিসিয়াল ওয়েবসাইট যাচাই করুন। বিশেষ করে installer বা setup file কোথা থেকে সংগ্রহ করা হচ্ছে তা নিশ্চিত করা গুরুত্বপূর্ণ।",
  ],
  Android: [
    "Android অ্যাপ বাছাইয়ের ক্ষেত্রে Android-এর প্রয়োজনীয় version, ডিভাইসের storage এবং অ্যাপটি কী ধরনের permission চায় তা দেখা গুরুত্বপূর্ণ। একই নামের অননুমোদিত বা পরিবর্তিত APK-এর বদলে প্রকাশকের নির্ভরযোগ্য উৎস ব্যবহার করা উচিত।",
    "অ্যাপ ইনস্টল করার আগে developer বা publisher-এর পরিচয়, প্রকাশিত সংস্করণ এবং অফিসিয়াল distribution source মিলিয়ে নিন। প্রয়োজনের বাইরে permission চাইলে সেটিও বিবেচনা করা উচিত।",
  ],
  Mac: [
    "Mac সফটওয়্যার ব্যবহারের আগে আপনার macOS version এবং Mac-এর Apple silicon বা Intel processor-এর সঙ্গে সফটওয়্যারটির সামঞ্জস্য যাচাই করা ভালো। কিছু অ্যাপ নির্দিষ্ট macOS সংস্করণ বা architecture-এর ওপর নির্ভর করতে পারে।",
    "সফটওয়্যার সংগ্রহের সময় প্রকাশকের অফিসিয়াল উৎস, লাইসেন্স এবং installation package-এর ধরন যাচাই করুন। macOS-এর security settings প্রয়োজন হলে পরিবর্তনের আগে সফটওয়্যারটির উৎস নিশ্চিত করা উচিত।",
  ],
  Fonts: [
    "Font ব্যবহারের ক্ষেত্রে শুধু নাম বা দেখতে কেমন তা নয়, font format, ভাষা বা Unicode support এবং কোন কাজে ব্যবহার করা যাবে—এসব বিষয় গুরুত্বপূর্ণ। বিশেষ করে বাংলা লেখার জন্য প্রয়োজনীয় glyph ও Unicode support আগে যাচাই করা ভালো।",
    "কোনো font ডাউনলোড বা ওয়েবসাইটে ব্যবহার করার আগে তার licence দেখে নিন। ব্যক্তিগত, বাণিজ্যিক, embedding বা redistribution-এর অনুমতি সব font-এর ক্ষেত্রে এক নয়।",
  ],
};

export default function SoftwareClient({ platform = "" }: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.meta?.has_more) {
      return null;
    }

    const params = new URLSearchParams();

    params.set("page", String(pageIndex + 1));
    params.set("per_page", "12");

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    if (platform) {
      params.set("platform", platform);
    }

    return `${API_BASE}/api/apps?${params.toString()}`;
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  const apps: App[] = data ? data.flatMap((page) => page?.data || []) : [];

  const hasMore = data?.[data.length - 1]?.meta?.has_more ?? false;

  const total = data?.[0]?.meta?.total ?? 0;

  const isLoading = !data && !error;
  const isFiltering = isValidating && size === 1;

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      setSize(1);
    }
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

  const hasActiveFilters = Boolean(search || platform);

  return (
    <main className="max-w-2xl mx-auto space-y-4 p-4 sm:p-6">
      {/* Header */}
      <header className="border-b border-zinc-400/25 pb-4">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Puzzle className="w-6 h-6" />

          {platform
            ? `${platform} Software & Apps`
            : "Software & Apps Directory"}
        </h1>

        <p className="text-sm opacity-60 mt-1">
          {platform
            ? `${platform} প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপ সম্পর্কে প্রয়োজনীয় তথ্য, ফিচার এবং অফিসিয়াল সোর্স খুঁজে দেখুন।`
            : "বিভিন্ন প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপ সম্পর্কে তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স খুঁজে দেখুন।"}
        </p>
      </header>

      {/* Search & Filters */}
      <nav
        className="space-y-4"
        aria-label="সফটওয়্যার সার্চ ও প্ল্যাটফর্ম ফিল্টার"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="সফটওয়্যার বা অ্যাপের নামে খুঁজুন..."
              aria-label="সফটওয়্যার সার্চ"
              className="w-full rounded-xl border border-zinc-400/25 bg-zinc-400/10 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              aria-label="ফিল্টার মুছে ফেলুন"
              title="ফিল্টার মুছে ফেলুন"
              className="p-2.5 rounded-xl bg-zinc-400/10 hover:bg-zinc-400/25"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Platform Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <div className="relative min-w-36 shrink-0">
            <select
              value={platform}
              onChange={(event) => handlePlatformChange(event.target.value)}
              aria-label="প্ল্যাটফর্ম নির্বাচন করুন"
              className="w-full appearance-none rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-2.5 pr-9 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
            >
              <option value="">সব প্ল্যাটফর্ম</option>
              <option value="Windows">Windows</option>
              <option value="Android">Android</option>
              <option value="Mac">Mac</option>
              <option value="Fonts">Fonts</option>
            </select>

            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-60" />
          </div>
        </div>
      </nav>

      {/* Results Count */}
      {hasActiveFilters && !isLoading && !error && (
        <p className="text-xs opacity-50">
          {total}টি ফলাফল পাওয়া গেছে
          {platform && ` · ${platform}`}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl bg-zinc-400/10 p-4 text-center">
          <p className="text-sm">সফটওয়্যার তথ্য লোড করা সম্ভব হয়নি।</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 rounded-xl bg-zinc-400/10 hover:bg-zinc-400/25 px-4 py-2 text-sm"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* Apps List */}
      {!error && (
        <section className="space-y-4" aria-label="Software and Apps List">
          {isLoading || isFiltering ? (
            <>
              <AppSkeleton />
              <AppSkeleton />
              <AppSkeleton />
              <AppSkeleton />
              <AppSkeleton />
            </>
          ) : apps.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-zinc-400/5">
              <p className="text-lg">কোনো সফটওয়্যার বা অ্যাপ পাওয়া যায়নি</p>

              <p className="text-sm opacity-60 mt-1">
                অন্য নাম বা প্ল্যাটফর্ম দিয়ে চেষ্টা করুন।
              </p>
            </div>
          ) : (
            apps.map((app) => {
              const description = cleanDescription(app.description);

              return (
                <Link
                  key={app.id}
                  href={`/software/${app.slug}`}
                  className="block rounded-2xl bg-zinc-400/10 p-4 transition hover:bg-zinc-400/20"
                >
                  <article>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        {app.icon_url ? (
                          <Image
                            src={app.icon_url}
                            alt={`${app.name} icon`}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-xl object-cover border border-zinc-400/25"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-zinc-400/10 flex items-center justify-center">
                            <Puzzle className="w-7 h-7 opacity-50" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-semibold line-clamp-1">{app.name}</h2>

                          {app.platform && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-zinc-400/15 opacity-70">
                              {app.platform}
                            </span>
                          )}
                        </div>

                        {app.version && (
                          <p className="text-xs opacity-50">
                            Version: {app.version}
                          </p>
                        )}

                        {description && (
                          <p className="text-sm opacity-70 line-clamp-2">
                            {description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-zinc-400/25">
                      <span className="inline-flex items-center gap-2 text-xs opacity-60">
                        বিস্তারিত দেখুন
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })
          )}
        </section>
      )}

      {/* Load More */}
      {!error && hasMore && !isLoading && (
        <div className="flex justify-center py-6">
          <button
            type="button"
            onClick={() => setSize(size + 1)}
            disabled={isValidating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-400/10 text-sm hover:bg-zinc-400/25 disabled:opacity-50"
          >
            {isValidating ? "লোড হচ্ছে..." : "আরও সফটওয়্যার দেখুন"}
          </button>
        </div>
      )}

      {/* Informational SEO Content */}
      <section className="space-y-4 pt-8 border-t border-zinc-400/25">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Puzzle className="w-5 h-5" />

          {platform
            ? `${platform} সফটওয়্যার ও অ্যাপ`
            : "সফটওয়্যার ও অ্যাপ ডিরেক্টরি"}
        </h2>

        <div className="space-y-4 text-sm opacity-70 leading-relaxed">
          {platform ? (
            <>
              <p>
                এই বিভাগে {platform} প্ল্যাটফর্মের বিভিন্ন সফটওয়্যার ও অ্যাপ
                সম্পর্কে প্রয়োজনীয় তথ্য উপস্থাপন করা হয়। প্রতিটি রিসোর্সের
                ব্যবহার, প্রধান ফিচার এবং প্রযোজ্য ক্ষেত্রে সিস্টেম রিকোয়ারমেন্ট
                সম্পর্কে তথ্য পাওয়া যাবে।
              </p>

              <p>
                সফটওয়্যার নির্বাচন করার সময় ডেভেলপার, লাইসেন্স, সমর্থিত অপারেটিং
                সিস্টেম এবং সফটওয়্যারের প্রয়োজনীয়তা যাচাই করা গুরুত্বপূর্ণ।
                তথ্যবক্সের সফটওয়্যার পেজে এসব তথ্য সহজে বোঝার মতোভাবে সাজানোর
                লক্ষ্য রাখা হয়েছে।
              </p>

              <p>
                সফটওয়্যার সংগ্রহ বা ইনস্টল করার ক্ষেত্রে সংশ্লিষ্ট ডেভেলপার বা
                প্রকাশকের অফিসিয়াল ওয়েবসাইট ব্যবহার করাই সবচেয়ে ভালো পদ্ধতি।
                বিস্তারিত পেজে যেখানে প্রযোজ্য সেখানে অফিসিয়াল সোর্সের তথ্য
                দেওয়া থাকবে।
              </p>

              {platformGuidance[platform]?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </>
          ) : (
            <>
              <p>
                তথ্যবক্সের Software & Apps বিভাগে Windows, Android, Mac এবং
                অন্যান্য সমর্থিত প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপ সম্পর্কে তথ্য
                খুঁজে পাওয়া যায়।
              </p>

              <p>
                এখানে সফটওয়্যারের পরিচিতি, প্রধান ফিচার, প্ল্যাটফর্ম, সংস্করণ
                এবং প্রয়োজনীয় সিস্টেম তথ্যের মতো বিষয়কে গুরুত্ব দেওয়া হয়। এর
                উদ্দেশ্য হলো ব্যবহারকারীদের সফটওয়্যার সম্পর্কে তথ্য বুঝতে এবং
                উপযুক্ত রিসোর্স খুঁজে পেতে সহায়তা করা।
              </p>

              <p>
                সফটওয়্যার ব্যবহারের আগে এর লাইসেন্স ও ডেভেলপার সম্পর্কে তথ্য
                যাচাই করুন এবং সফটওয়্যার সংগ্রহের জন্য সংশ্লিষ্ট ডেভেলপার বা
                প্রকাশকের অফিসিয়াল ওয়েবসাইটকে অগ্রাধিকার দিন।
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
