import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IntroductionShowClient from "./IntroductionShowClient";

type Props = {
  params: Promise<{ slug: string }>;
};

type IntroMeta = {
  id: number;
  title: string;
  slug: string;
  description?: string;
  intro_category?: string;
  image_url?: string;
};

async function getIntro(slug: string): Promise<IntroMeta | null> {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

  const res = await fetch(
    `${base}/api/intro-bd/${encodeURIComponent(slug)}`,
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) return null;

  const json = await res.json();
  return json?.data ?? null;
}

function getPlainText(value?: string): string {
  return (value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const intro = await getIntro(slug);

  if (!intro) {
    return {
      title: "তথ্য পাওয়া যায়নি | তথ্যবক্স",
      robots: { index: false, follow: false },
    };
  }

  const cleanDescription = getPlainText(intro.description);
  const isThinContent = cleanDescription.length < 120;
  const title = `${intro.title} | বাংলাদেশের পরিচিতি | তথ্যবক্স`;
  const description = cleanDescription
    ? cleanDescription.length > 160
      ? `${cleanDescription.slice(0, 157).trimEnd()}...`
      : cleanDescription
    : undefined;
  const canonical = `https://totthobox.com/bangladesh/introduction/${encodeURIComponent(intro.slug)}`;

  return {
    title,
    description,
    robots: {
      index: !isThinContent,
      follow: true,
    },
    openGraph: {
      title,
      description,
      images: intro.image_url ? [{ url: intro.image_url }] : [],
      type: "article",
      locale: "bn_BD",
      siteName: "Totthobox",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical,
    },
  };
}

export default async function IntroductionShowPage({ params }: Props) {
  const { slug } = await params;
  const intro = await getIntro(slug);

  if (!intro) {
    notFound();
  }

  return <IntroductionShowClient intro={intro} />;
}
