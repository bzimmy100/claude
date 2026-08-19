/* Vult het Sanity-project met demo-content voor SunBooster:
   - hoofdsite in NL en EN (gekoppelde vertalingen)
   - aparte US-site met eigen pagina-indeling
   - twee artikelen (NL/EN) en site-instellingen

   Gebruik:  cp .env.example .env  →  token invullen  →  npm run seed
   Het script is idempotent: nogmaals draaien overschrijft de demo-content. */

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

const block = (text, style = "normal") => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

const img = (assetId) =>
  assetId
    ? { _type: "image", asset: { _type: "reference", _ref: assetId } }
    : undefined;

const cta = (label, href) => ({ _type: "cta", label, href });

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

  /* ---------- Hoofdsite · Nederlands ---------- */

  docs.push({
    _id: "page-eu-home-nl",
    _type: "page",
    title: "Home",
    slug: { current: "home" },
    market: "eu",
    language: "nl",
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        kicker: "SunLED-technologie",
        title: "Haal de zon naar binnen",
        text: "SunBooster klikt op je beeldscherm en geeft je tijdens het werken de dosis nabij-infrarood licht die binnenlicht mist. Meer energie, betere focus — gewoon terwijl je doorwerkt.",
        image: img(pic["hero-eu"]),
        primaryCta: cta("Ontdek de wetenschap", "/wetenschap"),
        secondaryCta: cta("Zo werkt het", "/zo-werkt-het"),
      },
      {
        _type: "featureGrid",
        _key: key(),
        title: "Waarom SunBooster?",
        intro:
          "We brengen gemiddeld 90% van onze tijd binnen door — en missen daarmee een essentieel deel van het zonlicht.",
        items: [
          {
            _type: "featureItem",
            _key: key(),
            emoji: "☀️",
            title: "Zonlicht op je bureau",
            text: "Nabij-infrarood licht (NIR) is het deel van zonlicht dat binnenverlichting niet geeft. SunBooster vult dat aan.",
          },
          {
            _type: "featureItem",
            _key: key(),
            emoji: "🔋",
            title: "Meer energie",
            text: "NIR activeert de mitochondriën — de energiecentrales van je cellen. Wetenschappelijk aangetoond effect op stemming en energie.",
          },
          {
            _type: "featureItem",
            _key: key(),
            emoji: "🎯",
            title: "Betere focus",
            text: "Ideaal tegen de middagdip: consistente focus tijdens werken, studeren of gamen.",
          },
        ],
      },
      {
        _type: "stats",
        _key: key(),
        title: "In cijfers",
        items: [
          {
            _type: "statItem",
            _key: key(),
            value: "2–4 uur",
            label: "gebruik per dag, gewoon tijdens je werk",
          },
          {
            _type: "statItem",
            _key: key(),
            value: "≈ 7 uur",
            label: "equivalent buitenlicht op een bewolkte dag",
          },
          {
            _type: "statItem",
            _key: key(),
            value: "2 weken",
            label: "tot een merkbaar verschil",
          },
        ],
      },
      {
        _type: "imageText",
        _key: key(),
        title: "Klik. Aan. Klaar.",
        body: [
          block(
            "SunBooster klemt op elke monitor of laptop. Geen installatie, geen app: aanzetten en doorwerken. De LED's zijn onzichtbaar voor je ogen maar voelbaar voor je lijf."
          ),
          block(
            "Ontwikkeld met SunLED-technologie en gevalideerd in onderzoek met de Rijksuniversiteit Groningen en Maastricht University."
          ),
        ],
        image: img(pic["device"]),
        imagePosition: "rechts",
      },
      {
        _type: "testimonials",
        _key: key(),
        title: "Wat gebruikers zeggen",
        items: [
          {
            _type: "testimonialItem",
            _key: key(),
            quote:
              "Sinds SunBooster kom ik de middag door zonder derde kop koffie.",
            name: "Marieke",
            role: "UX-designer",
          },
          {
            _type: "testimonialItem",
            _key: key(),
            quote: "Het voelt als werken bij het raam, ook in november.",
            name: "Jesse",
            role: "Developer",
          },
          {
            _type: "testimonialItem",
            _key: key(),
            quote: "Simpel ding, groot verschil. Mijn energiedip is weg.",
            name: "Sander",
            role: "Ondernemer",
          },
        ],
      },
      {
        _type: "articleList",
        _key: key(),
        title: "Uit de kennisbank",
        max: 3,
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: "Probeer SunBooster 30 dagen",
        text: "Niet tevreden? Geld terug. Gratis verzending binnen Europa.",
        cta: cta("Bestel nu", "/zo-werkt-het"),
      },
    ],
  });

  docs.push({
    _id: "page-eu-science-nl",
    _type: "page",
    title: "Wetenschap",
    slug: { current: "wetenschap" },
    market: "eu",
    language: "nl",
    navOrder: 1,
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        kicker: "Onderzoek",
        title: "De wetenschap achter SunBooster",
        text: "Nabij-infrarood licht (650–900 nm) dringt diep door in de huid en activeert de mitochondriën — de energiecentrales van je cellen.",
        image: img(pic["science"]),
        primaryCta: cta("Veelgestelde vragen", "/veelgestelde-vragen"),
      },
      {
        _type: "imageText",
        _key: key(),
        title: "Wat doet nabij-infrarood licht?",
        body: [
          block(
            "Klinische studies laten positieve effecten zien op cardiovasculaire functie, het verminderen van ontstekingen en neurologische gezondheid."
          ),
          block(
            "Anders dan UV-licht maakt NIR geen vitamine D aan — het werkt via fotobiomodulatie: lichtenergie die de celstofwisseling ondersteunt."
          ),
        ],
        image: img(pic["device"]),
        imagePosition: "links",
      },
      {
        _type: "stats",
        _key: key(),
        title: "Gevalideerd onderzoek",
        items: [
          {
            _type: "statItem",
            _key: key(),
            value: "RUG",
            label: "onderzoek met de Rijksuniversiteit Groningen",
          },
          {
            _type: "statItem",
            _key: key(),
            value: "UM",
            label: "validatie met Maastricht University",
          },
          {
            _type: "statItem",
            _key: key(),
            value: "650–900 nm",
            label: "het werkzame deel van het zonlichtspectrum",
          },
        ],
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: "Zelf ervaren?",
        text: "Binnen twee weken merkbaar verschil, of je geld terug.",
        cta: cta("Zo werkt het", "/zo-werkt-het"),
      },
    ],
  });

  docs.push({
    _id: "page-eu-how-nl",
    _type: "page",
    title: "Zo werkt het",
    slug: { current: "zo-werkt-het" },
    market: "eu",
    language: "nl",
    navOrder: 2,
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        kicker: "In 3 stappen",
        title: "Zo werkt het",
        text: "Geen installatie, geen gedoe. SunBooster werkt op elke monitor of laptop.",
        image: img(pic["lifestyle"]),
      },
      {
        _type: "featureGrid",
        _key: key(),
        title: "Aan de slag",
        items: [
          {
            _type: "featureItem",
            _key: key(),
            emoji: "🖥️",
            title: "Klik hem vast",
            text: "SunBooster klemt bovenop elk scherm dat je normaal gebruikt.",
          },
          {
            _type: "featureItem",
            _key: key(),
            emoji: "💡",
            title: "Zet hem aan",
            text: "Eén knop. De NIR-LED's doen de rest terwijl jij werkt.",
          },
          {
            _type: "featureItem",
            _key: key(),
            emoji: "📈",
            title: "Bouw het op",
            text: "2 tot 4 uur per dag, verspreid over meerdere sessies. Veilig voor dagelijks gebruik.",
          },
        ],
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: "Vragen?",
        text: "Bekijk de veelgestelde vragen of neem contact op.",
        cta: cta("Naar de FAQ", "/veelgestelde-vragen"),
      },
    ],
  });

  docs.push({
    _id: "page-eu-faq-nl",
    _type: "page",
    title: "Veelgestelde vragen",
    slug: { current: "veelgestelde-vragen" },
    market: "eu",
    language: "nl",
    navOrder: 3,
    pageBuilder: [
      {
        _type: "faq",
        _key: key(),
        title: "Veelgestelde vragen",
        items: [
          {
            _type: "faqItem",
            _key: key(),
            question: "Hoe lang moet ik SunBooster per dag gebruiken?",
            answer: [
              block(
                "2 tot 4 uur opgeteld per dag — gewoon terwijl je werkt. Dat komt overeen met ongeveer 7 uur natuurlijk buitenlicht op een bewolkte dag."
              ),
            ],
          },
          {
            _type: "faqItem",
            _key: key(),
            question: "Is nabij-infrarood licht veilig?",
            answer: [
              block(
                "Ja. NIR is aangetoond veilig voor dagelijks gebruik, ook in meerdere sessies per dag. Het bevat geen UV."
              ),
            ],
          },
          {
            _type: "faqItem",
            _key: key(),
            question: "Maakt SunBooster vitamine D aan?",
            answer: [
              block(
                "Nee. Vitamine D wordt aangemaakt door UV-licht, en dat zendt SunBooster bewust niet uit. NIR werkt via de mitochondriën: het ondersteunt de energiehuishouding van je cellen."
              ),
            ],
          },
          {
            _type: "faqItem",
            _key: key(),
            question: "Op welke schermen past hij?",
            answer: [
              block("Op elke monitor, laptop of tablet met een rand van maximaal 2 cm."),
            ],
          },
        ],
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: "Antwoord niet gevonden?",
        text: "We helpen je graag verder.",
        cta: cta("Ontdek de wetenschap", "/wetenschap"),
      },
    ],
  });

  /* ---------- Hoofdsite · English ---------- */

  docs.push({
    _id: "page-eu-home-en",
    _type: "page",
    title: "Home",
    slug: { current: "home" },
    market: "eu",
    language: "en",
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        kicker: "SunLED technology",
        title: "Bring the sun indoors",
        text: "SunBooster clips onto your screen and delivers the near-infrared light that indoor lighting is missing — while you keep working. More energy, better focus.",
        image: img(pic["hero-eu"]),
        primaryCta: cta("Explore the science", "/science"),
        secondaryCta: cta("How it works", "/how-to-use"),
      },
      {
        _type: "featureGrid",
        _key: key(),
        title: "Why SunBooster?",
        intro:
          "We spend about 90% of our time indoors — and miss an essential part of sunlight because of it.",
        items: [
          {
            _type: "featureItem",
            _key: key(),
            emoji: "☀️",
            title: "Sunlight on your desk",
            text: "Near-infrared (NIR) is the part of sunlight that indoor lighting lacks. SunBooster fills the gap.",
          },
          {
            _type: "featureItem",
            _key: key(),
            emoji: "🔋",
            title: "More energy",
            text: "NIR activates the mitochondria — the powerhouses of your cells. Scientifically proven to boost mood and energy.",
          },
          {
            _type: "featureItem",
            _key: key(),
            emoji: "🎯",
            title: "Better focus",
            text: "Ideal against the afternoon slump: consistent focus while you work, study or game.",
          },
        ],
      },
      {
        _type: "stats",
        _key: key(),
        title: "The numbers",
        items: [
          {
            _type: "statItem",
            _key: key(),
            value: "2–4 hrs",
            label: "of use per day, simply while you work",
          },
          {
            _type: "statItem",
            _key: key(),
            value: "≈ 7 hrs",
            label: "of outdoor light on a cloudy day, equivalent",
          },
          {
            _type: "statItem",
            _key: key(),
            value: "2 weeks",
            label: "until you notice the difference",
          },
        ],
      },
      {
        _type: "imageText",
        _key: key(),
        title: "Clip. On. Done.",
        body: [
          block(
            "SunBooster clips onto any monitor or laptop. No installation, no app: switch it on and keep working. The LEDs are invisible to your eyes but noticeable for your body."
          ),
          block(
            "Built on SunLED technology and validated in research with the University of Groningen and Maastricht University."
          ),
        ],
        image: img(pic["device"]),
        imagePosition: "rechts",
      },
      {
        _type: "testimonials",
        _key: key(),
        title: "What users say",
        items: [
          {
            _type: "testimonialItem",
            _key: key(),
            quote: "Since SunBooster I get through the afternoon without a third coffee.",
            name: "Marieke",
            role: "UX designer",
          },
          {
            _type: "testimonialItem",
            _key: key(),
            quote: "It feels like working by the window, even in November.",
            name: "Jesse",
            role: "Developer",
          },
          {
            _type: "testimonialItem",
            _key: key(),
            quote: "Simple device, big difference. My energy dip is gone.",
            name: "Sander",
            role: "Entrepreneur",
          },
        ],
      },
      {
        _type: "articleList",
        _key: key(),
        title: "From the knowledge base",
        max: 3,
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: "Try SunBooster for 30 days",
        text: "Not satisfied? Money back. Free shipping within Europe.",
        cta: cta("Order now", "/how-to-use"),
      },
    ],
  });

  docs.push({
    _id: "page-eu-science-en",
    _type: "page",
    title: "Science",
    slug: { current: "science" },
    market: "eu",
    language: "en",
    navOrder: 1,
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        kicker: "Research",
        title: "The science behind SunBooster",
        text: "Near-infrared light (650–900 nm) penetrates deep into the skin and activates the mitochondria — the powerhouses of your cells.",
        image: img(pic["science"]),
        primaryCta: cta("Frequently asked questions", "/faq"),
      },
      {
        _type: "imageText",
        _key: key(),
        title: "What does near-infrared light do?",
        body: [
          block(
            "Clinical studies have demonstrated benefits for cardiovascular function, inflammation reduction and neurological health."
          ),
          block(
            "Unlike UV light, NIR does not produce vitamin D — it works through photobiomodulation: light energy that supports cellular metabolism."
          ),
        ],
        image: img(pic["device"]),
        imagePosition: "links",
      },
      {
        _type: "stats",
        _key: key(),
        title: "Validated research",
        items: [
          {
            _type: "statItem",
            _key: key(),
            value: "RUG",
            label: "research with the University of Groningen",
          },
          {
            _type: "statItem",
            _key: key(),
            value: "UM",
            label: "validation with Maastricht University",
          },
          {
            _type: "statItem",
            _key: key(),
            value: "650–900 nm",
            label: "the active part of the sunlight spectrum",
          },
        ],
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: "Experience it yourself?",
        text: "A noticeable difference within two weeks, or your money back.",
        cta: cta("How it works", "/how-to-use"),
      },
    ],
  });

  docs.push({
    _id: "page-eu-how-en",
    _type: "page",
    title: "How to use",
    slug: { current: "how-to-use" },
    market: "eu",
    language: "en",
    navOrder: 2,
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        kicker: "3 easy steps",
        title: "How to use",
        text: "No installation, no hassle. SunBooster works on any monitor or laptop.",
        image: img(pic["lifestyle"]),
      },
      {
        _type: "featureGrid",
        _key: key(),
        title: "Getting started",
        items: [
          {
            _type: "featureItem",
            _key: key(),
            emoji: "🖥️",
            title: "Clip it on",
            text: "SunBooster clips on top of any screen you normally use.",
          },
          {
            _type: "featureItem",
            _key: key(),
            emoji: "💡",
            title: "Switch it on",
            text: "One button. The NIR LEDs do the rest while you work.",
          },
          {
            _type: "featureItem",
            _key: key(),
            emoji: "📈",
            title: "Build it up",
            text: "2 to 4 hours a day, spread across multiple sessions. Safe for daily use.",
          },
        ],
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: "Questions?",
        text: "Check the FAQ or get in touch.",
        cta: cta("Go to FAQ", "/faq"),
      },
    ],
  });

  docs.push({
    _id: "page-eu-faq-en",
    _type: "page",
    title: "FAQ",
    slug: { current: "faq" },
    market: "eu",
    language: "en",
    navOrder: 3,
    pageBuilder: [
      {
        _type: "faq",
        _key: key(),
        title: "Frequently asked questions",
        items: [
          {
            _type: "faqItem",
            _key: key(),
            question: "How long should I use SunBooster per day?",
            answer: [
              block(
                "2 to 4 hours in total per day — simply while you work. That equals roughly 7 hours of natural outdoor light on a cloudy day."
              ),
            ],
          },
          {
            _type: "faqItem",
            _key: key(),
            question: "Is near-infrared light safe?",
            answer: [
              block(
                "Yes. NIR has been demonstrated to be safe for daily use, even across multiple sessions per day. It contains no UV."
              ),
            ],
          },
          {
            _type: "faqItem",
            _key: key(),
            question: "Does SunBooster produce vitamin D?",
            answer: [
              block(
                "No. Vitamin D is produced through UV light, which SunBooster deliberately does not emit. NIR works through the mitochondria, supporting your cells' energy production."
              ),
            ],
          },
          {
            _type: "faqItem",
            _key: key(),
            question: "Which screens does it fit?",
            answer: [
              block("Any monitor, laptop or tablet with a bezel up to 2 cm."),
            ],
          },
        ],
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: "Didn't find your answer?",
        text: "We're happy to help.",
        cta: cta("Explore the science", "/science"),
      },
    ],
  });

  /* ---------- US-site: eigen indeling, eigen toon ---------- */

  docs.push({
    _id: "page-us-home",
    _type: "page",
    title: "Home",
    slug: { current: "home" },
    market: "us",
    language: "en",
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        kicker: "Now available in the US",
        title: "The sun. On your desk.",
        text: "SunBooster brings the wellness benefits of sunlight to modern indoor lifestyles. Patented SunLED near-infrared technology, engineered in the Netherlands.",
        image: img(pic["hero-us"]),
        primaryCta: cta("Get SunBooster — $249", "/sunbooster"),
        secondaryCta: cta("The science", "/sunbooster"),
      },
      {
        _type: "stats",
        _key: key(),
        title: "Why it works",
        items: [
          {
            _type: "statItem",
            _key: key(),
            value: "$249",
            label: "free shipping across the US",
          },
          {
            _type: "statItem",
            _key: key(),
            value: "2–4 hrs",
            label: "daily use while you work, study or game",
          },
          {
            _type: "statItem",
            _key: key(),
            value: "14 days",
            label: "to feel the difference — or your money back",
          },
        ],
      },
      {
        _type: "featureGrid",
        _key: key(),
        title: "Sunlight, re-engineered",
        intro: "Three reasons Americans are clipping a sun to their monitor.",
        items: [
          {
            _type: "featureItem",
            _key: key(),
            title: "Beat the afternoon slump",
            text: "Scientifically proven to boost mood and energy when you need it most.",
          },
          {
            _type: "featureItem",
            _key: key(),
            title: "Zero effort",
            text: "Clips onto any monitor or laptop. One button, no app, no subscription.",
          },
          {
            _type: "featureItem",
            _key: key(),
            title: "Backed by research",
            text: "Validated with the University of Groningen and Maastricht University.",
          },
          {
            _type: "featureItem",
            _key: key(),
            title: "Safe for daily use",
            text: "Near-infrared only — no UV, safe across multiple sessions a day.",
          },
        ],
      },
      {
        _type: "testimonials",
        _key: key(),
        title: "From our US early adopters",
        items: [
          {
            _type: "testimonialItem",
            _key: key(),
            quote: "Chicago winters finally feel survivable at my desk.",
            name: "Alex",
            role: "Product manager, Chicago",
          },
          {
            _type: "testimonialItem",
            _key: key(),
            quote: "My 3pm crash is gone. This thing pays for itself in coffee.",
            name: "Jordan",
            role: "Analyst, NYC",
          },
          {
            _type: "testimonialItem",
            _key: key(),
            quote: "Set it, forget it, feel better. That's rare.",
            name: "Sam",
            role: "Engineer, Seattle",
          },
        ],
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: "Ready to feel the sun again?",
        text: "Order today — shipped from our US warehouse, free of charge.",
        cta: cta("Buy now — $249", "/sunbooster"),
      },
    ],
  });

  docs.push({
    _id: "page-us-product",
    _type: "page",
    title: "SunBooster",
    slug: { current: "sunbooster" },
    market: "us",
    language: "en",
    navOrder: 1,
    pageBuilder: [
      {
        _type: "hero",
        _key: key(),
        kicker: "The product",
        title: "SunBooster",
        text: "Powered by SunLED near-infrared light technology — a vital part of sunlight that's missing indoors.",
        image: img(pic["lifestyle"]),
        primaryCta: cta("Buy now — $249", "#"),
      },
      {
        _type: "imageText",
        _key: key(),
        title: "What's in the box",
        body: [
          block(
            "SunBooster device with universal clip, USB-C cable, and a quick-start guide. Fits any monitor, laptop or tablet."
          ),
          block(
            "Use it 2 to 4 hours a day while you work. Just 2 weeks of accumulated use can make a noticeable difference."
          ),
        ],
        image: img(pic["device"]),
        imagePosition: "rechts",
      },
      {
        _type: "faq",
        _key: key(),
        title: "Quick answers",
        items: [
          {
            _type: "faqItem",
            _key: key(),
            question: "Does it ship to all US states?",
            answer: [block("Yes — free shipping across all 50 states.")],
          },
          {
            _type: "faqItem",
            _key: key(),
            question: "Is there a warranty?",
            answer: [
              block("Two-year warranty and a 30-day money-back guarantee."),
            ],
          },
        ],
      },
      {
        _type: "ctaBanner",
        _key: key(),
        title: "Bring the sun to your desk",
        text: "$249 · Free US shipping · 30-day money-back guarantee",
        cta: cta("Buy now", "#"),
      },
    ],
  });

  /* ---------- Artikelen ---------- */

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

  /* ---------- Vertaal-koppelingen (voor de Translations-knop) ---------- */

  const link = (id, nlRef, enRef, type) => ({
    _id: id,
    _type: "translation.metadata",
    schemaTypes: [type],
    translations: [
      { _key: "nl", value: { _type: "reference", _ref: nlRef } },
      { _key: "en", value: { _type: "reference", _ref: enRef } },
    ],
  });

  docs.push(
    link("translation-home", "page-eu-home-nl", "page-eu-home-en", "page"),
    link("translation-science", "page-eu-science-nl", "page-eu-science-en", "page"),
    link("translation-how", "page-eu-how-nl", "page-eu-how-en", "page"),
    link("translation-faq", "page-eu-faq-nl", "page-eu-faq-en", "page"),
    link(
      "translation-middagdip",
      "article-middagdip-nl",
      "article-slump-en",
      "article"
    )
  );

  return docs;
}

/* -- uitvoeren ---------------------------------------------------------- */

console.log("SunBooster-demo seeden naar project", client.config().projectId);
console.log("→ afbeeldingen uploaden…");
const pic = await uploadImages();

console.log("→ documenten schrijven…");
const docs = buildDocs(pic);
const tx = docs.reduce(
  (acc, doc) => acc.createOrReplace(doc),
  client.transaction()
);
await tx.commit();
docs.forEach((doc) => console.log(`  ✔ ${doc._type}: ${doc._id}`));

console.log(`\nKlaar! ${docs.length} documenten geschreven.`);
console.log("Start de site met:  npm run dev  →  http://localhost:3000");
