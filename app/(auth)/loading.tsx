const block = "animate-pulse rounded-lg bg-zinc-400/15 motion-reduce:animate-none";

export default function AuthLoading() {
 return <main aria-busy="true" aria-label="ফর্ম লোড হচ্ছে" className="mx-auto flex min-h-[65vh] w-full max-w-lg items-center px-4 py-8">
  <p role="status" className="sr-only">ফর্ম লোড হচ্ছে…</p>
  <section className="w-full rounded-2xl border border-zinc-400/15 bg-zinc-400/5 p-6 sm:p-8">
   <div className={block+" mx-auto mb-5 size-12 rounded-2xl"}/><div className={block+" mx-auto mb-3 h-7 w-2/3"}/><div className={block+" mx-auto mb-8 h-4 w-4/5"}/>
   <div className="space-y-5">{[0,1,2].map(i=><div key={i}><div className={block+" mb-2 h-3 w-24"}/><div className={block+" h-12 w-full rounded-xl"}/></div>)}</div>
   <div className={block+" mt-6 h-12 w-full rounded-xl"}/><div className={block+" mx-auto mt-5 h-4 w-2/3"}/>
  </section>
 </main>;
}
