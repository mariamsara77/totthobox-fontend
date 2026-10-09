import { redirect } from "next/navigation";
import { getNewsSources } from "@/lib/news";

export default async function LegacyNewsSourceRedirect({
  params,
}: {
  params: Promise<{ sourceKey: string }>;
}) {
  const { sourceKey } = await params;
  const sources = await getNewsSources();
  const source = [...sources.bn, ...sources.en].find(
    (item) => item.key === sourceKey || item.slug === sourceKey,
  );

  redirect(source ? "/news/" + source.slug : "/news/headlines");
}
