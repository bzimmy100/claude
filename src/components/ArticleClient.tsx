"use client";

import Image from "next/image";
import { usePresentationQuery } from "next-sanity/hooks";
import type { QueryParams } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import type { ArticleDoc } from "@/sanity/lib/types";
import { RichText } from "./RichText";

/* Zelfde patroon als PageClient: binnen Presentation gestreamde data,
   daarbuiten de server-gerenderde versie. */
export function ArticleClient({
  initial,
  query,
  params,
}: {
  initial: ArticleDoc;
  query: string;
  params: QueryParams;
}) {
  const { data } = usePresentationQuery({ query, params });
  const article = (data ?? initial) as ArticleDoc;
  if (!article) return null;

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
