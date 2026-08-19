import Image from "next/image";
import { notFound } from "next/navigation";
import { RichText } from "@/components/RichText";
import { urlFor } from "@/sanity/lib/image";
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
  const { data } = await sanityFetch({
    query: ARTICLE_QUERY,
    params: { language: lang, slug },
  });
  const article = data as ArticleDoc;
  if (!article) notFound();

  return (
    <article className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl leading-tight font-bold">{article.title}</h1>
        {article.excerpt && (
          <p className="mt-4 text-lg text-ink/70">{article.excerpt}</p>
        )}
        {article.coverImage && (
          <Image
            src={urlFor(article.coverImage).width(1600).height(900).url()}
            alt={article.title ?? ""}
            width={1600}
            height={900}
            className="mt-8 w-full rounded-3xl"
          />
        )}
        {article.body && (
          <div className="mt-8">
            <RichText value={article.body} />
          </div>
        )}
      </div>
    </article>
  );
}
