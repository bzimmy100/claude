import { PageBuilder } from "@/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_QUERY } from "@/sanity/lib/queries";
import type { PageDoc } from "@/sanity/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { market: "eu", language: lang, slug: "home" },
  });
  const page = data as PageDoc;

  return (
    <PageBuilder blocks={page?.pageBuilder} variant="eu" base={`/${lang}`} />
  );
}
