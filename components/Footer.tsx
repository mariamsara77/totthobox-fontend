import Link from "next/link";
import CookieSettings from "./CookieSettings";
import { FaFacebook, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";

const links = [
  ["/about-us", "আমাদের সম্পর্কে"],
  ["/privacy-policy", "গোপনীয়তা নীতি"],
  ["/terms-of-service", "ব্যবহারের শর্তাবলী"],
  ["/contact-us", "যোগাযোগ"],
] as const;

export default function Footer() {
  return (
    <footer className="mt-4 border-t border-zinc-400/25 p-4">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
        <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="ফুটার লিংক">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl bg-zinc-400/10 p-4 text-sm hover:bg-zinc-400/25"
            >
              {label}
            </Link>
          ))}
          <CookieSettings />
        </nav>

        <div className="flex items-center gap-2">
          <a href="https://facebook.com/totthobox" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 hover:bg-zinc-400/25" aria-label="Facebook">
            <FaFacebook className="h-5 w-5" />
          </a>
          <a href="https://x.com/totthobox" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 hover:bg-zinc-400/25" aria-label="X">
            <FaXTwitter className="h-5 w-5" />
          </a>
          <a href="https://t.me/totthobox" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 hover:bg-zinc-400/25" aria-label="Telegram">
            <FaTelegramPlane className="h-5 w-5" />
          </a>
          <a href="mailto:admin@totthobox.com" className="rounded-xl border border-zinc-400/25 bg-zinc-400/10 p-4 hover:bg-zinc-400/25" aria-label="Email">
            <SiGmail className="h-5 w-5" />
          </a>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Totthobox. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="text-xs opacity-50">নির্ভরযোগ্য তথ্য ও সহজ ডিজিটাল সেবার প্রতিশ্রুতি।</p>
        </div>
      </div>
    </footer>
  );
}
