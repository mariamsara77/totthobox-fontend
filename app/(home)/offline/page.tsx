"use client";

import { useEffect, useState } from "react";
import { RefreshCw, WifiOff } from "lucide-react";

export default function OfflinePage() {
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      window.location.reload();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const handleRetry = () => {
    if (isReloading) return;
    setIsReloading(true);
    window.location.reload();
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-white px-4 py-8 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <section className="w-full max-w-md text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100/80 text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          <WifiOff className="size-7" aria-hidden="true" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
          আপনি অফলাইনে আছেন
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          ইন্টারনেট সংযোগ পাওয়া যাচ্ছে না। সংযোগ ফিরে এলে পেজটি স্বয়ংক্রিয়ভাবে
          আবার চেষ্টা করবে।
        </p>

        <button
          type="button"
          onClick={handleRetry}
          disabled={isReloading}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          <RefreshCw
            className={`size-4 ${isReloading ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          {isReloading ? "আবার চেষ্টা করা হচ্ছে..." : "আবার চেষ্টা করুন"}
        </button>

        <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-500">
          আগে খোলা কিছু পেজ আপনার ডিভাইসে ক্যাশ করা থাকলে সেগুলো এখনও পাওয়া যেতে পারে।
        </p>
      </section>
    </main>
  );
}
