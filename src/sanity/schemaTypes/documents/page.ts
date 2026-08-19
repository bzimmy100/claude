import { defineField, defineType } from "sanity";
import { FileText } from "lucide-react";

export const page = defineType({
  name: "page",
  title: "Pagina",
  type: "document",
  icon: FileText,
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title" },
      description: 'Voor de homepagina gebruik je "home".',
      validation: (rule) => rule.required(),
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
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
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
    select: { title: "title", language: "language", market: "market" },
    prepare: ({ title, language, market }) => ({
      title,
      subtitle: [market === "us" ? "US" : "NL/EN", language?.toUpperCase()]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
