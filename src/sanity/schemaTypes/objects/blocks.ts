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

/* Eén knop/link, gebruikt in hero en CTA-banner. */
export const cta = defineType({
  name: "cta",
  title: "Knop",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Tekst", type: "string" }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description: "Interne link (bijv. /science) of externe URL",
    }),
  ],
});

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  icon: Sun,
  fields: [
    defineField({ name: "kicker", title: "Bovenregel", type: "string" }),
    defineField({ name: "title", title: "Titel", type: "string" }),
    defineField({ name: "text", title: "Tekst", type: "text", rows: 3 }),
    defineField({
      name: "image",
      title: "Afbeelding",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "primaryCta", title: "Primaire knop", type: "cta" }),
    defineField({ name: "secondaryCta", title: "Secundaire knop", type: "cta" }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title ?? "Hero", subtitle: "Hero" }),
  },
});

export const imageText = defineType({
  name: "imageText",
  title: "Tekst + afbeelding",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({ name: "title", title: "Titel", type: "string" }),
    defineField({
      name: "body",
      title: "Tekst",
      type: "array",
      of: [{ type: "block" }],
    }),
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
  preview: {
    select: { title: "title", media: "image" },
    prepare: ({ title, media }) => ({
      title: title ?? "Tekst + afbeelding",
      subtitle: "Tekst + afbeelding",
      media,
    }),
  },
});

export const featureGrid = defineType({
  name: "featureGrid",
  title: "Voordelen-grid",
  type: "object",
  icon: LayoutGrid,
  fields: [
    defineField({ name: "title", title: "Titel", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2 }),
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
            defineField({ name: "title", title: "Titel", type: "string" }),
            defineField({ name: "text", title: "Tekst", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "title", subtitle: "emoji" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: title ?? "Voordelen-grid",
      subtitle: "Voordelen-grid",
    }),
  },
});

export const stats = defineType({
  name: "stats",
  title: "Cijfers",
  type: "object",
  icon: BarChart3,
  fields: [
    defineField({ name: "title", title: "Titel", type: "string" }),
    defineField({
      name: "items",
      title: "Cijfers",
      type: "array",
      of: [
        {
          type: "object",
          name: "statItem",
          fields: [
            defineField({ name: "value", title: "Waarde", type: "string" }),
            defineField({ name: "label", title: "Omschrijving", type: "string" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title ?? "Cijfers", subtitle: "Cijfers" }),
  },
});

export const testimonials = defineType({
  name: "testimonials",
  title: "Reviews",
  type: "object",
  icon: MessageSquareQuote,
  fields: [
    defineField({ name: "title", title: "Titel", type: "string" }),
    defineField({
      name: "items",
      title: "Reviews",
      type: "array",
      of: [
        {
          type: "object",
          name: "testimonialItem",
          fields: [
            defineField({ name: "quote", title: "Quote", type: "text", rows: 3 }),
            defineField({ name: "name", title: "Naam", type: "string" }),
            defineField({ name: "role", title: "Functie", type: "string" }),
          ],
          preview: { select: { title: "name", subtitle: "quote" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title ?? "Reviews", subtitle: "Reviews" }),
  },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  icon: HelpCircle,
  fields: [
    defineField({ name: "title", title: "Titel", type: "string" }),
    defineField({
      name: "items",
      title: "Vragen",
      type: "array",
      of: [
        {
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", title: "Vraag", type: "string" }),
            defineField({
              name: "answer",
              title: "Antwoord",
              type: "array",
              of: [{ type: "block" }],
            }),
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: title ?? "FAQ", subtitle: "FAQ" }),
  },
});

export const ctaBanner = defineType({
  name: "ctaBanner",
  title: "Call-to-action",
  type: "object",
  icon: Megaphone,
  fields: [
    defineField({ name: "title", title: "Titel", type: "string" }),
    defineField({ name: "text", title: "Tekst", type: "text", rows: 2 }),
    defineField({ name: "cta", title: "Knop", type: "cta" }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: title ?? "Call-to-action",
      subtitle: "Call-to-action",
    }),
  },
});

export const articleList = defineType({
  name: "articleList",
  title: "Laatste artikelen",
  type: "object",
  icon: Newspaper,
  fields: [
    defineField({ name: "title", title: "Titel", type: "string" }),
    defineField({
      name: "max",
      title: "Maximum aantal",
      type: "number",
      initialValue: 3,
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({
      title: title ?? "Laatste artikelen",
      subtitle: "Laatste artikelen (automatisch gevuld)",
    }),
  },
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
