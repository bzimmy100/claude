import { PageClient } from "@/components/PageClient";
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
  const queryParams = { market: "eu", language: lang, slug: "home" };
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: queryParams,
  });

  return (
    <PageClient
      initial={data as PageDoc}
      query={PAGE_QUERY}
      params={queryParams}
      variant="eu"
      lang={lang as "nl" | "en"}
      base={`/${lang}`}
    />
  );
}
