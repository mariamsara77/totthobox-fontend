export default function NewsStoryLoading() {
  return (
    <article aria-label="সংবাদের বিস্তারিত লোড হচ্ছে" aria-busy="true" className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:py-10">
      <div className="mb-6 h-9 w-40 animate-pulse rounded-xl bg-zinc-400/10" />
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-400/10">
        <div className="h-56 animate-pulse bg-zinc-400/10 sm:h-72" />
        <div className="space-y-4 p-5 sm:p-8">
          <div className="h-6 w-28 animate-pulse rounded-full bg-zinc-400/10" />
          <div className="h-7 w-full animate-pulse rounded-lg bg-zinc-400/10" />
          <div className="h-7 w-5/6 animate-pulse rounded-lg bg-zinc-400/10" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full animate-pulse rounded-md bg-zinc-400/10" />
            <div className="h-4 w-5/6 animate-pulse rounded-md bg-zinc-400/10" />
          </div>
          <div className="h-11 w-44 animate-pulse rounded-xl bg-zinc-400/10" />
        </div>
      </div>
    </article>
  );
}
