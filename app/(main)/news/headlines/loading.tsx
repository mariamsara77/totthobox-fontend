export default function NewsHeadlinesLoading() {
  return (
    <section aria-label="সংবাদ শিরোনাম লোড হচ্ছে" aria-busy="true" className="mx-auto w-full max-w-2xl animate-pulse px-4 py-6 sm:px-6">
      <div className="mb-6 rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-zinc-400/20" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-3 w-28 rounded bg-zinc-400/20" />
            <div className="h-7 w-2/3 rounded bg-zinc-400/20" />
            <div className="h-3 w-full max-w-md rounded bg-zinc-400/20" />
          </div>
        </div>
      </div>
      <div className="mb-6 space-y-3 rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-3">
        <div className="h-11 rounded-xl bg-zinc-400/20" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="h-11 rounded-xl bg-zinc-400/20" />
          <div className="h-11 rounded-xl bg-zinc-400/20" />
          <div className="h-11 rounded-xl bg-zinc-400/20" />
          <div className="h-11 rounded-xl bg-zinc-400/20" />
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-zinc-400/25">
            <div className="h-36 bg-zinc-400/15" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-4/5 rounded bg-zinc-400/20" />
              <div className="h-4 w-2/3 rounded bg-zinc-400/20" />
              <div className="h-3 w-1/3 rounded bg-zinc-400/20" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
