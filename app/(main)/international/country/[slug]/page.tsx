import type { Metadata } from "next";
import Link from "next/link";
import {
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
  const population = formatPopulation(country.population);
  const area = formatArea(country.area);
  const languages = country.languages.slice(0, 3).join(", ");
  const currency = country.currencies[0]?.name || "";

  const title = `${bnName} (${country.name}) - রাজধানী, জনসংখ্যা, আয়তন, মানচিত্র ও বিস্তারিত তথ্য | Totthobox`;
  const description = `${bnName} (${country.name}) এর রাজধানী ${country.capital}, জনসংখ্যা ${population}, আয়তন ${area}। ${
    country.continent ? `${country.continent} মহাদেশের ` : ""
  }${country.region ? `${country.region} অঞ্চলের ` : ""}এই দেশের ভাষা${
    languages ? ` (${languages})` : ""
  }${currency ? `, মুদ্রা ${currency}` : ""}, সীমান্তবর্তী দেশ, পতাকা, কোড ও মানচিত্রসহ সম্পূর্ণ তথ্য জানুন।`;

  return {
    title,
    description,
    keywords: [
      bnName,
      country.name,
      `${bnName} দেশ`,
      `${country.name} country`,
      `${bnName} রাজধানী`,
      `${country.name} capital`,
      `${bnName} জনসংখ্যা`,
      `${country.name} population`,
      `${bnName} আয়তন`,
      `${country.name} area`,
      `${bnName} মানচিত্র`,
      `${country.name} map`,
      `${bnName} পতাকা`,
      `${country.name} flag`,
      `${bnName} ভাষা`,
      `${country.name} languages`,
      `${bnName} মুদ্রা`,
      `${country.name} currency`,
      "বিশ্বকোষ",
      "দেশের তথ্য",
      "country facts",
      "Totthobox",
    ],
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
  const faqs = generateFaqs(country);

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
      {/* JSON-LD Place */}
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
          className="flex items-center gap-2 text-sm text-zinc-400"
        >
          <Link href="/" className="hover:underline">
            <FaHome />
          </Link>
          <span>/</span>
          <Link href="/international/all-country" className="hover:underline">
            বিশ্বকোষ
          </Link>
          <span>/</span>
          <span className="text-zinc-50 text-zinc-100">{country.name}</span>
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full bg-zinc-400/25 text-white text-xs ">
                {country.region}
              </span>
              {country.subregion && (
                <span className="px-2.5 py-1 rounded-full bg-zinc-400/25 text-white text-xs">
                  {country.subregion}
                </span>
              )}
            </div>
            <div className="absolute top-4 right-4 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full bg-zinc-400/10 text-white text-xs font-mono">
                {country.code}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-zinc-400/10 text-white text-xs font-mono">
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
                    : "bg-zinc-400/25 dark:bg-zinc-400/25 opacity-50 dark:opacity-50"
                }`}
              >
                {country.un_member}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs  ${
                  country.independent.includes("অধীনস্থ")
                    ? "bg-zinc-400/25 dark:bg-zinc-400/25 opacity-50 dark:opacity-50"
                    : "bg-zinc-400/25 dark:bg-zinc-400/25 opacity-50 dark:opacity-50"
                }`}
              >
                {country.independent}
              </span>
              {country.landlocked === "স্থলবেষ্টিত" ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs  bg-zinc-400/25 dark:bg-zinc-400/25 opacity-50 dark:opacity-50">
                  স্থলবেষ্টিত দেশ
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs  bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300">
                  সমুদ্রসীমা আছে
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Overview */}
        <article className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="opacity-50">📖</span>
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
              color: "opacity-50",
            },
            {
              label: "আয়তন",
              value: formatArea(country.area),
              color: "opacity-50",
            },
            {
              label: "জনঘনত্ব",
              value: country.density,
              color: "opacity-50",
            },
            {
              label: "রাজধানী",
              value: country.capital,
              color: "opacity-50",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group bg-zinc-400/10 border border-zinc-400/25 rounded-xl p-4 text-center transition-all border-zinc-400/25 hover:-translate-y-0.5"
            >
              <div
                className={`text-lg font-bold font-mono leading-tight truncate ${stat.color}`}
              >
                {stat.value}
              </div>
              <p className="mt-1 text-xs text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Codes + Geography */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-400/25 flex items-center gap-2">
              <span className="opacity-50">🆔</span>
              <h3 className="text-sm font-bold">আন্তর্জাতিক কোড</h3>
            </div>
            <div className="divide-y divide-zinc-200/50 dark:divide-zinc-700/50">
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
                    <span className="text-zinc-400">{label}</span>
                    <span className="font-mono  text-right">
                      {value}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-400/25 flex items-center gap-2">
              <span className="opacity-50">📍</span>
              <h3 className="text-sm font-bold">ভৌগোলিক তথ্য</h3>
            </div>
            <div className="divide-y divide-zinc-200/50 dark:divide-zinc-700/50">
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
                    <span className="text-zinc-400">{label}</span>
                    <span className=" text-right">{value}</span>
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
                <span className="opacity-50">🗣️</span>
                <h3 className="text-sm font-bold">
                  সরকারি ভাষা ({country.languages.length})
                </h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {country.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2.5 py-1 rounded-full bg-zinc-400/25 dark:bg-zinc-400/25 opacity-50 dark:opacity-50 text-xs "
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
                <span className="opacity-50">💰</span>
                <h3 className="text-sm font-bold">ব্যবহৃত মুদ্রা</h3>
              </div>
              <div className="divide-y divide-zinc-200/50 dark:divide-zinc-700/50">
                {country.currencies.map((cur) => (
                  <div
                    key={cur.code}
                    className="flex justify-between items-center px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-zinc-400/25 dark:bg-zinc-400/25 opacity-50 dark:opacity-50 text-xs font-mono font-bold">
                        {cur.code}
                      </span>
                      <span className="text-sm ">{cur.name}</span>
                    </div>
                    {cur.symbol ? (
                      <span className="text-xl font-black opacity-50 dark:opacity-50 font-mono">
                        {cur.symbol}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400">—</span>
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
              <span className="opacity-50">🌐</span>
              <h3 className="text-sm font-bold">বিভিন্ন ভাষায় নাম</h3>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {translations.map(([label, name]) => (
                <div
                  key={label}
                  className="bg-zinc-400/10/50 rounded-xl px-3 py-2.5 hover:bg-zinc-400/25 "
                >
                  <p className="text-xs text-zinc-400 mb-1">{label}</p>
                  <p className="text-sm  truncate">{name}</p>
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
            <span className="opacity-50">🗺️</span>
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
                  href={`/international/${nb.slug}`}
                  className="flex items-center gap-2 p-2 rounded-xl bg-zinc-400/10/50 bg-zinc-400/25 dark:bg-zinc-400/25 border border-transparent border-zinc-400/25 dark:border-zinc-400/25 transition-all group"
                >
                  {nb.flag && (
                    <FlagImage
                      src={nb.flag}
                      alt={nb.name}
                      className="w-8 h-5 object-cover rounded  flex-shrink-0"
                      width={32}
                      height={20}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs  truncate group-opacity-50 dark:group-opacity-50">
                      {nb.name}
                    </p>
                    <p className="text-xs text-zinc-400 font-mono">{nb.cca3}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="opacity-50 text-2xl mb-2">🛡️</p>
              <p className="text-sm text-zinc-400 ">
                দ্বীপ দেশ — কোনো স্থল সীমান্ত নেই
              </p>
            </div>
          )}
        </div>

        {/* Coat of Arms */}
        {country.coat_of_arms && (
          <div className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-400/25 flex items-center gap-2">
              <span className="opacity-50">🛡️</span>
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
                <span className="opacity-50">🗺️</span>
                <h3 className="text-sm font-bold">মানচিত্র</h3>
              </div>
              <div className="flex gap-2">
                {country.open_street_maps && (
                  <a
                    href={country.open_street_maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2.5 py-1 rounded bg-zinc-400/10 hover:bg-zinc-400/25 dark:hover:bg-zinc-400/25"
                  >
                    OpenStreetMap
                  </a>
                )}
                <a
                  href={country.google_maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2.5 py-1 rounded bg-zinc-400/25 text-white bg-zinc-400/25"
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
            <div className="px-4 py-2.5 bg-zinc-400/10 border-t border-zinc-400/25 flex flex-wrap gap-4 text-xs text-zinc-400 font-mono">
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
            className="block w-full text-center py-2 rounded-xl bg-zinc-400/25 text-white  bg-zinc-400/25"
          >
            {country.name} Google Maps-এ দেখুন
          </a>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <div className="bg-zinc-400/10 border border-zinc-400/25 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-400/25 flex items-center gap-2">
              <span className="opacity-50">❓</span>
              <h2 className="text-sm font-bold">প্রায়শই জিজ্ঞাসিত প্রশ্ন</h2>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {faqs.map((faq) => (
                <details key={faq.q} className="group p-4">
                  <summary className="flex items-center justify-between cursor-pointer text-sm  list-none">
                    {faq.q}
                    <span className="text-zinc-400 group-open:rotate-180 transition-transform">
                      ▼
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
          <p className="text-xs text-zinc-400">
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
            href="/international"
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
                className="text-sm text-zinc-400 hover:underline"
              >
                OSM
              </a>
            )}
            <a
              href={country.google_maps}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:underline"
            >
              Maps
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
