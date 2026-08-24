'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getTracker, trackPageView, startNavigation } from '@/lib/tracker';

export default function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // একবার init
  useEffect(() => {
    getTracker().init();
  }, []);

  // Route change → Page View
  useEffect(() => {
    // ছোট delay দিয়ে দিই যাতে পেজ রেন্ডার শেষ হয়, তারপর ট্র্যাক হয়
    const t = setTimeout(() => {
      trackPageView(pathname);
    }, 120);

    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  // Internal link click → navigation start
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      if (
        anchor.href &&
        anchor.origin === window.location.origin &&
        !anchor.target &&
        !anchor.hasAttribute('download') &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        startNavigation();
      }
    };

    document.addEventListener('click', onClick, { capture: true, passive: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  // Browser Back / Forward
  useEffect(() => {
    const onPop = () => startNavigation();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return null;
}