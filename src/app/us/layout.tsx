import { SiteFooter, UsNav } from "@/components/SiteChrome";
import { sanityFetch } from "@/sanity/lib/live";
import { NAV_QUERY, SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { NavPage, SettingsDoc } from "@/sanity/lib/types";

export const dynamic = "force-dynamic";

export default async function UsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settingsRes, navRes] = await Promise.all([
    sanityFetch({ query: SETTINGS_QUERY, params: { market: "us" } }),
    sanityFetch({
      query: NAV_QUERY,
      params: { market: "us", language: "en" },
    }),
  ]);
  const settings = settingsRes.data as SettingsDoc;
  const navPages = (navRes.data ?? []) as NavPage[];

  return (
    <div className="theme-us min-h-screen bg-white">
      <UsNav settings={settings} navPages={navPages} />
      <main>{children}</main>
      <SiteFooter settings={settings} dark />
    </div>
  );
}
