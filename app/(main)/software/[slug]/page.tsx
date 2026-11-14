import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Home, Eye, ArrowLeft, Puzzle } from "lucide-react";

import InteractiveActions from "./InteractiveActions";
import CreatorsTooltip from "./CreatorsTooltip";
import DownloadButton from "./DownloadButton";
import { fetchApi } from "@/lib/api/fetcher";
import { getSlugsForPath } from "@/lib/api/slugs";
import { CACHE_TTL, CACHE_TAGS } from "@/lib/cache-config";
import { isThinContent, extractRecordText } from "@/lib/seo/word-count";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  return await getSlugsForPath("/api/apps");
}

async function getAppData(slug: string) {
  const json = await fetchApi<any>(`/api/apps/${encodeURIComponent(slug)}`, {
    revalidate: CACHE_TTL.STATIC_CONTENT,
    tags: [CACHE_TAGS.SOFTWARE, `software:${slug}`],
  });

  if (!json?.data?.name || !json?.data?.slug) {
    return null;
  }

  return {
    app: json.data,
    seo: json.seo || {},
  };
}

async function getAppCreators(appId: number) {
  const json = await fetchApi<any>(`/api/apps/${appId}/creators`, {
    revalidate: CACHE_TTL.STATIC_CONTENT,
    tags: [CACHE_TAGS.SOFTWARE],
  });

  return Array.isArray(json?.data) ? json.data : [];
}

