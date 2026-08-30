"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Users,
  BookOpen,
  ArrowRight,
  Check,
  Info,
  ChevronDown,
} from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreators, setShowCreators] = useState(false);

  const creatorsRef = useRef<HTMLDivElement>(null);

  // Close creator dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        creatorsRef.current &&
        !creatorsRef.current.contains(event.target as Node)
      ) {
        setShowCreators(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

        const url = `${baseUrl}/api/islam/basic${
          search ? `?search=${encodeURIComponent(search)}` : ""
        }`;

        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          const text = await res.text();
          console.error("Non-JSON response:", text.slice(0, 500));
          throw new Error("API থেকে সঠিক JSON রেসপন্স পাওয়া যায়নি");
        }

        const json = await res.json();

        if (json.success) {
          setItems(json.data?.items || []);
          setCreators(json.data?.creators || []);
        } else {
          throw new Error(json.message || "ডেটা লোড করতে ব্যর্থ হয়েছে");
        }
      } catch (e: any) {
        console.error("Fetch error:", e);
        setError(e.message || "ডেটা লোড করতে সমস্যা হয়েছে");
        setItems([]);
        setCreators([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 py-6 text-zinc-800 dark:text-zinc-200">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3 text-zinc-900 dark:text-zinc-100">
            <BookOpen
              className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />
            ইসলামের মৌলিক জ্ঞান
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            দ্বীনের সঠিক পথ ও মৌলিক ধারণা
          </p>
        </div>

        {/* Creators Button + Panel */}
        <div className="relative" ref={creatorsRef}>
          <button
            onClick={() => setShowCreators(!showCreators)}
            className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="তথ্য প্রদানকারীগণ দেখুন"
          >
            <Users className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
          </button>

          {showCreators && (
            <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 z-50 p-4 space-y-4 shadow-xl">
              <div className="space-y-1">
                <h2 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  তথ্য প্রদানকারীগণ ({creators.length})
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  এই কন্টেন্ট তৈরিতে যারা অবদান রেখেছেন
                </p>
              </div>

              <div className="space-y-3">
                {creators.length === 0 ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center py-4">
                    কোনো কন্ট্রিবিউটর পাওয়া যায়নি।
                  </p>
                ) : (
                  creators.map((creator) => (
                    <div
                      key={creator.id}
                      className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 space-y-2"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          {creator.avatar_url ? (
                            <img
                              src={creator.avatar_url}
                              alt={creator.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center">
                              {creator.name.charAt(0)}
                            </div>
                          )}
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${
                              creator.is_online
                                ? "bg-emerald-500"
                                : "bg-zinc-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                              {creator.name}
                            </span>
                            {creator.email_verified && (
                              <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                            {creator.profession}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 text-zinc-500 dark:text-zinc-400">
                        <span>একটিভ: {creator.last_active_bn}</span>
                        <Link
                          href={`/users/${creator.slug}`}
                          className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          প্রোফাইল <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center border-t border-zinc-100 dark:border-zinc-800 pt-3">
                আমাদের সকল তথ্য ভেরিফাইড এবং যাচাইকৃত।
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Search Bar */}
      <nav className="flex items-center gap-2" aria-label="বিষয় সার্চ">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="বিষয় খুঁজুন (যেমন: নামাজ, যাকাত)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
            aria-label="বিষয় খুঁজুন"
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="সার্চ মুছুন"
          >
            <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          </button>
        )}
      </nav>

      {search && !loading && (
        <p
          className="text-xs text-zinc-500 dark:text-zinc-400 px-1"
          role="status"
          aria-live="polite"
        >
          “{search}” এর জন্য {items.length}টি ফলাফল পাওয়া গেছে
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 p-4 text-sm text-red-700 dark:text-red-400">
          <p className="font-semibold">ডেটা লোড করতে সমস্যা হয়েছে</p>
          <p className="mt-1 text-xs opacity-90">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-xs font-medium underline hover:opacity-80"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* Content List */}
      <section className="space-y-4" aria-labelledby="content-list-heading">
        <h2 id="content-list-heading" className="sr-only">
          ইসলামের মৌলিক জ্ঞানের তালিকা
        </h2>

        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 animate-pulse space-y-4 bg-white dark:bg-zinc-900/50"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          ))
        ) : items.length === 0 && !error ? (
          <div className="text-center py-16 text-zinc-500 dark:text-zinc-400 space-y-3">
            <BookOpen className="w-12 h-12 mx-auto stroke-1" />
            <p className="text-sm">কোনো ইসলামিক তথ্য পাওয়া যায়নি।</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                সার্চ ফিল্টার রিসেট করুন
              </button>
            )}
          </div>
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 p-4 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm"
            >
              <div className="flex gap-4">
                <div className="shrink-0">
                  {item.media?.[0] ? (
                    <img
                      src={item.media[0].thumb}
                      alt={item.title}
                      className="w-12 h-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                  {item.media_count > 1 && (
                    <span className="block text-center text-[10px] text-zinc-400 mt-1 font-medium">
                      +{item.media_count - 1}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  {item.type_name && (
                    <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/40">
                      {item.type_name}
                    </span>
                  )}
                  <h3 className="text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
                    <Link
                      href={`/islam/basic/${item.slug}`}
                      className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  {item.description_plain && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {item.description_plain}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex justify-end">
                <Link
                  href={`/islam/basic/${item.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  বিস্তারিত পড়ুন <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))
        )}
      </section>

      {/* About Section */}
      <section
        aria-labelledby="about-islam"
        className="space-y-3 pt-6 border-t border-zinc-200 dark:border-zinc-800"
      >
        <h2
          id="about-islam"
          className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100"
        >
          <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          ইসলামের মৌলিক বিষয়াবলী
        </h2>
        <div className="space-y-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          <p>
            আমাদের প্ল্যাটফর্মে ইসলামের মূল ভিত্তি ও আরকান সম্পর্কে সঠিক ও
            যাচাইকৃত তথ্য প্রকাশ করা হয়।{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">
              ঈমান, নামাজ, যাকাত, রোজা ও হজ
            </strong>{" "}
            সহ দ্বীনের মৌলিক বিষয়গুলো সহজ ভাষায় উপস্থাপন করা হয়েছে।
          </p>
          <p>
            শিক্ষার্থী ও নতুন দ্বীন সন্ধানীদের জন্য এই সংকলন অত্যন্ত উপযোগী।
            প্রতিটি বিষয়ের নিচে “বিস্তারিত পড়ুন” লিংকে ক্লিক করে পূর্ণাঙ্গ
            ব্যাখ্যা ও কোরআন-হাদিসের দলিল জানতে পারবেন।
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section
        aria-labelledby="faq-heading"
        className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800"
      >
        <h2
          id="faq-heading"
          className="text-base font-bold text-zinc-900 dark:text-zinc-100"
        >
          প্রায়শই জিজ্ঞাসিত প্রশ্ন (FAQ)
        </h2>
        <div className="space-y-2">
          {[
            {
              q: "ইসলামের মৌলিক আরকান কী কী?",
              a: "ইসলামের পাঁচটি মূল স্তম্ভ হলো: শাহাদাহ (ঈমান), নামাজ, যাকাত, রোজা এবং হজ। এগুলো ইসলামের ভিত্তি এবং প্রত্যেক সামর্থ্যবান মুসলিমের উপর ফরজ।",
            },
            {
              q: "তথ্যগুলো কি যাচাইকৃত?",
              a: "হ্যাঁ, কুরআন, সহীহ হাদিস এবং স্বীকৃত ইসলামী স্কলারদের তথ্যের ওপর ভিত্তি করে আমাদের কন্ট্রিবিউটরগণ কনটেন্ট প্রস্তুত ও যাচাই করে থাকেন।",
            },
            {
              q: "কে এই তথ্যগুলো পড়তে পারে?",
              a: "সকল বয়সের এবং যে কোনো ধর্মের মানুষ ইসলামের মৌলিক বিষয়গুলো সহজে জানার জন্য এই প্ল্যাটফর্ম ব্যবহার করতে পারেন।",
            },
            {
              q: "বিস্তারিত তথ্য কোথায় পাব?",
              a: "প্রতিটি কার্ডের নিচে “বিস্তারিত পড়ুন” লিংকে ক্লিক করলে পূর্ণাঙ্গ ব্যাখ্যা ও আনুষঙ্গিক বিবরণ পাওয়া যাবে।",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer p-3.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors select-none">
                <span>{faq.q}</span>
                <ChevronDown className="w-4 h-4 text-zinc-400 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="p-3.5 pt-0 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 border-t border-zinc-200/50 dark:border-zinc-800/50 mt-1">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
