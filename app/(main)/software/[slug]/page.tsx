import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Home, Eye, ArrowLeft, Puzzle, ExternalLink } from "lucide-react";

import InteractiveActions from "./InteractiveActions";
import CreatorsTooltip from "./CreatorsTooltip";
import DownloadButton from "./DownloadButton";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

async function getAppData(slug: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/apps/${encodeURIComponent(slug)}`,
      {
        next: {
          revalidate: 3600,
        },
      },
    );

    if (!res.ok) {
      return null;
    }

    const json = await res.json();

    if (!json?.data) {
      return null;
    }

    return {
      app: json.data,
      creators: json.creators || [],
      seo: json.seo || {},
    };
  } catch (error) {
    console.error("Error fetching app:", error);
    return null;
  }
}

function stripHtml(value?: string) {
  if (!value) {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
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

  const description =
    seo.description ||
    `${app.name}${
      app.platform ? ` (${app.platform})` : ""
    } সম্পর্কে ফিচার, ব্যবহার, সিস্টেম রিকোয়ারমেন্ট এবং প্রয়োজনীয় সফটওয়্যার তথ্য দেখুন।`;

  const canonical = `https://totthobox.com/software/${encodeURIComponent(
    app.slug,
  )}`;

  return {
    title,
    description,
    ...(seo.keywords
      ? {
          keywords: seo.keywords,
        }
      : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
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
  };
}

export default async function AppShowPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;
  const data = await getAppData(slug);

  if (!data) {
    notFound();
  }

  const { app, creators } = data;

  const description = stripHtml(app.description);

  return (
    <main className="max-w-2xl mx-auto space-y-5 p-4 sm:p-6">
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
      <section className="space-y-2">
        <DownloadButton
          appId={app.id}
          name={app.name}
          platform={app.platform}
        />

        <p className="text-xs text-center opacity-50">
          সফটওয়্যার সংগ্রহ বা ইনস্টল করার জন্য সংশ্লিষ্ট ডেভেলপার বা প্রকাশকের
          অফিসিয়াল সোর্স ব্যবহার করুন।
        </p>
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

      {/* Notice */}
      <section className="rounded-2xl border border-zinc-400/25 bg-zinc-400/10 p-4 space-y-2">
        <h2 className="font-bold">অফিসিয়াল সোর্স সম্পর্কে</h2>

        <p className="text-sm opacity-70 leading-relaxed">
          তথ্যবক্সে সফটওয়্যার সম্পর্কিত তথ্য উপস্থাপন করা হয়। সফটওয়্যার ডাউনলোড
          বা ইনস্টল করার আগে ডেভেলপার, লাইসেন্স এবং সিস্টেম রিকোয়ারমেন্ট যাচাই
          করুন। সম্ভব হলে সংশ্লিষ্ট ডেভেলপার বা প্রকাশকের অফিসিয়াল ওয়েবসাইট থেকে
          সফটওয়্যার সংগ্রহ করুন।
        </p>
      </section>

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
