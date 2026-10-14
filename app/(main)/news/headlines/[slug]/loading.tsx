export default function NewsDetailLoading() {
  return (
    <article aria-label="সংবাদের বিস্তারিত লোড হচ্ছে" aria-busy="true" className="mx-auto w-full max-w-2xl animate-pulse px-4 py-6 sm:px-6 lg:py-10">
      <div className="mb-6 h-9 w-40 rounded-lg bg-zinc-400/15" />
      <div className="overflow-hidden rounded-2xl border border-zinc-400/25">
        <div className="h-56 bg-zinc-400/15 sm:h-72" />
        <div className="space-y-4 p-5 sm:p-8">
          <div className="h-6 w-32 rounded-full bg-zinc-400/20" />
          <div className="h-8 w-full rounded bg-zinc-400/20" />
          <div className="h-8 w-4/5 rounded bg-zinc-400/20" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full rounded bg-zinc-400/15" />
            <div className="h-4 w-5/6 rounded bg-zinc-400/15" />
          </div>
          <div className="h-11 w-44 rounded-xl bg-zinc-400/20" />
        </div>
      </div>
    </article>
  );
}
