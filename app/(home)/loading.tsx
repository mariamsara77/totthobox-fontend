const block = "animate-pulse rounded-lg bg-zinc-400/15 motion-reduce:animate-none";

export default function HomeLoading() {
  return <main aria-busy="true" aria-label="হোমপেজ লোড হচ্ছে" className="mx-auto min-h-[65vh] w-full max-w-7xl px-4 py-6 sm:py-10">
    <p role="status" className="sr-only">হোমপেজ লোড হচ্ছে…</p>
    <section className="rounded-3xl border border-zinc-400/15 bg-zinc-400/5 p-5 sm:p-8">
      <div className={block + " mb-4 h-8 w-2/3 max-w-lg sm:h-10"} />
      <div className={block + " mb-2 h-4 w-full max-w-2xl"} /><div className={block + " h-4 w-4/5 max-w-xl"} />
      <div className="mt-6 flex flex-wrap gap-3"><div className={block + " h-11 w-32 rounded-xl"}/><div className={block + " h-11 w-28 rounded-xl"}/></div>
    </section>
    <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{Array.from({length:8},(_,i)=><div key={i} className="rounded-2xl border border-zinc-400/15 p-4"><div className={block+" mb-4 size-10 rounded-xl"}/><div className={block+" mb-2 h-4 w-3/4"}/><div className={block+" h-3 w-full"}/></div>)}</section>
  </main>;
}
