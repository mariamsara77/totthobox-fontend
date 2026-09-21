import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SoftwareClient from "../SoftwareClient";

type Props = {
  params: Promise<{
    platform: string;
  }>;
};

const ALLOWED_PLATFORMS = ["Windows", "Android", "Mac", "Fonts"] as const;

function formatPlatformName(value: string) {
  return decodeURIComponent(value).trim();
}

function isAllowedPlatform(value: string): boolean {
  return ALLOWED_PLATFORMS.includes(value as (typeof ALLOWED_PLATFORMS)[number]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params;
  const platformName = formatPlatformName(platform);

  if (!isAllowedPlatform(platformName)) {
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

export default async function PlatformSoftwarePage({ params }: Props) {
  const { platform } = await params;
  const platformName = formatPlatformName(platform);

  if (!isAllowedPlatform(platformName)) {
    notFound();
  }

  return <SoftwareClient platform={platformName} />;
}
