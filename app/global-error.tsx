"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="bn">
      <body className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="text-7xl font-bold tracking-tighter text-zinc-200 dark:text-zinc-800">
            Error
          </div>

          <h1 className="mt-4 text-2xl font-semibold">
            অ্যাপ্লিকেশনে সমস্যা হয়েছে
          </h1>

          <p className="mt-3 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            একটি গুরুতর সমস্যা হয়েছে। পেজটি রিফ্রেশ করে আবার চেষ্টা করুন।
          </p>

          {error.digest && (
            <p className="mt-2 text-xs text-zinc-400">
              Error ID: {error.digest}
            </p>
          )}

          <button
            onClick={() => reset()}
            className="mt-8 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </body>
    </html>
  );
}
