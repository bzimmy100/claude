import { defineQuery } from "next-sanity";

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && market == $market && language == $language && slug.current == $slug][0]{
    _id, title, slug, market, language,
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

/* Het menu volgt automatisch de pagina's van de site/taal. */
export const NAV_QUERY = defineQuery(`
  *[_type == "page" && market == $market && language == $language
    && slug.current != "home"] | order(coalesce(navOrder, 99) asc, title asc){
    _id, title, "slug": slug.current
  }
`);

/* Vind de vertaling van een pagina, voor de taalwissel in de navigatie. */
export const PAGE_TRANSLATIONS_QUERY = defineQuery(`
  *[_type == "translation.metadata" && references($id)][0]
    .translations[]{ "language": _key, "slug": @.value->slug.current }
`);
