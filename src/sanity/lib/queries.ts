import { defineQuery } from "next-sanity";

/* Pagina's matchen op taal-specifieke slug:
   NL gebruikt `slug`, EN gebruikt `slugEn` en valt terug op `slug`. */
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && market == $market && (
    ($language == "nl" && slug.current == $slug) ||
    ($language != "nl" && coalesce(slugEn.current, slug.current) == $slug)
  )][0]{
    _id, title, slug, market,
    pageBuilder[]{
      ...,
      _type == "articleList" => {
        ...,
        "articles": *[_type == "article" && language == $language]
          | order(_createdAt desc)[0...12]{
            _id, title, slug, excerpt, coverImage
          }
      }
    }
  }
`);

export const ARTICLE_QUERY = defineQuery(`
  *[_type == "article" && language == $language && slug.current == $slug][0]{
    _id, title, excerpt, coverImage, body, language,
    "translations": *[_type == "translation.metadata" && references(^._id)][0]
      .translations[]{ "language": _key, "slug": @.value->slug.current }
  }
`);

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && market == $market][0]{
    siteTitle, tagline
  }
`);

/* Het menu volgt automatisch de pagina's van de site. */
export const NAV_QUERY = defineQuery(`
  *[_type == "page" && market == $market && slug.current != "home"]
    | order(coalesce(navOrder, 99) asc, title.nl asc){
    _id, title, "slug": slug.current, "slugEn": slugEn.current
  }
`);
