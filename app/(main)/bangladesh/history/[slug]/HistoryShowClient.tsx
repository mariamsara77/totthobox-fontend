"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  ArrowLeft,
  Eye,
  Calendar,
  ChevronDown,
  Star,
  Clock,
} from "lucide-react";
import { FaUserPen } from "react-icons/fa6";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import InteractiveActions from "./InteractiveActions";
import MediaGallery from "@/components/MediaGallery";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

type History = {
  id: number;
  title: string;
  slug: string;
  era?: string;
  start_year?: string | number;
  end_year?: string | number;
  division?: string;
  district?: string;
  thana?: string;
  is_featured?: boolean;
  description?: string;
  image_url?: string;
  images?: { url: string; caption?: string }[];
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
  history: History;
};

function getPlainText(value?: string): string {
  return (value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getExcerpt(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  const candidate = value.slice(0, maxLength);
  const lastSpace = candidate.lastIndexOf(" ");
  const excerpt =
    lastSpace > Math.floor(maxLength * 0.7)
      ? candidate.slice(0, lastSpace)
      : candidate;
  return `${excerpt.trimEnd()}...`;
}

export default function HistoryShowClient({ history }: Props) {
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
    showCreators ? `${API_BASE}/api/history-bd/${history.id}/creators` : null,
    fetcher,
  );
  const creators: Creator[] = creatorsData?.data || [];

  const descriptionText = getPlainText(history.description);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "হোম",
        item: "https://totthobox.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "বাংলাদেশের ইতিহাস",
        item: "https://totthobox.com/bangladesh/history",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: history.title,
      },
    ],
  };

  const reactions = {
    like_count: history.reactions?.like_count ?? 0,
    dislike_count: history.reactions?.dislike_count ?? 0,
    user_has_liked: history.reactions?.user_has_liked ?? false,
    user_has_disliked: history.reactions?.user_has_disliked ?? false,
  };

  // MediaGallery - Single + Multiple support
  const media =
    history.images && history.images.length > 0
      ? history.images.map((img: any) => ({
          url: img.url,
          caption: img.caption || history.title,
        }))
      : history.image_url
        ? [{ url: history.image_url, caption: history.title }]
        : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/" className="hover:underline">
          হোম
        </Link>
        <span>/</span>
        <Link href="/bangladesh/history" className="hover:underline">
          ঐতিহাসিক স্থান
        </Link>
        <span>/</span>
        <span className="truncate opacity-70">{history.title}</span>
      </nav>

      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <span className="inline-block px-2.5 py-1 rounded-md text-xs bg-zinc-400/10">
              ইতিহাস ও ঐতিহ্য
            </span>
            {history.is_featured && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Star className="w-3 h-3" />
                Featured
              </span>
            )}
            {history.era && (
              <span className="inline-block px-2.5 py-1 rounded-md text-xs bg-zinc-400/10">
                {history.era}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {history.title}
          </h1>

          {(history.start_year || history.end_year) && (
            <p className="text-sm flex items-center gap-1.5 opacity-80">
              <Calendar className="w-4 h-4 shrink-0" />
              {history.start_year ?? "?"} – {history.end_year ?? "?"}
            </p>
          )}

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-zinc-400/10">
            <Eye className="w-3.5 h-3.5" />
            {history.views_count?.toLocaleString("bn-BD") || 0}
          </div>
        </div>

        {/* Creators */}
        <div className="relative shrink-0" ref={creatorsRef}>
          <button
            type="button"
            onClick={() => setShowCreators(!showCreators)}
            className="p-2 rounded-xl hover:bg-zinc-400/25 transition"
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

      {/* Era & Year Info Card */}
      {(history.era || history.start_year || history.end_year) && (
        <div className="rounded-2xl bg-zinc-400/10 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {history.era && (
            <div>
              <p className="text-xs opacity-70 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                যুগ / Era
              </p>
              <p className="font-medium">{history.era}</p>
            </div>
          )}
          {(history.start_year || history.end_year) && (
            <div>
              <p className="text-xs opacity-70 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                সময়কাল
              </p>
              <p className="font-medium">
                {history.start_year ?? "?"} – {history.end_year ?? "?"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">বিস্তারিত বিবরণ</h2>
        {history.description ? (
          <div
            className="prose dark:prose-invert max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: history.description }}
          />
        ) : (
          <p className="text-sm opacity-60">
            এই স্থানের বিস্তারিত বিবরণ এখনো যোগ করা হয়নি।
          </p>
        )}
      </section>

      {/* Like / Dislike / Share */}
      <InteractiveActions
        historyId={history.id}
        initialData={{
          reactions,
          title: history.title,
          slug: history.slug,
        }}
      />

      {/* Back */}
      <Link
        href="/bangladesh/history"
        className="inline-flex items-center gap-2 text-sm hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        ঐতিহাসিক স্থান তালিকায় ফিরে যান
      </Link>

      {/* About */}
      <section className="rounded-2xl bg-zinc-400/10 p-5 space-y-3">
        <h2 className="text-lg font-bold">{history.title} সম্পর্কে</h2>
        <div className="text-sm leading-relaxed space-y-2 opacity-90">
          <p>
            <strong>{history.title}</strong> হলো বাংলাদেশের একটি ঐতিহাসিক স্থান
            {history.era ? ` (${history.era})` : ""}।
          </p>
          {(history.division || history.district || history.thana) && (
            <p>
              অবস্থান: {[history.division, history.district, history.thana]
                .filter(Boolean)
                .join(" → ")}
              ।
            </p>
          )}
          {descriptionText && (
            <p>
              {getExcerpt(descriptionText, 320)}
            </p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>

        <details className="group rounded-xl bg-zinc-400/10 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 list-none hover:bg-zinc-400/15 transition">
            <span className="text-sm font-medium">{history.title} কী?</span>
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm leading-relaxed border-t border-zinc-400/20 pt-3 opacity-90">
            {descriptionText ? getExcerpt(descriptionText, 280) : "এই স্থানের বিস্তারিত তথ্য এখনো যোগ করা হয়নি।"}
          </div>
        </details>

        <details className="group rounded-xl bg-zinc-400/10 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 list-none hover:bg-zinc-400/15 transition">
            <span className="text-sm font-medium">
              অন্যান্য ঐতিহাসিক স্থান কোথায় দেখব?
            </span>
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm leading-relaxed border-t border-zinc-400/20 pt-3 opacity-90">
            <Link href="/bangladesh/history" className="underline">
              ঐতিহাসিক স্থান
            </Link>{" "}
            তালিকায় ফিরে গিয়ে অন্যান্য স্থান দেখতে পারবেন।
          </div>
        </details>
      </section>
    </div>
  );
}
