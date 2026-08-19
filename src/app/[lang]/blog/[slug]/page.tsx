import { notFound } from "next/navigation";
import { ArticleClient } from "@/components/ArticleClient";
import { sanityFetch } from "@/sanity/lib/live";
import { ARTICLE_QUERY } from "@/sanity/lib/queries";
import type { ArticleDoc } from "@/sanity/lib/types";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const queryParams = { language: lang, slug };
  const { data } = await sanityFetch({
    query: ARTICLE_QUERY,
    params: queryParams,
  });
  if (!data) notFound();

  return (
    <ArticleClient
      initial={data as ArticleDoc}
      query={ARTICLE_QUERY}
      params={queryParams}
    />
  );
}
