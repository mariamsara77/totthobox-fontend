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
      <body className="bg-[var(--page-background)] text-[var(--page-foreground)]">
        <div className="site-page flex min-h-screen flex-col items-center justify-center px-4 py-10 text-center">
          <div className="text-7xl font-black tracking-tighter text-[var(--brand-primary)] opacity-15">
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
            className="mt-8 rounded-2xl bg-[var(--brand-primary)] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_24px_var(--brand-glow)] hover:bg-[var(--brand-primary-strong)]"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </body>
    </html>
  );
}
