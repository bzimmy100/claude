import type { PortableTextBlock } from "next-sanity";

/* Lichte handmatige typen voor de demo (zonder Sanity TypeGen). */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PageBlock = { _type: string; _key: string; title?: string } & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type PageDoc = {
  _id: string;
  title?: string;
  pageBuilder?: PageBlock[];
} | null;

export type ArticleDoc = {
  _id: string;
  title?: string;
  excerpt?: string;
  coverImage?: { asset?: { _ref?: string } };
  body?: PortableTextBlock[];
} | null;

export type SettingsDoc = { siteTitle?: string; tagline?: string } | null;

export type NavPage = { _id: string; title?: string; slug?: string };
