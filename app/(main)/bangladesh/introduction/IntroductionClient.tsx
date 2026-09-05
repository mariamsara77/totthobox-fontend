"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Map, Search, X, ArrowRight, Users, Check } from "lucide-react";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { FaUser, FaUserPen } from "react-icons/fa6";

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const { data: creatorsData } = useSWR(
    showCreators ? `${API_BASE}/api/intro-bd/creators` : null,
    fetcher,
  );

  const grouped: Record<string, IntroItem[]> = data?.data || {};
  const total = data?.total ?? 0;
  const creators: Creator[] = creatorsData?.data || [];

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 sm:p-6">
      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Map className="w-6 h-6 text-amber-600 dark:text-amber-500" />
            বাংলাদেশের পরিচিতি
          </h1>
          <p className="text-sm  mt-1">
            বাংলাদেশের সকল বিভাগ ও জেলার বিস্তারিত তথ্য, ইতিহাস ও গুরুত্বপূর্ণ
            পরিচিতি
          </p>
        </div>

        {/* Creators Button */}
        <div className="relative shrink-0" ref={creatorsRef}>
          <button
            onClick={() => setShowCreators(!showCreators)}
            className="p-2 rounded-lg hover:bg-zinc-400/25"
            aria-label="তথ্য প্রদানকারীগণ"
          >
            <FaUserPen className="w-5 h-5" />
          </button>

          {showCreators && (
            <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-zinc-400/25 backdrop-blur-xl p-4 z-50 space-y-4">
              <div>
                <h3 className="">তথ্য প্রদানকারীগণ ({creators.length})</h3>
                <p className="text-xs mt-0.5">
                  এই পেজের কন্টেন্ট তৈরি ও যাচাইকরণে যারা অবদান রেখেছেন
                </p>
              </div>

              {creators.length === 0 ? (
                <p className="text-sm text-center py-4">
                  এখনো কোনো কন্ট্রিবিউটর পাওয়া যায়নি।
                </p>
              ) : (
                creators.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start gap-4 p-2 rounded-xl bg-zinc-400/10 hover:bg-zinc-400/25 border border-zinc-400/25"
                  >
                    <div className="relative">
                      {c.avatar_url ? (
                        <img
                          src={c.avatar_url}
                          alt={c.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-zinc-400/10 flex items-center justify-center text-sm ">
                          {c.name?.charAt(0)}
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${
                          c.is_online ? "bg-green-500" : "bg-zinc-500"
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className=" text-sm truncate">{c.name}</span>
                        {c.is_verified && (
                          <TbRosetteDiscountCheckFilled className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 truncate">
                        {c.profession || "কন্টেন্ট কন্ট্রিবিউটর"}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        সর্বশেষ: {c.last_active_at || "অজানা"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </header>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="বিভাগ, জেলা বা শিরোনাম দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-400/10 outline-none"
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="p-2.5 rounded-lg hover:bg-zinc-400/25"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {debouncedSearch && (
        <p className="text-xs  text-zinc-400">
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
                className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-zinc-400/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 rounded bg-zinc-400/10" />
                    <div className="h-3 w-full rounded bg-zinc-400/10" />
                    <div className="h-3 w-full rounded bg-zinc-400/10" />
                  </div>
                </div>
                <div className="border-t  border-zinc-400/25 my-2" />
                <div className="h-3 w-20 rounded bg-zinc-400/10" />
              </div>
            ))}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 text-zinc-400">
            <p className="text-lg ">কোনো তথ্য পাওয়া যায়নি</p>
            <p className="text-sm mt-1">অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন</p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <div className="flex justify-center">
                <span className="px-4 py-2 rounded-full bg-zinc-400/10 text-xs font-bold uppercase tracking-widest">
                  {category}
                </span>
              </div>

              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/bangladesh/introduction/${item.slug}`}
                  className="block rounded-2xl border border-zinc-400/25 bg-zinc-400/40 p-4 hover:bg-zinc-400/25"
                >
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-16 h-16 rounded-xl object-cover border border-zinc-400/25"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-zinc-400/10 flex items-center justify-center">
                          <Map className="w-7 h-7 text-zinc-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h2 className="text-lg line-clamp-1">{item.title}</h2>
                      {item.description && (
                        <p className="text-sm opacity-80 line-clamp-2">
                          {item.description.replace(/<[^>]+>/g, "")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-zinc-400/25">
                    <span className="inline-flex items-center gap-2 text-xs  text-amber-600 dark:text-amber-400">
                      বিস্তারিত পড়ুন
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ))
        )}
      </section>

      {/* About */}
      <section className="space-y-4 pt-6 border-t border-zinc-400/25">
        <h2 className="text-lg font-bold flex items-center gap-2">
          বাংলাদেশের পরিচিতি সম্পর্কে
        </h2>
        <div className="space-y-4 text-sm  leading-relaxed">
          <p>
            এই পেজে বাংলাদেশের বিভিন্ন বিভাগ, জেলা এবং সাধারণ তথ্যের তালিকা
            দেওয়া আছে। এখানে দেশের ভৌগোলিক অবস্থান, প্রশাসনিক বিভাগ, জনসংখ্যা,
            সংস্কৃতি, অর্থনীতি এবং অন্যান্য গুরুত্বপূর্ণ তথ্য একত্রিত করা হয়েছে।
          </p>
          <p>
            “বিস্তারিত পড়ুন” বাটনে ক্লিক করে পুরো ব্যাখ্যা, পরিসংখ্যান এবং
            প্রাসঙ্গিক তথ্য জানতে পারবেন। সার্চ ব্যবহার করে সহজেই প্রয়োজনীয় তথ্য
            খুঁজে নিতে পারবেন।
          </p>
        </div>
      </section>
    </div>
  );
}
