import React from "react";
import Link from "next/link";
import { ShieldCheck, UserCheck, CalendarCheck } from "lucide-react";
import { getEditorialProfile } from "@/config/editorial";

interface AuthorReviewerBlockProps {
  category?: "general" | "tax" | "history" | "islamic" | "software";
  lastUpdated?: string;
  reviewerName?: string;
  reviewerRole?: string;
  sources?: {
    name: string;
    url: string;
    note?: string;
  }[];
  className?: string;
}

export default function AuthorReviewerBlock({
  category = "general",
  lastUpdated,
  reviewerName,
  reviewerRole,
  sources,
  className = "",
}: AuthorReviewerBlockProps) {
  const profile = getEditorialProfile(category);

  return (
    <aside
      className={`my-8 space-y-3 rounded-2xl border border-zinc-200/90 bg-zinc-50/60 p-5 text-xs text-zinc-700 dark:border-zinc-800/90 dark:bg-zinc-900/40 dark:text-zinc-300 sm:text-sm ${className}`}
      aria-label="লেখক ও সম্পাদকীয় তথ্য"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/70 pb-3 dark:border-zinc-800/70">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="size-4" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-zinc-900 dark:text-zinc-100">
              লেখক: {profile.name}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {profile.role}
            </p>
          </div>
        </div>

        {lastUpdated && (
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <CalendarCheck className="size-3.5 text-zinc-400" aria-hidden="true" />
            <span>শেষ হালনাগাদ: {lastUpdated}</span>
          </div>
        )}
      </div>

      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
        {profile.bio}
      </p>

      {sources && sources.length > 0 && (
        <section className="border-t border-zinc-200/70 pt-3 dark:border-zinc-800/70">
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">
            তথ্যসূত্র
          </h3>
          <ul className="mt-2 space-y-1.5">
            {sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-600 dark:text-indigo-400"
                >
                  {source.name}
                </a>
                {source.note && (
                  <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {source.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            এগুলো সাধারণ রেফারেন্স; নির্দিষ্ট দাবি বা হাদিসের জন্য মূল নথি/বর্ণনা আলাদাভাবে যাচাই করুন।
          </p>
        </section>
      )}

      {reviewerName && (
        <div className="border-t border-zinc-200/70 pt-3 dark:border-zinc-800/70">
          <p className="font-semibold text-zinc-800 dark:text-zinc-200">
            পর্যালোচক: {reviewerName}
          </p>
          {reviewerRole && (
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {reviewerRole}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium text-zinc-500">বিষয়:</span>
          {profile.expertise.map((item) => (
            <span
              key={item}
              className="rounded-md bg-zinc-200/60 px-2 py-0.5 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300"
            >
              {item}
            </span>
          ))}
        </div>

        <Link
          href="/editorial-policy"
          className="ml-auto inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
        >
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          <span>সম্পাদকীয় নীতিমালা</span>
        </Link>
      </div>
    </aside>
  );
}
