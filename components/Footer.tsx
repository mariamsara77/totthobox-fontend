import Link from "next/link";
import CookieSettings from "./CookieSettings";
// import { Send, Mail, Settings2 } from "lucide-react";
import { FaFacebook, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";

// Lucide-এ Facebook & Twitter আইকন না থাকায় Custom SVG Component

export default function Footer() {
  return (
    <footer className="border-t border-zinc-400/25 py-8 mt-12">
      <div className="container mx-auto px-4 flex flex-col items-center gap-6">
        {/* Navigation + Cookie Button */}
        <nav
          className="flex flex-wrap justify-center items-center gap-4 md:gap-6"
          aria-label="ফুটার লিংক"
        >
          <Link
            href="/about-us"
            className="hover:opacity-50"
          >
            আমাদের সম্পর্কে
          </Link>
          <Link
            href="/privacy-policy"
            className="hover:opacity-50"
          >
            গোপনীয়তা নীতি
          </Link>
          <Link
            href="/terms-of-service"
            className="hover:opacity-50"
          >
            ব্যবহারের শর্তাবলী
          </Link>
          <Link
            href="/contact-us"
            className="hover:opacity-50"
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
            className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-50"
            aria-label="Facebook"
          >
            <FaFacebook className="w-5 h-5" />
          </a>
          <a
            href="https://x.com/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-50"
            aria-label="X"
          >
            <FaXTwitter className="w-5 h-5" />
          </a>
          <a
            href="https://t.me/totthobox"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-50"
            aria-label="Telegram"
          >
            <FaTelegramPlane className="w-5 h-5" />
          </a>
          <a
            href="mailto:admin@totthobox.com"
            className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-zinc-800 hover:text-zinc-50"
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
