# SunBooster · Sanity-demo

Demo-website op basis van [Sanity](https://www.sanity.io) voor
[sunbooster.health](https://www.sunbooster.health), met:

- **Blokken (page builder)** — pagina's opgebouwd uit versleepbare secties
  (hero, voordelen, cijfers, reviews, FAQ, call-to-action, artikelen)
- **Meertaligheid NL → EN, per veld** — NL is de hoofdtaal; onder elk
  NL-veld staat het EN-veld. Voeg je een sectie toe, dan staat die
  automatisch in beide talen — alleen de inhoud hoeft vertaald. EN valt
  terug op NL zolang er nog geen vertaling is. Slugs mogen per taal
  verschillen (`/nl/wetenschap` ↔ `/en/science`). Artikelen tonen het
  andere model: losse gekoppelde documenten per taal (een artikel hoeft
  niet in alle talen te bestaan)
- **Aparte US-site** — zelfde CMS, maar een eigen site met een eigen
  indeling én uitstraling (`/us`), niet alleen andere tekst
- **Live preview** — de Presentation-tool in de studio toont wijzigingen
  direct naast de editor (het Sanity-equivalent van Storyblok's visual editor)

Alles draait in één Next.js-app; de Sanity Studio zit ingebouwd op `/studio`.

## Setup (eenmalig, ±5 minuten)

1. **Clone en installeer**

   ```bash
   git clone https://github.com/bzimmy100/claude.git sunbooster-demo
   cd sunbooster-demo
   git checkout claude/sanity-demo-tokens-iybwfz
   npm install
   ```

2. **Token invullen**

   ```bash
   cp .env.example .env
   ```

   Maak op [sanity.io/manage → project → API → Tokens](https://www.sanity.io/organizations/oieU862NK/project/no1wfx74/api)
   een token met **Editor**-rechten en vul het in `.env` in bij
   `SANITY_API_TOKEN` én `SANITY_API_READ_TOKEN`.

3. **CORS toestaan** — op dezelfde API-pagina, onder *CORS origins*:
   voeg `http://localhost:3000` toe (met *Allow credentials* aangevinkt).
   Nodig omdat de studio op poort 3000 draait.

4. **Demo-content laden**

   ```bash
   npm run seed
   ```

   Dit vult project `no1wfx74` (dataset `production`) met de
   SunBooster-pagina's in NL/EN, de US-site, twee artikelen en de
   afbeeldingen. Het script is idempotent: nogmaals draaien zet de
   demo-content terug in de beginstand — handig na het oefenen van de demo.

5. **Starten**

   ```bash
   npm run demo
   ```

   `npm run demo` draait de site in productie-modus: snel en zonder
   zichtbaar herladen bij elke wijziging — gebruik dit voor de demo zelf.
   Gebruik `npm run dev` alleen als je aan de code werkt (na een
   `git pull` met codewijzigingen eerst opnieuw `npm run demo` starten,
   die bouwt de nieuwe code automatisch).

   | URL | Wat |
   | --- | --- |
   | <http://localhost:3000/nl> | Hoofdsite, Nederlands |
   | <http://localhost:3000/en> | Hoofdsite, Engels |
   | <http://localhost:3000/us> | US-site (eigen indeling) |
   | <http://localhost:3000/studio> | Sanity Studio (inloggen met je Sanity-account) |

## Demo-draaiboek

1. **Blokken tonen** — Studio → *Hoofdsite · Nederlands* → *Home*. Laat de
   pagina-opbouw zien: sleep een blok omhoog, voeg met *+* een nieuw blok
   toe. Publiceer en herlaad de site: de volgorde klopt meteen.
2. **Tekst aanpassen met live preview** — open de *Presentation*-tool
   (verrekijker-icoon). Links de editor, rechts de site. Pas de hero-titel
   aan en laat zien dat de preview live meebeweegt; klik in de preview op
   een tekst om er direct naartoe te springen.
3. **Vertalen NL → EN** — open een pagina: onder elk NL-veld staat het
   EN-veld. Voeg een nieuw blok toe en laat zien dat het meteen op
   `/nl` én `/en` staat (EN valt terug op NL tot je vertaalt) — beheer
   is dus één keer werk, alleen de inhoud wordt vertaald. Wissel op de
   site met de NL/EN-knop. Bij *Artikelen* zie je het andere model:
   losse documenten per taal, gekoppeld via het taalmenu bovenin —
   handig voor content die niet in elke taal hoeft te bestaan.
4. **De US-site** — Studio → *US-site*. Zelfde contenttypes en blokken,
   maar een andere site: eigen pagina's, andere blokvolgorde, en op
   `/us` een eigen layout (donkere navigatie, andere hero, andere
   accentkleur, genummerde voordelen in 2 kolommen). Kernboodschap:
   één CMS, meerdere merken/markten.
5. **Artikelen & rich text** — *Artikelen · Nederlands* → "Middagdip?".
   Portable Text met koppen en afbeeldingen; verschijnt automatisch in het
   blok "Uit de kennisbank" op de homepage.
6. **Voor de techneuten** — de *Vision*-tool in de studio laat GROQ-query's
   live zien, bijv. `*[_type == "page" && language == "nl"]{title}`.

## Structuur

```
sanity.config.ts        studio-configuratie (plugins: structure, presentation,
                        document-internationalization (artikelen), vision)
src/sanity/schemaTypes  contenttypes: page, article, siteSettings + blokken
                        (objects/locale.ts = de NL/EN-velden per veld)
src/sanity/lib          client, live fetch, GROQ-query's, image-helper
src/app/[lang]          hoofdsite NL/EN
src/app/us              US-site met eigen layout/thema
src/app/studio          ingebouwde Sanity Studio
scripts/seed.mjs        demo-content (npm run seed)
```

## Online zetten (testdomein)

1. Op [vercel.com](https://vercel.com): inloggen met GitHub → *Add New →
   Project* → deze repo kiezen.
2. Environment variables invullen (zelfde als `.env`); laat
   `NEXT_PUBLIC_SITE_ENV` weg zolang het een testomgeving is — dan
   blokkeert robots.txt automatisch alle zoekmachines.
3. Settings → Domains → `sunbooster.beeldfanaat.dev` toevoegen en in het
   DNS-beheer van beeldfanaat.dev een CNAME `sunbooster` →
   `cname.vercel-dns.com` aanmaken.
4. Op sanity.io/manage → API → CORS origins:
   `https://sunbooster.beeldfanaat.dev` toevoegen (met credentials).

Livegang is daarna alleen: het echte domein aan hetzelfde project
koppelen, `NEXT_PUBLIC_SITE_ENV=production` zetten en de redirect-map
activeren — de content staat al goed in Sanity.

> **Let op:** het API-token hoort alleen in `.env` (staat in `.gitignore`).
> Commit het nooit, en trek het in via sanity.io/manage als het ooit lekt.
