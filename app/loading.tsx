export default function Loading() {
  return (
    <main
      className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-8"
      aria-busy="true"
      aria-describedby="page-loading-status"
    >
      <p id="page-loading-status" role="status" className="sr-only">
        পৃষ্ঠা লোড হচ্ছে…
      </p>

      <div className="animate-pulse space-y-6 motion-reduce:animate-none">
        <div className="mx-auto h-8 w-2/3 max-w-md rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="mx-auto h-4 w-full max-w-xl rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="min-h-28 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900"
            >
              <div className="mb-4 h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="mt-2 h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
