export default function NewsDetailLoading() {
  return (
    <article
      aria-label="সংবাদের বিস্তারিত লোড হচ্ছে"
      aria-busy="true"
      className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:py-10"
    >
      <div className="mb-6 h-9 w-40 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-950/[0.02] dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-56 animate-pulse bg-zinc-100 dark:bg-zinc-800 sm:h-72" />
        <div className="p-5 sm:p-8">
          <div className="mb-4 flex animate-pulse flex-wrap items-center gap-2">
            <div className="h-6 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800/70" />
          </div>
          <div className="animate-pulse space-y-3">
            <div className="h-7 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800 sm:h-8" />
            <div className="h-7 w-11/12 rounded-lg bg-zinc-200 dark:bg-zinc-800 sm:h-8" />
            <div className="h-7 w-3/5 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 sm:h-8" />
          </div>
          <div className="mt-6 space-y-3 animate-pulse">
            <div className="h-4 w-full rounded-md bg-zinc-100 dark:bg-zinc-800/70" />
            <div className="h-4 w-full rounded-md bg-zinc-100 dark:bg-zinc-800/70" />
            <div className="h-4 w-5/6 rounded-md bg-zinc-100 dark:bg-zinc-800/70" />
          </div>
          <div className="mt-7 h-11 w-44 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>

      <div className="mt-8 animate-pulse">
        <div className="mb-4 h-5 w-40 rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="h-4 w-full rounded-md bg-zinc-100 dark:bg-zinc-800/70" />
              <div className="mt-2 h-4 w-3/4 rounded-md bg-zinc-100 dark:bg-zinc-800/70" />
              <div className="mt-4 h-3 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
