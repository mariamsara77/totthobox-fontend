export default function Loading() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="animate-pulse rounded-3xl bg-zinc-50 p-8 dark:bg-zinc-900">
        <div className="h-8 w-64 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-4 h-4 max-w-2xl rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 h-4 max-w-xl rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl bg-zinc-50 dark:bg-zinc-900"
          />
        ))}
      </div>
    </section>
  );
}
