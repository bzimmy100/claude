import { defineLive } from "next-sanity/live";
import { client } from "./client";

/* Live content: wijzigingen in de studio verschijnen direct op de site,
   zonder refresh. Het token is nodig om concepten (drafts) te tonen in
   de Presentation-tool. */
const token =
  process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});
