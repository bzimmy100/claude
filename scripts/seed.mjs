/* Vult het Sanity-project met demo-content voor SunBooster:
   - hoofdsite: één document per pagina, vertaling per veld (NL + EN)
   - aparte US-site met eigen pagina-indeling (alleen Engels)
   - twee artikelen als losse vertaal-documenten (NL/EN) en site-instellingen

   Gebruik:  cp .env.example .env  →  token invullen  →  npm run seed
   Het script is idempotent: nogmaals draaien zet de demo terug in de
   beginstand. Documenten van een eerdere seed-versie worden opgeruimd. */

import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";

try {
  process.loadEnvFile(".env");
} catch {
  // geen .env — dan moeten de variabelen al in de omgeving staan
}

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error(
    "✖ Geen SANITY_API_TOKEN gevonden. Kopieer .env.example naar .env en vul\n" +
      "  een token met Editor-rechten in (sanity.io/manage → API → Tokens)."
  );
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "no1wfx74",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-02-19",
  token,
  useCdn: false,
});

/* -- hulpjes ------------------------------------------------------------ */

let n = 0;
const key = () => `seed${(n++).toString(36).padStart(4, "0")}`;

/* Vertaalbaar veld: NL + EN. */
const L = (nl, en) => ({ _type: "localeString", nl, en });
const LT = (nl, en) => ({ _type: "localeText", nl, en });

const block = (text, style = "normal") => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

/* Vertaalbare rich text: arrays van alinea's per taal. */
const LR = (nlParas, enParas) => ({
  _type: "localeRichText",
  nl: nlParas.map((p) => (Array.isArray(p) ? block(p[0], p[1]) : block(p))),
  en: enParas.map((p) => (Array.isArray(p) ? block(p[0], p[1]) : block(p))),
});

const img = (assetId) =>
  assetId
    ? { _type: "image", asset: { _type: "reference", _ref: assetId } }
    : undefined;

const cta = (labelNl, labelEn, hrefNl, hrefEn) => ({
  _type: "cta",
  label: L(labelNl, labelEn),
  href: L(hrefNl, hrefEn ?? hrefNl),
});

/* Alleen-Engels varianten voor de US-site (NL-veld blijft leeg). */
const E = (en) => ({ _type: "localeString", en });
const ET = (en) => ({ _type: "localeText", en });
const ER = (paras) => ({
  _type: "localeRichText",
  en: paras.map((p) => (Array.isArray(p) ? block(p[0], p[1]) : block(p))),
});
const ecta = (label, href) => ({
  _type: "cta",
  label: E(label),
  href: E(href),
});

/* -- afbeeldingen ------------------------------------------------------- */

async function uploadImages() {
  const files = [
    "hero-eu",
    "hero-us",
    "device",
    "science",
    "article-middagdip",
    "lifestyle",
  ];
  const ids = {};
  for (const name of files) {
    const stream = createReadStream(
      new URL(`./assets/${name}.svg`, import.meta.url)
    );
    const asset = await client.assets.upload("image", stream, {
      filename: `${name}.svg`,
    });
    ids[name] = asset._id;
    console.log(`  ✔ afbeelding ${name}.svg`);
  }
  return ids;
}

/* -- documenten --------------------------------------------------------- */

