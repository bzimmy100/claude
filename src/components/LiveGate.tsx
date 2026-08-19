"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

/* SanityLive ververst de pagina bij elke wijziging. Buiten de studio is
   dat precies wat we willen; binnen de Presentation-tool zorgt de
   loader-verbinding al voor directe updates en zou het verversen alleen
   maar zichtbaar geflikker geven — daar schakelen we hem dus uit. */
export function LiveGate({ children }: { children: React.ReactNode }) {
  const inPresentationTool = useIsPresentationTool();
  if (inPresentationTool) return null;
  return <>{children}</>;
}
