import { Metadata } from "next";
import IntroductionShowClient from "./IntroductionShowClient";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getIntro(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
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
    return { title: "তথ্য পাওয়া যায়নি | তথ্যবক্স" };
  }

  const title = `${intro.title} | বাংলাদেশের পরিচিতি | তথ্যবক্স`;
  const description = (intro.description || `${intro.title} সম্পর্কে বিস্তারিত তথ্য।`)
    .replace(/<[^>]+>/g, "")
    .slice(0, 155);

  return {
    title,
    description,
    keywords: `${intro.title}, বাংলাদেশের পরিচিতি, ${intro.intro_category || ""}, তথ্যবক্স`,
    openGraph: {
      title,
      description,
      images: intro.image_url ? [{ url: intro.image_url }] : [],
      type: "article",
      locale: "bn_BD",
      siteName: "Totthobox",
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
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-zinc-500">
        তথ্য পাওয়া যায়নি
      </div>
    );
  }

  // শুধু এটা — InteractiveActions Client-এর ভিতরে যাবে
  return <IntroductionShowClient intro={intro} />;
}