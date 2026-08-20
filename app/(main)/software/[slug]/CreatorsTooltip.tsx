"use client";

import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import Link from "next/link";

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
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="তথ্য প্রদানকারীগণ"
      >
        <FaUser className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 z-50 rounded-2xl border border-zinc-400/25 bg-white dark:bg-zinc-700 shadow-xl p-4 space-y-4">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                তথ্য প্রদানকারী ({creators.length})
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                এই কন্টেন্ট তৈরিতে অবদান রেখেছেন
              </p>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-3">
              {creators.map((creator) => (
                <div
                  key={creator.slug}
                  className="flex items-start gap-3 p-2 rounded-xl bg-zinc-400/10"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden shrink-0">
                    {creator.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={creator.avatar_url}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-zinc-500">
                        {creator.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm truncate">
                        {creator.name}
                      </span>
                      {creator.is_verified && (
                        <BsPatchCheckFill className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 truncate">
                      {creator.profession || "কন্টেন্ট কন্ট্রিবিউটর"}
                    </p>
                    {creator.last_active && (
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        সর্বশেষ: {creator.last_active}
                      </p>
                    )}
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