"use client";

import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";

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

  if (!creators?.length) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 p-2 rounded-xl bg-zinc-400/10 hover:bg-zinc-400/25"
        aria-label="তথ্য প্রদানকারীগণ"
        aria-expanded={open}
      >
        <FaUser className="w-4 h-4" />
        <span className="text-sm">তথ্য প্রদানকারী</span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="বন্ধ করুন"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] z-50 rounded-2xl border border-zinc-400/25 bg-background p-4 space-y-4 shadow-xl">
            <div>
              <h3 className="font-bold">তথ্য প্রদানকারী ({creators.length})</h3>

              <p className="text-xs opacity-50 mt-1">
                এই কন্টেন্ট তৈরিতে অবদান রাখা ব্যক্তিদের তথ্য
              </p>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-3">
              {creators.map((creator) => (
                <div
                  key={creator.slug}
                  className="flex items-start gap-3 p-2 rounded-xl bg-zinc-400/10"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-400/10 overflow-hidden shrink-0">
                    {creator.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={creator.avatar_url}
                        alt={creator.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold opacity-50">
                        {creator.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm truncate">{creator.name}</span>

                      {creator.is_verified && (
                        <BsPatchCheckFill className="w-4 h-4 shrink-0 opacity-60" />
                      )}
                    </div>

                    <p className="text-xs opacity-50 truncate">
                      {creator.profession || "কন্টেন্ট কন্ট্রিবিউটর"}
                    </p>

                    {creator.last_active && (
                      <p className="text-[11px] opacity-50 mt-0.5">
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
