import { PageBuilder } from "@/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { PAGE_QUERY } from "@/sanity/lib/queries";
import type { PageDoc } from "@/sanity/lib/types";

export const dynamic = "force-dynamic";

export default async function UsHomePage() {
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { market: "us", language: "en", slug: "home" },
  });
  const page = data as PageDoc;

  return <PageBuilder blocks={page?.pageBuilder} variant="us" base="/us" />;
}
