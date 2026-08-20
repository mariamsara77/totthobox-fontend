'use client';

import { useEffect, useState } from 'react';

export default function UserAnalytics() {
  const [totalUsers, setTotalUsers] = useState<string>('113.29k');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://totthobox.com';
        const res = await fetch(`${baseUrl}/api/analytics/user-count`, {
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Network response failed');

        const data = await res.json();

        if (data.status === 'success' && data.total_users) {
          setTotalUsers(data.total_users);
        }
      } catch (error) {
        console.warn('Analytics Fetch Error (Using fallback):', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="flex items-center justify-center py-2">
      <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-5 py-2.5 shadow-xs backdrop-blur-md dark:border-emerald-800/50 dark:bg-emerald-950/30">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
        </span>

        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          প্ল্যাটফর্মটি ব্যবহার করেছেন{' '}
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
            {totalUsers}+
          </span>{' '}
          জন মানুষ
        </p>

        {loading && (
          <span className="animate-pulse text-xs italic text-zinc-400 dark:text-zinc-500">
            (লোড হচ্ছে...)
          </span>
        )}
      </div>
    </div>
  );
}