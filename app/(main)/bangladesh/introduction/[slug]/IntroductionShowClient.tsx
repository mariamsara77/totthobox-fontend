"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import useSWR from "swr";
import { ArrowLeft, Eye, ChevronDown, Map } from "lucide-react";
import { FaUserPen } from "react-icons/fa6";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import InteractiveActions from "./InteractiveActions";
import MediaGallery from "@/components/MediaGallery";

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
  images?: { url: string; caption?: string }[];
  views_count?: number;
  reactions?: {
    like_count: number;
    dislike_count: number;
    user_has_liked: boolean;
    user_has_disliked: boolean;
  };
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

function getExcerpt(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  const candidate = value.slice(0, maxLength);
  const lastSpace = candidate.lastIndexOf(" ");
  const excerpt = lastSpace > Math.floor(maxLength * 0.7) ? candidate.slice(0, lastSpace) : candidate;
  return `${excerpt.trimEnd()}...`;
}
export default function IntroductionShowClient({ intro }: Props) {
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
    showCreators ? `${API_BASE}/api/intro-bd/${intro.id}/creators` : null,
    fetcher,
  );
  const creators: Creator[] = creatorsData?.data || [];

  const plainDescription = (intro.description || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const descriptionExcerpt =
    plainDescription.length > 320
      ? getExcerpt(plainDescription, 320)
      : plainDescription;

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
        name: "বাংলাদেশের পরিচিতি",
        item: "https://totthobox.com/bangladesh/introduction",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: intro.title,
        item: `https://totthobox.com/bangladesh/introduction/${encodeURIComponent(intro.slug)}`,
      },
    ],
  };

  const reactions = {
    like_count: intro.reactions?.like_count ?? intro.like_count ?? 0,
    dislike_count: intro.reactions?.dislike_count ?? intro.dislike_count ?? 0,
    user_has_liked: intro.reactions?.user_has_liked ?? intro.has_like ?? false,
    user_has_disliked:
      intro.reactions?.user_has_disliked ?? intro.has_dislike ?? false,
  };

  // MediaGallery - Single + Multiple support (Tourism style)
  const media =
    intro.images && intro.images.length > 0
      ? intro.images.map((img: any) => ({
          url: img.url,
          caption: img.caption || intro.title,
        }))
      : intro.image_url
        ? [{ url: intro.image_url, caption: intro.title }]
        : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
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
        <span className="truncate opacity-70">{intro.title}</span>
      </nav>

      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {intro.intro_category && (
            <span className="inline-block px-2.5 py-1 rounded-md text-xs bg-zinc-400/10">
              {intro.intro_category}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {intro.title}
          </h1>

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            বাংলাদেশের পরিচিতি · বিস্তারিত তথ্য
          </p>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-zinc-400/10">
            <Eye className="w-3.5 h-3.5" />
            {intro.views_count?.toLocaleString("bn-BD") || 0}
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

      {/* Media Gallery */}
      {media.length > 0 ? (
        <div className="rounded-2xl overflow-hidden">
          <MediaGallery media={media} />
        </div>
      ) : (
        <p className="text-sm opacity-60">কোনো ছবি নেই</p>
      )}

      {/* Description */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">বিস্তারিত বিবরণ</h2>
        {intro.description ? (
          <div
            className="prose dark:prose-invert max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: intro.description }}
          />
        ) : (
          <p className="text-sm opacity-60">
            এই তথ্যের বিস্তারিত বিবরণ এখনো যোগ করা হয়নি।
          </p>
        )}
      </section>

      {/* Like / Dislike / Share */}
      <InteractiveActions
        introId={intro.id}
        initialData={{
          reactions,
          title: intro.title,
          slug: intro.slug,
        }}
      />

      {/* Back */}
      <Link
        href="/bangladesh/introduction"
        className="inline-flex items-center gap-2 text-sm hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        বাংলাদেশের পরিচিতি তালিকায় ফিরে যান
      </Link>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* About Section (AdSense friendly) */}
      <section className="rounded-2xl bg-zinc-400/10 p-5 space-y-3">
        <h2 className="text-lg font-bold">{intro.title} সম্পর্কে</h2>
        <div className="text-sm leading-relaxed space-y-2 opacity-90">
          {intro.intro_category && (
            <p>
              <strong>{intro.title}</strong> ক্যাটাগরি: {intro.intro_category}.
            </p>
          )}
          {descriptionExcerpt && <p>{descriptionExcerpt}</p>}
          {!descriptionExcerpt && (
            <p>এই তথ্যের বিস্তারিত বিবরণ এখনো যোগ করা হয়নি।</p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>

        <details className="group rounded-xl bg-zinc-400/10 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 list-none hover:bg-zinc-400/15 transition">
            <span className="text-sm font-medium">{intro.title} কী?</span>
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm leading-relaxed border-t border-zinc-400/20 pt-3 opacity-90">
            {descriptionExcerpt ||
              "এই তথ্যের বিস্তারিত বিবরণ এখনো যোগ করা হয়নি।"}
          </div>
        </details>

        <details className="group rounded-xl bg-zinc-400/10 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 list-none hover:bg-zinc-400/15 transition">
            <span className="text-sm font-medium">
              অন্যান্য তথ্য কোথায় পাব?
            </span>
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm leading-relaxed border-t border-zinc-400/20 pt-3 opacity-90">
            <Link href="/bangladesh/introduction" className="underline">
              বাংলাদেশের পরিচিতি
            </Link>{" "}
            তালিকায় ফিরে গিয়ে অন্যান্য তথ্য দেখতে পারবেন।
          </div>
        </details>
      </section>
    </div>
  );
}