function stripHtml(value?: string) {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function makeMetaDescription(value: string): string {
  const normalized = value.trim();

  if (normalized.length <= 160) {
    return normalized;
  }

  return `${normalized.slice(0, 157).trimEnd()}...`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAppData(slug);

  if (!data) {
    return {
      title: "সফটওয়্যার পাওয়া যায়নি | তথ্যবক্স",
      description: "অনুরোধ করা সফটওয়্যার বা অ্যাপের তথ্য পাওয়া যায়নি।",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { app, seo } = data;

  const title =
    seo.title ||
    `${app.name}${app.version ? ` v${app.version}` : ""} | তথ্যবক্স`;

  const appDescription = stripHtml(app.description);
  const isThin = isThinContent(extractRecordText(app), 300);
  const description =
    appDescription
      ? makeMetaDescription(appDescription)
      : `${app.name} সফটওয়্যারের বৈশিষ্ট্য, ব্যবহার, সংস্করণ ও অফিসিয়াল উৎসের তথ্য জানুন।`;

  const canonical = `https://totthobox.com/software/${encodeURIComponent(
    app.slug,
  )}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: "bn_BD",
      siteName: "তথ্যবক্স",
      images: app.icon_url
        ? [
            {
              url: app.icon_url,
              alt: app.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: !isThin,
      follow: true,
    },
  };
}

export default async function AppShowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getAppData(slug);

  if (!data) {
    notFound();
  }

  const { app } = data;
  const creators = await getAppCreators(app.id);
  const description = stripHtml(app.description);

  const breadcrumbSchema = {
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
        name: "Software & Apps",
        item: "https://totthobox.com/software/all",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: app.name,
        item: `https://totthobox.com/software/${encodeURIComponent(app.slug)}`,
      },
    ],
  };

  return (
    <main className="max-w-2xl mx-auto space-y-5 p-4 sm:p-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm opacity-50"
      >
        <Link href="/" className="hover:opacity-100" aria-label="হোম">
          <Home className="w-4 h-4" />
        </Link>
        <span>/</span>
        <Link href="/software/all" className="hover:opacity-100">
          Software & Apps
        </Link>
        <span>/</span>
        <span className="truncate max-w-40 sm:max-w-xs">{app.name}</span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap gap-2">
              {app.platform && (
                <span className="inline-flex items-center rounded-lg bg-zinc-400/10 px-2.5 py-1 text-xs opacity-70">
                  {app.platform}
                </span>
              )}
              {app.version && (
                <span className="inline-flex items-center rounded-lg bg-zinc-400/10 px-2.5 py-1 text-xs opacity-70">
                  Version {app.version}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight">{app.name}</h1>

            <div className="flex items-center gap-3 flex-wrap">
              {typeof app.views_count === "number" && (
                <div className="inline-flex items-center gap-2 rounded-lg bg-zinc-400/10 px-2.5 py-1 text-xs opacity-60">
                  <Eye className="w-3.5 h-3.5" />
                  {app.views_count}
                </div>
              )}
            </div>
          </div>

          {creators?.length > 0 && (
            <div className="shrink-0">
              <CreatorsTooltip creators={creators} />
            </div>
          )}
        </div>
      </header>

      {/* App Icon */}
      <div className="flex justify-center">
        {app.icon_url ? (
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-zinc-400/25">
            <Image
              src={app.icon_url}
              alt={`${app.name} icon`}
              fill
              className="object-cover"
              priority
              sizes="112px"
            />
          </div>
        ) : (
          <div className="w-28 h-28 rounded-2xl bg-zinc-400/10 flex items-center justify-center border border-zinc-400/25">
            <Puzzle className="w-12 h-12 opacity-50" />
          </div>
        )}
      </div>

      {/* Official Source */}
      <section className="space-y-3">
        <DownloadButton
          appId={app.id}
          name={app.name}
          platform={app.platform}
          downloadType={app.download_type === "local" ? "local" : "external"}
        />
      </section>

      {/* Overview */}
      <section aria-labelledby="overview-heading" className="space-y-4">
        <h2 id="overview-heading" className="text-xl font-bold">
          {app.name} সম্পর্কে
        </h2>

        {description ? (
          <div
            className="prose dark:prose-invert max-w-none prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: app.description,
            }}
          />
        ) : (
          <p className="text-sm opacity-60">
            এই সফটওয়্যার সম্পর্কে বিস্তারিত তথ্য এখনো যোগ করা হয়নি।
          </p>
        )}
      </section>

      {/* Software Information */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">সফটওয়্যার তথ্য</h2>

        <div className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 divide-y divide-zinc-400/25">
          {app.platform && (
            <div className="flex items-center justify-between gap-4 p-4">
              <span className="text-sm opacity-60">প্ল্যাটফর্ম</span>
              <span className="text-sm">{app.platform}</span>
            </div>
          )}

          {app.version && (
            <div className="flex items-center justify-between gap-4 p-4">
              <span className="text-sm opacity-60">সংস্করণ</span>
              <span className="text-sm">{app.version}</span>
            </div>
          )}

          {app.developer && (
            <div className="flex items-center justify-between gap-4 p-4">
              <span className="text-sm opacity-60">ডেভেলপার</span>
              <span className="text-sm text-right">{app.developer}</span>
            </div>
          )}

          {app.license && (
            <div className="flex items-center justify-between gap-4 p-4">
              <span className="text-sm opacity-60">লাইসেন্স</span>
              <span className="text-sm text-right">{app.license}</span>
            </div>
          )}
        </div>
      </section>

      {/* Strong Notice - AdSense Safe */}
      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
        <h2 className="font-bold text-amber-700 dark:text-amber-400">
          গুরুত্বপূর্ণ নোটিশ
        </h2>
        <p className="text-sm opacity-80 leading-relaxed">
          তথ্যবক্স শুধুমাত্র সফটওয়্যার সম্পর্কিত তথ্য প্রদান করে।          {app.download_type === "local" ? (
            <>
              এই রিসোর্সের ফাইল তথ্যবক্সের নিজস্ব সংরক্ষণ থেকে প্রদান করা হচ্ছে।
              ব্যবহার করার আগে সফটওয়্যারের উৎস ও লাইসেন্স যাচাই করুন।
            </>
          ) : (
            <>
              আমরা সফটওয়্যার ফাইল হোস্ট করি না; সংশ্লিষ্ট ডেভেলপার বা
              প্রকাশকের <strong>অফিসিয়াল ওয়েবসাইট</strong>-এ নিয়ে যাওয়া হয়।
              সফটওয়্যার সংগ্রহের আগে লাইসেন্স যাচাই করুন।
            </>
          )}
        </p>
      </section>

      {/* ইনস্টলেশন গাইড — additive, server-rendered, from API data only */}
      {app.platform && (
        <section aria-labelledby="install-heading" className="space-y-3">
          <h2 id="install-heading" className="text-xl font-bold">
            {app.name} কিভাবে ইনস্টল করবেন?
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm leading-relaxed opacity-80">
            <li>উপরের ডাউনলোড বাটনে ক্লিক করে ফাইল সংগ্রহ করুন।</li>
            <li>ডাউনলোড সম্পন্ন হলে ফাইলটি খুলুন এবং ইনস্টলেশন উইজার্ড অনুসরণ করুন।</li>
            <li>
              {app.platform.toLowerCase().includes("windows")
                ? "Windows-এ ইনস্টল করতে .exe ফাইলে ডাবল ক্লিক করুন এবং Administrator হিসেবে চালান।"
                : `${app.platform} ডিভাইসে ইনস্টলেশনের জন্য সংশ্লিষ্ট প্ল্যাটফর্মের নির্দেশনা অনুসরণ করুন।`}
            </li>
            <li>ইনস্টলেশনের পর সফটওয়্যার চালু করুন এবং প্রয়োজনে লাইসেন্স যাচাই করুন।</li>
          </ol>
          {app.platform.toLowerCase().includes("windows") && (
            <p className="text-xs opacity-60">
              সমর্থিত সিস্টেম: {app.platform}
              {app.version ? ` (সংস্করণ ${app.version})` : ""}
            </p>
          )}
        </section>
      )}

      {/* FAQ — built from real API fields only */}
      {(app.name || description) && (() => {
        const faqItems: { q: string; a: string }[] = [];
        if (app.name) {
          faqItems.push({
            q: `${app.name} কী?`,
            a: description
              ? `${description.slice(0, 200)}${description.length > 200 ? "..." : ""}`
              : `${app.name} হলো একটি সফটওয়্যার।`,
          });
        }
        if (app.platform) {
          faqItems.push({
            q: `${app.name} কোন প্ল্যাটফর্মে চলে?`,
            a: `${app.name} ${app.platform} প্ল্যাটফর্মে${app.version ? ` (সংস্করণ ${app.version})` : ""} সমর্থিত।`,
          });
        }
        if (app.developer) {
          faqItems.push({
            q: `${app.name}-এর ডেভেলপার কে?`,
            a: `${app.name}-এর ডেভেলপার হলেন ${app.developer}।`,
          });
        }
        if (faqItems.length === 0) return null;
        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        };
        return (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <section aria-labelledby="faq-heading" className="space-y-4">
              <h2 id="faq-heading" className="text-xl font-bold">
                সচরাচর জিজ্ঞাসা ({app.name})
              </h2>
              <div className="space-y-4">
                {faqItems.map((item) => (
                  <div
                    key={item.q}
                    className="rounded-2xl border border-zinc-400/25 bg-zinc-400/5 p-4 space-y-1"
                  >
                    <h3 className="font-semibold text-sm">{item.q}</h3>
                    <p className="text-sm opacity-80 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        );
      })()}

      {/* Reactions */}
      <InteractiveActions
        appId={app.id}
        initialData={{
          reactions: {
            like_count: app.like_count ?? 0,
            dislike_count: app.dislike_count ?? 0,
            user_has_liked: app.has_like ?? false,
            user_has_disliked: app.has_dislike ?? false,
          },
          title: app.name,
          slug: app.slug,
        }}
      />

      {/* Back */}
      <div>
        <Link
          href="/software/all"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm opacity-50 hover:opacity-100 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Software & Apps-এ ফিরে যান
        </Link>
      </div>
    </main>
  );
}
