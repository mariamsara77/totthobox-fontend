"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import useSWR from "swr";
import { ArrowLeft, Eye, MapPin, ChevronDown } from "lucide-react";
import { FaUserPen } from "react-icons/fa6";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import InteractiveActions from "./InteractiveActions";
import MediaGallery from "@/components/MediaGallery";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Establishment = {
  id: number;
  title: string;
  slug: string;
  type?: string;
  type_label?: string;
  description?: string;
  image_url?: string;
  images?: { url: string; caption?: string }[];
  thana?: string;
  district?: string;
  division?: string;
  views_count?: number;
  reactions?: {
    like_count: number;
    dislike_count: number;
    user_has_liked: boolean;
    user_has_disliked: boolean;
  };
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
  establishment: Establishment;
};

export default function EstablishmentShowClient({ establishment }: Props) {
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

  const { data: creatorsData, isLoading: creatorsLoading } = useSWR(
    showCreators
      ? `${API_BASE}/api/establishment-bd/${establishment.id}/creators`
      : null,
    fetcher,
  );
  const creators: Creator[] = creatorsData?.data || [];

  const reactions = {
    like_count: establishment.reactions?.like_count ?? 0,
    dislike_count: establishment.reactions?.dislike_count ?? 0,
    user_has_liked: establishment.reactions?.user_has_liked ?? false,
    user_has_disliked: establishment.reactions?.user_has_disliked ?? false,
  };

  const location = [
    establishment.thana,
    establishment.district,
    establishment.division,
  ]
    .filter(Boolean)
    .join(" • ");

  // MediaGallery - Single + Multiple support
  const media =
    establishment.images && establishment.images.length > 0
      ? establishment.images.map((img: any) => ({
          url: img.url,
          caption: img.caption || establishment.title,
        }))
      : establishment.image_url
        ? [{ url: establishment.image_url, caption: establishment.title }]
        : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/" className="hover:underline">
          হোম
        </Link>
        <span>/</span>
        <Link href="/bangladesh/establishment" className="hover:underline">
          স্থাপনাসমূহ
        </Link>
        <span>/</span>
        <span className="truncate opacity-70">{establishment.title}</span>
      </nav>

      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {establishment.type_label && (
            <span className="inline-block px-2.5 py-1 rounded-md text-xs bg-zinc-400/10">
              {establishment.type_label}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {establishment.title}
          </h1>

          {location && (
            <p className="text-sm flex items-center gap-1.5 opacity-80">
              <MapPin className="w-4 h-4 shrink-0" />
              {location}
            </p>
          )}

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-zinc-400/10">
            <Eye className="w-3.5 h-3.5" />
            {establishment.views_count?.toLocaleString("bn-BD") || 0}
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

      {/* Media Gallery */}
      {media.length > 0 && (
        <div className="rounded-2xl overflow-hidden">
          <MediaGallery media={media} />
        </div>
      )}

      {/* Description */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">বিস্তারিত বিবরণ</h2>
        {establishment.description ? (
          <div
            className="prose dark:prose-invert max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: establishment.description }}
          />
        ) : (
          <p className="text-sm opacity-60">
            এই স্থাপনার বিস্তারিত বিবরণ এখনো যোগ করা হয়নি।
          </p>
        )}
      </section>

      {/* Like / Dislike / Share */}
      <InteractiveActions
        establishmentId={establishment.id}
        initialData={{
          reactions,
          title: establishment.title,
          slug: establishment.slug,
        }}
      />

      {/* Back */}
      <Link
        href="/bangladesh/establishment"
        className="inline-flex items-center gap-2 text-sm hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        স্থাপনা তালিকায় ফিরে যান
      </Link>

      {/* About */}
      <section className="rounded-2xl bg-zinc-400/10 p-5 space-y-3">
        <h2 className="text-lg font-bold">{establishment.title} সম্পর্কে</h2>
        <div className="text-sm leading-relaxed space-y-2 opacity-90">
          <p>
            <strong>{establishment.title}</strong> হলো বাংলাদেশের একটি
            গুরুত্বপূর্ণ স্থাপনা/প্রতিষ্ঠান।
            {establishment.type_label && (
              <>
                {" "}
                এটি <strong>{establishment.type_label}</strong> ধরনের।
              </>
            )}
          </p>
          <p>
            উপরের বিবরণ থেকে বিস্তারিত জানুন। তথ্যবক্স থেকে নির্ভরযোগ্য তথ্য
            সহজেই পেয়ে যান।
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>

        <details className="group rounded-xl bg-zinc-400/10 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 list-none hover:bg-zinc-400/15 transition">
            <span className="text-sm font-medium">
              {establishment.title} কী?
            </span>
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm leading-relaxed border-t border-zinc-400/20 pt-3 opacity-90">
            উপরের “বিস্তারিত বিবরণ” সেকশনে এই স্থাপনার পূর্ণাঙ্গ তথ্য লেখা আছে।
          </div>
        </details>

        <details className="group rounded-xl bg-zinc-400/10 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 list-none hover:bg-zinc-400/15 transition">
            <span className="text-sm font-medium">
              অন্যান্য স্থাপনা কোথায় দেখব?
            </span>
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm leading-relaxed border-t border-zinc-400/20 pt-3 opacity-90">
            <Link href="/bangladesh/establishment" className="underline">
              স্থাপনাসমূহ
            </Link>{" "}
            তালিকায় ফিরে গিয়ে অন্যান্য প্রতিষ্ঠান দেখতে পারবেন।
          </div>
        </details>
      </section>
    </div>
  );
}
