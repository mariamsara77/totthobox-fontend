"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

const groups: Array<{ matches: string[]; title: string; links: RelatedLink[] }> = [
  {
    matches: ["/bangla/calendar", "/bangla/holiday"],
    title: "আরও দেখুন",
    links: [
      { href: "/bangla/calendar", label: "বাংলা ক্যালেন্ডার", description: "বাংলা ও ইংরেজি তারিখ দেখুন।" },
      { href: "/bangla/holiday", label: "ছুটির তালিকা", description: "সরকারি ও বিশেষ ছুটির তথ্য।" },
      { href: "/tools/age-calculator", label: "বয়স ক্যালকুলেটর", description: "জন্মতারিখ থেকে বয়স হিসাব করুন।" },
      { href: "/converter/time", label: "সময় কনভার্টার", description: "সময় ও এককের রূপান্তর করুন।" },
    ],
  },
  {
    matches: ["/bangladesh/"],
    title: "বাংলাদেশ সম্পর্কিত আরও তথ্য",
    links: [
      { href: "/bangladesh/introduction", label: "বাংলাদেশ পরিচিতি", description: "দেশের মৌলিক তথ্য ও পরিচয়।" },
      { href: "/bangladesh/history", label: "বাংলাদেশের ইতিহাস", description: "ইতিহাসের গুরুত্বপূর্ণ অধ্যায়।" },
      { href: "/bangladesh/tourism", label: "পর্যটন", description: "দর্শনীয় স্থান ও ভ্রমণ তথ্য।" },
      { href: "/bangladesh/establishment", label: "প্রতিষ্ঠান", description: "গুরুত্বপূর্ণ প্রতিষ্ঠান সম্পর্কে তথ্য।" },
      { href: "/bangladesh/public-figure", label: "গুণীজন", description: "বাংলাদেশের বিশিষ্ট ব্যক্তিদের তথ্য।" },
    ],
  },
  {
    matches: ["/international/"],
    title: "আন্তর্জাতিক তথ্য",
    links: [
      { href: "/international/all-country", label: "সব দেশ", description: "দেশ, রাজধানী ও মুদ্রার তথ্য।" },
      { href: "/bangladesh/introduction", label: "বাংলাদেশ", description: "বাংলাদেশের পরিচিতি ও তথ্য।" },
      { href: "/bangla/calendar", label: "বাংলা ক্যালেন্ডার", description: "তারিখ ও বিশেষ দিবস দেখুন।" },
    ],
  },
  {
    matches: ["/islam/"],
    title: "ইসলামিক কনটেন্টে আরও দেখুন",
    links: [
      { href: "/islam/basic", label: "ইসলামের মৌলিক জ্ঞান", description: "ইসলামের মৌলিক বিষয়গুলো জানুন।" },
      { href: "/islam/dowan", label: "দোয়া সংগ্রহ", description: "দৈনন্দিন প্রয়োজনীয় দোয়া।" },
    ],
  },
  {
    matches: ["/converter/"],
    title: "আরও কনভার্টার",
    links: [
      { href: "/converter/currency", label: "মুদ্রা কনভার্টার", description: "বিভিন্ন মুদ্রার রূপান্তর করুন।" },
      { href: "/converter/length", label: "দৈর্ঘ্য কনভার্টার", description: "দৈর্ঘ্যের একক রূপান্তর করুন।" },
      { href: "/converter/weight", label: "ওজন কনভার্টার", description: "ওজনের একক রূপান্তর করুন।" },
      { href: "/converter/temperature", label: "তাপমাত্রা কনভার্টার", description: "তাপমাত্রার একক রূপান্তর করুন।" },
    ],
  },
  {
    matches: ["/tools/", "/pdf-editor"],
    title: "আরও ইউটিলিটি টুলস",
    links: [
      { href: "/tools/age-calculator", label: "বয়স ক্যালকুলেটর", description: "বয়স ও সময়ের হিসাব করুন।" },
      { href: "/tools/percentage-calculator", label: "শতকরা ক্যালকুলেটর", description: "শতকরা হিসাব সহজে করুন।" },
      { href: "/tools/image-resizer", label: "Image Resizer", description: "ছবির আকার পরিবর্তন করুন।" },
      { href: "/tools/qrcode-generator", label: "QR Code Generator", description: "সহজে QR কোড তৈরি করুন।" },
    ],
  },
  {
    matches: ["/software/"],
    title: "আরও সফটওয়্যার তথ্য",
    links: [
      { href: "/software/all", label: "সব সফটওয়্যার", description: "বিভিন্ন প্ল্যাটফর্মের সফটওয়্যার।" },
      { href: "/services", label: "সব সেবা", description: "Totthobox-এর অন্যান্য ডিজিটাল সেবা দেখুন।" },
      { href: "/pdf-editor", label: "PDF Editor", description: "ব্রাউজারেই PDF সম্পাদনার টুল ব্যবহার করুন।" },
    ],
  },
  {
    matches: ["/contact/"],
    title: "জরুরি সেবায় আরও দেখুন",
    links: [
      { href: "/contact/police", label: "পুলিশ", description: "পুলিশের জরুরি যোগাযোগের তথ্য।" },
      { href: "/contact/fire-service", label: "ফায়ার সার্ভিস", description: "ফায়ার সার্ভিসের জরুরি তথ্য।" },
      { href: "/contact/ambulance", label: "অ্যাম্বুলেন্স", description: "অ্যাম্বুলেন্স ও জরুরি সহায়তা।" },
      { href: "/contact-us", label: "যোগাযোগ", description: "Totthobox-এর সাথে যোগাযোগ করুন।" },
    ],
  },
  {
    matches: ["/signs/"],
    title: "আরও সংকেত",
    links: [
      { href: "/signs/all", label: "সব সংকেত", description: "বিভিন্ন ধরনের সংকেত ও চিহ্ন।" },
      { href: "/contact/police", label: "জরুরি সেবা", description: "জরুরি যোগাযোগের তথ্য।" },
    ],
  },
];

export default function RelatedLinks() {
  const pathname = usePathname();
  const group = groups.find(({ matches }) =>
    matches.some((match) => pathname === match || pathname.startsWith(match + "/")),
  );

  if (!group) return null;

  const links = group.links.filter((link) => link.href !== pathname).slice(0, 5);
  if (!links.length) return null;

  return (
    <section className="mx-auto mt-10 max-w-3xl px-4" aria-labelledby="related-links-heading">
      <div className="border-t border-zinc-400/25 pt-6">
        <h2 id="related-links-heading" className="text-xl font-bold">
          {group.title}
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl bg-zinc-400/10 p-4 transition-colors hover:bg-zinc-400/25"
            >
              <h3 className="font-semibold">{link.label}</h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
