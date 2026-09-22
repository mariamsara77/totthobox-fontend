"use client";

import Image from "next/image";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import useSWR from "swr";
import { ArrowLeft, Eye, Briefcase, ChevronDown, Calendar } from "lucide-react";
import { FaUserPen } from "react-icons/fa6";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import InteractiveActions from "./InteractiveActions";
import MediaGallery from "@/components/MediaGallery";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Category = {
  id: number;
  name: string;
};

type CurrentRole = {
  title: string;
  from_year?: string | null;
  is_current?: boolean;
};

type HistoryItem = {
  title: string;
  is_current?: boolean;
  from_year?: string | null;
  to_year?: string | null;
};

type Person = {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  image_url?: string;
  images?: { url: string; caption?: string }[];
  date_of_birth?: string | null;
  date_of_death?: string | null;
  categories?: Category[];
  current_role?: CurrentRole | null;
  histories?: HistoryItem[];
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
  person: Person;
};

function getExcerpt(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  const candidate = value.slice(0, maxLength);
  const lastSpace = candidate.lastIndexOf(" ");
  const excerpt = lastSpace > Math.floor(maxLength * 0.7) ? candidate.slice(0, lastSpace) : candidate;
  return `${excerpt.trimEnd()}...`;
}
export default function PersonShowClient({ person }: Props) {
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
    showCreators ? `${API_BASE}/api/people/${person.id}/creators` : null,
    fetcher,
  );
  const creators: Creator[] = creatorsData?.data || [];

  const plainBio = (person.bio || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const bioExcerpt =
    plainBio.length > 320
      ? getExcerpt(plainBio, 320)
      : plainBio;

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
        name: "প্রোফাইল আর্কাইভ",
        item: "https://totthobox.com/bangladesh/public-figure",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: person.name,
        item: `https://totthobox.com/bangladesh/public-figure/${encodeURIComponent(person.slug)}`,
      },
    ],
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    ...(plainBio ? { description: plainBio } : {}),
    ...(person.image_url ? { image: person.image_url } : {}),
    ...(person.date_of_birth ? { birthDate: person.date_of_birth } : {}),
    ...(person.date_of_death ? { deathDate: person.date_of_death } : {}),
    ...(person.current_role?.title
      ? { jobTitle: person.current_role.title }
      : {}),
  };

  const reactions = {
    like_count: person.reactions?.like_count ?? 0,
    dislike_count: person.reactions?.dislike_count ?? 0,
    user_has_liked: person.reactions?.user_has_liked ?? false,
    user_has_disliked: person.reactions?.user_has_disliked ?? false,
  };

  // MediaGallery support
  const media =
    person.images && person.images.length > 0
      ? person.images.map((img: any) => ({
          url: img.url,
          caption: img.caption || person.name,
        }))
      : person.image_url
        ? [{ url: person.image_url, caption: person.name }]
        : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/" className="hover:underline">
          হোম
        </Link>
        <span>/</span>
        <Link href="/bangladesh/public-figure" className="hover:underline">
          প্রোফাইল আর্কাইভ
        </Link>
        <span>/</span>
        <span className="truncate opacity-70">{person.name}</span>
      </nav>

      {/* Header */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            {person.categories?.map((cat) => (
              <span
                key={cat.id}
                className="inline-block px-2.5 py-1 rounded-md text-xs bg-zinc-400/10"
              >
                {cat.name}
              </span>
            ))}
            {person.current_role && (
              <span className="inline-block px-2.5 py-1 rounded-md text-xs bg-green-500/15 text-green-700 dark:text-green-400">
                বর্তমানে কর্মরত
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {person.name}
          </h1>

          {person.current_role && (
            <p className="text-sm flex items-center gap-1.5 opacity-80">
              <Briefcase className="w-4 h-4 shrink-0" />
              {person.current_role.title}
              {person.current_role.from_year && (
                <span className="opacity-70">
                  • {person.current_role.from_year} থেকে
                </span>
              )}
            </p>
          )}

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-zinc-400/10">
            <Eye className="w-3.5 h-3.5" />
            {person.views_count?.toLocaleString("bn-BD") || 0}
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
                          <Image src={c.avatar_url} alt={c.name} width={48} height={48} sizes="48px" className="w-12 h-12 rounded-xl object-cover" />
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

      {/* Bio */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">জীবন বৃত্তান্ত</h2>
        {person.bio ? (
          <div
            className="prose dark:prose-invert max-w-none text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: person.bio }}
          />
        ) : (
          <p className="text-sm opacity-60">
            এই ব্যক্তির বিস্তারিত জীবনবৃত্তান্ত এখনো যোগ করা হয়নি।
          </p>
        )}
      </section>

      {/* Career History */}
      {person.histories && person.histories.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">কর্মজীবনের ইতিহাস</h2>
          <div className="space-y-2">
            {person.histories.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-400/10"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {h.is_current && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-green-500/15 text-green-700 dark:text-green-400 shrink-0">
                      বর্তমান
                    </span>
                  )}
                  <span className="text-sm font-medium truncate">
                    {h.title}
                  </span>
                </div>
                <span className="text-xs opacity-70 shrink-0 ml-2">
                  {h.from_year ?? "—"}
                  {h.to_year
                    ? ` – ${h.to_year}`
                    : h.is_current
                      ? " – বর্তমান"
                      : ""}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Like / Dislike / Share */}
      <InteractiveActions
        personId={person.id}
        initialData={{
          reactions,
          title: person.name,
          slug: person.slug,
        }}
      />

      {/* Back */}
      <Link
        href="/bangladesh/public-figure"
        className="inline-flex items-center gap-2 text-sm hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        প্রোফাইল আর্কাইভে ফিরে যান
      </Link>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, personSchema]),
        }}
      />

      {/* About */}
      <section className="rounded-2xl bg-zinc-400/10 p-5 space-y-3">
        <h2 className="text-lg font-bold">{person.name} সম্পর্কে</h2>
        <div className="text-sm leading-relaxed space-y-2 opacity-90">
          <p>
            <strong>{person.name}</strong>
            {person.current_role?.title && (
              <>
                {" "}
                বর্তমানে <strong>{person.current_role.title}</strong> পদে
                কর্মরত।
              </>
            )}
            {person.categories && person.categories.length > 0 && (
              <>
                {" "}
                প্রোফাইলটি {person.categories.map((c) => c.name).join(", ")}{" "}
                শ্রেণির তথ্যের সঙ্গে সম্পর্কিত।
              </>
            )}
          </p>
          {bioExcerpt && <p>{bioExcerpt}</p>}
          {!bioExcerpt && person.histories && person.histories.length > 0 && (
            <p>
              এই প্রোফাইলে {person.histories.length}টি কর্মজীবনের তথ্য নথিভুক্ত
              রয়েছে।
            </p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>

        <details className="group rounded-xl bg-zinc-400/10 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 list-none hover:bg-zinc-400/15 transition">
            <span className="text-sm font-medium">{person.name} কী?</span>
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm leading-relaxed border-t border-zinc-400/20 pt-3 opacity-90">
            {bioExcerpt ||
              "এই প্রোফাইলে জীবনবৃত্তান্তের বিস্তারিত তথ্য এখনো যোগ করা হয়নি।"}
          </div>
        </details>

        <details className="group rounded-xl bg-zinc-400/10 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 list-none hover:bg-zinc-400/15 transition">
            <span className="text-sm font-medium">
              অন্যান্য প্রোফাইল কোথায় দেখব?
            </span>
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm leading-relaxed border-t border-zinc-400/20 pt-3 opacity-90">
            <Link href="/bangladesh/public-figure" className="underline">
              প্রোফাইল আর্কাইভ
            </Link>{" "}
            তালিকায় ফিরে গিয়ে অন্যান্য ব্যক্তিদের প্রোফাইল দেখতে পারবেন।
          </div>
        </details>
      </section>
    </div>
  );
}
