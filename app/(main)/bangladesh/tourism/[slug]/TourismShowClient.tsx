"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import {
  ArrowLeft,
  Eye,
  MapPin,
  Users,
  Check,
  ChevronDown,
} from "lucide-react";
import InteractiveActions from "./InteractiveActions";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Tourism = {
  id: number;
  title: string;
  slug: string;
  tourism_type?: string;
  type_label?: string;
  description?: string;
  image_url?: string;
  map?: string;
  thana?: string;
  district?: string;
  division?: string;
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
  tourism: Tourism;
};

export default function TourismShowClient({ tourism }: Props) {
  const [showCreators, setShowCreators] = useState(false);

  const { data: creatorsData } = useSWR(
    showCreators ? `${API_BASE}/api/tourism-bd/${tourism.id}/creators` : null,
    fetcher,
  );
  const creators: Creator[] = creatorsData?.data || [];

  const reactions = {
    like_count: tourism.reactions?.like_count ?? tourism.like_count ?? 0,
    dislike_count:
      tourism.reactions?.dislike_count ?? tourism.dislike_count ?? 0,
    user_has_liked:
      tourism.reactions?.user_has_liked ?? tourism.has_like ?? false,
    user_has_disliked:
      tourism.reactions?.user_has_disliked ?? tourism.has_dislike ?? false,
  };

  const location = [tourism.thana, tourism.district, tourism.division]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 sm:p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-400">
        <Link href="/" className="hover:text-zinc-50 hover:text-zinc-50">
          হোম
        </Link>
        <span>/</span>
        <Link
          href="/bangladesh/tourism"
          className="hover:text-zinc-50 hover:text-zinc-50"
        >
          পর্যটন কেন্দ্র
        </Link>
        <span>/</span>
        <span className="text-zinc-50 text-zinc-200 truncate">
          {tourism.title}
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {tourism.type_label && (
              <span className="inline-block px-2.5 py-0.5 rounded-md text-xs  bg-zinc-400/10 ">
                {tourism.type_label}
              </span>
            )}

            <h1 className="text-2xl  font-black tracking-tight text-zinc-50 dark:text-white">
              {tourism.title}
            </h1>

            {location && (
              <p className="text-sm text-zinc-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                {location}
              </p>
            )}

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-zinc-400/10 text-zinc-300">
                <Eye className="w-3.5 h-3.5" />
                {tourism.views_count?.toLocaleString("bn-BD") || 0}
              </span>
            </div>
          </div>

          {/* Creators */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowCreators(!showCreators)}
              className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:bg-zinc-800"
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
                <div className="absolute right-0 top-full mt-2 w-80 max-h-80 overflow-y-auto rounded-2xl border border-zinc-400/25 bg-zinc-950 bg-zinc-900  p-4 z-50 space-y-4">
                  <h3 className=" text-sm text-zinc-50 text-zinc-200">
                    তথ্য প্রদানকারী
                  </h3>
                  {creators.length === 0 ? (
                    <p className="text-xs text-zinc-400 text-center py-2">
                      কোনো কন্ট্রিবিউটর পাওয়া যায়নি।
                    </p>
                  ) : (
                    creators.map((c) => (
                      <div key={c.id} className="flex items-center gap-4">
                        {c.avatar_url ? (
                          <img
                            src={c.avatar_url}
                            alt={c.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-zinc-400/10 flex items-center justify-center text-xs ">
                            {c.name?.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-sm  truncate">
                              {c.name}
                            </span>
                            {c.is_verified && (
                              <Check className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 truncate">
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
      {tourism.image_url && (
        <div className="rounded-2xl overflow-hidden border border-zinc-400/25 bg-zinc-400/10">
          <img
            src={tourism.image_url}
            alt={tourism.title}
            className="w-full h-auto object-cover max-h-[400px]"
          />
        </div>
      )}

      {/* Description */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-50 text-zinc-200">
          বিস্তারিত বিবরণ
        </h2>
        {tourism.description ? (
          <div
            className="prose dark:prose-invert max-w-none leading-relaxed "
            dangerouslySetInnerHTML={{ __html: tourism.description }}
          />
        ) : (
          <p className="text-sm text-zinc-400">
            এই স্থানের বিস্তারিত বিবরণ এখনো যোগ করা হয়নি।
          </p>
        )}
      </section>

      {/* Like / Dislike / Share */}
      <InteractiveActions
        tourismId={tourism.id}
        initialData={{
          reactions,
          title: tourism.title,
          slug: tourism.slug,
        }}
      />

      {/* Back */}
      <Link
        href="/bangladesh/tourism"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-50 hover:text-zinc-50"
      >
        <ArrowLeft className="w-4 h-4" />
        পর্যটন কেন্দ্র তালিকায় ফিরে যান
      </Link>

      {/* About */}
      <section className="rounded-2xl bg-zinc-400/10/40 p-4 space-y-2">
        <h2 className="text-lg font-bold text-zinc-50 text-zinc-200">
          {tourism.title} সম্পর্কে
        </h2>
        <p className="text-sm  leading-relaxed">
          <strong>{tourism.title}</strong> হলো বাংলাদেশের একটি দর্শনীয় স্থান।
          {tourism.type_label && (
            <>
              {" "}
              এটি <strong>{tourism.type_label}</strong> ধরনের পর্যটন কেন্দ্র।
            </>
          )}{" "}
          উপরের বিবরণ অনুসরণ করে বিস্তারিত জানুন।
        </p>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-50 text-zinc-200">
          প্রায়শই জিজ্ঞাসিত প্রশ্ন
        </h2>

        <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-2  text-zinc-50 text-zinc-200 list-none">
            <span>{tourism.title} কী?</span>
            <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm ">
            উপরের “বিস্তারিত বিবরণ” সেকশনে এই স্থানের পূর্ণাঙ্গ তথ্য লেখা আছে।
          </div>
        </details>

        <details className="group rounded-xl border border-zinc-400/25 overflow-hidden">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-2  text-zinc-50 text-zinc-200 list-none">
            <span>অন্যান্য পর্যটন কেন্দ্র কোথায়?</span>
            <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition shrink-0" />
          </summary>
          <div className="px-4 pb-4 text-sm ">
            <Link
              href="/bangladesh/tourism"
              className="text-amber-600 hover:underline"
            >
              পর্যটন কেন্দ্র
            </Link>{" "}
            তালিকায় ফিরে গিয়ে অন্যান্য স্থান দেখতে পারবেন।
          </div>
        </details>
      </section>
    </div>
  );
}
