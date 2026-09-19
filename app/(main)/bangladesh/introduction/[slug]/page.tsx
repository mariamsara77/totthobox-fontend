import { Metadata } from "next";
import { notFound } from "next/navigation";
import IntroductionShowClient from "./IntroductionShowClient";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getIntro(slug: string) {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  const res = await fetch(`${base}/api/intro-bd/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
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

  const cleanDesc = (
    intro.description || `${intro.title} সম্পর্কে বিস্তারিত তথ্য ও পরিচিতি।`
  )
    .replace(/<[^>]+>/g, "")
    .slice(0, 160);

  const title = `${intro.title} | বাংলাদেশের পরিচিতি | তথ্যবক্স`;

  return {
    title,
    description: cleanDesc,
    keywords: `${intro.title}, বাংলাদেশের পরিচিতি, ${intro.intro_category || ""}, বাংলাদেশ তথ্য, তথ্যবক্স`,
    openGraph: {
      title,
      description: cleanDesc,
      images: intro.image_url ? [{ url: intro.image_url }] : [],
      type: "article",
      locale: "bn_BD",
      siteName: "Totthobox",
      url: `https://totthobox.com/bangladesh/introduction/${intro.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDesc,
    },
    alternates: {
      canonical: `https://totthobox.com/bangladesh/introduction/${intro.slug}`,
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
