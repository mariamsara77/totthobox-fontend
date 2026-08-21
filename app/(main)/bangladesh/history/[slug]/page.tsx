import { Metadata } from "next";
import HistoryShowClient from "./HistoryShowClient";

type Props = { params: Promise<{ slug: string }> };

async function getHistory(slug: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  const res = await fetch(`${base}/api/history-bd/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getHistory(slug);
  if (!item) return { title: "স্থান পাওয়া যায়নি | তথ্যবক্স" };

  const title = `${item.title} | বাংলাদেশের ঐতিহাসিক স্থান | তথ্যবক্স`;
  const description = (item.description || `${item.title} সম্পর্কে বিস্তারিত ইতিহাস।`)
    .replace(/<[^>]+>/g, "")
    .slice(0, 155);

  return {
    title,
    description,
    keywords: `${item.title}, বাংলাদেশ ইতিহাস, ঐতিহাসিক স্থান${item.era ? `, ${item.era}` : ""}, তথ্যবক্স`,
    openGraph: {
      title,
      description,
      images: item.image_url ? [{ url: item.image_url }] : [],
    },
    alternates: {
      canonical: `https://totthobox.com/bangladesh/history/${item.slug}`,
    },
  };
}

export default async function HistoryShowPage({ params }: Props) {
  const { slug } = await params;
  const item = await getHistory(slug);
  if (!item) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-zinc-500">
        স্থান পাওয়া যায়নি
      </div>
    );
  }
  return <HistoryShowClient history={item} />;
}