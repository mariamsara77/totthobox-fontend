const block = "animate-pulse rounded-lg bg-zinc-400/15 motion-reduce:animate-none";

export default function ChatLoading() {
 return <main aria-busy="true" aria-label="মেসেজ লোড হচ্ছে" className="grid min-h-[70vh] w-full grid-cols-1 overflow-hidden md:grid-cols-[300px_minmax(0,1fr)]">
  <p role="status" className="sr-only">মেসেজ লোড হচ্ছে…</p>
  <aside className="border-b border-zinc-400/15 p-4 md:border-b-0 md:border-r"><div className={block+" mb-5 h-8 w-2/3"}/><div className={block+" mb-5 h-10 w-full rounded-xl"}/>{Array.from({length:6},(_,i)=><div key={i} className="flex items-center gap-3 border-b border-zinc-400/10 py-4"><div className={block+" size-11 shrink-0 rounded-full"}/><div className="flex-1"><div className={block+" mb-2 h-4 w-2/3"}/><div className={block+" h-3 w-4/5"}/></div></div>)}</aside>
  <section className="hidden flex-col p-5 md:flex"><div className="flex items-center gap-3 border-b border-zinc-400/15 pb-4"><div className={block+" size-10 rounded-full"}/><div className={block+" h-4 w-32"}/></div><div className="flex flex-1 flex-col justify-end gap-4 py-5"><div className={block+" h-14 w-2/3 rounded-2xl"}/><div className={block+" h-14 w-1/2 self-end rounded-2xl"}/><div className={block+" h-14 w-3/5 rounded-2xl"}/></div><div className={block+" h-12 w-full rounded-xl"}/></section>
 </main>;
}
