import type { Metadata } from "next";
import type { ReactNode } from "react";

import { EventProgramSubnav, PageShell } from "@/components";
import {
  getIjtcProgram,
  isIjtcHidden,
  IJTC_BECOME_RIDERS_LINK,
  IJTC_NAV_ITEMS,
} from "@/lib/ijtc-data";
import { getRequestLocale } from "@/lib/i18n/request";

export const metadata: Metadata = {
  title: {
    default: "Indonesia Junior Talent Cup",
    template: "%s | IJTC",
  },
  description:
    "Indonesia Junior Talent Cup programme, schedule, riders, standings, regulation, and rider inquiry information.",
};

export default async function IjtcLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getRequestLocale();
  const program = await getIjtcProgram(locale);
  if (!program || isIjtcHidden(program)) {
    return (
      <PageShell spectrumSeparators>
        <section className="ms-blue-heat-surface flex min-h-[70vh] items-center">
          <div className="ms-shell max-w-3xl py-24">
            <p className="ms-kicker text-ms-electric-yellow">IJTC / 2026</p>
            <h1 className="ms-heading-display mt-6">
              Programme updates are coming soon.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ms-warm-white/68">
              The Indonesia Junior Talent Cup programme is being prepared for
              its next public release. Please check back for the approved season
              information.
            </p>
          </div>
        </section>
      </PageShell>
    );
  }
  return (
    <PageShell spectrumSeparators>
      <EventProgramSubnav
        programLabel={`IJTC / ${program.seasonLabel}`}
        items={IJTC_NAV_ITEMS}
        cta={{
          ...IJTC_BECOME_RIDERS_LINK,
          label: program.becomeRidersLabel ?? IJTC_BECOME_RIDERS_LINK.label,
          href: program.becomeRidersHref ?? IJTC_BECOME_RIDERS_LINK.href,
        }}
      />
      {children}
    </PageShell>
  );
}
