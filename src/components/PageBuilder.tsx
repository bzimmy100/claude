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
type Block = { _type: string; _key: string; title?: string } & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

/* Zet de blokken uit Sanity om naar componenten.
   `base` is het URL-voorvoegsel van de site (/nl, /en of /us). */
export function PageBuilder({
  blocks,
  variant,
  base,
}: {
  blocks?: Block[];
  variant: Variant;
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
              <Hero key={block._key} block={block} variant={variant} base={base} />
            );
          case "imageText":
            return <ImageTextBlock key={block._key} block={block} />;
          case "featureGrid":
            return (
              <FeatureGrid key={block._key} block={block} variant={variant} />
            );
          case "stats":
            return <Stats key={block._key} block={block} />;
          case "testimonials":
            return <Testimonials key={block._key} block={block} />;
          case "faq":
            return <Faq key={block._key} block={block} />;
          case "ctaBanner":
            return <CtaBanner key={block._key} block={block} base={base} />;
          case "articleList":
            return <ArticleList key={block._key} block={block} base={base} />;
          default:
            return null;
        }
      })}
    </>
  );
}
