import { redirect } from "next/navigation";
import { sourceSlug } from "@/lib/news";

export default async function LegacyNewsSourceRedirect({
  params,
}: {
  params: Promise<{ sourceKey: string }>;
}) {
  const { sourceKey } = await params;
  redirect("/news/" + sourceSlug(sourceKey));
}
