import type { Metadata } from "next";
import type { ReactNode } from "react";

import { EventProgramSubnav, PageShell } from "@/components";
import { IJTC_BECOME_RIDERS_LINK, IJTC_NAV_ITEMS } from "@/lib/ijtc-data";

export const metadata: Metadata = {
  title: {
    default: "Indonesia Junior Talent Cup",
    template: "%s | IJTC",
  },
  description:
    "Indonesia Junior Talent Cup programme, schedule, riders, standings, regulation, and rider inquiry information.",
};

export default function IjtcLayout({ children }: { children: ReactNode }) {
  return (
    <PageShell spectrumSeparators>
      <EventProgramSubnav
        programLabel="IJTC / 2026"
        items={IJTC_NAV_ITEMS}
        cta={IJTC_BECOME_RIDERS_LINK}
      />
      {children}
    </PageShell>
  );
}
