'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // চাইলে এখানে এরর লজিক বা কনসোল লগ রাখতে পারেন
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <h1 className="text-6xl font-bold text-red-600">500</h1>
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-4">
                সার্ভারে একটি সমস্যা হয়েছে!
            </h2>
            <p className="text-sm text-zinc-500 mt-2 max-w-md">
                দুঃখিত, আমাদের এন্ডে কোনো টেকনিক্যাল সমস্যা দেখা দিয়েছে। দয়া করে আবার চেষ্টা করুন।
            </p>
            <div className="mt-6 flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition"
                >
                    আবার চেষ্টা করুন
                </button>
                <a
                    href="/"
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                    হোম পেজ
                </a>
            </div>
        </div>
    );
}