import {
  defineField,
  defineType,
  type ConditionalPropertyCallback,
} from "sanity";

/* Per-veld vertaling: onder elk NL-veld staat het EN-veld.
   NL is de hoofdtaal — is het EN-veld leeg, dan valt de site terug op NL.
   Op US-pagina's wordt het NL-veld verborgen (die site is alleen Engels). */

const hideNlOnUsPages: ConditionalPropertyCallback = ({ document }) =>
  document?.market === "us";

export const localeString = defineType({
  name: "localeString",
  title: "Vertaalbare tekst",
  type: "object",
  fields: [
    defineField({
      name: "nl",
      title: "🇳🇱 Nederlands",
      type: "string",
      hidden: hideNlOnUsPages,
    }),
    defineField({ name: "en", title: "🇬🇧 English", type: "string" }),
  ],
});

export const localeText = defineType({
  name: "localeText",
  title: "Vertaalbare tekst (lang)",
  type: "object",
  fields: [
    defineField({
      name: "nl",
      title: "🇳🇱 Nederlands",
      type: "text",
      rows: 3,
      hidden: hideNlOnUsPages,
    }),
    defineField({ name: "en", title: "🇬🇧 English", type: "text", rows: 3 }),
  ],
});

export const localeRichText = defineType({
  name: "localeRichText",
  title: "Vertaalbare opgemaakte tekst",
  type: "object",
  fields: [
    defineField({
      name: "nl",
      title: "🇳🇱 Nederlands",
      type: "array",
      of: [{ type: "block" }],
      hidden: hideNlOnUsPages,
    }),
    defineField({
      name: "en",
      title: "🇬🇧 English",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
});
