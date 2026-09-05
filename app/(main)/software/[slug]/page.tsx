import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Home,
  Eye,
  ArrowLeft,
  ChevronDown,
  Download,
  Puzzle,
} from "lucide-react";
import InteractiveActions from "./InteractiveActions";
import CreatorsTooltip from "./CreatorsTooltip";
import DownloadButton from "./DownloadButton";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

async function getAppData(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/apps/${slug}`, {
      next: { revalidate: 3600 }, // ১ ঘণ্টা ক্যাশ
    });

    if (!res.ok) return null;

    const json = await res.json();

    // API response structure: { data: {...}, creators?: [] }
    if (!json.data) return null;

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAppData(slug);

  if (!data)
    return {
      title: "অ্যাপ পাওয়া যায়নি",
      robots: { index: false, follow: false },
    };

  const { app, seo } = data;

  return {
    title:
      seo.title ||
      `${app.name} v${app.version || ""} Free Download | Safe & Verified | তথ্যবক্স`,
    description:
      seo.description ||
      `Download ${app.name} v${app.version || ""} for ${app.platform || ""} for free on Totthobox. 100% safe, fast, and verified direct download.`,
    keywords:
      seo.keywords ||
      `${app.name} free download, ${app.name} ${app.platform}, download ${app.name} safe, totthobox software`,
    openGraph: {
      title: seo.title || app.name,
      description: seo.description,
      images: app.icon_url ? [{ url: app.icon_url }] : [],
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

  const { app, creators } = data;

  return (
    <div className="max-w-2xl mx-auto space-y-4 p-4 sm:p-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-zinc-400"
      >
        <Link href="/" className="opacity-80 hover:opacity-100 ">
          <Home className="w-4 h-4" />
        </Link>
        <span>/</span>
        <Link href="/software" className="opacity-80 hover:opacity-100 ">
          All Free Softwar
        </Link>
        <span>/</span>
        <span className="truncate max-w-40 sm:max-w-xs">
          {app.name} {app.version ? `v${app.version}` : ""}
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              {app.platform && (
                <span className="inline-flex items-center rounded-md bg-zinc-400/10 px-2.5 py-1 text-xs  ">
                  {app.platform}
                </span>
              )}
              {app.version && (
                <span className="inline-flex items-center rounded-md bg-zinc-400/10 px-2.5 py-1 text-xs  ">
                  v{app.version}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight">{app.name}</h1>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 rounded-md bg-green-50 dark:bg-green-900/20 px-2.5 py-1 text-xs  text-green-700 dark:text-green-400">
                <Download className="w-3.5 h-3.5" />
                {app.download_count ?? 0}+ Downloads
              </div>

              <div className="inline-flex items-center gap-2 rounded-md bg-zinc-400/10/50 px-2.5 py-1 text-xs  ">
                <Eye className="w-3.5 h-3.5" />
                {app.views_count ?? 0}
              </div>
            </div>
          </div>

          {/* Creators Tooltip */}
          {creators && creators.length > 0 && (
            <div className="shrink-0">
              <CreatorsTooltip creators={creators} />
            </div>
          )}
        </div>
      </header>

      {/* App Icon */}
      <div className="flex justify-center">
        {app.icon_url ? (
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-zinc-400/25 dark:border-zinc-700 ">
            <Image
              src={app.icon_url}
              alt={app.name}
              fill
              className="object-cover"
              priority
              sizes="112px"
            />
          </div>
        ) : (
          <div className="w-28 h-28 rounded-2xl bg-zinc-400/10 flex items-center justify-center border border-zinc-400/25 dark:border-zinc-700">
            <Puzzle className="w-12 h-12 text-zinc-400" />
          </div>
        )}
      </div>

      {/* Download Button */}
      <DownloadButton appId={app.id} name={app.name} platform={app.platform} />

      {/* Description / How to */}
      <section aria-labelledby="how-to-heading" className="space-y-4">
        <h2 id="how-to-heading" className="text-lg font-bold">
          How to download and install {app.name}
        </h2>

        {app.description ? (
          <div
            className="prose dark:prose-invert max-w-none prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: app.description }}
          />
        ) : (
          <p className="">এই অ্যাপের বিস্তারিত নির্দেশনা এখনো যোগ করা হয়নি।</p>
        )}
      </section>

      {/* Archive Password */}
      {app.download_password && (
        <section className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800 flex items-center gap-4">
          <div className="bg-blue-500 p-2 rounded-xl text-white shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold">Archive Password</h2>
            <p className="font-mono text-xl  mt-0.5">{app.download_password}</p>
          </div>
        </section>
      )}

      {/* Like / Dislike / Share */}
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

      {/* Back Button */}
      <div>
        <Link
          href="/software"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm opacity-50 hover:opacity-100 rounded-lg "
        >
          <ArrowLeft className="w-4 h-4" />
          Digital Resource Library তে ফিরে যান
        </Link>
      </div>

      {/* About Section */}
      <section className="rounded-2xl bg-zinc-400/10/40 p-4 space-y-4">
        <h2 className="text-lg font-bold">{app.name} ফ্রি ডাউনলোড সম্পর্কে</h2>
        <div className="text-sm leading-relaxed  space-y-4">
          <p>
            <strong>{app.name}</strong>
            {app.version ? ` (Version ${app.version})` : ""}{" "}
            {app.platform ? `${app.platform} প্ল্যাটফর্মের` : ""} জন্য Totthobox
            থেকে ফ্রি ডাউনলোড করুন। ফাইলটি ভেরিফাইড এবং ম্যালওয়্যার-ফ্রি।
          </p>
          <p>
            উপরের ডাউনলোড বাটনে ক্লিক করে সরাসরি ফাইল নিতে পারবেন।
            {app.download_password &&
              " আর্কাইভ পাসওয়ার্ড প্রয়োজন হলে উপরের পাসওয়ার্ড বক্স থেকে কপি করুন।"}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4 pt-2">
        <h2 className="text-lg font-bold">প্রায়শাই জিজ্ঞাসিত প্রশ্ন</h2>

        <div className="space-y-2">
          <details className="group rounded-xl border border-zinc-400/25 bg-zinc-400/10 overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer px-4 py-3.5  hover:bg-zinc-400/25 transition list-none">
              <span>{app.name} কি ফ্রি?</span>
              <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition shrink-0" />
            </summary>
            <div className="px-4 pb-4 text-sm  leading-relaxed border-t border-zinc-400/25 pt-3">
              হ্যাঁ। Totthobox থেকে {app.name} সম্পূর্ণ ফ্রি ডাউনলোড করা যায়।
            </div>
          </details>

          <details className="group rounded-xl border border-zinc-400/25 bg-zinc-400/10 overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer px-4 py-3.5  hover:bg-zinc-400/25 transition list-none">
              <span>ডাউনলোড নিরাপদ কি?</span>
              <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition shrink-0" />
            </summary>
            <div className="px-4 pb-4 text-sm  leading-relaxed border-t border-zinc-400/25 pt-3">
              হ্যাঁ। ফাইলটি ভেরিফাইড এবং ম্যালওয়্যার-ফ্রি হিসেবে চিহ্নিত। তবে
              ডাউনলোডের পর নিজের অ্যান্টিভাইরাস দিয়ে স্ক্যান করার পরামর্শ দেওয়া
              হয়।
            </div>
          </details>

          <details className="group rounded-xl border border-zinc-400/25 bg-zinc-400/10 overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer px-4 py-3.5  hover:bg-zinc-400/25 transition list-none">
              <span>কোন প্ল্যাটফর্মের জন্য?</span>
              <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition shrink-0" />
            </summary>
            <div className="px-4 pb-4 text-sm  leading-relaxed border-t border-zinc-400/25 pt-3">
              এই ভার্সনটি{" "}
              <strong>{app.platform || "একাধিক প্ল্যাটফর্ম"}</strong> এর জন্য।
            </div>
          </details>

          <details className="group rounded-xl border border-zinc-400/25 bg-zinc-400/10 overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer px-4 py-3.5  hover:bg-zinc-400/25 transition list-none">
              <span>কীভাবে ইনস্টল করব?</span>
              <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition shrink-0" />
            </summary>
            <div className="px-4 pb-4 text-sm  leading-relaxed border-t border-zinc-400/25 pt-3">
              উপরের “How to download and install” সেকশনে বিস্তারিত নির্দেশনা
              দেওয়া আছে। ডাউনলোড করে ফাইলটি রান/এক্সট্রাক্ট করুন এবং নির্দেশনা
              অনুসরণ করুন।
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
