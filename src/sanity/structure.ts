import type { StructureResolver } from "sanity/structure";

/* Studio-indeling: de hoofdsite (NL/EN), de aparte US-site,
   artikelen en instellingen netjes gegroepeerd. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Hoofdsite · Nederlands")
        .child(
          S.documentTypeList("page")
            .title("Pagina's (NL)")
            .filter('_type == "page" && market == "eu" && language == "nl"')
            .apiVersion("2025-02-19")
        ),
      S.listItem()
        .title("Hoofdsite · English")
        .child(
          S.documentTypeList("page")
            .title("Pages (EN)")
            .filter('_type == "page" && market == "eu" && language == "en"')
            .apiVersion("2025-02-19")
        ),
      S.listItem()
        .title("US-site (eigen indeling)")
        .child(
          S.documentTypeList("page")
            .title("US pages")
            .filter('_type == "page" && market == "us"')
            .apiVersion("2025-02-19")
        ),
      S.divider(),
      S.listItem()
        .title("Artikelen · Nederlands")
        .child(
          S.documentTypeList("article")
            .title("Artikelen (NL)")
            .filter('_type == "article" && language == "nl"')
            .apiVersion("2025-02-19")
        ),
      S.listItem()
        .title("Artikelen · English")
        .child(
          S.documentTypeList("article")
            .title("Articles (EN)")
            .filter('_type == "article" && language == "en"')
            .apiVersion("2025-02-19")
        ),
      S.divider(),
      S.listItem()
        .title("Site-instellingen")
        .child(S.documentTypeList("siteSettings").title("Site-instellingen")),
    ]);
