"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Map, Search, X, ArrowRight, Loader2 } from "lucide-react";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { FaUserPen } from "react-icons/fa6";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

type IntroItem = {
  id: number;
  title: string;
  slug: string;
  intro_category?: string;
  description?: string;
  image_url?: string;
};

type Creator = {
  id: number;
  name: string;
  slug: string;
  avatar_url?: string;
  profession?: string;
  is_verified?: boolean;
  is_online?: boolean;
  last_active_at?: string;
};

export default function IntroductionClient() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showCreators, setShowCreators] = useState(false);
  const creatorsRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, error, isLoading } = useSWR(
    `${API_BASE}/api/intro-bd?search=${encodeURIComponent(debouncedSearch)}`,
    fetcher,
    { revalidateOnFocus: false },
  );

  const { data: creatorsData, isLoading: creatorsLoading } = useSWR(
    showCreators ? `${API_BASE}/api/intro-bd/creators` : null,
    fetcher,
  );

  const grouped: Record<string, IntroItem[]> = data?.data || {};
  const total = data?.total ?? 0;
  const creators: Creator[] = creatorsData?.data || [];
  const hasSearch = !!debouncedSearch;

  return (
    <div className="max-w-2xl mx-auto space-y-8 px-4 py-6 sm:py-8">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5">
            <Map className="w-7 h-7" />
            বাংলাদেশের পরিচিতি
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            সকল বিভাগ, জেলা, ইতিহাস, সংস্কৃতি ও গুরুত্বপূর্ণ তথ্য এক জায়গায়
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
            <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-zinc-400/25 backdrop-blur-xl p-4 z-50 space-y-3 shadow-xl">
              <div>
                <h3 className="font-medium">
                  তথ্য প্রদানকারীগণ ({creators.length})
                </h3>
                <p className="text-xs mt-0.5 opacity-70">
                  এই পেজের কন্টেন্ট তৈরি ও যাচাইকরণে যারা অবদান রেখেছেন
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
                          {c.is_verified && (
                            <TbRosetteDiscountCheckFilled className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs opacity-70 truncate">
                          {c.profession || "কন্টেন্ট কন্ট্রিবিউটর"}
                        </p>
                        {c.last_active_at && (
                          <p className="text-xs opacity-60 mt-0.5">
                            সর্বশেষ: {c.last_active_at}
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
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="বিভাগ, জেলা বা শিরোনাম দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-400/10 text-sm outline-none hover:bg-zinc-400/15 transition"
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="px-3.5 rounded-xl bg-zinc-400/10 hover:bg-zinc-400/20 transition"
            title="মুছুন"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {hasSearch && !isLoading && (
        <p className="text-xs text-zinc-500">
          “{debouncedSearch}” এর জন্য {total}টি ফলাফল পাওয়া গেছে
        </p>
      )}

      {/* Grouped List */}
      <section className="space-y-10">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-zinc-400/10 p-4 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-zinc-400/15" />
                  <div className="flex-1 space-y-2.5 pt-1">
                    <div className="h-4 w-3/4 rounded bg-zinc-400/15" />
                    <div className="h-3 w-full rounded bg-zinc-400/15" />
                    <div className="h-3 w-5/6 rounded bg-zinc-400/15" />
                  </div>
                </div>
                <div className="border-t border-zinc-400/20 my-3" />
                <div className="h-3 w-24 rounded bg-zinc-400/15" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 rounded-2xl bg-zinc-400/5">
            <p className="text-base font-medium">ডেটা লোড করতে সমস্যা হয়েছে</p>
            <p className="text-sm opacity-60 mt-1">পরে আবার চেষ্টা করুন</p>
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-zinc-400/5">
            <Map className="w-10 h-10 mx-auto opacity-40 mb-3" />
            <p className="text-base font-medium">কোনো তথ্য পাওয়া যায়নি</p>
            <p className="text-sm opacity-60 mt-1">
              অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <div className="flex justify-center">
                <span className="px-4 py-1.5 rounded-full bg-zinc-400/10 text-xs font-bold uppercase tracking-widest">
                  {category}
                </span>
              </div>

              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/bangladesh/introduction/${item.slug}`}
                  className="block rounded-2xl bg-zinc-400/10 p-4 hover:bg-zinc-400/20 transition"
                >
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-zinc-400/15">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-40">
                          <Map className="w-7 h-7" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h2 className="text-base font-semibold line-clamp-1">
                        {item.title}
                      </h2>
                      {item.description && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                          {item.description.replace(/<[^>]+>/g, "")}
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
              ))}
            </div>
          ))
        )}
      </section>

      {/* SEO + AdSense Content Block */}
      <section className="space-y-4 pt-8 border-t border-zinc-400/20">
        <h2 className="text-xl font-bold">বাংলাদেশের পরিচিতি সম্পর্কে</h2>
        <div className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <p>
            বাংলাদেশ একটি সমৃদ্ধ ইতিহাস, বৈচিত্র্যময় সংস্কৃতি এবং অনন্য ভৌগোলিক
            বৈশিষ্ট্যের দেশ। এখানে ৮টি বিভাগ ও ৬৪টি জেলা রয়েছে। প্রতিটি অঞ্চলের
            নিজস্ব ঐতিহ্য, ভাষা, খাদ্য ও জীবনধারা আছে।
          </p>
          <p>
            এই পেজে আপনি বাংলাদেশের সকল বিভাগ, জেলা এবং সাধারণ তথ্যের বিস্তারিত
            তালিকা পাবেন। সার্চ ব্যবহার করে সহজেই প্রয়োজনীয় তথ্য খুঁজে নিতে
            পারবেন। প্রতিটি আইটেমের বিস্তারিত বিবরণ, ছবি ও পরিসংখ্যান দেওয়া আছে।
          </p>
          <p>
            তথ্যবক্স থেকে বাংলাদেশ সম্পর্কিত নির্ভরযোগ্য, হালনাগাদ ও সহজবোধ্য
            তথ্য এক জায়গায় পেয়ে যান। ভ্রমণ, শিক্ষা বা সাধারণ জ্ঞানের জন্য এই
            রিসোর্সটি অত্যন্ত উপকারী।
          </p>
        </div>
      </section>
    </div>
  );
}
