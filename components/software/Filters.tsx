"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";

interface Props {
  initialSearch?: string;
  initialPlatform?: string;
}

export default function Filters({
  initialSearch = "",
  initialPlatform = "",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [platform, setPlatform] = useState(initialPlatform);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== initialSearch) {
        updateParams({ search });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const updateParams = (updates: { search?: string; platform?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.search !== undefined) {
      updates.search
        ? params.set("search", updates.search)
        : params.delete("search");
    }

    if (updates.platform !== undefined) {
      updates.platform
        ? params.set("platform", updates.platform)
        : params.delete("platform");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="অ্যাপের নামে খুঁজুন..."
        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={platform}
        onChange={(e) => {
          setPlatform(e.target.value);
          updateParams({ platform: e.target.value });
        }}
        className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm"
      >
        <option value="">All Platforms</option>
        <option value="Windows">Windows</option>
        <option value="Android">Android</option>
        <option value="Mac">Mac</option>
      </select>
    </div>
  );
}