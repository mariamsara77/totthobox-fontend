import Link from "next/link";
import CookieSettings from "./CookieSettings";
// import { Send, Mail, Settings2 } from "lucide-react";
import { FaFacebook, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";

// Lucide-এ Facebook & Twitter আইকন না থাকায় Custom SVG Component

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-zinc-400/25 py-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-3 sm:px-4">
        {/* Navigation + Cookie Button */}
        <nav
          className="flex flex-wrap justify-center items-center gap-4 md:gap-6"
          aria-label="ফুটার লিংক"
        >
          <Link
            href="/about-us"
            className="rounded-xl px-2 py-1 text-sm text-zinc-600 transition-colors hover:bg-zinc-400/25 dark:text-zinc-400"
          >
            আমাদের সম্পর্কে
          </Link>
          <Link
            href="/privacy-policy"
            className="rounded-xl px-2 py-1 text-sm text-zinc-600 transition-colors hover:bg-zinc-400/25 dark:text-zinc-400"
          >
            গোপনীয়তা নীতি
          </Link>
          <Link
            href="/terms-of-service"
            className="rounded-xl px-2 py-1 text-sm text-zinc-600 transition-colors hover:bg-zinc-400/25 dark:text-zinc-400"
          >
            ব্যবহারের শর্তাবলী
          </Link>
          <Link
            href="/contact-us"
            className="rounded-xl px-2 py-1 text-sm text-zinc-600 transition-colors hover:bg-zinc-400/25 dark:text-zinc-400"
          >
            যোগাযোগ
          </Link>

          <CookieSettings />
        </nav>

        {/* Social Links */}
        <div className="flex items-center gap-2">
          <a
            href="https://facebook.com/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl p-2 text-zinc-500 transition-colors hover:bg-zinc-400/25 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            aria-label="Facebook"
          >
            <FaFacebook className="w-5 h-5" />
          </a>
          <a
            href="https://x.com/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl p-2 text-zinc-500 transition-colors hover:bg-zinc-400/25 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            aria-label="X"
          >
            <FaXTwitter className="w-5 h-5" />
          </a>
          <a
            href="https://t.me/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl p-2 text-zinc-500 transition-colors hover:bg-zinc-400/25 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            aria-label="Telegram"
          >
            <FaTelegramPlane className="w-5 h-5" />
          </a>
          <a
            href="mailto:admin@totthobox.com"
            className="rounded-xl p-2 text-zinc-500 transition-colors hover:bg-zinc-400/25 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            aria-label="Email"
          >
            <SiGmail className="w-5 h-5" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center space-y-1">
          <p className="text-sm  text-zinc-300">
            &copy; {new Date().getFullYear()} Totthobox. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-xs text-zinc-400">
            নির্ভরযোগ্য তথ্য ও সহজ ডিজিটাল সেবার প্রতিশ্রুতি।
          </p>
        </div>
      </div>
    </footer>
  );
}
