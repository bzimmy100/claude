import Image from "next/image";
import Link from "next/link";
import type { PortableTextBlock } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { RichText } from "./RichText";

/* Alle blok-componenten. Elke component kent twee smaken:
   variant "eu" (hoofdsite) en "us" (US-site, eigen indeling). */

export type Variant = "eu" | "us";

type Cta = { label?: string; href?: string };
type SanityImg = { asset?: { _ref?: string } } & Record<string, unknown>;

function CtaButton({
  cta,
  kind = "primary",
  base = "",
}: {
  cta?: Cta;
  kind?: "primary" | "secondary";
  base?: string;
}) {
  if (!cta?.label) return null;
  const href = cta.href?.startsWith("/") ? `${base}${cta.href}` : (cta.href ?? "#");
  const styles =
    kind === "primary"
      ? "bg-sun text-white hover:bg-sun-deep"
      : "bg-white/80 text-ink ring-1 ring-ink/15 hover:bg-white";
  return (
    <Link
      href={href}
      className={`inline-block rounded-full px-6 py-3 text-sm font-semibold transition ${styles}`}
    >
      {cta.label}
    </Link>
  );
}

export function Hero({
  block,
  variant,
  base,
}: {
  block: {
    kicker?: string;
    title?: string;
    text?: string;
    image?: SanityImg;
    primaryCta?: Cta;
    secondaryCta?: Cta;
  };
  variant: Variant;
  base: string;
}) {
  if (variant === "us") {
    /* US: donkere, volle breedte-hero met gecentreerde tekst. */
    return (
      <section className="bg-navy px-6 py-24 text-center text-white">
        <div className="mx-auto max-w-3xl">
          {block.kicker && (
            <p className="mb-4 text-sm font-bold tracking-widest text-sun uppercase">
              {block.kicker}
            </p>
          )}
          <h1 className="text-4xl font-bold sm:text-6xl">{block.title}</h1>
          {block.text && (
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              {block.text}
            </p>
          )}
          <div className="mt-8 flex justify-center gap-4">
            <CtaButton cta={block.primaryCta} base={base} />
            <CtaButton cta={block.secondaryCta} kind="secondary" base={base} />
          </div>
          {block.image && (
            <Image
              src={urlFor(block.image).width(1600).url()}
              alt={block.title ?? ""}
              width={1600}
              height={900}
              className="mx-auto mt-12 w-full max-w-3xl rounded-3xl"
              priority
            />
          )}
        </div>
      </section>
    );
  }

  /* Hoofdsite: zachte split-hero, afbeelding rechts. */
  return (
    <section className="px-6 pt-16 pb-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          {block.kicker && (
            <p className="mb-4 text-sm font-bold tracking-widest text-sun-deep uppercase">
              {block.kicker}
            </p>
          )}
          <h1 className="text-4xl leading-tight font-bold sm:text-5xl">
            {block.title}
          </h1>
          {block.text && (
            <p className="mt-5 max-w-lg text-lg text-ink/70">{block.text}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <CtaButton cta={block.primaryCta} base={base} />
            <CtaButton cta={block.secondaryCta} kind="secondary" base={base} />
          </div>
        </div>
        {block.image && (
          <Image
            src={urlFor(block.image).width(1200).url()}
            alt={block.title ?? ""}
            width={1200}
            height={900}
            className="w-full rounded-3xl shadow-xl shadow-sun/20"
            priority
          />
        )}
      </div>
    </section>
  );
}

export function ImageTextBlock({
  block,
}: {
  block: {
    title?: string;
    body?: PortableTextBlock[];
    image?: SanityImg;
    imagePosition?: string;
  };
}) {
  const imageLeft = block.imagePosition === "links";
  return (
    <section className="px-6 py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className={imageLeft ? "md:order-2" : ""}>
          {block.title && (
            <h2 className="mb-4 text-3xl font-bold">{block.title}</h2>
          )}
          {block.body && <RichText value={block.body} />}
        </div>
        {block.image && (
          <Image
            src={urlFor(block.image).width(1200).url()}
            alt={block.title ?? ""}
            width={1200}
            height={900}
            className={`w-full rounded-3xl ${imageLeft ? "md:order-1" : ""}`}
          />
        )}
      </div>
    </section>
  );
}

