import Link from "next/link";
import CookieSettings from "./CookieSettings";
import { FaFacebook, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import BrandIcon from "./BrandIcon";

export default function Footer() {
  return (
    <footer className="pwa-safe-bottom mt-14 border-t border-[var(--brand-border)] bg-transparent py-12 sm:mt-18">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2" aria-label="Totthobox হোম">
          <span className="brand-mark size-11 rounded-[1.1rem] transition duration-200 group-hover:-translate-y-0.5">
            <BrandIcon className="size-6" />
          </span>
          <span className="brand-wordmark text-base font-black tracking-[-0.02em]">Totthobox</span>
        </Link>

        <p className="mt-4 max-w-xl text-center text-xs leading-6 text-zinc-500 dark:text-zinc-400 sm:text-sm">
          প্রয়োজনীয় তথ্য, জ্ঞান ও ডিজিটাল টুলসকে আরও সহজ, দ্রুত এবং ব্যবহারবান্ধব করার একটি সমন্বিত প্ল্যাটফর্ম।
        </p>

        <nav
          className="mt-7 flex flex-wrap justify-center gap-1.5"
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
              className="rounded-full border border-transparent px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:border-[var(--brand-border)] hover:bg-[var(--brand-surface)] hover:text-[var(--brand-primary-strong)] dark:text-zinc-400 dark:hover:text-zinc-100 sm:text-sm"
            >
              {label}
            </Link>
          ))}
          <CookieSettings />
        </nav>

        <div className="my-7 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-[var(--brand-border)] to-transparent" />

        <div className="flex items-center gap-1">
          <a
            href="https://facebook.com/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-icon-button flex size-10 items-center justify-center rounded-2xl"
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
