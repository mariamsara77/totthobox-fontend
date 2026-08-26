"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // ✅ Prefer environment variable, fallback to production API
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

        const url = `${baseUrl}/api/islam/basic${
          search ? `?search=${encodeURIComponent(search)}` : ""
        }`;

        console.log("Fetching:", url); // Debug on Vercel → check browser console

        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // Important for some hosting setups
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          const text = await res.text();
          console.error("Non-JSON response:", text.slice(0, 500));
          throw new Error("API returned non-JSON response");
        }

        const json = await res.json();

        if (json.success) {
          setItems(json.data?.items || []);
          setCreators(json.data?.creators || []);
        } else {
          throw new Error(json.message || "API returned success: false");
        }
      } catch (e: any) {
        console.error("Fetch error:", e);
        setError(e.message || "ডেটা লোড করতে সমস্যা হয়েছে");
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
    <div className="max-w-2xl mx-auto space-y-4 px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-400/25 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-4">
            <BookOpen className="w-6 h-6" aria-hidden="true" />
            ইসলামের মৌলিক জ্ঞান
          </h1>
          <p className="text-sm  mt-1">
            দ্বীনের সঠিক পথ ও মৌলিক ধারণা
          </p>
        </div>

        {/* Creators Button + Panel */}
        <div className="relative">
          <button
            onClick={() => setShowCreators(!showCreators)}
            className="p-2 rounded-xl hover:bg-zinc-400/10"
            aria-label="তথ্য প্রদানকারীগণ দেখুন"
          >
            <Users className="w-5 h-5" />
          </button>

          {showCreators && (
            <div className="absolute right-0 top-full mt-2 w-80 max-h-112 overflow-y-auto rounded-2xl border border-zinc-400/25 dark:border-zinc-400/25 bg-zinc-100 bg-zinc-400/10 z-50 p-4 space-y-4">
              <div className="space-y-1">
                <h2 className="">
                  তথ্য প্রদানকারীগণ ({creators.length})
                </h2>
                <p className="text-xs">
                  এই কন্টেন্ট তৈরিতে যারা অবদান রেখেছেন
                </p>
              </div>

              <div className="space-y-4">
                {creators.length === 0 ? (
                  <p className="text-xs  text-center py-4">
                    কোনো কন্ট্রিবিউটর পাওয়া যায়নি।
                  </p>
                ) : (
                  creators.map((creator) => (
                    <div
                      key={creator.id}
                      className="p-2.5 rounded-xl bg-zinc-400/10 space-y-2"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative shrink-0">
                          {creator.avatar_url ? (
                            <img
                              src={creator.avatar_url}
                              alt={creator.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-zinc-400/10 flex items-center justify-center">
                              {creator.name.charAt(0)}
                            </div>
                          )}
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                              creator.is_online ? "bg-zinc-400/25" : "bg-zinc-400/25"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className=" text-sm truncate">
                              {creator.name}
                            </span>
                            {creator.email_verified && (
                              <Check className="w-4 h-4 opacity-50 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs truncate">
                            {creator.profession}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-400/25/50 dark:border-zinc-400/25">
                        <span>একটিভ: {creator.last_active_bn}</span>
                        <Link
                          href={`/users/${creator.slug}`}
                          className="inline-flex items-center gap-0.5 hover:underline hover:opacity-50"
                        >
                          প্রোফাইল <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <p className="text-xs  text-center border-t border-zinc-400/25 dark:border-zinc-400/25 pt-3">
                আমাদের সকল তথ্য ভেরিফাইড এবং যাচাইকৃত।
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Search */}
      <nav className="flex items-center gap-2" aria-label="বিষয় সার্চ">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 " />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="বিষয় খুঁজুন (যেমন: নামাজ, যাকাত)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-400/10 border-0   outline-none"
            aria-label="বিষয় খুঁজুন"
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="p-2 rounded-xl bg-zinc-400/10 hover:bg-zinc-400/25"
            aria-label="সার্চ মুছুন"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </nav>

      {search && !loading && (
        <p
          className="text-xs  "
          role="status"
          aria-live="polite"
        >
          “{search}” এর জন্য {items.length}টি ফলাফল পাওয়া গেছে
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl bg-zinc-400/25 bg-zinc-400/10 border border-zinc-400/25 dark:border-zinc-400/25 p-4 text-sm opacity-50 dark:opacity-50">
          <p className="">ডেটা লোড করতে সমস্যা হয়েছে</p>
          <p className="mt-1 text-xs opacity-80">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-xs underline"
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
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-zinc-400/10 border-zinc-400/25 p-4 animate-pulse space-y-4"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-400/10 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-16 bg-zinc-400/10 rounded" />
                  <div className="h-5 w-full bg-zinc-400/10 rounded" />
                  <div className="h-4 w-full bg-zinc-400/10 rounded" />
                  <div className="h-4 w-full bg-zinc-400/10 rounded" />
                </div>
              </div>
                  <hr className="border border-zinc-400/25"/>
                  <div className="h-4 w-2/8 bg-zinc-400/10 rounded" />
            </div>
          ))
        ) : items.length === 0 && !error ? (
          <div className="text-center py-16 ">
            <BookOpen className="w-12 h-12 mx-auto mb-4" />
            <p>কোনো ইসলামিক তথ্য পাওয়া যায়নি।</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-sm hover:underline"
              >
                সার্চ মুছুন
              </button>
            )}
          </div>
        ) : (
          items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-zinc-400/25 p-4"
            >
              <div className="flex gap-4">
                <div className="shrink-0">
                  {item.media?.[0] ? (
                    <img
                      src={item.media[0].thumb}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-400/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-zinc-300" />
                    </div>
                  )}
                  {item.media_count > 1 && (
                    <span className="block text-center text-[10px]  mt-0.5">
                      +{item.media_count - 1}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  {item.type_name && (
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-zinc-400/10 ">
                      {item.type_name}
                    </span>
                  )}
                  <h3 className=" text-lg leading-snug">
                    <Link
                      href={`/islam/basic/${item.slug}`}
                      className="hover:text-zinc-300 "
                    >
                      {item.title}
                    </Link>
                  </h3>
                  {item.description_plain && (
                    <p className="text-sm  line-clamp-2">
                      {item.description_plain}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-100 border-zinc-400/25">
                <Link
                  href={`/islam/basic/${item.slug}`}
                  className="inline-flex items-center gap-1 text-sm hover:underline"
                >
                  বিস্তারিত পড়ুন <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))
        )}
      </section>

      {/* About Section */}
      <section
        aria-labelledby="about-islam"
        className="space-y-4 pt-6 border-t border-zinc-400/25"
      >
        <h2
          id="about-islam"
          className="text-lg flex items-center gap-2"
        >
          <Info className="size-5" />
          ইচ্ছাকৃত তথ্য ও মূলভিত্তি
        </h2>
        <div className="">
          <p>
            আমাদের প্ল্যাটফর্মে ইসলামের মূল ভিত্তি ও আরকান সম্পর্কে সঠিক ও
            যাচাইকৃত তথ্য প্রকাশ করা হয়।
            <strong> ঈমান, নামাজ, যাকাত, রোজা ও হজ</strong> সহ দ্বীনের মৌলিক
            বিষয়গুলো সহজ ভাষায় উপস্থাপন করা হয়েছে। এখানে ইসলামের মূল স্তম্ভ,
            বিশ্বাস এবং আমল সম্পর্কে নির্ভরযোগ্য তথ্য একত্রিত করা হয়েছে।
          </p>
          <p>
            শিক্ষার্থী, নতুন শিক্ষার্থী এবং সাধারণ মানুষ যারা ইসলামের মৌলিক
            বিষয়গুলো সহজে বুঝতে চান, তাদের জন্য এই সংকলন খুবই উপযোগী। “বিস্তারিত
            পড়ুন” বাটনে ক্লিক করে প্রতিটি বিষয়ের পূর্ণাঙ্গ ব্যাখ্যা ও
            প্রাসঙ্গিক তথ্য জানতে পারবেন।
          </p>
          <p>
            এই তথ্যগুলো নিয়মিত যাচাই ও আপডেট করা হয় যাতে সঠিক ও নির্ভরযোগ্য
            কন্টেন্ট থাকে। সহজ ভাষায় উপস্থাপিত হওয়ায় সবাই সহজে বুঝতে ও শিখতে
            পারেন।
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="space-y-4">
        <h2 id="faq-heading" className="text-lg">
          প্রায়শই জিজ্ঞাসিত প্রশ্ন
        </h2>
        <div className="space-y-2">
          {[
            {
              q: "ইসলামের মৌলিক আরকান কী কী?",
              a: "ইসলামের পাঁচটি মূল স্তম্ভ হলো: শাহাদাহ (ঈমান), নামাজ, যাকাত, রোজা এবং হজ। এগুলো ইসলামের ভিত্তি এবং প্রত্যেক মুসলিমের উপর ফরজ।",
            },
            {
              q: "তথ্যগুলো কি যাচাইকৃত?",
              a: "হ্যাঁ। আমাদের কন্টেন্ট ভেরিফাইড কন্ট্রিবিউটরদের মাধ্যমে নির্ভরযোগ্য উৎস থেকে তৈরি ও যাচাই করা হয়। কুরআন, সহীহ হাদিস এবং স্বীকৃত ইসলামী স্কলারদের মতামতের ভিত্তিতে তথ্য উপস্থাপন করা হয়।",
            },
            {
              q: "কে এই তথ্যগুলো পড়তে পারে?",
              a: "যে কেউ এই তথ্যগুলো পড়তে ও শিখতে পারেন। নতুন শিক্ষার্থী, সাধারণ মানুষ এবং যারা ইসলামের মৌলিক বিষয়গুলো সহজে বুঝতে চান, তাদের জন্য এটি বিশেষভাবে উপযোগী।",
            },
            {
              q: "বিস্তারিত তথ্য কোথায় পাব?",
              a: "প্রতিটি বিষয়ের নিচে “বিস্তারিত পড়ুন” বাটনে ক্লিক করলে আলাদা পেজে পূর্ণাঙ্গ ব্যাখ্যা দেখা যাবে। সেখানে সংশ্লিষ্ট আয়াত, হাদিস এবং প্রাসঙ্গিক তথ্যসহ বিস্তারিত বিবরণ পাওয়া যায়।",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl bg-zinc-400/10 overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer group p-4 bg-zinc-400/10 hover:bg-zinc-400/25">
                <span>{faq.q}</span>
                  <ChevronDown
                  className="size-4 group-open:rotate-180 transition-transform"
                /> 
              </summary>
              <div className="p-4 leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
