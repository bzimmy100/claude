import { notFound } from "next/navigation";
import { PageBuilder } from "@/components/PageBuilder";
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
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { market: "us", language: "en", slug },
  });
  const page = data as PageDoc;
  if (!page) notFound();

  return <PageBuilder blocks={page.pageBuilder} variant="us" base="/us" />;
}
