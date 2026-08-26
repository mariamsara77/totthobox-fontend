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
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
            <div className="space-y-4">
                <h1 className="text-6xl font-bold">500</h1>
                <h2 className="text-xl font-semibold">
                    সার্ভারে একটি সমস্যা হয়েছে!
                </h2>
                <p className="opacity-50 max-w-md mx-auto">
                    দুঃখিত, আমাদের এন্ডে কোনো টেকনিক্যাল সমস্যা দেখা দিয়েছে। দয়া করে আবার চেষ্টা করুন।
                </p>
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => reset()}
                        className="p-4 rounded-xl border border-zinc-400/25 bg-zinc-400/25 hover:bg-zinc-400/50"
                    >
                        আবার চেষ্টা করুন
                    </button>
                    <a
                        href="/"
                        className="p-4 rounded-xl border border-zinc-400/25 bg-zinc-400/10 hover:bg-zinc-400/25"
                    >
                        হোম পেজ
                    </a>
                </div>
            </div>
        </div>
    );
}