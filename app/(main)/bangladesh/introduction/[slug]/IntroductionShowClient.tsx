"use client";

import React, { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { ArrowLeft, Eye, Users, Check, ChevronDown } from "lucide-react";
import InteractiveActions from "./InteractiveActions";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { FaUserPen } from "react-icons/fa6";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Intro = {
  id: number;
  title: string;
  slug: string;
  intro_category?: string;
  description?: string;
  image_url?: string;
  views_count?: number;
  reactions?: {
    like_count: number;
    dislike_count: number;
    user_has_liked: boolean;
    user_has_disliked: boolean;
  };
  // পুরনো shape সাপোর্ট (optional)
  like_count?: number;
  dislike_count?: number;
  has_like?: boolean;
  has_dislike?: boolean;
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

type Props = {
  intro: Intro;
};

export default function IntroductionShowClient({ intro }: Props) {
  const [showCreators, setShowCreators] = useState(false);

  const { data: creatorsData } = useSWR(
    showCreators ? `${API_BASE}/api/intro-bd/${intro.id}/creators` : null,
    fetcher,
  );
  const creators: Creator[] = creatorsData?.data || [];

  // reactions normalize
  const reactions = intro.reactions || {
    like_count: intro.like_count ?? 0,
    dislike_count: intro.dislike_count ?? 0,
    user_has_liked: intro.has_like ?? false,
    user_has_disliked: intro.has_dislike ?? false,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 sm:p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/" className="hover:underline">
          হোম
        </Link>
        <span>/</span>
        <Link href="/bangladesh/introduction" className="hover:underline">
          বাংলাদেশের পরিচিতি
        </Link>
        <span>/</span>
        <span className=" truncate">{intro.title}</span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {intro.intro_category && (
              <span className="inline-block px-2.5 py-0.5 rounded-md text-xs  bg-zinc-400/10 ">
                {intro.intro_category}
              </span>
            )}
            <h1 className="text-2xl  font-black tracking-tight dark:text-white">
              {intro.title}
            </h1>
            <p className="text-sm">বাংলাদেশের পরিচিতি · বিস্তারিত তথ্য</p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-zinc-400/10">
                <Eye className="w-3.5 h-3.5" />
                {intro.views_count?.toLocaleString("bn-BD") || 0}
              </span>
            </div>
          </div>

          {/* Creators */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowCreators(!showCreators)}
              className="p-2 rounded-lg hover:bg-zinc-400/25"
              aria-label="তথ্য প্রদানকারীগণ"
            >
              <FaUserPen className="w-5 h-5" />
            </button>
            {showCreators && (
              <>
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
                      <Link key={c.id} href={`/users/${c.slug}`}>
                        <div
                          key={c.id}
                          className="flex items-start gap-4 p-2 rounded-xl bg-zinc-400/10 hover:bg-zinc-400/25 border border-zinc-400/25 mb-2"
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
                              <strong className="truncate">{c.name}</strong>
                              {c.is_verified && (
                                <TbRosetteDiscountCheckFilled className="w-4 h-4 text-blue-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs opacity-80 truncate">
                              {c.profession || "কন্টেন্ট কন্ট্রিবিউটর"}
                            </p>
                            <p className="text-xs opacity-80 mt-0.5">
                              সর্বশেষ: {c.last_active_at || "অজানা"}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Image */}
      {intro.image_url && (
        <div className="rounded-2xl overflow-hidden border border-zinc-400/25">
          <img
            src={intro.image_url}
            alt={intro.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Description */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold ">বিস্তারিত বিবরণ</h2>
        {intro.description ? (
          <div
            className="prose dark:prose-invert max-w-none leading-relaxed "
            dangerouslySetInnerHTML={{ __html: intro.description }}
          />
        ) : (
          <p className="text-sm text-zinc-400">
            এই তথ্যের বিস্তারিত বিবরণ এখনো যোগ করা হয়নি।
          </p>
        )}
      </section>

      {/* ✅ Like / Dislike / Share — এখানেই বসবে */}
      <InteractiveActions
        introId={intro.id}
        initialData={{
          reactions: intro.reactions || {
            like_count: 0,
            dislike_count: 0,
            user_has_liked: false,
            user_has_disliked: false,
          },
          title: intro.title,
          slug: intro.slug,
        }}
      />
      {/* Back */}
      <Link
        href="/bangladesh/introduction"
        className="inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="w-4 h-4 hover:underline" />
        বাংলাদেশের পরিচিতি তালিকায় ফিরে যান
      </Link>

      {/* About */}
      <section className="rounded-2xl bg-zinc-400/10/40 p-4 space-y-2">
        <h2 className="text-lg font-bold ">{intro.title} সম্পর্কে</h2>
        <p className="text-sm  leading-relaxed">
          <strong>{intro.title}</strong> হলো বাংলাদেশের পরিচিতির অংশ।
          {intro.intro_category && (
            <>
              {" "}
              এটি <strong>{intro.intro_category}</strong> ক্যাটাগরির অন্তর্গত।
            </>
          )}{" "}
          উপরের বিবরণ অনুসরণ করে বিস্তারিত জানুন।
        </p>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold ">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>
        <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-2 ">
            <span>{intro.title} কী?</span>
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition" />
          </summary>
          <div className="px-4 pb-4 text-sm ">
            উপরের “বিস্তারিত বিবরণ” সেকশনে এই তথ্যের পূর্ণাঙ্গ ব্যাখ্যা লেখা
            আছে।
          </div>
        </details>
        <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-2 ">
            <span>অন্যান্য তথ্য কোথায় পাব?</span>
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition" />
          </summary>
          <div className="px-4 pb-4 text-sm ">
            <Link href="/bangladesh/introduction" className="hover:underline">
              বাংলাদেশের পরিচিতি
            </Link>{" "}
            তালিকায় ফিরে গিয়ে অন্যান্য তথ্য দেখতে পারবেন।
          </div>
        </details>
      </section>
    </div>
  );
}
