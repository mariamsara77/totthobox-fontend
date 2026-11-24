export default function NewsHeadlinesLoading() {
  return (
    <section
      aria-label="সংবাদ শিরোনাম লোড হচ্ছে"
      aria-busy="true"
      className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6"
    >
      <div className="mb-6 animate-pulse rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-950/[0.02] sm:p-7 dark:border-zinc-800 dark:bg-zinc-400/10">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-zinc-400/10" />
          <div className="min-w-0 flex-1 space-y-3 py-1">
            <div className="h-3 w-28 rounded-full bg-zinc-400/10" />
            <div className="h-7 w-2/3 rounded-lg bg-zinc-400/10" />
            <div className="h-3 w-full max-w-md rounded-full bg-zinc-400/10" />
            <div className="h-3 w-4/5 max-w-sm rounded-full bg-zinc-400/10" />
          </div>
        </div>
      </div>

      <div className="mb-6 animate-pulse rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm shadow-zinc-950/[0.02] dark:border-zinc-800 dark:bg-zinc-400/10">
        <div className="mb-3 h-11 rounded-xl border border-zinc-200 bg-zinc-400/10 dark:border-zinc-700" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-11 rounded-xl border border-zinc-200 bg-zinc-400/10 dark:border-zinc-700" />
          ))}
        </div>
        <div className="mt-3 h-11 rounded-xl bg-zinc-400/10" />
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <div className="h-5 w-36 animate-pulse rounded-md bg-zinc-400/10" />
        <div className="h-4 w-28 animate-pulse rounded-md bg-zinc-400/10" />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <article
            key={index}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-400/10"
          >
            <div className="h-36 animate-pulse bg-zinc-400/10 sm:h-40" />
            <div className="animate-pulse p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-6 w-24 rounded-full bg-zinc-400/10" />
                <div className="h-3 w-16 rounded-full bg-zinc-400/10" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded-md bg-zinc-400/10" />
                <div className="h-4 w-5/6 rounded-md bg-zinc-400/10" />
                <div className="h-4 w-2/3 rounded-md bg-zinc-400/10" />
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="h-3 w-32 rounded-full bg-zinc-400/10" />
                <div className="h-3 w-16 rounded-full bg-zinc-400/10" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
