"use client";
import type { ReactNode } from "react";
import Link from "next/link";

export function ToolPage({ title, description, children, related = [] }: { title: string; description: string; children: ReactNode; related?: { href: string; label: string }[] }) {
  return <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10"><header className="mb-6 space-y-2 text-center"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1><p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p></header>{children}{related.length > 0 && <nav aria-label="সম্পর্কিত টুল" className="mt-8 flex flex-wrap justify-center gap-2">{related.map((item) => <Link key={item.href} href={item.href} className="rounded-full bg-zinc-400/10 px-3 py-1.5 text-xs hover:bg-zinc-400/25">{item.label}</Link>)}</nav>}</main>;
}
export function Panel({ children }: { children: ReactNode }) { return <section className="rounded-2xl bg-zinc-400/10 p-4 sm:p-5">{children}</section>; }
