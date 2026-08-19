import { SiteFooter, UsNav } from "@/components/SiteChrome";
import { sanityFetch } from "@/sanity/lib/live";
import { loc } from "@/sanity/lib/locale";
import { NAV_QUERY, SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { NavPageRaw, SettingsDoc } from "@/sanity/lib/types";

export const dynamic = "force-dynamic";

export default async function UsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settingsRes, navRes] = await Promise.all([
    sanityFetch({ query: SETTINGS_QUERY, params: { market: "us" } }),
    sanityFetch({ query: NAV_QUERY, params: { market: "us" } }),
  ]);
  const settings = settingsRes.data as SettingsDoc;
  const navPages = ((navRes.data ?? []) as NavPageRaw[]).map((page) => ({
    _id: page._id,
    title: loc(page.title, "en"),
    slug: page.slug,
  }));

  return (
    <div className="theme-us min-h-screen bg-white">
      <UsNav settings={settings} navPages={navPages} />
      <main>{children}</main>
      <SiteFooter settings={settings} dark />
    </div>
  );
}
