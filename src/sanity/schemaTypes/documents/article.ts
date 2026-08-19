import { defineField, defineType } from "sanity";
import { Newspaper } from "lucide-react";

export const article = defineType({
  name: "article",
  title: "Artikel",
  type: "document",
  icon: Newspaper,
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "excerpt",
      title: "Samenvatting",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "coverImage",
      title: "Omslagafbeelding",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "Tekst",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
    }),
  ],
  preview: {
    select: { title: "title", language: "language", media: "coverImage" },
    prepare: ({ title, language, media }) => ({
      title,
      subtitle: language?.toUpperCase(),
      media,
    }),
  },
});
