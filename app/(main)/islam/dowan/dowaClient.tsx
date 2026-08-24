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

interface DowaItem {
  id: number;
  bangla_name: string;
  slug: string;
  type: string | null;
  type_name: string | null;
  bangla_text: string;
  media: MediaItem[];
  media_count: number;
  is_featured: boolean;
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

export default function DowaClient() {
  const [items, setItems] = useState<DowaItem[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreators, setShowCreators] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
        if (!baseUrl) {
          console.error("NEXT_PUBLIC_API_BASE_URL is not defined");
          setLoading(false);
          return;
        }

        const url = `${baseUrl}/api/islam/dowan?search=${encodeURIComponent(search)}`;
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
        });

        const contentType = res.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          const text = await res.text();
          console.error("Non-JSON:", text.slice(0, 300));
          throw new Error("API returned non-JSON");
        }

        const json = await res.json();
        if (json.success) {
          setItems(json.data.items || []);
          setCreators(json.data.creators || []);
        }
      } catch (e) {
        console.error("Fetch error:", e);
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
          <h1 className="text-2xl font-bold text-zinc-50 dark:text-white">
            দোয়া সংগ্রহ
          </h1>
          <p className="text-sm  mt-1">
            দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া ও আমল
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowCreators(!showCreators)}
            className="p-2 rounded-lg hover:bg-zinc-400/10"
            aria-label="তথ্য প্রদানকারীগণ দেখুন"
          >
            <Users className="w-5 h-5" />
          </button>

          {showCreators && (
            <div className="absolute right-0 top-full mt-2 w-80 max-h-112 overflow-y-auto rounded-2xl border border-zinc-400/25 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 z-50 p-4 space-y-4">
              <div className="space-y-1">
                <h2 className="">
                  তথ্য প্রদানকারীগণ ({creators.length})
                </h2>
                <p className="text-xs ">
                  এই কন্টেন্ট তৈরিতে যারা অবদান রেখেছেন
                </p>
              </div>

              <div className="space-y-4">
                {creators.length === 0 ? (
                  <p className="text-xs  text-center py-4">
                    কোনো কন্ট্রিবিউটর পাওয়া যায়নি।
                  </p>
                ) : (
                  creators.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-xl bg-zinc-400/10/60 space-y-2"
                    >
                      <div className="flex items-start gap-4">
                        {c.avatar_url ? (
                          <img
                            src={c.avatar_url}
                            alt={c.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center">
                            {c.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className=" text-sm truncate">
                              {c.name}
                            </span>
                            {c.email_verified && (
                              <Check className="w-4 h-4 text-blue-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs  truncate">
                            {c.profession}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs  pt-1 border-t border-zinc-400/25/50">
                        <span>একটিভ: {c.last_active_bn}</span>
                        <Link
                          href={`/users/${c.slug}`}
                          className="inline-flex items-center gap-0.5 hover:underline hover:opacity-50"
                        >
                          প্রোফাইল <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs  text-center border-t pt-3">
                আমাদের সকল তথ্য ভেরিফাইড এবং যাচাইকৃত।
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 " />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="দোয়া খুঁজুন (যেমন: ঘুমানোর দোয়া, খাবারের দোয়া)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-400/10 border-0 focus:ring-2 focus:ring-zinc-500 outline-none"
          aria-label="দোয়া খুঁজুন"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
            aria-label="সার্চ মুছুন"
          >
            <X className="w-4 h-4 " />
          </button>
        )}
      </div>

      {/* List */}
      <section className="space-y-4" aria-labelledby="content-list-heading">
        <h2 id="content-list-heading" className="sr-only">
          দোয়া তালিকা
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
                </div>
              </div>
                  <hr className="border border-zinc-400/25"/>
                  <div className="h-4 w-2/8 bg-zinc-400/10 rounded" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="text-center py-16 ">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>কোনো দোয়া পাওয়া যায়নি।</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-sm text-zinc-300 hover:underline"
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
              <div className="flex gap-4 items-start">
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
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  {item.type && (
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-zinc-400/10 ">
                      {item.type_name || item.type}
                    </span>
                  )}
                  <h3 className=" text-lg leading-snug">
                    <Link
                      href={`/islam/dowan/${item.slug}`}
                      className="hover:text-zinc-300 "
                    >
                      {item.bangla_name}
                    </Link>
                  </h3>
                  {item.bangla_text && (
                    <p className="text-sm  line-clamp-2">{item.bangla_text}</p>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-100 border-zinc-400/25">
                <Link
                  href={`/islam/dowan/${item.slug}`}
                  className="inline-flex items-center gap-2 text-sm hover:underline"
                >
                  বিস্তারিত পড়ুন <ArrowRight className="size-3" />
                </Link>
              </div>
            </article>
          ))
        )}
      </section>

      {/* About */}
      <section
        aria-labelledby="about-dowa"
        className="space-y-4 pt-6 border-t border-zinc-400/25"
      >
        <h2
          id="about-dowa"
          className="text-lg flex items-center gap-2"
        >
          <Info className="size-5" />
          দোয়া সংগ্রহ সম্পর্কে
        </h2>
        <div className="leading-relaxed">
          <p>
            আমাদের প্ল্যাটফর্মে দৈনন্দিন জীবনের প্রয়োজনীয় দোয়া, জিকির ও আমলসমূহ
            সঠিক ও যাচাইকৃত উৎস থেকে সংগ্রহ করে সহজ বাংলায় উপস্থাপন করা হয়েছে।
            ঘুমানো, খাওয়া, সফর, বিপদ-আপদসহ বিভিন্ন পরিস্থিতির জন্য গুরুত্বপূর্ণ
            দোয়া এক জায়গায় পাবেন। প্রতিটি দোয়ার সাথে আরবি, উচ্চারণ এবং বাংলা
            অর্থ দেওয়া হয়েছে যাতে সহজে মুখস্থ ও বুঝে পড়া যায়।
          </p>
          <p>
            নতুন শিক্ষার্থী থেকে শুরু করে সাধারণ মানুষ সবাই এই সংগ্রহ থেকে উপকৃত
            হতে পারেন। “বিস্তারিত পড়ুন” বাটনে ক্লিক করে প্রতিটি দোয়ার পূর্ণাঙ্গ
            তথ্য, ফজিলত এবং প্রাসঙ্গিক হাদিস জানতে পারবেন।
          </p>
          <p>
            এই তথ্যগুলো নিয়মিত যাচাই ও আপডেট করা হয় যাতে সঠিক ও নির্ভরযোগ্য
            কন্টেন্ট থাকে। সহজ ভাষায় উপস্থাপিত হওয়ায় সবাই সহজে শিখতে ও আমল করতে
            পারেন।
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="space-y-4">
        <h2 id="faq-heading" className="text-lg font-bold">
          প্রায়শই জিজ্ঞাসিত প্রশ্ন
        </h2>
        <div className="space-y-2">
          {[
            {
              q: "এখানে কোন ধরনের দোয়া পাওয়া যায়?",
              a: "ঘুমানোর দোয়া, খাবারের দোয়া, সফরের দোয়া, বিপদের দোয়া, শুকরিয়ার দোয়াসহ দৈনন্দিন জীবনের প্রয়োজনীয় সব দোয়া ও আমল এখানে পাওয়া যাবে। সকাল-সন্ধ্যার জিকির, নামাজের দোয়া এবং বিভিন্ন পরিস্থিতির জন্য গুরুত্বপূর্ণ দোয়াও অন্তর্ভুক্ত রয়েছে।",
            },
            {
              q: "তথ্যগুলো কি যাচাইকৃত?",
              a: "হ্যাঁ। আমাদের কন্টেন্ট ভেরিফাইড কন্ট্রিবিউটরদের মাধ্যমে নির্ভরযোগ্য উৎস থেকে তৈরি ও যাচাই করা হয়। কুরআন, সহীহ হাদিস এবং স্বীকৃত ইসলামী স্কলারদের মতামতের ভিত্তিতে তথ্য উপস্থাপন করা হয়।",
            },
            {
              q: "দোয়াগুলো কীভাবে শিখব?",
              a: "প্রতিটি দোয়ার সাথে আরবি টেক্সট, সহজ উচ্চারণ এবং বাংলা অর্থ দেওয়া আছে। নিয়মিত পড়ে ও মুখস্থ করে আমল করতে পারেন। “বিস্তারিত পড়ুন” বাটনে ক্লিক করে ফজিলত ও প্রাসঙ্গিক তথ্যও জানতে পারবেন।",
            },
            {
              q: "বিস্তারিত তথ্য কোথায় পাব?",
              a: "প্রতিটি দোয়ার নিচে “বিস্তারিত পড়ুন” বাটনে ক্লিক করলে আলাদা পেজে পূর্ণাঙ্গ তথ্য দেখা যাবে। সেখানে আরবি, উচ্চারণ, অর্থ, ফজিলত এবং সংশ্লিষ্ট হাদিসসহ বিস্তারিত বিবরণ পাওয়া যায়।",
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
