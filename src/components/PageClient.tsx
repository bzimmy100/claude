"use client";

import { usePresentationQuery } from "next-sanity/hooks";
import type { QueryParams } from "next-sanity";
import type { Lang } from "@/sanity/lib/locale";
import type { PageDoc } from "@/sanity/lib/types";
import { PageBuilder } from "./PageBuilder";
import type { Variant } from "./blocks";

/* Binnen de Presentation-tool streamt de studio wijzigingen rechtstreeks
   deze component in (geen verversing nodig); daarbuiten doet de hook niets
   en tonen we gewoon de server-gerenderde data. */
export function PageClient({
  initial,
  query,
  params,
  variant,
  lang,
  base,
}: {
  initial: PageDoc;
  query: string;
  params: QueryParams;
  variant: Variant;
  lang: Lang;
  base: string;
}) {
  const { data } = usePresentationQuery({ query, params });
  const page = (data ?? initial) as PageDoc;
  return (
    <PageBuilder
      blocks={page?.pageBuilder}
      variant={variant}
      lang={lang}
      base={base}
    />
  );
}
