import type { Lang } from "@/sanity/lib/locale";
import {
  ArticleList,
  CtaBanner,
  Faq,
  FeatureGrid,
  Hero,
  ImageTextBlock,
  Stats,
  Testimonials,
  type Variant,
} from "./blocks";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Block = { _type: string; _key: string; title?: any } & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

/* Zet de blokken uit Sanity om naar componenten.
   `base` is het URL-voorvoegsel van de site (/nl, /en of /us),
   `lang` bepaalt welke taal uit de locale-velden gelezen wordt. */
export function PageBuilder({
  blocks,
  variant,
  lang,
  base,
}: {
  blocks?: Block[];
  variant: Variant;
  lang: Lang;
  base: string;
}) {
  if (!blocks?.length) {
    return (
      <p className="px-6 py-24 text-center text-ink/50">
        Deze pagina heeft nog geen blokken — voeg ze toe in de studio.
      </p>
    );
  }
  return (
    <>
      {blocks.map((block) => {
        switch (block._type) {
          case "hero":
            return (
              <Hero
                key={block._key}
                block={block}
                variant={variant}
                lang={lang}
                base={base}
              />
            );
          case "imageText":
            return <ImageTextBlock key={block._key} block={block} lang={lang} />;
          case "featureGrid":
            return (
              <FeatureGrid
                key={block._key}
                block={block}
                variant={variant}
                lang={lang}
              />
            );
          case "stats":
            return <Stats key={block._key} block={block} lang={lang} />;
          case "testimonials":
            return <Testimonials key={block._key} block={block} lang={lang} />;
          case "faq":
            return <Faq key={block._key} block={block} lang={lang} />;
          case "ctaBanner":
            return (
              <CtaBanner key={block._key} block={block} lang={lang} base={base} />
            );
          case "articleList":
            return (
              <ArticleList
                key={block._key}
                block={block}
                lang={lang}
                base={base}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
