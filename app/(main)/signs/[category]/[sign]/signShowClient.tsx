"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, ChevronDown } from "lucide-react";
import { FaUserPen } from "react-icons/fa6";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import InteractiveActions from "./InteractiveActions";
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
  const { category, item, creators = [], views } = initialData;
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

  // MediaGallery - Single + Multiple
  const media =
    item.media && item.media.length > 0
      ? item.media.map((m: any) => ({
          url: m.url,
          caption: m.caption || item.name,
        }))
      : item.first_media_url
        ? [{ url: item.first_media_url, caption: item.name }]
        : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/" className="hover:underline">
          হোম
        </Link>
        <span>/</span>
        <Link href="/signs/all" className="hover:underline">
          ট্রাফিক সাইন
        </Link>
        <span>/</span>
        <Link href={`/signs/${categorySlug}`} className="hover:underline">
          {category?.name || categorySlug}
        </Link>
        <span>/</span>
        <span className="truncate opacity-70">{item.name}</span>
      </nav>

      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {category?.name && (
            <span className="inline-block px-2.5 py-1 rounded-md text-xs bg-zinc-400/10">
              {category.name}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {item.name}
          </h1>

          <p className="text-sm opacity-80">
            {category?.name || "ট্রাফিক"} সাইন · অর্থ ও ব্যবহার
          </p>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-zinc-400/10">
            <Eye className="w-3.5 h-3.5" />
            {(views || 0).toLocaleString("bn-BD")}
          </div>
        </div>

        {/* Creators */}
        <div className="relative shrink-0" ref={creatorsRef}>
          <button
            type="button"
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

              {creators.length === 0 ? (
                <p className="text-sm text-center py-4 opacity-60">
                  এখনো কোনো কন্ট্রিবিউটর পাওয়া যায়নি।
                </p>
              ) : (
                creators.map((c: any) => (
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
                        {c.is_online !== undefined && (
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900 ${
                              c.is_online ? "bg-green-500" : "bg-zinc-400"
                            }`}
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <strong className="truncate text-sm">{c.name}</strong>
                          {(c.email_verified || c.is_verified) && (
                            <TbRosetteDiscountCheckFilled className="w-4 h-4 text-blue-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs opacity-70 truncate">
                          {c.profession || "কন্টেন্ট কন্ট্রিবিউটর"}
                        </p>
                        {(c.last_active_bn || c.last_active_at) && (
                          <p className="text-xs opacity-60 mt-0.5">
                            সর্বশেষ: {c.last_active_bn || c.last_active_at}
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

      {/* Media Gallery (Single + Multiple) */}
      {media.length > 0 && (
        <div className="rounded-2xl overflow-hidden">
          <MediaGallery media={media} />
        </div>
      )}

      {/* Description */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">বিস্তারিত বিবরণ</h2>
        {item.description ? (
          <div
            className="prose dark:prose-invert max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        ) : (
          <p className="text-sm opacity-60">
            এই চিহ্নের বিস্তারিত বিবরণ এখনো যোগ করা হয়নি।
          </p>
        )}
      </section>

      {/* Like / Dislike / Share */}
      <InteractiveActions
        itemId={item.id}
        initialLike={item.like_count ?? 0}
        initialDislike={item.dislike_count ?? 0}
        hasLike={item.has_like ?? false}
        hasDislike={item.has_dislike ?? false}
        shareTitle={item.name}
      />

      {/* Back */}
      <Link
        href={`/signs/${categorySlug}`}
        className="inline-flex items-center gap-2 text-sm hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        {category?.name || "সাইন"} তালিকায় ফিরে যান
      </Link>

      {/* About */}
      <section className="rounded-2xl bg-zinc-400/10 p-5 space-y-3">
        <h2 className="text-lg font-bold">{item.name} সম্পর্কে</h2>
        <div className="text-sm leading-relaxed space-y-2 opacity-90">
          <p>
            <strong>{item.name}</strong> হলো{" "}
            <strong>{category?.name || "ট্রাফিক"}</strong> ক্যাটাগরির একটি
            ট্রাফিক সাইন/রোড চিহ্ন।
          </p>
          <p>
            রাস্তায় এই চিহ্ন দেখলে উপরের নির্দেশনা অনুসরণ করুন। আরও সাইন দেখতে{" "}
            <Link href={`/signs/${categorySlug}`} className="underline">
              {category?.name || "সাইন"}
            </Link>{" "}
            তালিকায় যান।
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>

        <details className="group rounded-xl bg-zinc-400/10 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 list-none hover:bg-zinc-400/15 transition">
            <span className="text-sm font-medium">{item.name} কী বোঝায়?</span>
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm leading-relaxed border-t border-zinc-400/20 pt-3 opacity-90">
            উপরের “বিস্তারিত বিবরণ” সেকশনে এই চিহ্নের অর্থ ও ব্যবহার লেখা আছে।
          </div>
        </details>

        <details className="group rounded-xl bg-zinc-400/10 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 list-none hover:bg-zinc-400/15 transition">
            <span className="text-sm font-medium">
              একই ক্যাটাগরির অন্য সাইন কোথায়?
            </span>
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm leading-relaxed border-t border-zinc-400/20 pt-3 opacity-90">
            <Link href={`/signs/${categorySlug}`} className="underline">
              {category?.name || "সাইন"}
            </Link>{" "}
            তালিকায় ফিরে গিয়ে অন্যান্য চিহ্ন দেখতে পারবেন।
          </div>
        </details>
      </section>
    </div>
  );
}
