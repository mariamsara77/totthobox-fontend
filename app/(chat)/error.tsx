"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function ChatError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.warn("Chat error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex h-full w-full min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <h2 className="text-xl font-bold tracking-tight">মেসেজ লোড করা যায়নি</h2>
        <p className="text-sm opacity-60">
          সার্ভারের সাথে সংযোগ স্থাপনে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-400/15 px-4 py-2 text-xs font-semibold hover:bg-zinc-400/25"
          >
            <ArrowLeft className="size-4" />
            হোমে ফিরে যান
          </Link>
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
          >
            <RefreshCw className="size-4" />
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    </div>
  );
}