function buildDocs(pic) {
  const docs = [];

  /* Site-instellingen */
  docs.push(
    {
      _id: "siteSettings-eu",
      _type: "siteSettings",
      market: "eu",
      siteTitle: "SunBooster",
      tagline: "Breng de zon naar binnen · Bring the sun indoors",
    },
    {
      _id: "siteSettings-us",
      _type: "siteSettings",
      market: "us",
      siteTitle: "SunBooster US",
      tagline: "Now shipping across the US — $249, free shipping.",
    }
  );

  /* ---------- Hoofdsite: één document per pagina, NL + EN per veld ---------- */

  docs.push({
    _id: "page-eu-home",
    _type: "page",
    title: L("Home", "Home"),
    slug: { current: "home" },
    market: "eu",
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        kicker: L("SunLED-technologie", "SunLED technology"),
        title: L("Haal de zon naar binnen", "Bring the sun indoors"),
        text: LT(
          "SunBooster klikt op je beeldscherm en geeft je tijdens het werken de dosis nabij-infrarood licht die binnenlicht mist. Meer energie, betere focus — gewoon terwijl je doorwerkt.",
          "SunBooster clips onto your screen and delivers the near-infrared light that indoor lighting is missing — while you keep working. More energy, better focus."
        ),
        image: img(pic["hero-eu"]),
        primaryCta: cta(
          "Ontdek de wetenschap",
          "Explore the science",
          "/wetenschap",
          "/science"
        ),
        secondaryCta: cta(
          "Zo werkt het",
          "How it works",
          "/zo-werkt-het",
          "/how-to-use"
        ),
      },
      {
        _type: "featureGrid",
        _key: key(),
        title: L("Waarom SunBooster?", "Why SunBooster?"),
        intro: LT(
          "We brengen gemiddeld 90% van onze tijd binnen door — en missen daarmee een essentieel deel van het zonlicht.",
          "We spend about 90% of our time indoors — and miss an essential part of sunlight because of it."
        ),
        items: [
          {
            _type: "featureItem",
            _key: key(),
            emoji: "☀️",
            title: L("Zonlicht op je bureau", "Sunlight on your desk"),
            text: LT(
              "Nabij-infrarood licht (NIR) is het deel van zonlicht dat binnenverlichting niet geeft. SunBooster vult dat aan.",
              "Near-infrared (NIR) is the part of sunlight that indoor lighting lacks. SunBooster fills the gap."
            ),
          },
          {
            _type: "featureItem",
            _key: key(),
            emoji: "🔋",
            title: L("Meer energie", "More energy"),
            text: LT(
              "NIR activeert de mitochondriën — de energiecentrales van je cellen. Wetenschappelijk aangetoond effect op stemming en energie.",
              "NIR activates the mitochondria — the powerhouses of your cells. Scientifically proven to boost mood and energy."
            ),
          },
          {
            _type: "featureItem",
            _key: key(),
            emoji: "🎯",
            title: L("Betere focus", "Better focus"),
            text: LT(
              "Ideaal tegen de middagdip: consistente focus tijdens werken, studeren of gamen.",
              "Ideal against the afternoon slump: consistent focus while you work, study or game."
            ),
          },
        ],
      },
      {
        _type: "stats",
        _key: key(),
        title: L("In cijfers", "The numbers"),
        items: [
          {
            _type: "statItem",
            _key: key(),
            value: L("2–4 uur", "2–4 hrs"),
            label: L(
              "gebruik per dag, gewoon tijdens je werk",
              "of use per day, simply while you work"
            ),
          },
          {
            _type: "statItem",
            _key: key(),
            value: L("≈ 7 uur", "≈ 7 hrs"),
            label: L(
              "equivalent buitenlicht op een bewolkte dag",
              "of outdoor light on a cloudy day, equivalent"
            ),
          },
          {
            _type: "statItem",
            _key: key(),
            value: L("2 weken", "2 weeks"),
            label: L(
              "tot een merkbaar verschil",
              "until you notice the difference"
            ),
          },
        ],
      },
      {
        _type: "imageText",
        _key: key(),
        title: L("Klik. Aan. Klaar.", "Clip. On. Done."),
        body: LR(
          [
            "SunBooster klemt op elke monitor of laptop. Geen installatie, geen app: aanzetten en doorwerken. De LED's zijn onzichtbaar voor je ogen maar voelbaar voor je lijf.",
            "Ontwikkeld met SunLED-technologie en gevalideerd in onderzoek met de Rijksuniversiteit Groningen en Maastricht University.",
          ],
          [
            "SunBooster clips onto any monitor or laptop. No installation, no app: switch it on and keep working. The LEDs are invisible to your eyes but noticeable for your body.",
            "Built on SunLED technology and validated in research with the University of Groningen and Maastricht University.",
          ]
        ),
        image: img(pic["device"]),
        imagePosition: "rechts",
      },
      {
        _type: "testimonials",
        _key: key(),
        title: L("Wat gebruikers zeggen", "What users say"),
        items: [
          {
            _type: "testimonialItem",
            _key: key(),
            quote: LT(
              "Sinds SunBooster kom ik de middag door zonder derde kop koffie.",
              "Since SunBooster I get through the afternoon without a third coffee."
            ),
            name: "Marieke",
            role: L("UX-designer", "UX designer"),
          },
          {
            _type: "testimonialItem",
            _key: key(),
            quote: LT(
              "Het voelt als werken bij het raam, ook in november.",
              "It feels like working by the window, even in November."
            ),
            name: "Jesse",
            role: L("Developer", "Developer"),
          },
          {
            _type: "testimonialItem",
            _key: key(),
            quote: LT(
              "Simpel ding, groot verschil. Mijn energiedip is weg.",
              "Simple device, big difference. My energy dip is gone."
            ),
            name: "Sander",
            role: L("Ondernemer", "Entrepreneur"),
          },
        ],
      },
      {
        _type: "articleList",
        _key: key(),
        title: L("Uit de kennisbank", "From the knowledge base"),
        max: 3,
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: L("Probeer SunBooster 30 dagen", "Try SunBooster for 30 days"),
        text: LT(
          "Niet tevreden? Geld terug. Gratis verzending binnen Europa.",
          "Not satisfied? Money back. Free shipping within Europe."
        ),
        cta: cta("Bestel nu", "Order now", "/zo-werkt-het", "/how-to-use"),
      },
    ],
  });

  docs.push({
    _id: "page-eu-science",
    _type: "page",
    title: L("Wetenschap", "Science"),
    slug: { current: "wetenschap" },
    slugEn: { current: "science" },
    market: "eu",
    navOrder: 1,
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        kicker: L("Onderzoek", "Research"),
        title: L(
          "De wetenschap achter SunBooster",
          "The science behind SunBooster"
        ),
        text: LT(
          "Nabij-infrarood licht (650–900 nm) dringt diep door in de huid en activeert de mitochondriën — de energiecentrales van je cellen.",
          "Near-infrared light (650–900 nm) penetrates deep into the skin and activates the mitochondria — the powerhouses of your cells."
        ),
        image: img(pic["science"]),
        primaryCta: cta(
          "Veelgestelde vragen",
          "Frequently asked questions",
          "/veelgestelde-vragen",
          "/faq"
        ),
      },
      {
        _type: "imageText",
        _key: key(),
        title: L(
          "Wat doet nabij-infrarood licht?",
          "What does near-infrared light do?"
        ),
        body: LR(
          [
            "Klinische studies laten positieve effecten zien op cardiovasculaire functie, het verminderen van ontstekingen en neurologische gezondheid.",
            "Anders dan UV-licht maakt NIR geen vitamine D aan — het werkt via fotobiomodulatie: lichtenergie die de celstofwisseling ondersteunt.",
          ],
          [
            "Clinical studies have demonstrated benefits for cardiovascular function, inflammation reduction and neurological health.",
            "Unlike UV light, NIR does not produce vitamin D — it works through photobiomodulation: light energy that supports cellular metabolism.",
          ]
        ),
        image: img(pic["device"]),
        imagePosition: "links",
      },
      {
        _type: "stats",
        _key: key(),
        title: L("Gevalideerd onderzoek", "Validated research"),
        items: [
          {
            _type: "statItem",
            _key: key(),
            value: L("RUG", "RUG"),
            label: L(
              "onderzoek met de Rijksuniversiteit Groningen",
              "research with the University of Groningen"
            ),
          },
          {
            _type: "statItem",
            _key: key(),
            value: L("UM", "UM"),
            label: L(
              "validatie met Maastricht University",
              "validation with Maastricht University"
            ),
          },
          {
            _type: "statItem",
            _key: key(),
            value: L("650–900 nm", "650–900 nm"),
            label: L(
              "het werkzame deel van het zonlichtspectrum",
              "the active part of the sunlight spectrum"
            ),
          },
        ],
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: L("Zelf ervaren?", "Experience it yourself?"),
        text: LT(
          "Binnen twee weken merkbaar verschil, of je geld terug.",
          "A noticeable difference within two weeks, or your money back."
        ),
        cta: cta("Zo werkt het", "How it works", "/zo-werkt-het", "/how-to-use"),
      },
    ],
  });

  docs.push({
    _id: "page-eu-how",
    _type: "page",
    title: L("Zo werkt het", "How to use"),
    slug: { current: "zo-werkt-het" },
    slugEn: { current: "how-to-use" },
    market: "eu",
    navOrder: 2,
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        kicker: L("In 3 stappen", "3 easy steps"),
        title: L("Zo werkt het", "How to use"),
        text: LT(
          "Geen installatie, geen gedoe. SunBooster werkt op elke monitor of laptop.",
          "No installation, no hassle. SunBooster works on any monitor or laptop."
        ),
        image: img(pic["lifestyle"]),
      },
      {
        _type: "featureGrid",
        _key: key(),
        title: L("Aan de slag", "Getting started"),
        items: [
          {
            _type: "featureItem",
            _key: key(),
            emoji: "🖥️",
            title: L("Klik hem vast", "Clip it on"),
            text: LT(
              "SunBooster klemt bovenop elk scherm dat je normaal gebruikt.",
              "SunBooster clips on top of any screen you normally use."
            ),
          },
          {
            _type: "featureItem",
            _key: key(),
            emoji: "💡",
            title: L("Zet hem aan", "Switch it on"),
            text: LT(
              "Eén knop. De NIR-LED's doen de rest terwijl jij werkt.",
              "One button. The NIR LEDs do the rest while you work."
            ),
          },
          {
            _type: "featureItem",
            _key: key(),
            emoji: "📈",
            title: L("Bouw het op", "Build it up"),
            text: LT(
              "2 tot 4 uur per dag, verspreid over meerdere sessies. Veilig voor dagelijks gebruik.",
              "2 to 4 hours a day, spread across multiple sessions. Safe for daily use."
            ),
          },
        ],
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: L("Vragen?", "Questions?"),
        text: LT(
          "Bekijk de veelgestelde vragen of neem contact op.",
          "Check the FAQ or get in touch."
        ),
        cta: cta("Naar de FAQ", "Go to FAQ", "/veelgestelde-vragen", "/faq"),
      },
    ],
  });

  docs.push({
    _id: "page-eu-faq",
    _type: "page",
    title: L("Veelgestelde vragen", "FAQ"),
    slug: { current: "veelgestelde-vragen" },
    slugEn: { current: "faq" },
    market: "eu",
    navOrder: 3,
    pageBuilder: [
      {
        _type: "faq",
        _key: key(),
        title: L("Veelgestelde vragen", "Frequently asked questions"),
        items: [
          {
            _type: "faqItem",
            _key: key(),
            question: L(
              "Hoe lang moet ik SunBooster per dag gebruiken?",
              "How long should I use SunBooster per day?"
            ),
            answer: LR(
              [
                "2 tot 4 uur opgeteld per dag — gewoon terwijl je werkt. Dat komt overeen met ongeveer 7 uur natuurlijk buitenlicht op een bewolkte dag.",
              ],
              [
                "2 to 4 hours in total per day — simply while you work. That equals roughly 7 hours of natural outdoor light on a cloudy day.",
              ]
            ),
          },
          {
            _type: "faqItem",
            _key: key(),
            question: L(
              "Is nabij-infrarood licht veilig?",
              "Is near-infrared light safe?"
            ),
            answer: LR(
              [
                "Ja. NIR is aangetoond veilig voor dagelijks gebruik, ook in meerdere sessies per dag. Het bevat geen UV.",
              ],
              [
                "Yes. NIR has been demonstrated to be safe for daily use, even across multiple sessions per day. It contains no UV.",
              ]
            ),
          },
          {
            _type: "faqItem",
            _key: key(),
            question: L(
              "Maakt SunBooster vitamine D aan?",
              "Does SunBooster produce vitamin D?"
            ),
            answer: LR(
              [
                "Nee. Vitamine D wordt aangemaakt door UV-licht, en dat zendt SunBooster bewust niet uit. NIR werkt via de mitochondriën: het ondersteunt de energiehuishouding van je cellen.",
              ],
              [
                "No. Vitamin D is produced through UV light, which SunBooster deliberately does not emit. NIR works through the mitochondria, supporting your cells' energy production.",
              ]
            ),
          },
          {
            _type: "faqItem",
            _key: key(),
            question: L(
              "Op welke schermen past hij?",
              "Which screens does it fit?"
            ),
            answer: LR(
              [
                "Op elke monitor, laptop of tablet met een rand van maximaal 2 cm.",
              ],
              ["Any monitor, laptop or tablet with a bezel up to 2 cm."]
            ),
          },
        ],
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: L("Antwoord niet gevonden?", "Didn't find your answer?"),
        text: LT("We helpen je graag verder.", "We're happy to help."),
        cta: cta(
          "Ontdek de wetenschap",
          "Explore the science",
          "/wetenschap",
          "/science"
        ),
      },
    ],
  });

  /* ---------- US-site: eigen indeling, eigen toon, alleen Engels ---------- */

  docs.push({
    _id: "page-us-home",
    _type: "page",
    title: E("Home"),
    slug: { current: "home" },
    market: "us",
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        kicker: E("Now available in the US"),
        title: E("The sun. On your desk."),
        text: ET(
          "SunBooster brings the wellness benefits of sunlight to modern indoor lifestyles. Patented SunLED near-infrared technology, engineered in the Netherlands."
        ),
        image: img(pic["hero-us"]),
        primaryCta: ecta("Get SunBooster — $249", "/sunbooster"),
        secondaryCta: ecta("The science", "/sunbooster"),
      },
      {
        _type: "stats",
        _key: key(),
        title: E("Why it works"),
        items: [
          {
            _type: "statItem",
            _key: key(),
            value: E("$249"),
            label: E("free shipping across the US"),
          },
          {
            _type: "statItem",
            _key: key(),
            value: E("2–4 hrs"),
            label: E("daily use while you work, study or game"),
          },
          {
            _type: "statItem",
            _key: key(),
            value: E("14 days"),
            label: E("to feel the difference — or your money back"),
          },
        ],
      },
      {
        _type: "featureGrid",
        _key: key(),
        title: E("Sunlight, re-engineered"),
        intro: ET("Three reasons Americans are clipping a sun to their monitor."),
        items: [
          {
            _type: "featureItem",
            _key: key(),
            title: E("Beat the afternoon slump"),
            text: ET(
              "Scientifically proven to boost mood and energy when you need it most."
            ),
          },
          {
            _type: "featureItem",
            _key: key(),
            title: E("Zero effort"),
            text: ET(
              "Clips onto any monitor or laptop. One button, no app, no subscription."
            ),
          },
          {
            _type: "featureItem",
            _key: key(),
            title: E("Backed by research"),
            text: ET(
              "Validated with the University of Groningen and Maastricht University."
            ),
          },
          {
            _type: "featureItem",
            _key: key(),
            title: E("Safe for daily use"),
            text: ET(
              "Near-infrared only — no UV, safe across multiple sessions a day."
            ),
          },
        ],
      },
      {
        _type: "testimonials",
        _key: key(),
        title: E("From our US early adopters"),
        items: [
          {
            _type: "testimonialItem",
            _key: key(),
            quote: ET("Chicago winters finally feel survivable at my desk."),
            name: "Alex",
            role: E("Product manager, Chicago"),
          },
          {
            _type: "testimonialItem",
            _key: key(),
            quote: ET(
              "My 3pm crash is gone. This thing pays for itself in coffee."
            ),
            name: "Jordan",
            role: E("Analyst, NYC"),
          },
          {
            _type: "testimonialItem",
            _key: key(),
            quote: ET("Set it, forget it, feel better. That's rare."),
            name: "Sam",
            role: E("Engineer, Seattle"),
          },
        ],
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: E("Ready to feel the sun again?"),
        text: ET("Order today — shipped from our US warehouse, free of charge."),
        cta: ecta("Buy now — $249", "/sunbooster"),
      },
    ],
  });

  docs.push({
    _id: "page-us-product",
    _type: "page",
    title: E("SunBooster"),
    slug: { current: "sunbooster" },
    market: "us",
    navOrder: 1,
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        kicker: E("The product"),
        title: E("SunBooster"),
        text: ET(
          "Powered by SunLED near-infrared light technology — a vital part of sunlight that's missing indoors."
        ),
        image: img(pic["lifestyle"]),
        primaryCta: ecta("Buy now — $249", "#"),
      },
      {
        _type: "imageText",
        _key: key(),
        title: E("What's in the box"),
        body: ER([
          "SunBooster device with universal clip, USB-C cable, and a quick-start guide. Fits any monitor, laptop or tablet.",
          "Use it 2 to 4 hours a day while you work. Just 2 weeks of accumulated use can make a noticeable difference.",
        ]),
        image: img(pic["device"]),
        imagePosition: "rechts",
      },
      {
        _type: "faq",
        _key: key(),
        title: E("Quick answers"),
        items: [
          {
            _type: "faqItem",
            _key: key(),
            question: E("Does it ship to all US states?"),
            answer: ER(["Yes — free shipping across all 50 states."]),
          },
          {
            _type: "faqItem",
            _key: key(),
            question: E("Is there a warranty?"),
            answer: ER([
              "Two-year warranty and a 30-day money-back guarantee.",
            ]),
          },
        ],
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: E("Bring the sun to your desk"),
        text: ET("$249 · Free US shipping · 30-day money-back guarantee"),
        cta: ecta("Buy now", "#"),
      },
    ],
  });

  /* ---------- Artikelen: losse documenten per taal ---------- */

  docs.push({
    _id: "article-middagdip-nl",
    _type: "article",
    title: "Middagdip? Dit is waarom je energie crasht — en wat helpt",
    slug: { current: "middagdip" },
    language: "nl",
    excerpt:
      "Rond half drie zakt bij veel mensen de energie in. Dat ligt niet aan je lunch, maar aan je licht.",
    coverImage: img(pic["article-middagdip"]),
    body: [
      block(
        "Herkenbaar? Om 14:30 uur voelt je hoofd als watten en lonkt de koffieautomaat. De middagdip is deels biologisch — je circadiane ritme kent nu eenmaal een dip — maar wordt flink versterkt door een gebrek aan het juiste licht."
      ),
      block("Licht is meer dan lux", "h2"),
      block(
        "Binnenverlichting geeft vooral zichtbaar licht. Wat ontbreekt is nabij-infrarood (NIR): het deel van zonlicht dat je huid en cellen bereikt en de mitochondriën — de energiecentrales van je cellen — activeert."
      ),
      block("Wat kun je doen?", "h2"),
      block(
        "Een wandeling buiten helpt altijd, zelfs op een bewolkte dag. Lukt dat niet, dan brengt SunBooster het ontbrekende deel van het zonlicht naar je bureau: 2 tot 4 uur gebruik per dag staat gelijk aan zo'n 7 uur buitenlicht bij bewolking."
      ),
    ],
  });

  docs.push({
    _id: "article-slump-en",
    _type: "article",
    title: "Afternoon slump? Why your energy crashes — and what helps",
    slug: { current: "afternoon-slump" },
    language: "en",
    excerpt:
      "Around 2:30pm many people's energy collapses. It's not your lunch — it's your light.",
    coverImage: img(pic["article-middagdip"]),
    body: [
      block(
        "Sound familiar? At 2:30pm your head feels like cotton wool and the coffee machine is calling. The afternoon slump is partly biological — your circadian rhythm simply dips — but it's amplified considerably by a lack of the right light."
      ),
      block("Light is more than lux", "h2"),
      block(
        "Indoor lighting mostly delivers visible light. What's missing is near-infrared (NIR): the part of sunlight that reaches your skin and cells and activates the mitochondria — the powerhouses of your cells."
      ),
      block("What can you do?", "h2"),
      block(
        "A walk outside always helps, even on a cloudy day. If that's not an option, SunBooster brings the missing part of sunlight to your desk: 2 to 4 hours of daily use equals about 7 hours of outdoor light under clouds."
      ),
    ],
  });

  /* Vertaal-koppeling voor het artikel (Translations-knop in de studio). */
  docs.push({
    _id: "translation-middagdip",
    _type: "translation.metadata",
    schemaTypes: ["article"],
    translations: [
      { _key: "nl", value: { _type: "reference", _ref: "article-middagdip-nl" } },
      { _key: "en", value: { _type: "reference", _ref: "article-slump-en" } },
    ],
  });

  return docs;
}

/* Documenten van de vorige seed-opzet (losse NL/EN-pagina's) opruimen. */
const OLD_IDS = [
  "translation-home",
  "translation-science",
  "translation-how",
  "translation-faq",
  "page-eu-home-nl",
  "page-eu-home-en",
  "page-eu-science-nl",
  "page-eu-science-en",
  "page-eu-how-nl",
  "page-eu-how-en",
  "page-eu-faq-nl",
  "page-eu-faq-en",
];

/* -- uitvoeren ---------------------------------------------------------- */

console.log("SunBooster-demo seeden naar project", client.config().projectId);
console.log("→ afbeeldingen uploaden…");
const pic = await uploadImages();

console.log("→ documenten schrijven…");
const docs = buildDocs(pic);
let tx = client.transaction();
for (const id of OLD_IDS) {
  tx = tx.delete(id).delete(`drafts.${id}`);
}
for (const doc of docs) {
  tx = tx.createOrReplace(doc).delete(`drafts.${doc._id}`);
}
await tx.commit();
docs.forEach((doc) => console.log(`  ✔ ${doc._type}: ${doc._id}`));

console.log(`\nKlaar! ${docs.length} documenten geschreven.`);
console.log("Start de site met:  npm run dev  →  http://localhost:3000");
