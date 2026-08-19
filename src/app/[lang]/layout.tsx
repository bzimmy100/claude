import { notFound } from "next/navigation";
import { EuNav, SiteFooter } from "@/components/SiteChrome";
import { sanityFetch } from "@/sanity/lib/live";
import { loc, type Lang } from "@/sanity/lib/locale";
import { NAV_QUERY, SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { NavPageRaw, SettingsDoc } from "@/sanity/lib/types";

export const dynamic = "force-dynamic";

const LANGS = ["nl", "en"] as const;

export default async function EuLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  if (!LANGS.includes(langParam as (typeof LANGS)[number])) notFound();
  const lang = langParam as Lang;

  const [settingsRes, navRes] = await Promise.all([
    sanityFetch({ query: SETTINGS_QUERY, params: { market: "eu" } }),
    sanityFetch({ query: NAV_QUERY, params: { market: "eu" } }),
  ]);
  const settings = settingsRes.data as SettingsDoc;
  const navPages = ((navRes.data ?? []) as NavPageRaw[]).map((page) => ({
    _id: page._id,
    title: loc(page.title, lang),
    slug: lang === "en" ? (page.slugEn ?? page.slug) : page.slug,
  }));

  const otherLang = lang === "nl" ? "en" : "nl";
  return (
    <div className="min-h-screen">
      <EuNav
        settings={settings}
        navPages={navPages}
        lang={lang}
        switchHref={`/${otherLang}`}
      />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
