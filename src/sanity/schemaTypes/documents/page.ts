import { defineField, defineType } from "sanity";
import { FileText } from "lucide-react";

/* Eén document per pagina. De structuur (blokken) is voor NL en EN
   automatisch gelijk; alleen de inhoud wordt per veld vertaald.
   De US-site heeft eigen pagina's (market: "us"), alleen in het Engels. */

export const page = defineType({
  name: "page",
  title: "Pagina",
  type: "document",
  icon: FileText,
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title.nl" },
      description: 'Voor de homepagina gebruik je "home".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slugEn",
      title: "Slug (Engelse URL)",
      type: "slug",
      options: { source: "title.en" },
      description: "Leeg laten = zelfde als de Nederlandse slug.",
      hidden: ({ document }) => document?.market === "us",
    }),
    defineField({
      name: "market",
      title: "Site",
      type: "string",
      options: {
        list: [
          { title: "Hoofdsite (NL/EN)", value: "eu" },
          { title: "US-site", value: "us" },
        ],
        layout: "radio",
      },
      initialValue: "eu",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "navOrder",
      title: "Volgorde in menu",
      type: "number",
      description: "Laag nummer = eerder in het menu. Leeg = achteraan.",
    }),
    defineField({
      name: "pageBuilder",
      title: "Pagina-opbouw",
      type: "pageBuilder",
    }),
  ],
  preview: {
    select: { nl: "title.nl", en: "title.en", market: "market" },
    prepare: ({ nl, en, market }) => ({
      title: nl ?? en,
      subtitle: market === "us" ? "US-site" : "Hoofdsite (NL/EN)",
    }),
  },
});
