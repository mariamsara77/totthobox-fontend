import Link from "next/link";
import NavbarHeader from "@/components/NavbarHeader";
import Footer from "@/components/Footer";

type ErrorPageProps = {
  code?: string | number;
  title: string;
  description?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  digest?: string;
};

export default function ErrorPage({
  code = "Error",
  title,
  description = "একটি অপ্রত্যাশিত সমস্যা হয়েছে।",
  showRetry = false,
  onRetry,
  digest,
}: ErrorPageProps) {
  return (
    <div className="site-page min-h-screen flex flex-col">
      <NavbarHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="select-none text-7xl font-black tracking-tighter text-[var(--brand-primary)] opacity-15">
          {code}
        </div>

        <h1 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {description}
        </p>

        {digest && (
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
            Error ID: {digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="rounded-2xl bg-[var(--brand-primary)] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_24px_var(--brand-glow)] transition hover:bg-[var(--brand-primary-strong)]"
            >
              আবার চেষ্টা করুন
            </button>
          )}

          <Link
            href="/"
            className="rounded-2xl bg-[var(--brand-surface)] px-5 py-3 text-sm font-bold text-[var(--brand-primary-strong)] transition hover:bg-[var(--brand-primary)] hover:text-white"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
