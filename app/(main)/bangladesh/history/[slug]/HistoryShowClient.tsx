"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  ArrowLeft,
  Eye,
  Calendar,
  Users,
  Check,
  ChevronDown,
  Star,
} from "lucide-react";
import InteractiveActions from "./InteractiveActions";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://totthobox.com";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

type History = {
  id: number;
  title: string;
  slug: string;
  era?: string;
  start_year?: string | number;
  end_year?: string | number;
  is_featured?: boolean;
  description?: string;
  image_url?: string;
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

export default function HistoryShowClient({ history }: { history: History }) {
  const [showCreators, setShowCreators] = useState(false);
  const { data: creatorsData } = useSWR(
    showCreators ? `${API_BASE}/api/history-bd/${history.id}/creators` : null,
    fetcher
  );
  const creators = creatorsData?.data || [];

  const reactions = {
    like_count: history.reactions?.like_count ?? history.like_count ?? 0,
    dislike_count:
      history.reactions?.dislike_count ?? history.dislike_count ?? 0,
    user_has_liked:
      history.reactions?.user_has_liked ?? history.has_like ?? false,
    user_has_disliked:
      history.reactions?.user_has_disliked ?? history.has_dislike ?? false,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 sm:p-6">
      <nav className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/">হোম</Link>
        <span>/</span>
        <Link href="/bangladesh/history">ঐতিহাসিক স্থান</Link>
        <span>/</span>
        <span className="text-zinc-800 dark:text-zinc-200 truncate">
          {history.title}
        </span>
      </nav>

      <header className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600">
                ইতিহাস ও ঐতিহ্য
              </span>
              {history.is_featured && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-amber-500 text-white">
                  <Star className="w-3 h-3" /> Featured
                </span>
              )}
              {history.era && (
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
                  {history.era}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              {history.title}
            </h1>
            {(history.start_year || history.end_year) && (
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {history.start_year ?? "?"} – {history.end_year ?? "?"}
              </p>
            )}
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600">
              <Eye className="w-3.5 h-3.5" />
              {history.views_count?.toLocaleString("bn-BD") || 0}
            </span>
          </div>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowCreators(!showCreators)}
              className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
                  <h3 className="font-semibold text-sm">তথ্য প্রদানকারী</h3>
                  {creators.length === 0 ? (
                    <p className="text-xs text-zinc-500 text-center py-2">
                      কোনো কন্ট্রিবিউটর নেই
                    </p>
                  ) : (
                    creators.map((c: any) => (
                      <div key={c.id} className="flex items-center gap-3">
                        {c.avatar_url ? (
                          <img
                            src={c.avatar_url}
                            alt={c.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-zinc-200 flex items-center justify-center text-xs">
                            {c.name?.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium truncate">
                              {c.name}
                            </span>
                            {c.is_verified && (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                          </div>
                          <p className="text-xs text-zinc-500">
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

      {history.image_url && (
        <div className="rounded-2xl overflow-hidden border border-zinc-400/25">
          <img
            src={history.image_url}
            alt={history.title}
            className="w-full h-auto object-cover max-h-[400px]"
          />
        </div>
      )}

      {(history.era || history.start_year || history.end_year) && (
        <div className="rounded-2xl border border-zinc-400/25 bg-zinc-50 dark:bg-zinc-800/40 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {history.era && (
            <div>
              <p className="text-xs text-zinc-500 mb-1">যুগ / Era</p>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">
                {history.era}
              </p>
            </div>
          )}
          {(history.start_year || history.end_year) && (
            <div>
              <p className="text-xs text-zinc-500 mb-1">সময়কাল</p>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">
                {history.start_year ?? "?"} – {history.end_year ?? "?"}
              </p>
            </div>
          )}
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
          বিস্তারিত বিবরণ
        </h2>
        {history.description ? (
          <div
            className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300"
            dangerouslySetInnerHTML={{ __html: history.description }}
          />
        ) : (
          <p className="text-sm text-zinc-500">বিবরণ এখনো যোগ করা হয়নি।</p>
        )}
      </section>

      <InteractiveActions
        historyId={history.id}
        initialData={{
          reactions,
          title: history.title,
          slug: history.slug,
        }}
      />

      <Link
        href="/bangladesh/history"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800"
      >
        <ArrowLeft className="w-4 h-4" />
        ঐতিহাসিক স্থান তালিকায় ফিরে যান
      </Link>

      <section className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 p-5 space-y-2">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
          {history.title} সম্পর্কে
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <strong>{history.title}</strong> হলো বাংলাদেশের একটি ঐতিহাসিক স্থান
          {history.era ? ` (${history.era})` : ""}. উপরের বিবরণ অনুসরণ করে
          বিস্তারিত জানুন।
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
          প্রায়শই জিজ্ঞাসিত প্রশ্ন
        </h2>
        <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 font-medium list-none">
            <span>{history.title} কী?</span>
            <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition" />
          </summary>
          <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400">
            উপরের “বিস্তারিত বিবরণ” সেকশনে এই স্থানের পূর্ণাঙ্গ তথ্য লেখা আছে।
          </div>
        </details>
        <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 font-medium list-none">
            <span>অন্যান্য ঐতিহাসিক স্থান কোথায়?</span>
            <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition" />
          </summary>
          <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href="/bangladesh/history"
              className="text-amber-600 hover:underline"
            >
              ঐতিহাসিক স্থান
            </Link>{" "}
            তালিকায় ফিরে গিয়ে অন্যান্য স্থান দেখতে পারবেন।
          </div>
        </details>
      </section>
    </div>
  );
}