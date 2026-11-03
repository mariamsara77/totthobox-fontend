import Link from "next/link";
import CookieSettings from "./CookieSettings";
import { FaFacebook, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="pwa-safe-bottom mt-12 border-t border-zinc-200/80 dark:border-zinc-800/80 py-8 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-3 sm:px-4">
        <nav
          className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2"
          aria-label="ফুটার লিংক"
        >
          <Link
            href="/about-us"
            className="flex min-h-[44px] items-center rounded-xl px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            আমাদের সম্পর্কে
          </Link>
          <Link
            href="/privacy-policy"
            className="flex min-h-[44px] items-center rounded-xl px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            গোপনীয়তা নীতি
          </Link>
          <Link
            href="/terms-of-service"
            className="flex min-h-[44px] items-center rounded-xl px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ব্যবহারের শর্তাবলী
          </Link>
          <Link
            href="/disclaimer"
            className="flex min-h-[44px] items-center rounded-xl px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            দায়মুক্তি (Disclaimer)
          </Link>
          <Link
            href="/contact-us"
            className="flex min-h-[44px] items-center rounded-xl px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            যোগাযোগ
          </Link>
          <div className="flex items-center min-h-[44px]">
            <CookieSettings />
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://facebook.com/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            aria-label="Facebook"
          >
            <FaFacebook aria-hidden="true" className="h-5 w-5" />
          </a>
          <a
            href="https://x.com/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            aria-label="X"
          >
            <FaXTwitter aria-hidden="true" className="h-5 w-5" />
          </a>
          <a
            href="https://t.me/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            aria-label="Telegram"
          >
            <FaTelegramPlane aria-hidden="true" className="h-5 w-5" />
          </a>
          <a
            href="mailto:admin@totthobox.com"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-2.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            aria-label="Email"
          >
            <SiGmail aria-hidden="true" className="h-5 w-5" />
          </a>
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} Totthobox. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            নির্ভরযোগ্য তথ্য ও সহজ ডিজিটাল সেবার বিশ্বস্ত মাধ্যম।
          </p>
        </div>
      </div>
    </footer>
  );
}
