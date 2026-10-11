const block = "animate-pulse rounded-lg bg-zinc-400/15 motion-reduce:animate-none";

export default function MainLoading() {
 return <main aria-busy="true" aria-label="পৃষ্ঠা লোড হচ্ছে" className="tb-page-container tb-section mx-auto min-h-[60vh] w-full max-w-7xl">
  <p role="status" className="sr-only">পৃষ্ঠা লোড হচ্ছে…</p>
  <header className="mb-7 space-y-3"><div className={block+" h-8 w-2/3 max-w-sm sm:h-9"}/><div className={block+" h-4 w-full max-w-2xl"}/><div className={block+" h-4 w-4/5 max-w-xl"}/></header>
  <div className="mb-6 flex gap-2 overflow-hidden">{[24,20,28,22,26].map((w,i)=><div key={i} className={block+" h-9 shrink-0 rounded-full"} style={{width:w*4}}/>)}</div>
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({length:6},(_,i)=><article key={i} className="rounded-2xl border border-zinc-400/15 p-4 sm:p-5"><div className={block+" mb-4 h-36 w-full rounded-xl"}/><div className={block+" mb-3 h-5 w-4/5"}/><div className={block+" mb-2 h-3 w-full"}/><div className={block+" h-3 w-2/3"}/><div className={block+" mt-5 h-9 w-28 rounded-xl"}/></article>)}</div>
 </main>;
}
