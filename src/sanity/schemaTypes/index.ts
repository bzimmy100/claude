import { page } from "./documents/page";
import { article } from "./documents/article";
import { siteSettings } from "./documents/siteSettings";
import { localeString, localeText, localeRichText } from "./objects/locale";
import {
  cta,
  hero,
  imageText,
  featureGrid,
  stats,
  testimonials,
  faq,
  ctaBanner,
  articleList,
  pageBuilder,
} from "./objects/blocks";

export const schemaTypes = [
  // documenten
  page,
  article,
  siteSettings,
  // vertaalbare velden
  localeString,
  localeText,
  localeRichText,
  // blokken
  cta,
  hero,
  imageText,
  featureGrid,
  stats,
  testimonials,
  faq,
  ctaBanner,
  articleList,
  pageBuilder,
];
