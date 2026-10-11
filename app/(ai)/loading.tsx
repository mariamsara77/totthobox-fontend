const block = "animate-pulse rounded-lg bg-zinc-400/15 motion-reduce:animate-none";

export default function AiLoading() {
 return <main aria-busy="true" aria-label="AI চ্যাট লোড হচ্ছে" className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col px-4 py-6">
  <p role="status" className="sr-only">AI চ্যাট লোড হচ্ছে…</p>
  <header className="flex items-center gap-3 border-b border-zinc-400/15 pb-4"><div className={block+" size-10 rounded-xl"}/><div className="flex-1"><div className={block+" mb-2 h-5 w-40"}/><div className={block+" h-3 w-24"}/></div><div className={block+" size-8 rounded-full"}/></header>
  <section className="flex flex-1 flex-col justify-end gap-5 py-8">{[["w-3/4","self-start"],["w-2/3","self-end"],["w-4/5","self-start"]].map(([w,pos],i)=><div key={i} className={pos+" w-full max-w-lg rounded-2xl border border-zinc-400/15 p-4"}><div className={block+" mb-2 h-3 "+w}/><div className={block+" h-3 w-4/5"}/></div>)}</section>
  <div className={block+" h-14 w-full rounded-2xl"}/>
 </main>;
}
