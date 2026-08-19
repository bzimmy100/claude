import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import {
  loc,
  locRich,
  type Lang,
  type LocaleRichText,
  type LocaleString,
} from "@/sanity/lib/locale";
import { RichText } from "./RichText";

/* Alle blok-componenten. Elke component kent twee smaken:
   variant "eu" (hoofdsite) en "us" (US-site, eigen indeling).
   Tekstvelden zijn locale-velden; `lang` bepaalt welke taal je ziet. */

export type Variant = "eu" | "us";

type Cta = { label?: LocaleString; href?: LocaleString };
type SanityImg = { asset?: { _ref?: string } } & Record<string, unknown>;

function CtaButton({
  cta,
  lang,
  kind = "primary",
  base = "",
}: {
  cta?: Cta;
  lang: Lang;
  kind?: "primary" | "secondary";
  base?: string;
}) {
  const label = loc(cta?.label, lang);
  if (!label) return null;
  const rawHref = loc(cta?.href, lang) ?? "#";
  const href = rawHref.startsWith("/") ? `${base}${rawHref}` : rawHref;
  const styles =
    kind === "primary"
      ? "bg-sun text-white hover:bg-sun-deep"
      : "bg-white/80 text-ink ring-1 ring-ink/15 hover:bg-white";
  return (
    <Link
      href={href}
      className={`inline-block rounded-full px-6 py-3 text-sm font-semibold transition ${styles}`}
    >
      {label}
    </Link>
  );
}