export function FeatureGrid({
  block,
  variant,
}: {
  block: {
    title?: string;
    intro?: string;
    items?: { _key: string; emoji?: string; title?: string; text?: string }[];
  };
  variant: Variant;
}) {
  return (
    <section className="bg-sky px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          {block.title && <h2 className="text-3xl font-bold">{block.title}</h2>}
          {block.intro && <p className="mt-3 text-ink/70">{block.intro}</p>}
        </div>
        <div
          className={`mt-10 grid gap-6 ${
            variant === "us" ? "sm:grid-cols-2" : "sm:grid-cols-3"
          }`}
        >
          {block.items?.map((item, i) => (
            <div
              key={item._key}
              className={`rounded-2xl bg-white p-6 shadow-sm ${
                variant === "us" ? "flex items-start gap-4" : ""
              }`}
            >
              <div className="text-3xl">
                {variant === "us" ? (
                  <span className="font-bold text-sun">{i + 1}.</span>
                ) : (
                  (item.emoji ?? "☀️")
                )}
              </div>
              <div>
                <h3 className="mt-2 font-bold">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/70">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Stats({
  block,
}: {
  block: { title?: string; items?: { _key: string; value?: string; label?: string }[] };
}) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl text-center">
        {block.title && <h2 className="text-3xl font-bold">{block.title}</h2>}
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {block.items?.map((item) => (
            <div key={item._key}>
              <div className="text-5xl font-bold text-sun-deep">
                {item.value}
              </div>
              <p className="mt-2 text-sm text-ink/70">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({
  block,
}: {
  block: {
    title?: string;
    items?: { _key: string; quote?: string; name?: string; role?: string }[];
  };
}) {
  return (
    <section className="bg-sky px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {block.title && (
          <h2 className="text-center text-3xl font-bold">{block.title}</h2>
        )}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {block.items?.map((item) => (
            <figure key={item._key} className="rounded-2xl bg-white p-6 shadow-sm">
              <blockquote className="text-sm leading-relaxed text-ink/80">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold">
                {item.name}
                {item.role && (
                  <span className="block font-normal text-ink/50">
                    {item.role}
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq({
  block,
}: {
  block: {
    title?: string;
    items?: { _key: string; question?: string; answer?: PortableTextBlock[] }[];
  };
}) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        {block.title && (
          <h2 className="mb-8 text-center text-3xl font-bold">{block.title}</h2>
        )}
        <div className="space-y-3">
          {block.items?.map((item) => (
            <details
              key={item._key}
              className="group rounded-2xl bg-white p-5 shadow-sm"
            >
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                {item.question}
              </summary>
              {item.answer && (
                <div className="mt-3">
                  <RichText value={item.answer} />
                </div>
              )}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBanner({
  block,
  base,
}: {
  block: { title?: string; text?: string; cta?: Cta };
  base: string;
}) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl rounded-3xl bg-sun px-8 py-14 text-center text-white">
        <h2 className="text-3xl font-bold">{block.title}</h2>
        {block.text && (
          <p className="mx-auto mt-3 max-w-xl text-white/85">{block.text}</p>
        )}
        {block.cta?.label && (
          <Link
            href={
              block.cta.href?.startsWith("/")
                ? `${base}${block.cta.href}`
                : (block.cta.href ?? "#")
            }
            className="mt-7 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-sun-deep transition hover:scale-105"
          >
            {block.cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}

export function ArticleList({
  block,
  base,
}: {
  block: {
    title?: string;
    max?: number;
    articles?: {
      _id: string;
      title?: string;
      slug?: { current?: string };
      excerpt?: string;
      coverImage?: SanityImg;
    }[];
  };
  base: string;
}) {
  const articles = block.articles?.slice(0, block.max ?? 3) ?? [];
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {block.title && <h2 className="text-3xl font-bold">{block.title}</h2>}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article._id}
              href={`${base}/blog/${article.slug?.current}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
            >
              {article.coverImage && (
                <Image
                  src={urlFor(article.coverImage).width(800).height(450).url()}
                  alt={article.title ?? ""}
                  width={800}
                  height={450}
                  className="w-full"
                />
              )}
              <div className="p-5">
                <h3 className="font-bold group-hover:text-sun-deep">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="mt-2 text-sm text-ink/70">{article.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
