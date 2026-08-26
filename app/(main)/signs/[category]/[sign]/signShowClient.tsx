"use client";

import { useState } from "react";
import Link from "next/link";
import InteractiveActions from "./InteractiveActions";
import { ArrowLeft, Eye, User, Check, ArrowRight } from "lucide-react";
import MediaGallery from "@/components/MediaGallery";

interface Props {
  initialData: {
    category: any;
    item: any;
    creators: any[];
    views: number;
  };
  categorySlug: string;
  signSlug: string;
}

export default function SignShowClient({ initialData, categorySlug }: Props) {
  const { category, item, creators, views } = initialData;
  const [showCreators, setShowCreators] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-4 px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-zinc-400 flex flex-wrap items-center gap-1">
        <Link href="/" className="opacity-50">
          হোম
        </Link>
        <span>/</span>
        <Link href={`/signs/${categorySlug}`} className="opacity-50">
          {category.name} সাইন
        </Link>
        <span>/</span>
        <span className="text-zinc-50 text-zinc-200 truncate max-w-[160px]">
          {item.name}
        </span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-zinc-400/10 text-zinc-300">
            {category.name}
          </span>
          <h1 className="text-2xl  font-black tracking-tight text-zinc-50 dark:text-white">
            {item.name}
          </h1>
          <p className="text-sm text-zinc-400">
            {category.name} সাইন · অর্থ ও ব্যবহার
          </p>
          <div className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-zinc-400/10">
            <Eye className="w-3.5 h-3.5" /> {views}
          </div>
        </div>

        {/* Creators */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowCreators(!showCreators)}
            className="p-1.5 rounded-xl hover:bg-zinc-400/10 hover:bg-zinc-400/10"
            aria-label="তথ্য প্রদানকারী"
          >
            <User className="w-4 h-4" />
          </button>
          {showCreators && (
            <div className="absolute right-0 top-full mt-2 w-72 max-h-80 overflow-y-auto rounded-2xl border bg-zinc-400/10 bg-zinc-400/10  z-50 p-4 space-y-4">
              <div>
                <h2 className=" text-sm">তথ্য প্রদানকারী</h2>
                <p className="text-xs text-zinc-400">
                  এই কন্টেন্ট তৈরিতে অবদান রেখেছেন
                </p>
              </div>
              {creators.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-2">
                  কোনো কন্ট্রিবিউটর পাওয়া যায়নি।
                </p>
              ) : (
                creators.map((c: any) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-zinc-400/10/60 space-y-2"
                  >
                    <div className="flex items-start gap-4">
                      {c.avatar_url ? (
                        <img
                          src={c.avatar_url}
                          alt={c.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-zinc-400/25 flex items-center justify-center text-sm  opacity-50">
                          {c.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className=" text-sm truncate">
                            {c.name}
                          </span>
                          {c.email_verified && (
                            <Check className="w-3.5 h-3.5 text-zinc-300" />
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 truncate">
                          {c.profession}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-400 pt-1 border-t">
                      <span>একটিভ: {c.last_active_bn}</span>
                      <Link
                        href={`/users/${c.slug}`}
                        className="opacity-50 hover:underline inline-flex items-center gap-0.5"
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

      <article className="space-y-4">
        {/* Media Gallery Integration */}
        {item.media?.length > 0 && (
          <div className="rounded-xl overflow-hidden mb-6">
            <MediaGallery
              media={item.media.map((m: any) => ({
                url: m.url,
                caption: item.title, // লাইটবক্সে ছবির নিচে ক্যাপশন হিসেবে টাইটেল দেখাবে
              }))}
            />
          </div>
        )}

        <div
          className="prose prose-emerald dark:prose-invert max-w-none leading-relaxed"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      </article>

      {/* Description */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold">বিস্তারিত বিবরণ</h2>
        {item.description ? (
          <div
            className="prose dark:prose-invert max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        ) : (
          <p className="text-sm text-zinc-400">
            এই চিহ্নের বিস্তারিত বিবরণ এখনো যোগ করা হয়নি।
          </p>
        )}
      </section>

      {/* Actions */}
      <InteractiveActions
        itemId={item.id}
        initialLike={item.like_count ?? 0}
        initialDislike={item.dislike_count ?? 0}
        hasLike={item.has_like ?? false}
        hasDislike={item.has_dislike ?? false}
        shareTitle={item.name}
      />

      {/* Back */}
      <div>
        <Link
          href={`/signs/${categorySlug}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-300 opacity-50"
        >
          <ArrowLeft className="w-4 h-4" /> {category.name} তালিকায় ফিরে যান
        </Link>
      </div>

      {/* About */}
      <section className="rounded-2xl bg-zinc-400/10/40 p-4 space-y-4">
        <h2 className="text-lg font-bold">{item.name} সম্পর্কে</h2>
        <p className="text-sm  leading-relaxed">
          <strong>{item.name}</strong> হলো <strong>{category.name}</strong>{" "}
          ক্যাটাগরির একটি ট্রাফিক সাইন/রোড চিহ্ন। রাস্তায় এই চিহ্ন দেখলে উপরের
          নির্দেশনা অনুসরণ করুন।
        </p>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>
        <div className="space-y-2">
          <details className="group rounded-xl border overflow-hidden">
            <summary className="flex justify-between cursor-pointer px-4 py-2  list-none hover:bg-zinc-400/10 hover:bg-zinc-400/10">
              <span>{item.name} কী বোঝায়?</span>
              <span className="text-zinc-400 group-open:rotate-180 transition">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm ">
              উপরের “বিস্তারিত বিবরণ” সেকশনে এই চিহ্নের অর্থ ও ব্যবহার লেখা আছে।
            </div>
          </details>
          <details className="group rounded-xl border overflow-hidden">
            <summary className="flex justify-between cursor-pointer px-4 py-2  list-none hover:bg-zinc-400/10 hover:bg-zinc-400/10">
              <span>একই ক্যাটাগরির অন্য সাইন কোথায়?</span>
              <span className="text-zinc-400 group-open:rotate-180 transition">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm ">
              <Link
                href={`/signs/${categorySlug}`}
                className="opacity-50 hover:underline"
              >
                {category.name}
              </Link>{" "}
              তালিকায় ফিরে গিয়ে অন্যান্য চিহ্ন দেখতে পারবেন।
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
