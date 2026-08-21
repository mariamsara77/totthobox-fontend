"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  ArrowLeft,
  Eye,
  Briefcase,
  Users,
  Check,
  ChevronDown,
} from "lucide-react";
import InteractiveActions from "./InteractiveActions";

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
  date_of_birth?: string | null;
  date_of_death?: string | null;
  categories?: Category[];
  current_role?: CurrentRole | null;
  histories?: HistoryItem[];
  views_count?: number;
  like_count?: number;
  dislike_count?: number;
  has_like?: boolean;
  has_dislike?: boolean;
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
  last_active_at?: string;
};

type Props = {
  person: Person;
};

export default function PersonShowClient({ person }: Props) {
  const [showCreators, setShowCreators] = useState(false);

  const { data: creatorsData } = useSWR(
    showCreators ? `${API_BASE}/api/people/${person.id}/creators` : null,
    fetcher
  );
  const creators: Creator[] = creatorsData?.data || [];

  const reactions = {
    like_count: person.reactions?.like_count ?? person.like_count ?? 0,
    dislike_count:
      person.reactions?.dislike_count ?? person.dislike_count ?? 0,
    user_has_liked:
      person.reactions?.user_has_liked ?? person.has_like ?? false,
    user_has_disliked:
      person.reactions?.user_has_disliked ?? person.has_dislike ?? false,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-800 dark:hover:text-zinc-200">
          হোম
        </Link>
        <span>/</span>
        <Link
          href="/bangladesh/public-figure"
          className="hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          প্রোফাইল আর্কাইভ
        </Link>
        <span>/</span>
        <span className="text-zinc-800 dark:text-zinc-200 truncate">
          {person.name}
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              {person.categories?.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  {cat.name}
                </span>
              ))}
              {person.current_role && (
                <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  বর্তমানে কর্মরত
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
              {person.name}
            </h1>

            {person.current_role && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4 shrink-0" />
                {person.current_role.title}
                {person.current_role.from_year && (
                  <span className="text-zinc-400">
                    • {person.current_role.from_year} থেকে
                  </span>
                )}
              </p>
            )}

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600">
                <Eye className="w-3.5 h-3.5" />
                {person.views_count?.toLocaleString("bn-BD") || 0}
              </span>
            </div>
          </div>

          {/* Creators */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowCreators(!showCreators)}
              className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="তথ্য প্রদানকারীগণ"
            >
              <Users className="w-5 h-5" />
            </button>

            {showCreators && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowCreators(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 max-h-80 overflow-y-auto rounded-2xl border border-zinc-400/25 bg-white dark:bg-zinc-900 shadow-xl p-4 z-50 space-y-3">
                  <h3 className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                    তথ্য প্রদানকারী
                  </h3>
                  {creators.length === 0 ? (
                    <p className="text-xs text-zinc-500 text-center py-2">
                      কোনো কন্ট্রিবিউটর পাওয়া যায়নি।
                    </p>
                  ) : (
                    creators.map((c) => (
                      <div key={c.id} className="flex items-center gap-3">
                        {c.avatar_url ? (
                          <img
                            src={c.avatar_url}
                            alt={c.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-medium">
                            {c.name?.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium truncate">
                              {c.name}
                            </span>
                            {c.is_verified && (
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 truncate">
                            {c.profession || "কন্ট্রিবিউটর"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Image */}
      {person.image_url && (
        <div className="rounded-2xl overflow-hidden border border-zinc-400/25 bg-zinc-100 dark:bg-zinc-800">
          <img
            src={person.image_url}
            alt={person.name}
            className="w-full h-auto object-cover max-h-[400px]"
          />
        </div>
      )}

      {/* Bio */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
          জীবন বৃত্তান্ত
        </h2>
        {person.bio ? (
          <div
            className="prose dark:prose-invert max-w-none leading-relaxed text-zinc-600 dark:text-zinc-300"
            dangerouslySetInnerHTML={{ __html: person.bio }}
          />
        ) : (
          <p className="text-sm text-zinc-500">
            এই ব্যক্তির বিস্তারিত জীবনবৃত্তান্ত এখনো যোগ করা হয়নি।
          </p>
        )}
      </section>

      {/* Optional career list — API histories থাকলে */}
      {person.histories && person.histories.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
            কর্মজীবনের ইতিহাস
          </h2>
          <div className="space-y-2">
            {person.histories.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-400/25"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {h.is_current && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 shrink-0">
                      বর্তমান
                    </span>
                  )}
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                    {h.title}
                  </span>
                </div>
                <span className="text-xs text-zinc-500 shrink-0 ml-2">
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
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        <ArrowLeft className="w-4 h-4" />
        প্রোফাইল আর্কাইভে ফিরে যান
      </Link>

      {/* About */}
      <section className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 p-5 space-y-2">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
          {person.name} সম্পর্কে
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <strong>{person.name}</strong> হলো বাংলাদেশের একজন বিশিষ্ট ব্যক্তিত্ব।
          উপরের জীবনবৃত্তান্ত ও কর্মজীবনের ইতিহাস অনুসরণ করে বিস্তারিত জানুন।
        </p>
      </section>

      {/* FAQ */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
          প্রায়শাই জিজ্ঞাসিত প্রশ্ন
        </h2>

        <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200 list-none">
            <span>{person.name} কী?</span>
            <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400">
            উপরের “জীবন বৃত্তান্ত” সেকশনে এই ব্যক্তির পূর্ণাঙ্গ তথ্য লেখা আছে।
          </div>
        </details>

        <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200 list-none">
            <span>অন্যান্য প্রোফাইল কোথায়?</span>
            <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href="/bangladesh/public-figure"
              className="text-amber-600 hover:underline"
            >
              প্রোফাইল আর্কাইভ
            </Link>{" "}
            তালিকায় ফিরে গিয়ে অন্যান্য ব্যক্তিদের প্রোফাইল দেখতে পারবেন।
          </div>
        </details>
      </section>
    </div>
  );
}