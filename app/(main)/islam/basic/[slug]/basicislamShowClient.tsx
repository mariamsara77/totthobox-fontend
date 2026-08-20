"use client";

import { useState } from "react";
import Link from "next/link";
import InteractiveActions from "./InteractiveActions";
import MediaGallery from '@/components/MediaGallery';
import {
  ArrowLeft,
  Eye,
  User,
  Check,
  ArrowRight,
} from "lucide-react";

interface Props {
  initialData: {
    item: any;
    creators: any[];
    views: number;
  };
  slug: string;
}

export default function BasicIslamShowClient({ initialData, slug }: Props) {
  const { item, creators, views } = initialData;
  const [showCreators, setShowCreators] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 py-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-zinc-500 flex flex-wrap items-center gap-1">
        <Link href="/" className="hover:text-emerald-600">হোম</Link>
        <span>/</span>
        <Link href="/islam/basic" className="hover:text-emerald-600">
          ইসলামের মৌলিক জ্ঞান
        </Link>
        <span>/</span>
        <span className="text-zinc-800 dark:text-zinc-200 truncate max-w-[200px]">
          {item.title}
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-3 border-b border-zinc-200 dark:border-zinc-700 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600">
          {item.title}
        </h1>

        <div className="flex items-center justify-between text-sm text-zinc-500">
          <p>ইসলামের মৌলিক জ্ঞান · তথ্যবক্স</p>

          {/* Creators */}
          <div className="relative">
            <button
              onClick={() => setShowCreators(!showCreators)}
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="তথ্য প্রদানকারীগণ দেখুন"
            >
              <User className="w-4 h-4" />
            </button>

            {showCreators && (
              <div className="absolute right-0 top-full mt-2 w-72 max-h-80 overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl z-50 p-4 space-y-3">
                <div>
                  <h2 className="font-semibold text-sm">তথ্য প্রদানকারী</h2>
                  <p className="text-xs text-zinc-500">এই কন্টেন্ট তৈরিতে অবদান রেখেছেন</p>
                </div>

                {creators.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-3">
                    কোনো কন্ট্রিবিউটর পাওয়া যায়নি।
                  </p>
                ) : (
                  creators.map((c: any) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 space-y-2"
                    >
                      <div className="flex items-start gap-3">
                        {c.avatar_url ? (
                          <img
                            src={c.avatar_url}
                            alt={c.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-medium text-emerald-700">
                            {c.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-sm truncate">{c.name}</span>
                            {c.email_verified && (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 truncate">{c.profession}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-200/50">
                        <span>একটিভ: {c.last_active_bn}</span>
                        <Link
                          href={`/users/${c.slug}`}
                          className="text-emerald-600 hover:underline inline-flex items-center gap-0.5"
                        >
                          প্রোফাইল <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}

                <p className="text-xs text-zinc-400 text-center border-t pt-2">
                  আমাদের সকল তথ্য ভেরিফাইড এবং যাচাইকৃত।
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
          <Eye className="w-3.5 h-3.5" />
          {views} ভিউ
        </div>
      </header>

      {/* Content */}
      {/* Content */}
      <article className="space-y-6">
        
        {/* Media Gallery Integration */}
        {item.media?.length > 0 && (
          <div className="rounded-xl overflow-hidden mb-6">
            <MediaGallery 
              media={item.media.map((m: any) => ({
                url: m.url,
                caption: item.title // লাইটবক্সে ছবির নিচে ক্যাপশন হিসেবে টাইটেল দেখাবে
              }))} 
            />
          </div>
        )}

        <div
          className="prose prose-emerald dark:prose-invert max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      </article>

      <div>
        <Link
          href="/islam/basic"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-emerald-600"
        >
          <ArrowLeft className="w-4 h-4" /> সব বিষয়ে ফিরে যান
        </Link>
      </div>

      {/* Like / Dislike / Share */}
     <InteractiveActions
  itemId={item.id}                          // ← id পাঠান
  initialLike={item.like_count ?? 0}
  initialDislike={item.dislike_count ?? 0}
  hasLike={item.has_like ?? false}
  hasDislike={item.has_dislike ?? false}
/>

      {/* Comments placeholder */}
      {/* <CommentsSection modelType="BasicIslam" modelId={item.id} /> */}

      {/* About */}
      <section className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 p-5 space-y-3">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
          এই বিষয় সম্পর্কে
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          <strong>{item.title}</strong> ইসলামের মৌলিক জ্ঞানের অংশ।
          দ্বীনের সঠিক ধারণা জানতে আরও বিষয় দেখুন{" "}
          <Link href="/islam/basic" className="text-emerald-600 hover:underline">
            ইসলামের মৌলিক জ্ঞান
          </Link>{" "}
          সেকশনে।
        </p>
      </section>

      {/* FAQ */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>
        <div className="space-y-2">
          <details className="group rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer px-4 py-3 font-medium list-none hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <span>{item.title} কেন গুরুত্বপূর্ণ?</span>
              <span className="text-zinc-400 group-open:rotate-180 transition">▼</span>
            </summary>
            <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400">
              এটি ইসলামের মৌলিক জ্ঞানের অংশ। সঠিক ধারণা রাখা প্রতিটি মুসলমানের জন্য প্রয়োজনীয়। উপরের বিবরণে বিস্তারিত ব্যাখ্যা আছে।
            </div>
          </details>
          <details className="group rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer px-4 py-3 font-medium list-none hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <span>আরও বিষয় কোথায় পাব?</span>
              <span className="text-zinc-400 group-open:rotate-180 transition">▼</span>
            </summary>
            <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400">
              <Link href="/islam/basic" className="text-emerald-600 hover:underline">
                ইসলামের মৌলিক জ্ঞান
              </Link>{" "}
              পেজে সব বিষয় একসাথে দেখতে পারবেন।
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}