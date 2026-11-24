"use client";

import { useState } from "react";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import { ArrowRight } from "lucide-react";

type Creator = {
  name: string;
  slug: string;
  avatar_url?: string;
  profession?: string;
  is_verified?: boolean;
  last_active?: string;
};

export default function CreatorsTooltip({ creators }: { creators: Creator[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-zinc-400/25"
        aria-label="তথ্য প্রদানকারীগণ"
      >
        <FaUser className="size-4" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Tooltip Card */}
          <div className="absolute right-0 top-full mt-2 w-80 z-50 rounded-2xl bg-zinc-200 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-800 shadow-xl p-4 space-y-4">
            {/* Header */}
            <div className="border-b border-zinc-400/25 pb-2">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                তথ্য প্রদানকারী ({creators.length})
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                এই কন্টেন্ট তৈরিতে অবদান রেখেছেন
              </p>
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {creators.map((creator) => (
                <div
                  key={creator.slug}
                  className="p-3 rounded-xl bg-zinc-400/10 space-y-2"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden shrink-0 flex items-center justify-center text-zinc-700 dark:text-zinc-200 font-bold text-sm">
                      {creator.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={creator.avatar_url}
                          alt={creator.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        creator.name.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {creator.name}
                        </span>
                        {creator.is_verified && (
                          <BsPatchCheckFill className="w-4 h-4 shrink-0 text-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {creator.profession || "কন্টেন্ট কন্ট্রিবিউটর"}
                      </p>
                    </div>
                  </div>

                  {/* Profile Link */}
                  <div className="flex items-center justify-between w-full text-xs border-t border-zinc-400/25 pt-2">
                    {creator.last_active && (
                      <p className="text-xs opacity-50">
                        সর্বশেষ: {creator.last_active}
                      </p>
                    )}
                    <Link
                      href={`/users/${creator.slug}`}
                      className="flex gap-4 items-center hover:bg-zinc-400/25 px-2 py-1 rounded"
                    >
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
