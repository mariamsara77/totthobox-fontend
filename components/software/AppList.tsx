'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchApps } from '@/lib/api';
import Link from 'next/link';

export default function AppsList({
  initialData,
  creators,
  initialSearch,
  initialPlatform,
}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [platform, setPlatform] = useState(initialPlatform);
  const [apps, setApps] = useState(initialData.data);
  const [meta, setMeta] = useState(initialData.meta);
  const [loading, setLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (platform) params.set('platform', platform);
      router.push(`/software?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, platform]);

  // When URL changes → re-fetch (or you can rely on server re-render)
  useEffect(() => {
    setApps(initialData.data);
    setMeta(initialData.meta);
  }, [initialData]);

  const loadMore = async () => {
    if (!meta.has_more || loading) return;
    setLoading(true);
    const next = await fetchApps({
      search,
      platform,
      page: meta.current_page + 1,
      per_page: 10,
    });
    setApps((prev: any) => [...prev, ...next.data]);
    setMeta(next.meta);
    setLoading(false);
  };

  return (
    <>
      {/* Search + Filter */}
      <div className="space-y-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="অ্যাপের নামে খুঁজুন..."
          className="w-full rounded-xl border px-4 py-2"
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="min-w-36 rounded-xl border px-3 py-2"
        >
          <option value="">All Platforms</option>
          <option value="Windows">Windows</option>
          <option value="Android">Android</option>
          <option value="Mac">Mac</option>
        </select>
      </div>

      {/* Results count */}
      {(search || platform) && (
        <p className="text-xs text-zinc-500">
          {meta.total}টি ফলাফল পাওয়া গেছে
        </p>
      )}

      {/* List */}
      <div className="space-y-4">
        {apps.map((app: any) => (
          <div key={app.id} className="border rounded-xl p-4 flex gap-4">
            <img
              src={app.icon_url || '/placeholder.png'}
              alt={app.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1">
              <Link href={`/software/${app.slug}`} className="font-semibold text-lg hover:underline">
                {app.name}
              </Link>
              {app.platform && (
                <span className="ml-2 text-xs border px-2 py-0.5 rounded">
                  {app.platform}
                </span>
              )}
              <p className="text-sm text-zinc-600 line-clamp-2 mt-1">
                {app.description?.replace(/<[^>]+>/g, '')}
              </p>
            </div>
          </div>
        ))}

        {apps.length === 0 && (
          <p className="text-center text-zinc-500 py-8">কোনো অ্যাপ পাওয়া যায়নি</p>
        )}
      </div>

      {/* Load more */}
      {meta.has_more && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="w-full py-3 border rounded-xl"
        >
          {loading ? 'লোড হচ্ছে...' : 'আরও দেখুন'}
        </button>
      )}
    </>
  );
}