import React from "react";
import Link from "next/link";
import { ShieldCheck, UserCheck, CalendarCheck } from "lucide-react";
import { getEditorialProfile } from "@/config/editorial";

interface AuthorReviewerBlockProps {
  category?: "general" | "tax" | "history" | "islamic" | "software";
  lastUpdated?: string;
  className?: string;
}

export default function AuthorReviewerBlock({
  category = "general",
  lastUpdated = "মার্চ ২০২৬",
  className = "",
}: AuthorReviewerBlockProps) {
  const profile = getEditorialProfile(category);

  return (
    <aside
      className={`my-8 p-5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/60 dark:bg-zinc-900/40 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 space-y-3 ${className}`}
      aria-label="সম্পাদকীয় ও তথ্য যাচাইকরণ তথ্য"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-zinc-900 dark:text-zinc-100">
              {profile.name}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {profile.role}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs">
          <CalendarCheck className="w-3.5 h-3.5 text-zinc-400" />
          <span>শেষ হালনাগাদ: {lastUpdated}</span>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
        {profile.bio}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium text-zinc-500">বিশেষজ্ঞ ক্ষেত্র:</span>
          {profile.expertise.map((item, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-zinc-200/60 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
            >
              {item}
            </span>
          ))}
        </div>

        <Link
          href="/editorial-policy"
          className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline ml-auto"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>সম্পাদকীয় নীতিমালা</span>
        </Link>
      </div>
    </aside>
  );
}
