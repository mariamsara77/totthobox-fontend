import Link from "next/link";
import CookieSettings from "./CookieSettings";
import { FaFacebook, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import BrandIcon from "./BrandIcon";

export default function Footer() {
  return (
    <footer className="pwa-safe-bottom mt-16 border-t border-white/60 bg-white/35 py-10 backdrop-blur-xl dark:border-white/10 dark:bg-black/10 sm:mt-20">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2" aria-label="Totthobox হোম">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-[var(--brand-surface)] text-[var(--brand-primary-strong)] ring-1 ring-[var(--brand-border)] transition group-hover:scale-105">
            <BrandIcon className="size-6" />
          </span>
          <span className="text-base font-bold tracking-tight">Totthobox</span>
        </Link>

        <p className="mt-3 max-w-lg text-center text-xs leading-6 text-zinc-500 dark:text-zinc-400 sm:text-sm">
          প্রয়োজনীয় তথ্য, জ্ঞান ও ডিজিটাল টুলসকে আরও সহজ, দ্রুত এবং ব্যবহারবান্ধব করার একটি সমন্বিত প্ল্যাটফর্ম।
        </p>

        <nav
          className="mt-6 flex flex-wrap justify-center gap-x-2 gap-y-2"
          aria-label="ফুটার লিংক"
        >
          {[
            ["/about-us", "আমাদের সম্পর্কে"],
            ["/privacy-policy", "গোপনীয়তা নীতি"],
            ["/terms-of-service", "ব্যবহারের শর্তাবলী"],
            ["/contact-us", "যোগাযোগ"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-[var(--brand-surface)] hover:text-[var(--brand-primary-strong)] dark:text-zinc-400 dark:hover:text-zinc-100 sm:text-sm"
            >
              {label}
            </Link>
          ))}
          <CookieSettings />
        </nav>

        <div className="my-6 h-px w-full max-w-xl bg-gradient-to-r from-transparent via-[var(--brand-border)] to-transparent" />

        <div className="flex items-center gap-1">
          <a
            href="https://facebook.com/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-10 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-[var(--brand-surface)] hover:text-[var(--brand-primary-strong)] dark:text-zinc-400"
            aria-label="Facebook"
          >
            <FaFacebook className="size-5" />
          </a>
          <a
            href="https://x.com/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-10 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-[var(--brand-surface)] hover:text-[var(--brand-primary-strong)] dark:text-zinc-400"
            aria-label="X"
          >
            <FaXTwitter className="size-5" />
          </a>
          <a
            href="https://t.me/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-10 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-[var(--brand-surface)] hover:text-[var(--brand-primary-strong)] dark:text-zinc-400"
            aria-label="Telegram"
          >
            <FaTelegramPlane className="size-5" />
          </a>
          <a
            href="mailto:admin@totthobox.com"
            className="flex size-10 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-[var(--brand-surface)] hover:text-[var(--brand-primary-strong)] dark:text-zinc-400"
            aria-label="Email"
          >
            <SiGmail className="size-5" />
          </a>
        </div>

        <div className="mt-5 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} Totthobox. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">
            নির্ভরযোগ্য তথ্য ও সহজ ডিজিটাল সেবার প্রতিশ্রুতি।
          </p>
        </div>
      </div>
    </footer>
  );
}
