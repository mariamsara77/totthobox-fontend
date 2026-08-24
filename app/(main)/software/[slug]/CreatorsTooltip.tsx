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
        className="p-2 rounded-lg hover:bg-zinc-400/10-colors"
        aria-label="তথ্য প্রদানকারীগণ"
      >
        <FaUser className="w-5 h-5 " />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 z-50 rounded-2xl border border-zinc-400/25 bg-zinc-950 bg-zinc-700  p-4 space-y-4">
            <div>
              <h3 className="font-bold text-zinc-50 text-zinc-100">
                তথ্য প্রদানকারী ({creators.length})
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                এই কন্টেন্ট তৈরিতে অবদান রেখেছেন
              </p>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-4">
              {creators.map((creator) => (
                <div
                  key={creator.slug}
                  className="flex items-start gap-4 p-2 rounded-xl bg-zinc-800/80"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-400/10 overflow-hidden shrink-0">
                    {creator.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={creator.avatar_url}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-zinc-400">
                        {creator.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className=" text-sm truncate">
                        {creator.name}
                      </span>
                      {creator.is_verified && (
                        <BsPatchCheckFill className="w-4 h-4 text-zinc-300 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate">
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
