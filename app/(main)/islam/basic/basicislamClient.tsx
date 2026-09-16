"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  X,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Info,
} from "lucide-react";
import { FaUserPen } from "react-icons/fa6";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";

interface MediaItem {
  id: number;
  url: string;
  thumb: string;
}

interface BasicIslamItem {
  id: number;
  title: string;
  slug: string;
  type: string | null;
  type_name: string;
  description_plain: string;
  media: MediaItem[];
  media_count: number;
}

interface Creator {
  id: number;
  name: string;
  slug: string;
  avatar_url: string | null;
  profession: string;
  email_verified: boolean;
  is_online: boolean;
  last_active_bn: string;
}

export default function BasicIslamClient() {
  const [items, setItems] = useState<BasicIslamItem[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreators, setShowCreators] = useState(false);
  const [creatorsLoading, setCreatorsLoading] = useState(false);

  const creatorsRef = useRef<HTMLDivElement>(null);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        creatorsRef.current &&
        !creatorsRef.current.contains(e.target as Node)
      ) {
        setShowCreators(false);
      }
    };
    if (showCreators) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCreators]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch items
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

        const url = `${baseUrl}/api/islam/basic${
          debouncedSearch
            ? `?search=${encodeURIComponent(debouncedSearch)}`
            : ""
        }`;

        const res = await fetch(url, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();

        if (json.success) {
          setItems(json.data?.items || []);
          // creators শুধু প্রথম লোডে সেট করো (search এ নয়)
          if (!debouncedSearch && json.data?.creators) {
            setCreators(json.data.creators);
          }
        } else {
          throw new Error(json.message || "ডেটা লোড করতে ব্যর্থ");
        }
      } catch (e: any) {
        console.error(e);
        setError(e.message || "ডেটা লোড করতে সমস্যা হয়েছে");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            ইসলামের মৌলিক জ্ঞান
          </h1>
          <p className="text-sm opacity-80">
            দ্বীনের সঠিক পথ ও মৌলিক ধারণা — ঈমান, নামাজ, যাকাত, রোজা ও হজ
          </p>
        </div>

        {/* Creators */}
        <div className="relative shrink-0" ref={creatorsRef}>
          <button
            onClick={() => setShowCreators(!showCreators)}
            className="p-2 rounded-lg hover:bg-zinc-400/25 transition"
            aria-label="তথ্য প্রদানকারীগণ"
          >
            <FaUserPen className="w-5 h-5" />
          </button>

          {showCreators && (
            <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-zinc-400/25 backdrop-blur-xl p-4 z-50 space-y-3">
              <div>
                <h3 className="font-medium">
                  তথ্য প্রদানকারীগণ ({creators.length})
                </h3>
                <p className="text-xs mt-0.5 opacity-70">
                  এই কন্টেন্ট তৈরিতে যারা অবদান রেখেছেন
                </p>
              </div>

              {creatorsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 rounded-xl bg-zinc-400/10 animate-pulse"
                    >
                      <div className="w-12 h-12 rounded-xl bg-zinc-400/15" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-2/3 rounded bg-zinc-400/15" />
                        <div className="h-3 w-1/2 rounded bg-zinc-400/15" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : creators.length === 0 ? (
                <p className="text-sm text-center py-4 opacity-60">
                  এখনো কোনো কন্ট্রিবিউটর পাওয়া যায়নি।
                </p>
              ) : (
                creators.map((c) => (
                  <Link key={c.id} href={`/users/${c.slug}`}>
                    <div className="flex items-start gap-3 p-2 rounded-xl bg-zinc-400/10 hover:bg-zinc-400/25 border border-zinc-400/25 transition">
                      <div className="relative">
                        {c.avatar_url ? (
                          <img
                            src={c.avatar_url}
                            alt={c.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-zinc-400/15 flex items-center justify-center text-sm font-medium">
                            {c.name?.charAt(0)}
                          </div>
                        )}
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${
                            c.is_online ? "bg-green-500" : "bg-zinc-400"
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <strong className="truncate text-sm">{c.name}</strong>
                          {c.email_verified && (
                            <TbRosetteDiscountCheckFilled className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs opacity-70 truncate">
                          {c.profession || "কন্টেন্ট কন্ট্রিবিউটর"}
                        </p>
                        {c.last_active_bn && (
                          <p className="text-xs opacity-60 mt-0.5">
                            সর্বশেষ: {c.last_active_bn}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </header>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="বিষয় খুঁজুন (যেমন: নামাজ, যাকাত)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-400/10 outline-none hover:bg-zinc-400/15 transition text-sm"
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="p-2.5 rounded-xl hover:bg-zinc-400/25 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {debouncedSearch && !loading && (
        <p className="text-xs opacity-70">
          “{debouncedSearch}” এর জন্য {items.length}টি ফলাফল পাওয়া গেছে
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-zinc-400/10 p-4 text-sm">
          <p className="font-medium">ডেটা লোড করতে সমস্যা হয়েছে</p>
          <p className="mt-1 text-xs opacity-70">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-xs underline"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* List */}
      <section className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-zinc-400/10 p-4 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-400/15 shrink-0" />
                  <div className="flex-1 space-y-2.5 pt-1">
                    <div className="h-3 w-16 rounded bg-zinc-400/15" />
                    <div className="h-4 w-3/4 rounded bg-zinc-400/15" />
                    <div className="h-3 w-full rounded bg-zinc-400/15" />
                  </div>
                </div>
                <div className="border-t border-zinc-400/20 my-3" />
                <div className="h-3 w-24 rounded bg-zinc-400/15" />
              </div>
            ))}
          </div>
        ) : items.length === 0 && !error ? (
          <div className="text-center py-16 rounded-2xl bg-zinc-400/5">
            <BookOpen className="w-10 h-10 mx-auto opacity-40 mb-3" />
            <p className="text-base font-medium">কোনো তথ্য পাওয়া যায়নি</p>
            <p className="text-sm opacity-60 mt-1">
              অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-xs underline"
              >
                সার্চ রিসেট করুন
              </button>
            )}
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`/islam/basic/${item.slug}`}
              className="block rounded-2xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20 transition"
            >
              <div className="flex gap-4 items-start">
                <div className="shrink-0">
                  {item.media?.[0]?.thumb ? (
                    <img
                      src={item.media[0].thumb}
                      alt={item.title}
                      className="w-12 h-12 rounded-xl object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-zinc-400/15 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 opacity-50" />
                    </div>
                  )}
                  {item.media_count > 1 && (
                    <span className="block text-center text-[10px] opacity-50 mt-1">
                      +{item.media_count - 1}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  {item.type_name && (
                    <span className="inline-block text-[11px] px-2 py-0.5 rounded-md bg-zinc-400/15">
                      {item.type_name}
                    </span>
                  )}
                  <h2 className="text-base font-semibold line-clamp-1">
                    {item.title}
                  </h2>
                  {item.description_plain && (
                    <p className="text-sm opacity-80 line-clamp-2">
                      {item.description_plain}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-400/20">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                  বিস্তারিত পড়ুন
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))
        )}
      </section>

      {/* About (AdSense + SEO friendly) */}
      <section className="space-y-3 pt-6 border-t border-zinc-400/25">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Info className="w-5 h-5 opacity-70" />
          ইসলামের মৌলিক বিষয়াবলী
        </h2>
        <div className="space-y-3 text-sm leading-relaxed opacity-90">
          <p>
            এই পেজে ইসলামের মূল ভিত্তি ও আরকান সম্পর্কে সঠিক ও যাচাইকৃত তথ্য
            দেওয়া হয়েছে। <strong>ঈমান, নামাজ, যাকাত, রোজা ও হজ</strong> সহ
            দ্বীনের মৌলিক বিষয়গুলো সহজ ভাষায় উপস্থাপন করা হয়েছে।
          </p>
          <p>
            শিক্ষার্থী ও নতুন দ্বীন সন্ধানীদের জন্য এই সংকলন উপযোগী। প্রতিটি
            বিষয়ের “বিস্তারিত পড়ুন” লিংকে ক্লিক করে পূর্ণাঙ্গ ব্যাখ্যা জানতে
            পারবেন।
          </p>
          <p>
            তথ্যবক্স থেকে ইসলামের মৌলিক জ্ঞান নির্ভরযোগ্যভাবে এক জায়গায় পেয়ে
            যান।
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>

        {[
          {
            q: "ইসলামের মৌলিক আরকান কী কী?",
            a: "ইসলামের পাঁচটি মূল স্তম্ভ হলো: শাহাদাহ (ঈমান), নামাজ, যাকাত, রোজা এবং হজ। এগুলো ইসলামের ভিত্তি।",
          },
          {
            q: "তথ্যগুলো কি যাচাইকৃত?",
            a: "হ্যাঁ, কুরআন, সহীহ হাদিস এবং স্বীকৃত ইসলামী স্কলারদের তথ্যের ভিত্তিতে কন্টেন্ট প্রস্তুত ও যাচাই করা হয়।",
          },
          {
            q: "কে এই তথ্যগুলো পড়তে পারে?",
            a: "সকল বয়সের মানুষ ইসলামের মৌলিক বিষয়গুলো সহজে জানার জন্য এই পেজ ব্যবহার করতে পারেন।",
          },
          {
            q: "বিস্তারিত তথ্য কোথায় পাব?",
            a: "প্রতিটি কার্ডের নিচে “বিস্তারিত পড়ুন” লিংকে ক্লিক করলে পূর্ণাঙ্গ ব্যাখ্যা পাওয়া যাবে।",
          },
        ].map((faq, i) => (
          <details
            key={i}
            className="group rounded-xl bg-zinc-400/10 overflow-hidden"
          >
            <summary className="flex items-center justify-between cursor-pointer px-4 py-3 list-none hover:bg-zinc-400/15 transition">
              <span className="text-sm font-medium">{faq.q}</span>
              <ChevronDown className="w-4 h-4 group-open:rotate-180 transition shrink-0" />
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed border-t border-zinc-400/20 pt-3 opacity-90">
              {faq.a}
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}
