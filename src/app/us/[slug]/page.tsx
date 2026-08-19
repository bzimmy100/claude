import { notFound } from "next/navigation";
import { PageClient } from "@/components/PageClient";
import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_QUERY } from "@/sanity/lib/queries";
import type { PageDoc } from "@/sanity/lib/types";

export const dynamic = "force-dynamic";

export default async function UsSubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const queryParams = { market: "us", language: "en", slug };
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: queryParams,
  });
  if (!data) notFound();

  return (
    <PageClient
      initial={data as PageDoc}
      query={PAGE_QUERY}
      params={queryParams}
      variant="us"
      lang="en"
      base="/us"
    />
  );
}
