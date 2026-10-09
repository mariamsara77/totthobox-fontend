import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SoftwareClient from "../SoftwareClient";

type Props = {
  params: Promise<{
    platform: string;
  }>;
};

function formatPlatformName(value: string) {
  return decodeURIComponent(value).trim();
}

async function getPlatformTotal(platform: string): Promise<number | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";

    const response = await fetch(
      `${baseUrl}/api/apps?platform=${encodeURIComponent(platform)}&per_page=1&page=1`,
      {
        next: {
          revalidate: 3600,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    return typeof json?.meta?.total === "number" ? json.meta.total : null;
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return ["Windows", "Android", "Mac", "Fonts"].map((platform) => ({
    platform,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params;
  const platformName = formatPlatformName(platform);

  const platformTotal = await getPlatformTotal(platformName);

  if (platformTotal === 0) {
    return {
      title: "সফটওয়্যার প্ল্যাটফর্ম পাওয়া যায়নি | তথ্যবক্স",
      description: "অনুরোধ করা সফটওয়্যার প্ল্যাটফর্মের তথ্য পাওয়া যায়নি।",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${platformName} Software & Apps | তথ্যবক্স`;

  const description = `${platformName} প্ল্যাটফর্মের সফটওয়্যার ও অ্যাপ সম্পর্কে তথ্য, ফিচার, সিস্টেম রিকোয়ারমেন্ট এবং অফিসিয়াল সোর্স দেখুন।`;

  const canonical = `https://totthobox.com/software/all/${encodeURIComponent(
    platformName,
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
      type: "website",
      locale: "bn_BD",
      siteName: "তথ্যবক্স",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

async function getInitialData(platform: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://admin.totthobox.com";
  const response = await fetch(`${baseUrl}/api/apps?platform=${encodeURIComponent(platform)}&page=1&per_page=12`, {
    next: { revalidate: 3600, tags: [`software:${platform}`] },
  });
  if (!response.ok) throw new Error("Failed to load initial software data");
  return response.json();
}

export default async function PlatformSoftwarePage({ params }: Props) {
  const { platform } = await params;
  const platformName = formatPlatformName(platform);

  const platformTotal = await getPlatformTotal(platformName);

  if (platformTotal === 0) {
    notFound();
  }

  const initialData = await getInitialData(platformName);
  return <SoftwareClient platform={platformName} initialData={initialData} />;
}
