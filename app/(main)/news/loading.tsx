import { Newspaper } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="mx-auto max-w-2xl space-y-8 px-4 py-6 sm:py-8"
      aria-busy="true"
      aria-label="সংবাদ লোড হচ্ছে"
    >
      <header className="space-y-2">
        <div className="flex items-center gap-2.5">
          <Newspaper className="size-7 shrink-0 opacity-35" aria-hidden="true" />
          <div className="h-7 w-44 animate-pulse rounded-lg bg-zinc-400/15 sm:h-8 sm:w-56" />
        </div>
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-zinc-400/15" />
        <div className="h-4 w-4/5 max-w-lg animate-pulse rounded bg-zinc-400/15" />
      </header>

      <div className="flex gap-2 overflow-hidden" aria-hidden="true">
        {[24, 28, 20, 24, 28, 20].map((width, index) => (
          <div
            key={index}
            style={{ width: `${width * 4}px` }}
            className="h-9 shrink-0 animate-pulse rounded-xl bg-zinc-400/15"
          />
        ))}
      </div>

      <div className="space-y-3" aria-hidden="true">
        <div className="h-11 animate-pulse rounded-xl bg-zinc-400/10" />
        <div className="flex gap-2 overflow-hidden">
          <div className="h-10 w-32 shrink-0 animate-pulse rounded-xl bg-zinc-400/15" />
          <div className="h-10 w-32 shrink-0 animate-pulse rounded-xl bg-zinc-400/15" />
          <div className="h-10 w-36 shrink-0 animate-pulse rounded-xl bg-zinc-400/15" />
        </div>
      </div>

      <div className="flex items-center justify-between" aria-hidden="true">
        <div className="h-4 w-24 animate-pulse rounded bg-zinc-400/15" />
        <div className="flex gap-2">
          <div className="h-7 w-14 animate-pulse rounded-lg bg-zinc-400/15" />
          <div className="h-7 w-16 animate-pulse rounded-lg bg-zinc-400/15" />
        </div>
      </div>

      <section className="space-y-3" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((item) => (
          <article
            key={item}
            className="rounded-2xl bg-zinc-400/10 p-4 sm:p-5"
          >
            <div className="flex items-start gap-4">
              <div className="size-20 shrink-0 animate-pulse rounded-xl bg-zinc-400/15 sm:size-24" />
              <div className="min-w-0 flex-1 space-y-3 pt-1">
                <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-400/15" />
                <div className="h-5 w-full animate-pulse rounded bg-zinc-400/15" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-400/15" />
                <div className="h-5 w-28 animate-pulse rounded-full bg-zinc-400/15" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-zinc-400/20 pt-3">
              <div className="h-3 w-24 animate-pulse rounded bg-zinc-400/15" />
              <div className="h-9 w-32 animate-pulse rounded-xl bg-zinc-400/15" />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
