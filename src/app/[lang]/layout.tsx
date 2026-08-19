import { notFound } from "next/navigation";
import { EuNav, SiteFooter } from "@/components/SiteChrome";
import { sanityFetch } from "@/sanity/lib/live";
import { NAV_QUERY, SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { NavPage, SettingsDoc } from "@/sanity/lib/types";

export const dynamic = "force-dynamic";

const LANGS = ["nl", "en"] as const;

export default async function EuLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LANGS.includes(lang as (typeof LANGS)[number])) notFound();

  const [settingsRes, navRes] = await Promise.all([
    sanityFetch({ query: SETTINGS_QUERY, params: { market: "eu" } }),
    sanityFetch({ query: NAV_QUERY, params: { market: "eu", language: lang } }),
  ]);
  const settings = settingsRes.data as SettingsDoc;
  const navPages = (navRes.data ?? []) as NavPage[];

  const otherLang = lang === "nl" ? "en" : "nl";
  return (
    <div className="min-h-screen">
      <EuNav
        settings={settings}
        navPages={navPages}
        lang={lang as "nl" | "en"}
        switchHref={`/${otherLang}`}
      />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </div>
  );
}
