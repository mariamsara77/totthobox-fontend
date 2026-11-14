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
    <div className="flex min-h-screen flex-col">
      <NavbarHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="select-none text-7xl font-bold tracking-tighter text-zinc-200 dark:text-zinc-800">
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
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              আবার চেষ্টা করুন
            </button>
          )}

          <Link
            href="/"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 shadow-sm"
          >
            হোম পেজে ফিরে যান
          </Link>
          <Link
            href="/bangla/calendar"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            ক্যালেন্ডার ও ছুটি
          </Link>
          <Link
            href="/converter/land"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            ভূমি ও পরিমাপ
          </Link>
          <Link
            href="/tools/tax-vat-calculator"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            ট্যাক্স ও ভ্যাট
          </Link>
          <Link
            href="/contact/police"
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            জরুরি হটলাইন
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
