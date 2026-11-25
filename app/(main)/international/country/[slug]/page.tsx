import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllCountries,
  getCountry,
  generateOverview,
  generateFaqs,
  formatPopulation,
  formatArea,
} from "@/lib/countries";
import { FlagImage } from "@/components/international/FlagImage";
import { CoatOfArms } from "@/components/international/CoatOfArms";
import { FaHome } from "react-icons/fa";
import { notFound } from "next/navigation";
import { AiFillDollarCircle } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";

export const revalidate = 86400;

const CONTINENT_BN: Record<string, string> = {
  Asia: "এশিয়া",
  Europe: "ইউরোপ",
  Africa: "আফ্রিকা",
  "North America": "উত্তর আমেরিকা",
  "South America": "দক্ষিণ আমেরিকা",
  Oceania: "ওশেনিয়া",
  Antarctica: "অ্যান্টার্কটিকা",
};

function buildCountryDescription(country: any, bnName: string): string {
  const parts: string[] = [];
  if (country.area > 0) parts.push(`মোট আয়তন ${formatArea(country.area)}`);
  if (country.population > 0) parts.push(`জনসংখ্যা প্রায় ${formatPopulation(country.population)}`);
  if (country.capital && country.capital !== "N/A") parts.push(`রাজধানী ${country.capital}`);
  const cont = country.continent && country.continent !== "N/A"
    ? (CONTINENT_BN[country.continent] || country.continent)
    : "";
  if (cont) parts.push(`মহাদেশ ${cont}`);

  const facts = parts.join(", ");
  let desc = `${bnName}-এর ${facts}। বিস্তারিত ভৌগোলিক অবস্থান, মানচিত্র, ডায়াল কোড ও প্রয়োজনীয় তথ্য জানুন তথ্যবক্সে।`;

  if (desc.length > 160) {
    desc = `${bnName}-এর ${facts}। বিস্তারিত ভৌগোলিক অবস্থান, মানচিত্র ও তথ্য জানুন তথ্যবক্সে।`;
  }
  if (desc.length > 160) {
    desc = desc.slice(0, 157) + "...";
  }
  while (desc.length < 120) {
    desc += " তথ্যবক্স বিশ্বকোষ।";
  }
  if (desc.length > 160) {
    desc = desc.slice(0, 160);
  }
  return desc;
}

