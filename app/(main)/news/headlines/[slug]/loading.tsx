export default function NewsSourceOrLegacyLoading() {
  return (
    <section aria-label="সংবাদ শিরোনাম লোড হচ্ছে" aria-busy="true" className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-6 animate-pulse rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-3 w-28 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-7 w-2/3 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-full max-w-md rounded-full bg-zinc-100 dark:bg-zinc-800/70" />
          </div>
        </div>
      </div>
      <div className="mb-6 animate-pulse rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-3 h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-11 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
        </div>
        <div className="mt-3 h-11 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <article key={index} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="h-36 animate-pulse bg-zinc-100 dark:bg-zinc-800 sm:h-40" />
            <div className="animate-pulse space-y-3 p-4">
              <div className="h-6 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-full rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-5/6 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-28 rounded-full bg-zinc-100 dark:bg-zinc-800/70" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
