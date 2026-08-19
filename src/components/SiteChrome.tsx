import Link from "next/link";
import { Sun } from "lucide-react";

type Settings = { siteTitle?: string; tagline?: string } | null;
type NavPage = { _id: string; title?: string; slug?: string };

/* Navigatie + footer voor de hoofdsite (NL/EN), met taalwissel. */
export function EuNav({
  settings,
  navPages,
  lang,
  switchHref,
}: {
  settings: Settings;
  navPages: NavPage[];
  lang: "nl" | "en";
  switchHref: string;
}) {
  const otherLang = lang === "nl" ? "en" : "nl";
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={`/${lang}`} className="flex items-center gap-2 font-bold">
          <Sun className="size-6 text-sun" />
          {settings?.siteTitle ?? "SunBooster"}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {navPages.map((page) => (
            <Link
              key={page._id}
              href={`/${lang}/${page.slug}`}
              className="hidden font-medium text-ink/70 hover:text-ink sm:block"
            >
              {page.title}
            </Link>
          ))}
          <Link
            href={switchHref}
            className="rounded-full bg-white px-3 py-1.5 font-semibold ring-1 ring-ink/10 hover:ring-ink/30"
            title={otherLang === "en" ? "Switch to English" : "Naar Nederlands"}
          >
            {otherLang.toUpperCase()}
          </Link>
          <Link
            href="/us"
            className="rounded-full px-3 py-1.5 font-semibold text-ink/50 ring-1 ring-ink/10 hover:text-ink"
            title="US site"
          >
            🇺🇸
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* Navigatie voor de US-site: donker, eigen stijl. */
export function UsNav({
  settings,
  navPages,
}: {
  settings: Settings;
  navPages: NavPage[];
}) {
  return (
    <header className="bg-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/us" className="flex items-center gap-2 text-lg font-bold">
          <Sun className="size-6 text-sun" />
          {settings?.siteTitle ?? "SunBooster US"}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {navPages.map((page) => (
            <Link
              key={page._id}
              href={`/us/${page.slug}`}
              className="hidden font-medium text-white/70 hover:text-white sm:block"
            >
              {page.title}
            </Link>
          ))}
          <Link
            href="/nl"
            className="rounded-full bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20"
            title="Naar de Europese site"
          >
            🇪🇺 EU
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({
  settings,
  dark = false,
}: {
  settings: Settings;
  dark?: boolean;
}) {
  return (
    <footer
      className={
        dark
          ? "bg-navy px-6 py-10 text-white/60"
          : "border-t border-ink/10 px-6 py-10 text-ink/60"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between text-sm">
        <p>{settings?.tagline ?? "SunBooster — bring the sun indoors."}</p>
        <p>Demo · Sanity CMS</p>
      </div>
    </footer>
  );
}