export async function generateStaticParams() {
  try {
    const countries = await getAllCountries();
    return countries.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { country } = await getCountry(slug);

  if (!country) {
    return {
      title: "দেশ পাওয়া যায়নি | বিশ্বকোষ - সকল দেশের তথ্য | Totthobox",
      description:
        "অনুরোধকৃত দেশটির তথ্য আমাদের ডেটাবেসে পাওয়া যায়নি। বিশ্বের সকল দেশের সম্পূর্ণ তালিকা, জনসংখ্যা, রাজধানী ও মানচিত্র দেখতে ভিজিট করুন।",
      robots: { index: false, follow: true },
    };
  }

  const bnName = country.name_bengali || country.name;
  const possessiveName = `${bnName}-এর`;
  let title = `${possessiveName} আয়তন কত? জনসংখ্যা, রাজধানী ও মহাদেশ`;
  if (title.length > 60) {
    title = `${possessiveName} আয়তন কত? জনসংখ্যা ও রাজধানী`;
  }
  if (title.length > 60) {
    title = `${possessiveName} আয়তন, জনসংখ্যা ও তথ্য`;
  }
  if (title.length > 60) {
    title = title.slice(0, 60);
  }

  const description = buildCountryDescription(country, bnName);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "bn_BD",
      images: [
        {
          url: country.flag,
          width: 640,
          height: 360,
          alt: `${country.name} flag`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [country.flag],
    },
    alternates: {
      canonical: `/international/country/${country.slug}`,
    },
  };
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const { country, neighbors } = await getCountry(slug);

  // ── NOT FOUND ──
  if (!country) {
    notFound();
  }

  const overviewText = generateOverview(country);
  const bnName = country.name_bengali || country.name;
  const possessiveName = `${bnName}-এর`;
  const continentBn =
    country.continent && country.continent !== "N/A"
      ? CONTINENT_BN[country.continent] || country.continent
      : "";

  const allCountries = await getAllCountries();
  const sameContinentCountries = allCountries.filter(
    (c) => c.slug !== country.slug && c.continent === country.continent,
  );
  const relatedCountries =
    neighbors.length >= 4
      ? neighbors.slice(0, 4)
      : [
          ...neighbors,
          ...sameContinentCountries.filter(
            (sc) => !neighbors.some((nb) => nb.slug === sc.slug),
          ),
        ].slice(0, 4);

  const quickQuestions: { q: string; a1: string; details: string }[] = [];

  if (country.area > 0) {
    quickQuestions.push({
      q: `${possessiveName} আয়তন কত?`,
      a1: `${possessiveName} মোট আয়তন ${formatArea(country.area)} (${country.area.toLocaleString("bn-BD")} বর্গ কিলোমিটার)।`,
      details: `আয়তনের দিক থেকে দেশটির ভৌগোলিক বিস্তৃতি ও অবস্থান বিশ্বের মানচিত্রে অত্যন্ত গুরুত্বপূর্ণ।`,
    });
  }

  if (country.population > 0) {
    quickQuestions.push({
      q: `${possessiveName} জনসংখ্যা কত?`,
      a1: `${possessiveName} বর্তমান জনসংখ্যা আনুমানিক ${formatPopulation(country.population)} (প্রায় ${country.population.toLocaleString("bn-BD")} জন)।`,
      details:
        country.density !== "N/A"
          ? `দেশটিতে প্রতি বর্গ কিলোমিটারে জনসংখ্যার গড় ঘনত্ব প্রায় ${country.density} জন।`
          : `এটি দেশটির মোট আনুমানিক জনসংখ্যা।`,
    });
  }

  if (continentBn) {
    quickQuestions.push({
      q: `${bnName} কোন মহাদেশে অবস্থিত?`,
      a1: `${bnName} ${continentBn} মহাদেশের ${country.subregion || country.region || ""} অঞ্চলে অবস্থিত ${country.independent === "স্বাধীন রাষ্ট্র" ? "একটি স্বাধীন রাষ্ট্র" : "একটি অধীনস্থ অঞ্চল"}।`,
      details: `${country.landlocked === "স্থলবেষ্টিত" ? "দেশটি চারদিক থেকে স্থলবেষ্টিত এবং এর কোনো সমুদ্র উপকূল নেই।" : "দেশটির উন্মুক্ত সমুদ্র উপকূল রয়েছে।"}${country.borders_count > 0 ? ` স্থলপথে ${possessiveName} সীমান্ত রয়েছে ${country.borders_count}টি প্রতিবেশী দেশের সাথে।` : " এটি একটি দ্বীপরাষ্ট্র বা কোনো স্থল সীমান্ত নেই।"}`,
    });
  }

  if (country.capital && country.capital !== "N/A") {
    quickQuestions.push({
      q: `${possessiveName} রাজধানীর নাম কী?`,
      a1: `${possessiveName} রাজধানীর নাম ${country.capital}।`,
      details: `এটি দেশের প্রধান প্রশাসনিক কেন্দ্র, রাজনৈতিক কার্যকলাপ এবং অর্থনৈতিক প্রাণকেন্দ্র হিসেবে পরিচালিত হয়।`,
    });
  }

  const quickFaqs = quickQuestions.map((item) => ({
    q: item.q,
    a: `${item.a1} ${item.details}`,
  }));
  const existingFaqs = generateFaqs(country);
  const faqs = [
    ...quickFaqs,
    ...existingFaqs.filter((ef) => !quickFaqs.some((qf) => qf.q === ef.q)),
  ];

  const translations = Object.entries({
    "🇧🇩 বাংলা": country.name_bengali,
    "🇸🇦 আরবি": country.name_arabic,
    "🇫🇷 ফরাসি": country.name_french,
    "🇪🇸 স্পেনীয়": country.name_spanish,
    "🇨🇳 চীনা": country.name_chinese,
    "🇷🇺 রুশ": country.name_russian,
    "🇩🇪 জার্মান": country.name_german,
    "🇮🇳 হিন্দি": country.name_hindi,
    "🇯🇵 জাপানি": country.name_japanese,
  }).filter(([, v]) => v);

  return (
    <>
      {/* JSON-LD Breadcrumb + Place */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "হোম",
                item: "https://totthobox.com/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "বিশ্বকোষ",
                item: "https://totthobox.com/international/all-country",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: country.name,
                item: `https://totthobox.com/international/country/${encodeURIComponent(country.slug)}`,
              },
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Place",
            name: country.name,
            alternateName: country.official_name,
            description: overviewText,
            image: country.flag,
            geo:
              country.lat && country.lng
                ? {
                    "@type": "GeoCoordinates",
                    latitude: country.lat,
                    longitude: country.lng,
                  }
                : undefined,
          }),
        }}
      />

      {/* JSON-LD FAQ */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: f.a,
                },
              })),
            }),
          }}
        />
      )}

      <section className="max-w-2xl mx-auto space-y-8 p-4">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm"
        >
          <Link href="/" className="hover:underline">
            <FaHome />
          </Link>
          <span>/</span>
          <Link href="/international/all-country" className="hover:underline">
            বিশ্বকোষ
          </Link>
          <span>/</span>
          <span className="">{country.name}</span>
        </nav>

        {/* HERO */}
        <div className="rounded-2xl overflow-hidden border border-zinc-400/25  hover: transition-shadow">
          <div className="relative aspect-video w-full overflow-hidden bg-zinc-400/10">
            <FlagImage
              src={country.flag_svg || country.flag}
              fallbackSrc={country.flag}
              alt={`${country.name} এর জাতীয় পতাকা — ${country.official_name}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full bg-zinc-700/10 text-white text-xs ">
                {country.region}
              </span>
              {country.subregion && (
                <span className="px-2.5 py-1 rounded-full bg-zinc-700/10 text-white text-xs">
                  {country.subregion}
                </span>
              )}
            </div>
            <div className="absolute top-4 right-4 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full bg-zinc-700/10 text-white text-xs font-mono">
                {country.code}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-zinc-700/10 text-white text-xs font-mono">
                {country.cca3}
              </span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="text-xs text-white/60 uppercase tracking-widest mb-2">
                {country.continent}
              </p>
              <h1 className="text-3xl  font-black flex items-center gap-4 tracking-tight">
                <span className="text-4xl" aria-hidden>
                  {country.flag_emoji}
                </span>
                <span>{country.name}</span>
              </h1>
              {country.name_bengali && (
                <p className="text-base text-white/70 mt-1 ">
                  {country.name_bengali}
                </p>
              )}
              <p className="text-xs text-white/40 font-mono mt-0.5">
                {country.official_name}
              </p>
            </div>
          </div>

          <div className="bg-zinc-400/10 px-5 py-2 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-400/25">
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs  ${
                  country.un_member.includes("সদস্য নয়")
                    ? "bg-zinc-400/10 "
                    : "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300"
                }`}
              >
                {country.un_member}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-zinc-400/10 border border-zinc-400/25 ${
                  country.independent.includes("অধীনস্থ") ? "" : ""
                }`}
              >
                {country.independent}
              </span>
              {country.landlocked === "স্থলবেষ্টিত" ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-zinc-400/10 border border-zinc-400/25">
                  স্থলবেষ্টিত দেশ
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs">
                  সমুদ্রসীমা আছে
                </span>
              )}
            </div>
          </div>
        </div>

        {/* দ্রুত তথ্য (Server-rendered Direct Answer Block) */}
        {quickQuestions.length > 0 && (
          <section
            aria-label="দ্রুত তথ্য"
            className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10/40 p-5 space-y-4"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-400/25">
              <span className="text-lg" aria-hidden>
                ⚡
              </span>
              <h2 className="text-base font-bold">
                {bnName} সম্পর্কে দ্রুত তথ্য
              </h2>
            </div>

            <div className="space-y-4">
              {quickQuestions.map((item) => (
                <div key={item.q} className="space-y-1">
                  <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {item.q}
                  </h2>
                  <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {item.a1}
                    </strong>{" "}
                    {item.details}
                  </p>
                </div>
              ))}
            </div>

            {/* সম্পর্কিত দেশসমূহ (3-4 genuinely related internal links) */}
            {relatedCountries.length > 0 && (
              <div className="pt-3 border-t border-zinc-400/25 space-y-2">
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  সম্পর্কিত দেশসমূহ{continentBn ? ` (${continentBn} মহাদেশ)` : ""}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {relatedCountries.map((rc) => (
                    <Link
                      key={rc.slug}
                      href={`/international/country/${encodeURIComponent(rc.slug)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-400/10 hover:bg-zinc-400/20 border border-zinc-400/20 text-xs transition"
                    >
                      <span aria-hidden>{rc.flag_emoji}</span>
                      <span>{rc.name_bengali || rc.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Overview */}
        <article className="border border-zinc-400/25 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="">📖</span>
            <h2 className="text-sm font-bold">
              {country.name} সম্পর্কে সংক্ষিপ্ত পরিচিতি
            </h2>
          </div>
          <p className="text-sm leading-relaxed ">{overviewText}</p>
        </article>

        {/* Mega Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "জনসংখ্যা",
              value: formatPopulation(country.population),
              color: "text-blue-500",
            },
            {
              label: "আয়তন",
              value: formatArea(country.area),
              color: "text-green-500",
            },
            {
              label: "জনঘনত্ব",
              value: country.density,
              color: "text-amber-500",
            },
            {
              label: "রাজধানী",
              value: country.capital,
              color: "text-purple-500",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group bg-zinc-400/10 border border-zinc-400/25 rounded-xl p-4 text-center transition-all hover:border-indigo-400/40 hover:-translate-y-0.5"
            >
              <div
                className={`text-lg font-bold font-mono leading-tight truncate ${stat.color}`}
              >
                {stat.value}
              </div>
              <p className="mt-1 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Codes + Geography */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-400/25 flex items-center gap-2">
              <span className="">🆔</span>
              <h3 className="text-sm font-bold">আন্তর্জাতিক কোড</h3>
            </div>
            <div className="divide-y divide-zinc-400/25">
              {[
                ["ISO Alpha-2", country.code],
                ["ISO Alpha-3", country.cca3],
                ["UN Numeric", country.ccn3],
                ["Olympic (CIOC)", country.cioc],
                ["FIFA", country.fifa],
                [
                  "ডায়াল কোড",
                  country.all_phone_codes.length
                    ? country.all_phone_codes.join(", ")
                    : country.phone_code,
                ],
                [
                  "ইন্টারনেট TLD",
                  country.tld.length ? country.tld.join(", ") : "N/A",
                ],
                ["গাড়ির সাইন", country.car_signs],
              ]
                .filter(([, v]) => v && v !== "N/A")
                .map(([label, value]) => (
                  <div
                    key={label as string}
                    className="flex justify-between px-4 py-2.5 text-sm"
                  >
                    <span>{label}</span>
                    <strong className="font-mono  text-right">{value}</strong>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-400/25 flex items-center gap-2">
              <span className="">📍</span>
              <h3 className="text-sm font-bold">ভৌগোলিক তথ্য</h3>
            </div>
            <div className="divide-y divide-zinc-400/25">
              {[
                ["মহাদেশ", country.continent],
                ["অঞ্চল", country.region],
                ["উপ-অঞ্চল", country.subregion],
                ["স্থানাঙ্ক", country.coords],
                ["ভৌগোলিক অবস্থান", country.landlocked],
                [
                  "সীমান্তের সংখ্যা",
                  country.borders_count > 0
                    ? `${country.borders_count}টি দেশ`
                    : "কোনো স্থল সীমান্ত নেই",
                ],
                [
                  "সপ্তাহ শুরু",
                  country.start_of_week !== "N/A"
                    ? country.start_of_week.charAt(0).toUpperCase() +
                      country.start_of_week.slice(1)
                    : "N/A",
                ],
                [
                  "গাড়ি চালনা",
                  country.driving_side === "right"
                    ? "ডান পাশে"
                    : country.driving_side === "left"
                      ? "বাম পাশে"
                      : "N/A",
                ],
              ]
                .filter(([, v]) => v && v !== "N/A")
                .map(([label, value]) => (
                  <div
                    key={label as string}
                    className="flex justify-between px-4 py-2.5 text-sm"
                  >
                    <span>{label}</span>
                    <strong className=" text-right">{value}</strong>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Languages + Currencies */}
        <div className="grid md:grid-cols-2 gap-6">
          {country.languages.length > 0 && (
            <div className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden">
              <div className="px-4 py-2 border-b border-zinc-400/25 flex items-center gap-2">
                <span className="text-green-500">🗣️</span>
                <h3 className="text-sm font-bold">
                  সরকারি ভাষা ({country.languages.length})
                </h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {country.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs "
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {country.currencies.length > 0 && (
            <div className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden">
              <div className="px-4 py-2 border-b border-zinc-400/25 flex items-center gap-2">
                <AiFillDollarCircle />
                <h3 className="text-sm font-bold">ব্যবহৃত মুদ্রা</h3>
              </div>
              <div className="divide-y divide-zinc-400/25">
                {country.currencies.map((cur) => (
                  <div
                    key={cur.code}
                    className="flex justify-between items-center px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-mono font-bold">
                        {cur.code}
                      </span>
                      <span className="text-sm ">{cur.name}</span>
                    </div>
                    {cur.symbol ? (
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                        {cur.symbol}
                      </span>
                    ) : (
                      <span className="text-xs ">—</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Translations */}
        {translations.length > 0 && (
          <div className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-400/25 flex items-center gap-2">
              <span>🌐</span>
              <h3 className="text-sm font-bold">বিভিন্ন ভাষায় নাম</h3>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {translations.map(([label, name]) => (
                <div
                  key={label}
                  className="bg-zinc-400/10/50 rounded-lg px-3 py-2.5 hover:bg-zinc-700/25 "
                >
                  <p className="text-xs  mb-1">{label}</p>
                  <strong className="text-sm  truncate">{name}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timezones */}
        {country.timezones.length > 0 && (
          <div className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-400/25 flex items-center gap-2">
              <span className="text-sky-500">🕒</span>
              <h3 className="text-sm font-bold">
                টাইমজোন ({country.timezones.length})
              </h3>
            </div>
            <div className="p-4 flex flex-wrap gap-2">
              {country.timezones.map((tz) => (
                <span
                  key={tz}
                  className="px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 text-xs font-mono"
                >
                  {tz}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Neighbors */}
        <div className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-zinc-400/25 flex items-center gap-2">
            <span className="text-indigo-500">🗺️</span>
            <h3 className="text-sm font-bold">
              {neighbors.length > 0
                ? `সীমান্তবর্তী দেশ (${neighbors.length})`
                : "ভৌগোলিক সীমানা"}
            </h3>
          </div>
          {neighbors.length > 0 ? (
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {neighbors.map((nb) => (
                <Link
                  key={nb.cca3}
                  href={`/international/country/${encodeURIComponent(nb.slug)}`}
                  className="flex items-center gap-2 p-2 rounded-lg bg-zinc-400/10 hover:border hover:border-zinc-400/25 transition-all group"
                >
                  {nb.flag && (
                    <FlagImage
                      src={nb.flag}
                      alt={nb.name}
                      className="w-8 h-5 object-cover shrink-0"
                      width={32}
                      height={20}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs  truncate">{nb.name}</p>
                    <strong className="text-xs  font-mono">{nb.cca3}</strong>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-blue-400 text-2xl mb-2">🛡️</p>
              <p className="text-sm  ">দ্বীপ দেশ — কোনো স্থল সীমান্ত নেই</p>
            </div>
          )}
        </div>

        {/* Coat of Arms */}
        {country.coat_of_arms && (
          <div className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-400/25 flex items-center gap-2">
              <span className="text-indigo-500">🛡️</span>
              <h3 className="text-sm font-bold">রাষ্ট্রীয় প্রতীক</h3>
            </div>
            <CoatOfArms
              src={country.coat_of_arms}
              alt={`${country.name} এর রাষ্ট্রীয় প্রতীক`}
            />
          </div>
        )}

        {/* Maps */}
        {country.google_maps_embed ? (
          <div className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-400/25 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-indigo-500">🗺️</span>
                <h3 className="text-sm font-bold">মানচিত্র</h3>
              </div>
              <div className="flex gap-2">
                {country.open_street_maps && (
                  <a
                    href={country.open_street_maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2.5 py-1 rounded bg-zinc-400/10 hover:bg-zinc-700 dark:hover:bg-zinc-600"
                  >
                    OpenStreetMap
                  </a>
                )}
                <a
                  href={country.google_maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2.5 py-1 rounded-lg bg-zinc-400/10 hover:bg-zinc-400/20"
                >
                  Google Maps
                </a>
              </div>
            </div>
            <div className="aspect-video w-full bg-zinc-400/10">
              <iframe
                src={country.google_maps_embed}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${country.name} মানচিত্র`}
              />
            </div>
            <div className="px-4 py-2.5 bg-zinc-400/10 border-t border-zinc-400/25 flex flex-wrap gap-4 text-xs  font-mono">
              <span>📍 {country.coords}</span>
              {country.capital !== "N/A" && country.capital_lat && (
                <span>
                  🏛️ রাজধানী: {country.capital_lat.toFixed(4)}°,{" "}
                  {country.capital_lng?.toFixed(4)}°
                </span>
              )}
            </div>
          </div>
        ) : (
          <a
            href={country.google_maps}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-2 rounded-xl bg-indigo-600 text-white  hover:bg-indigo-700"
          >
            {country.name} Google Maps-এ দেখুন
          </a>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <div className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-400/25 flex items-center gap-2">
              <span className="text-indigo-500">❓</span>
              <h2 className="text-sm font-bold">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>
            </div>
            <div className="divide-y divide-zinc-400/25">
              {faqs.map((faq) => (
                <details key={faq.q} className="group p-4">
                  <summary className="flex items-center justify-between cursor-pointer text-sm  list-none">
                    {faq.q}
                    <span className=" group-open:rotate-180 transition-transform">
                      <IoMdArrowDropdown />
                    </span>
                  </summary>
                  <p className="mt-2 text-sm  leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Attribution */}
        <div className="text-center px-2">
          <p className="text-xs ">
            তথ্যসূত্র:{" "}
            <a
              href="https://github.com/mledoze/countries"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              mledoze/countries
            </a>{" "}
            ও{" "}
            <a
              href="https://github.com/samayo/country-json"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              samayo/country-json
            </a>{" "}
            (ওপেন সোর্স ডেটাসেট)। পতাকার ছবি সরবরাহ করেছে{" "}
            <a
              href="https://flagcdn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              FlagCDN
            </a>
            । তথ্য ৩০ দিন পরপর হালনাগাদ করা হয়।
          </p>
        </div>

        {/* Back */}
        <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-zinc-400/25">
          <Link
            href="/international/all-country"
            className="inline-flex items-center gap-2 text-sm  hover:underline"
          >
            ← সকল দেশে ফিরুন
          </Link>
          <div className="flex gap-4">
            {country.open_street_maps && (
              <a
                href={country.open_street_maps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm  hover:underline"
              >
                OSM
              </a>
            )}
            <a
              href={country.google_maps}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm  hover:underline"
            >
              Maps
            </a>
          </div>
        </div>
      </section>
    </>
  );
}