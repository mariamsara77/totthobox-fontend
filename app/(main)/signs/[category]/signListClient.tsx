"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Users,
  ArrowRight,
  Check,
  Info,
  Signpost,
} from "lucide-react";

interface SignItem {
  id: number;
  name: string;
  slug: string;
  description_plain: string;
  thumb: string | null;
  category: { id: number; name: string; slug: string } | null;
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

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

export default function SignListClient({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const isAll = categorySlug === "all";
  const [items, setItems] = useState<SignItem[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreators, setShowCreators] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://totthobox.com';
        if (!baseUrl) return;

        const url = `${baseUrl}/api/signs/${categorySlug}?search=${encodeURIComponent(search)}`;
        const res = await fetch(url, { headers: { Accept: "application/json" } });

        if (!res.ok) throw new Error("Failed");
        const json = await res.json();
        if (json.success) {
          setItems(json.data.items || []);
          setCreators(json.data.creators || []);
          setCategory(json.data.category || null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(fetchData, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [categorySlug, search]);

  const title = isAll ? "সকল ট্রাফিক সাইন" : category?.name || categorySlug;
  const subtitle = isAll
    ? "বাংলাদেশের সকল ট্রাফিক সাইন ও রোড চিহ্নের সম্পূর্ণ তালিকা"
    : "এই ক্যাটাগরির অন্তর্ভুক্ত সকল চিহ্নের তালিকা";

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <Signpost className="w-6 h-6" />
            {title}
          </h1>
          <p className="text-sm text-zinc-500">{subtitle}</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowCreators(!showCreators)}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="তথ্য প্রদানকারীগণ"
          >
            <Users className="w-5 h-5" />
          </button>

          {showCreators && (
            <div className="absolute right-0 top-full mt-2 w-80 max-h-112 overflow-y-auto rounded-2xl border bg-white dark:bg-zinc-900 shadow-xl z-50 p-4 space-y-4">
              <div>
                <h2 className="font-semibold">তথ্য প্রদানকারীগণ ({creators.length})</h2>
                <p className="text-xs text-zinc-500">এই কন্টেন্ট তৈরিতে যারা অবদান রেখেছেন</p>
              </div>
              {creators.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-4">কোনো কন্ট্রিবিউটর পাওয়া যায়নি।</p>
              ) : (
                creators.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 space-y-2">
                    <div className="flex items-start gap-3">
                      {c.avatar_url ? (
                        <img src={c.avatar_url} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium">
                          {c.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-sm truncate">{c.name}</span>
                          {c.email_verified && <Check className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <p className="text-xs text-zinc-500 truncate">{c.profession}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500 pt-1 border-t">
                      <span>একটিভ: {c.last_active_bn}</span>
                      <Link href={`/users/${c.slug}`} className="text-amber-600 hover:underline inline-flex items-center gap-0.5">
                        প্রোফাইল <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
              <p className="text-xs text-zinc-400 text-center border-t pt-3">
                আমাদের সকল তথ্য ভেরিফাইড এবং যাচাইকৃত।
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="সাইন খুঁজুন (যেমন: স্টপ, জিগজ্যাগ)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
        {search && (
          <button onClick={() => setSearch("")} className="p-2 rounded-lg hover:bg-zinc-100">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {search && !loading && (
        <p className="text-xs text-zinc-500" role="status">
          “{search}” এর জন্য {items.length}টি ফলাফল পাওয়া গেছে
        </p>
      )}

      {/* List */}
      <section className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-2xl border p-4 animate-pulse flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded" />
                <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <Signpost className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>কোনো ট্রাফিক সাইন পাওয়া যায়নি।</p>
          </div>
        ) : (
          items.map((sign) => {
            const catSlug = isAll ? sign.category?.slug || "all" : categorySlug;
            return (
              <article
                key={sign.id}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-md transition"
              >
                <div className="flex gap-4 items-start">
                  <div className="shrink-0">
                    {sign.thumb ? (
                      <img
                        src={sign.thumb}
                        alt={sign.name}
                        className="w-16 h-16 rounded-xl object-contain bg-zinc-50 dark:bg-zinc-800"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <Signpost className="w-6 h-6 text-zinc-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h2 className="font-semibold text-lg">
                      <Link
                        href={`/signs/${catSlug}/${sign.slug}`}
                        className="hover:text-amber-600"
                      >
                        {sign.name}
                      </Link>
                    </h2>
                    {isAll && sign.category && (
                      <p className="text-xs text-zinc-500">{sign.category.name}</p>
                    )}
                    {sign.description_plain && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {sign.description_plain}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <Link
                    href={`/signs/${catSlug}/${sign.slug}`}
                    className="inline-flex items-center gap-1 text-sm text-amber-600 hover:underline"
                  >
                    বিস্তারিত পড়ুন <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* About */}
      <section className="space-y-4 pt-6 border-t">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-600" />
          {isAll ? "সকল ট্রাফিক সাইন সম্পর্কে" : `${category?.name || ""} সম্পর্কে`}
        </h2>
        <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          {isAll ? (
            <>
              <p>
                এই পেজে বাংলাদেশের <strong>সকল ট্রাফিক সাইন ও রোড চিহ্নের</strong> সম্পূর্ণ তালিকা দেওয়া আছে।
                এখানে সতর্কতামূলক, নিষেধাজ্ঞামূলক, নির্দেশমূলক এবং তথ্যমূলক সব ধরনের চিহ্ন একত্রিত করা হয়েছে।
              </p>
              <p>
                ড্রাইভার, শিক্ষার্থী এবং সাধারণ মানুষ যারা ট্রাফিক নিয়ম জানতে চান, তাদের জন্য এই তালিকা খুবই উপযোগী।
              </p>
            </>
          ) : (
            <>
              <p>
                এই পেজে <strong>{category?.name}</strong> ক্যাটাগরির ট্রাফিক সাইন ও রোড চিহ্নের তালিকা দেওয়া আছে।
                প্রতিটি চিহ্নের ছবি, নাম এবং সংক্ষিপ্ত অর্থ দেখতে পারবেন।
              </p>
              <p>
                “বিস্তারিত পড়ুন” বাটনে ক্লিক করে পুরো ব্যাখ্যা, অর্থ এবং ব্যবহার সম্পর্কে জানতে পারবেন।
              </p>
            </>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold">প্রায়শাই জিজ্ঞাসিত প্রশ্ন</h2>
        <div className="space-y-2">
          {[
            {
              q: isAll ? "সকল ট্রাফিক সাইন কী?" : `${category?.name || "এই ক্যাটাগরি"} কী?`,
              a: isAll
                ? "এটি বাংলাদেশের সকল ট্রাফিক সাইন ও রোড চিহ্নের সম্পূর্ণ তালিকা। সতর্কতামূলক, নিষেধাজ্ঞামূলক, নির্দেশমূলক এবং তথ্যমূলক চিহ্ন এখানে অন্তর্ভুক্ত।"
                : "এটি ট্রাফিক সাইন/রোড চিহ্নের একটি ক্যাটাগরি। উপরের তালিকায় এ ক্যাটাগরির সব চিহ্ন দেখানো হয়েছে।",
            },
            {
              q: "বিস্তারিত তথ্য কোথায় পাব?",
              a: "প্রতিটি সাইনের নিচে “বিস্তারিত পড়ুন” বাটনে ক্লিক করলে আলাদা পেজে পুরো ব্যাখ্যা দেখা যাবে।",
            },
            {
              q: "তথ্যগুলো কি নিয়মিত আপডেট হয়?",
              a: "হ্যাঁ। নতুন চিহ্ন যোগ হলে বা পুরনো তথ্যে পরিবর্তন এলে তা নিয়মিত আপডেট করা হয়।",
            },
            {
              q: "কীভাবে নির্দিষ্ট সাইন খুঁজব?",
              a: "উপরের সার্চ বক্সে সাইনের নাম বা কীওয়ার্ড লিখে খুঁজতে পারেন।",
            },
          ].map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
            >
              <summary className="flex justify-between cursor-pointer px-4 py-3 font-medium list-none hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <span>{faq.q}</span>
                <span className="text-zinc-400 group-open:rotate-180 transition">▼</span>
              </summary>
              <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}