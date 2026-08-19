import type { PortableTextBlock } from "next-sanity";

/* Vertaalbare velden uitlezen: pak de gevraagde taal,
   val terug op Nederlands (de hoofdtaal). */

export type LocaleString = { nl?: string; en?: string } | null | undefined;
export type LocaleRichText =
  | { nl?: PortableTextBlock[]; en?: PortableTextBlock[] }
  | null
  | undefined;

export type Lang = "nl" | "en";

export function loc(field: LocaleString, lang: Lang): string | undefined {
  if (!field) return undefined;
  return field[lang] || field.nl || field.en || undefined;
}

export function locRich(
  field: LocaleRichText,
  lang: Lang
): PortableTextBlock[] | undefined {
  if (!field) return undefined;
  const value = field[lang];
  if (value?.length) return value;
  return field.nl?.length ? field.nl : field.en;
}
