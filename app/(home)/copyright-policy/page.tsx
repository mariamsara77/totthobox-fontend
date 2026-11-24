import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "কপিরাইট ও DMCA নীতি | Totthobox",
  description:
    "Totthobox-এ কপিরাইট অভিযোগ, অনুমতিবিহীন ব্যবহার ও takedown request জমা দেওয়ার পদ্ধতি জানুন।",
  alternates: { canonical: "https://totthobox.com/copyright-policy" },
  openGraph: {
    title: "কপিরাইট ও DMCA নীতি | Totthobox",
    description: "কপিরাইট অভিযোগ ও takedown request জমা দেওয়ার নির্দেশনা।",
    url: "https://totthobox.com/copyright-policy",
    siteName: "Totthobox",
    type: "website",
    locale: "bn_BD",
  },
  twitter: {
    card: "summary",
    title: "কপিরাইট ও DMCA নীতি | Totthobox",
    description: "কপিরাইট অভিযোগ ও takedown request জমা দেওয়ার নির্দেশনা।",
  },
};

export default function CopyrightPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:py-12">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          কপিরাইট ও DMCA নীতি
        </h1>
        <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Totthobox অন্যের কপিরাইট, ট্রেডমার্ক ও প্রযোজ্য বৌদ্ধিক সম্পত্তির অধিকারকে সম্মান করে।
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">১. অভিযোগ জমা দেওয়ার আগে</h2>
        <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          আপনি যদি কোনো কনটেন্টের অধিকারী হন বা অধিকারীর অনুমোদিত প্রতিনিধি হন
          এবং Totthobox-এ প্রকাশিত কোনো material আপনার অধিকার লঙ্ঘন করছে বলে
          মনে করেন, তাহলে নিচের তথ্যসহ লিখিত অভিযোগ পাঠান। অভিযোগে শুধু সেই
          নির্দিষ্ট URL উল্লেখ করুন; পুরো category বা unrelated content সরানোর
          অনুরোধ করবেন না।
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">২. অভিযোগে যে তথ্যগুলো দিন</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          <li>আপনার পূর্ণ নাম এবং যোগাযোগের email address।</li>
          <li>কপিরাইটযুক্ত কাজের নাম, বর্ণনা এবং সম্ভব হলে মূল প্রকাশনার URL।</li>
          <li>Totthobox-এর যে নির্দিষ্ট URL-এ অভিযোগকৃত material আছে।</li>
          <li>আপনি অধিকারী বা অনুমোদিত প্রতিনিধি—তার ব্যাখ্যা।</li>
          <li>তথ্যগুলো সত্য এবং আপনার অভিযোগ করার আইনগত অধিকার রয়েছে—এ মর্মে বিবৃতি।</li>
          <li>আপনার নাম/স্বাক্ষর (ইলেকট্রনিক স্বাক্ষর গ্রহণযোগ্য কি না, তা owner/legal reviewer নির্ধারণ করবেন)।</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">৩. অভিযোগ কীভাবে পাঠাবেন?</h2>
        <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          আপাতত অভিযোগ পাঠানোর প্রকাশিত যোগাযোগ ঠিকানা:
          {" "}
          <a href="mailto:admin@totthobox.com" className="font-semibold text-indigo-700 underline dark:text-indigo-400">
            admin@totthobox.com
          </a>
          {" "}।
          email subject-এ “Copyright / DMCA Notice” লিখুন এবং প্রয়োজনীয় তথ্য
          সংযুক্ত করুন। এই ঠিকানাটি site owner-এর পক্ষ থেকে নিয়মিত পর্যবেক্ষণ
          করা হয় কি না, প্রকাশের আগে নিশ্চিত করতে হবে।
        </p>
        <Link
          href="/contact-us"
          className="text-sm font-semibold text-indigo-700 underline underline-offset-2 dark:text-indigo-400"
        >
          বিকল্প যোগাযোগ ফর্ম
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">৪. পর্যালোচনা ও ব্যবস্থা</h2>
        <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          অভিযোগ পাওয়ার পর Totthobox অভিযোগ, URL ও প্রদত্ত তথ্য পর্যালোচনা করবে।
          প্রয়োজন হলে অতিরিক্ত তথ্য চাওয়া হতে পারে এবং যুক্তিসংগত ক্ষেত্রে
          অভিযোগকৃত material সাময়িকভাবে সীমিত, সংশোধিত বা সরানো হতে পারে।
          অভিযোগ পাওয়া মাত্রই লঙ্ঘন প্রমাণিত হয়েছে—এমন ধরে নেওয়া হয় না।
        </p>
        <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          পাল্টা-নোটিশ, পুনঃস্থাপন, repeat-infringer policy এবং নির্দিষ্ট
          jurisdiction-এর statutory deadline সম্পর্কে কোনো আইনি নিশ্চয়তা
          এখানে দেওয়া হচ্ছে না। প্রয়োজন হলে আইনজীবীর পরামর্শ নিয়ে আনুষ্ঠানিক
          DMCA process ও designated agent তথ্য প্রকাশ করতে হবে।
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">৫. ভুল বা অসৎ অভিযোগ</h2>
        <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          মিথ্যা, বিভ্রান্তিকর বা অন্যের অধিকার ক্ষুণ্ণ করার উদ্দেশ্যে অভিযোগ
          জমা দেবেন না। অভিযোগকারীর পরিচয় ও যোগাযোগের তথ্য অভিযোগ যাচাই এবং
          প্রয়োজনীয় follow-up-এর জন্য ব্যবহার হতে পারে; তা আমাদের
          <Link href="/privacy-policy" className="font-semibold text-indigo-700 underline dark:text-indigo-400"> গোপনীয়তা নীতি</Link>
          অনুযায়ী পরিচালিত হবে।
        </p>
      </section>
    </main>
  );
}
