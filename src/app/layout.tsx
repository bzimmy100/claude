import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { LiveGate } from "@/components/LiveGate";
import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";

export const metadata: Metadata = {
  title: "SunBooster demo",
  description: "Sanity-demo voor sunbooster.health",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isEnabled: isDraftMode } = await draftMode();
  return (
    <html lang="nl">
      <body>
        {children}
        <LiveGate>
          <SanityLive />
        </LiveGate>
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
