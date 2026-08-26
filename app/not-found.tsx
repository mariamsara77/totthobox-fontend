export const dynamic = 'force-dynamic';

import NavbarHeader from "@/components/NavbarHeader";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ১. নেভবার কানেক্ট */}
      <NavbarHeader />

      {/* ২. মূল 404 কন্টেন্ট */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <h1 className="text-6xl font-bold text-zinc-800 dark:text-zinc-100">404</h1>
        <h2 className="text-xl font-semibold text-zinc-600 dark:text-zinc-300 mt-4">
          পেজটি খুঁজে পাওয়া যায়নি
        </h2>
        <p className="text-sm text-zinc-500 mt-2 max-w-md">
          আপনি যে পেজটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা লিংকটি ভুল রয়েছে।
        </p>
        <Link 
          href="/" 
          className="mt-6 px-4 py-2 rounded-xl text-sm font-medium bg-zinc-400/25 text-white bg-zinc-400/25 transition"
        >
          হোম পেজে ফিরে যান
        </Link>
      </main>

      {/* ৩. ফুটার কানেক্ট */}
      <Footer />
    </div>
  );
}