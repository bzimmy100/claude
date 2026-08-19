import { defineField, defineType } from "sanity";
import { Settings } from "lucide-react";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site-instellingen",
  type: "document",
  icon: Settings,
  fields: [
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
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "siteTitle", title: "Sitenaam", type: "string" }),
    defineField({
      name: "tagline",
      title: "Tagline (footer)",
      type: "string",
    }),
  ],
  preview: {
    select: { market: "market", title: "siteTitle" },
    prepare: ({ market, title }) => ({
      title: title ?? "Site-instellingen",
      subtitle: market === "us" ? "US-site" : "Hoofdsite (NL/EN)",
    }),
  },
});