export function Hero({
  block,
  variant,
  lang,
  base,
}: {
  block: {
    kicker?: LocaleString;
    title?: LocaleString;
    text?: LocaleString;
    image?: SanityImg;
    primaryCta?: Cta;
    secondaryCta?: Cta;
  };
  variant: Variant;
  lang: Lang;
  base: string;
}) {
  const kicker = loc(block.kicker, lang);
  const title = loc(block.title, lang);
  const text = loc(block.text, lang);

  if (variant === "us") {
    /* US: donkere, volle breedte-hero met gecentreerde tekst. */
    return (
      <section className="bg-navy px-6 py-24 text-center text-white">
        <div className="mx-auto max-w-3xl">
          {kicker && (
            <p className="mb-4 text-sm font-bold tracking-widest text-sun uppercase">
              {kicker}
            </p>
          )}
          <h1 className="text-4xl font-bold sm:text-6xl">{title}</h1>
          {text && (
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">{text}</p>
          )}
          <div className="mt-8 flex justify-center gap-4">
            <CtaButton cta={block.primaryCta} lang={lang} base={base} />
            <CtaButton
              cta={block.secondaryCta}
              lang={lang}
              kind="secondary"
              base={base}
            />
          </div>
          {block.image && (
            <Image
              src={urlFor(block.image).width(1600).url()}
              alt={title ?? ""}
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
          {kicker && (
            <p className="mb-4 text-sm font-bold tracking-widest text-sun-deep uppercase">
              {kicker}
            </p>
          )}
          <h1 className="text-4xl leading-tight font-bold sm:text-5xl">
            {title}
          </h1>
          {text && <p className="mt-5 max-w-lg text-lg text-ink/70">{text}</p>}
          <div className="mt-8 flex flex-wrap gap-4">
            <CtaButton cta={block.primaryCta} lang={lang} base={base} />
            <CtaButton
              cta={block.secondaryCta}
              lang={lang}
              kind="secondary"
              base={base}
            />
          </div>
        </div>
        {block.image && (
          <Image
            src={urlFor(block.image).width(1200).url()}
            alt={title ?? ""}
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
  lang,
}: {
  block: {
    title?: LocaleString;
    body?: LocaleRichText;
    image?: SanityImg;
    imagePosition?: string;
  };
  lang: Lang;
}) {
  const imageLeft = block.imagePosition === "links";
  const title = loc(block.title, lang);
  const body = locRich(block.body, lang);
  return (
    <section className="px-6 py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className={imageLeft ? "md:order-2" : ""}>
          {title && <h2 className="mb-4 text-3xl font-bold">{title}</h2>}
          {body && <RichText value={body} />}
        </div>
        {block.image && (
          <Image
            src={urlFor(block.image).width(1200).url()}
            alt={title ?? ""}
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
  lang,
}: {
  block: {
    title?: LocaleString;
    intro?: LocaleString;
    items?: {
      _key: string;
      emoji?: string;
      title?: LocaleString;
      text?: LocaleString;
    }[];
  };
  variant: Variant;
  lang: Lang;
}) {
  const title = loc(block.title, lang);
  const intro = loc(block.intro, lang);
  return (
    <section className="bg-sky px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          {title && <h2 className="text-3xl font-bold">{title}</h2>}
          {intro && <p className="mt-3 text-ink/70">{intro}</p>}
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
                <h3 className="mt-2 font-bold">{loc(item.title, lang)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/70">
                  {loc(item.text, lang)}
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
  lang,
}: {
  block: {
    title?: LocaleString;
    items?: { _key: string; value?: LocaleString; label?: LocaleString }[];
  };
  lang: Lang;
}) {
  const title = loc(block.title, lang);
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl text-center">
        {title && <h2 className="text-3xl font-bold">{title}</h2>}
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {block.items?.map((item) => (
            <div key={item._key}>
              <div className="text-5xl font-bold text-sun-deep">
                {loc(item.value, lang)}
              </div>
              <p className="mt-2 text-sm text-ink/70">{loc(item.label, lang)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({
  block,
  lang,
}: {
  block: {
    title?: LocaleString;
    items?: {
      _key: string;
      quote?: LocaleString;
      name?: string;
      role?: LocaleString;
    }[];
  };
  lang: Lang;
}) {
  const title = loc(block.title, lang);
  return (
    <section className="bg-sky px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {title && <h2 className="text-center text-3xl font-bold">{title}</h2>}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {block.items?.map((item) => (
            <figure key={item._key} className="rounded-2xl bg-white p-6 shadow-sm">
              <blockquote className="text-sm leading-relaxed text-ink/80">
                “{loc(item.quote, lang)}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold">
                {item.name}
                {loc(item.role, lang) && (
                  <span className="block font-normal text-ink/50">
                    {loc(item.role, lang)}
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
  lang,
}: {
  block: {
    title?: LocaleString;
    items?: {
      _key: string;
      question?: LocaleString;
      answer?: LocaleRichText;
    }[];
  };
  lang: Lang;
}) {
  const title = loc(block.title, lang);
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        {title && (
          <h2 className="mb-8 text-center text-3xl font-bold">{title}</h2>
        )}
        <div className="space-y-3">
          {block.items?.map((item) => {
            const answer = locRich(item.answer, lang);
            return (
              <details
                key={item._key}
                className="group rounded-2xl bg-white p-5 shadow-sm"
              >
                <summary className="cursor-pointer list-none font-semibold marker:hidden">
                  {loc(item.question, lang)}
                </summary>
                {answer && (
                  <div className="mt-3">
                    <RichText value={answer} />
                  </div>
                )}
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CtaBanner({
  block,
  lang,
  base,
}: {
  block: { title?: LocaleString; text?: LocaleString; cta?: Cta };
  lang: Lang;
  base: string;
}) {
  const title = loc(block.title, lang);
  const text = loc(block.text, lang);
  const label = loc(block.cta?.label, lang);
  const rawHref = loc(block.cta?.href, lang) ?? "#";
  const href = rawHref.startsWith("/") ? `${base}${rawHref}` : rawHref;
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl rounded-3xl bg-sun px-8 py-14 text-center text-white">
        <h2 className="text-3xl font-bold">{title}</h2>
        {text && <p className="mx-auto mt-3 max-w-xl text-white/85">{text}</p>}
        {label && (
          <Link
            href={href}
            className="mt-7 inline-block rounded-full bg-white px-7 py-3 text-sm font-semibold text-sun-deep transition hover:scale-105"
          >
            {label}
          </Link>
        )}
      </div>
    </section>
  );
}

export function ArticleList({
  block,
  lang,
  base,
}: {
  block: {
    title?: LocaleString;
    max?: number;
    articles?: {
      _id: string;
      title?: string;
      slug?: { current?: string };
      excerpt?: string;
      coverImage?: SanityImg;
    }[];
  };
  lang: Lang;
  base: string;
}) {
  const title = loc(block.title, lang);
  const articles = block.articles?.slice(0, block.max ?? 3) ?? [];
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {title && <h2 className="text-3xl font-bold">{title}</h2>}
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
