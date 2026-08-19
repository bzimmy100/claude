import { defineField, defineType } from "sanity";
import {
  Sun,
  Image as ImageIcon,
  LayoutGrid,
  BarChart3,
  MessageSquareQuote,
  HelpCircle,
  Megaphone,
  Newspaper,
} from "lucide-react";

/* Alle tekstvelden zijn "locale"-velden: NL met daaronder EN.
   Zo delen beide talen automatisch dezelfde pagina-opbouw en hoeft
   alleen de inhoud vertaald te worden. */

const titlePreview = {
  select: { nl: "title.nl", en: "title.en" },
  prepare: ({ nl, en }: { nl?: string; en?: string }, subtitle?: string) => ({
    title: nl ?? en ?? subtitle,
    subtitle,
  }),
};

const preview = (subtitle: string) => ({
  select: titlePreview.select,
  prepare: (sel: { nl?: string; en?: string }) =>
    titlePreview.prepare(sel, subtitle),
});

/* Eén knop/link, gebruikt in hero en CTA-banner. */
export const cta = defineType({
  name: "cta",
  title: "Knop",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Tekst", type: "localeString" }),
    defineField({
      name: "href",
      title: "Link",
      type: "localeString",
      description:
        "Interne link (bijv. /wetenschap — EN-veld: /science) of externe URL. EN leeg = zelfde als NL.",
    }),
  ],
});

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  icon: Sun,
  fields: [
    defineField({ name: "kicker", title: "Bovenregel", type: "localeString" }),
    defineField({ name: "title", title: "Titel", type: "localeString" }),
    defineField({ name: "text", title: "Tekst", type: "localeText" }),
    defineField({
      name: "image",
      title: "Afbeelding",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "primaryCta", title: "Primaire knop", type: "cta" }),
    defineField({ name: "secondaryCta", title: "Secundaire knop", type: "cta" }),
  ],
  preview: preview("Hero"),
});

export const imageText = defineType({
  name: "imageText",
  title: "Tekst + afbeelding",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({ name: "title", title: "Titel", type: "localeString" }),
    defineField({ name: "body", title: "Tekst", type: "localeRichText" }),
    defineField({
      name: "image",
      title: "Afbeelding",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imagePosition",
      title: "Positie afbeelding",
      type: "string",
      options: { list: ["links", "rechts"], layout: "radio" },
      initialValue: "rechts",
    }),
  ],
  preview: preview("Tekst + afbeelding"),
});

export const featureGrid = defineType({
  name: "featureGrid",
  title: "Voordelen-grid",
  type: "object",
  icon: LayoutGrid,
  fields: [
    defineField({ name: "title", title: "Titel", type: "localeString" }),
    defineField({ name: "intro", title: "Intro", type: "localeText" }),
    defineField({
      name: "background",
      title: "Achtergrondkleur",
      type: "string",
      options: {
        list: [
          { title: "Lichtblauw", value: "sky" },
          { title: "Crème", value: "cream" },
          { title: "Zongeel", value: "sun" },
          { title: "Donker", value: "navy" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "sky",
    }),
    defineField({
      name: "items",
      title: "Voordelen",
      type: "array",
      of: [
        {
          type: "object",
          name: "featureItem",
          fields: [
            defineField({ name: "emoji", title: "Emoji", type: "string" }),
            defineField({ name: "title", title: "Titel", type: "localeString" }),
            defineField({ name: "text", title: "Tekst", type: "localeText" }),
          ],
          preview: preview("Voordeel"),
        },
      ],
    }),
  ],
  preview: preview("Voordelen-grid"),
});

export const stats = defineType({
  name: "stats",
  title: "Cijfers",
  type: "object",
  icon: BarChart3,
  fields: [
    defineField({ name: "title", title: "Titel", type: "localeString" }),
    defineField({
      name: "items",
      title: "Cijfers",
      type: "array",
      of: [
        {
          type: "object",
          name: "statItem",
          fields: [
            defineField({ name: "value", title: "Waarde", type: "localeString" }),
            defineField({
              name: "label",
              title: "Omschrijving",
              type: "localeString",
            }),
          ],
          preview: {
            select: { nl: "value.nl", en: "value.en", sub: "label.nl" },
            prepare: ({ nl, en, sub }) => ({
              title: nl ?? en,
              subtitle: sub,
            }),
          },
        },
      ],
    }),
  ],
  preview: preview("Cijfers"),
});

export const testimonials = defineType({
  name: "testimonials",
  title: "Reviews",
  type: "object",
  icon: MessageSquareQuote,
  fields: [
    defineField({ name: "title", title: "Titel", type: "localeString" }),
    defineField({
      name: "items",
      title: "Reviews",
      type: "array",
      of: [
        {
          type: "object",
          name: "testimonialItem",
          fields: [
            defineField({ name: "quote", title: "Quote", type: "localeText" }),
            defineField({ name: "name", title: "Naam", type: "string" }),
            defineField({ name: "role", title: "Functie", type: "localeString" }),
          ],
          preview: {
            select: { title: "name", subtitle: "quote.nl" },
          },
        },
      ],
    }),
  ],
  preview: preview("Reviews"),
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  icon: HelpCircle,
  fields: [
    defineField({ name: "title", title: "Titel", type: "localeString" }),
    defineField({
      name: "items",
      title: "Vragen",
      type: "array",
      of: [
        {
          type: "object",
          name: "faqItem",
          fields: [
            defineField({
              name: "question",
              title: "Vraag",
              type: "localeString",
            }),
            defineField({
              name: "answer",
              title: "Antwoord",
              type: "localeRichText",
            }),
          ],
          preview: {
            select: { nl: "question.nl", en: "question.en" },
            prepare: ({ nl, en }) => ({ title: nl ?? en }),
          },
        },
      ],
    }),
  ],
  preview: preview("FAQ"),
});

export const ctaBanner = defineType({
  name: "ctaBanner",
  title: "Call-to-action",
  type: "object",
  icon: Megaphone,
  fields: [
    defineField({ name: "title", title: "Titel", type: "localeString" }),
    defineField({ name: "text", title: "Tekst", type: "localeText" }),
    defineField({ name: "cta", title: "Knop", type: "cta" }),
  ],
  preview: preview("Call-to-action"),
});

export const articleList = defineType({
  name: "articleList",
  title: "Laatste artikelen",
  type: "object",
  icon: Newspaper,
  fields: [
    defineField({ name: "title", title: "Titel", type: "localeString" }),
    defineField({
      name: "max",
      title: "Maximum aantal",
      type: "number",
      initialValue: 3,
    }),
  ],
  preview: preview("Laatste artikelen (automatisch gevuld)"),
});

/* Het bouwblokken-veld dat elke pagina gebruikt. */
export const pageBuilder = defineType({
  name: "pageBuilder",
  title: "Pagina-opbouw",
  type: "array",
  of: [
    { type: "hero" },
    { type: "imageText" },
    { type: "featureGrid" },
    { type: "stats" },
    { type: "testimonials" },
    { type: "faq" },
    { type: "ctaBanner" },
    { type: "articleList" },
  ],
  options: { insertMenu: { views: [{ name: "list" }] } },
});
