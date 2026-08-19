import type { MetadataRoute } from "next";

/* Zolang NEXT_PUBLIC_SITE_ENV niet op "production" staat, wordt de hele
   site geblokkeerd voor zoekmachines. Zo kan de testomgeving
   (sunbooster.beeldfanaat.dev) nooit per ongeluk in Google belanden.
   Bij livegang zet je in Vercel: NEXT_PUBLIC_SITE_ENV=production */
export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_SITE_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] },
  };
}
