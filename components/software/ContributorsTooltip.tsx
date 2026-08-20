"use client";

import { useState } from "react";
import type { Creator } from "@/types/app-resource";

export default function ContributorsTooltip({
  creators,
}: {
  creators: Creator[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        title="তথ্য প্রদানকারী"
      >
        👥
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-full mt-2 z-50 w-72 max-h-80 overflow-y-auto rounded-xl border bg-white dark:bg-zinc-900 shadow-xl p-3 space-y-3">
            <p className="font-semibold text-sm">
              তথ্য প্রদানকারী ({creators.length})
            </p>

            {creators.length === 0 ? (
              <p className="text-xs text-zinc-500">কোনো কন্ট্রিবিউটর নেই</p>
            ) : (
              creators.map((creator) => (
                <div key={creator.id} className="flex items-center gap-3">
                  {creator.avatar_url ? (
                    <img
                      src={creator.avatar_url}
                      alt={creator.name}
                      className="size-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-9 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {creator.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {creator.profession}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}