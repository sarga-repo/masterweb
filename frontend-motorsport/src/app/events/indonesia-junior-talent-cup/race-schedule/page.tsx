import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  InformationBand,
  PageHero,
  ScheduleCard,
  SectionHeader,
} from "@/components";
import { fetchMotorsportTheme } from "@/lib/cms-data";
import {
  formatProgramStatus,
  getIjtcInformationBand,
  getIjtcProgram,
  IJTC_BASE_PATH,
} from "@/lib/ijtc-data";
import { getRequestLocale } from "@/lib/i18n/request";
import { createSurfaceSequencer } from "@/lib/surface-sequencer";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Race Schedule",
  description:
    "Indonesia Junior Talent Cup 2026 race schedule and session status.",
};

export default async function IjtcSchedulePage() {
  const locale = await getRequestLocale();
  const [program, theme] = await Promise.all([
    getIjtcProgram(locale),
    fetchMotorsportTheme(locale),
  ]);
  if (!program) notFound();
  const nextAlternatingSurface = createSurfaceSequencer(theme).nextClass;

  return (
    <>
      <PageHero
        kicker={`IJTC / ${program.seasonLabel}`}
        kickerColor="orange"
        title="Race schedule."
        description="Published rounds, sessions, and venue status for the Indonesia Junior Talent Cup programme."
        backgroundImage={program.image}
        backgroundAlt={program.imageAlt}
        accent="blue"
        accentPosition="bottom-right"
        surface="heat"
        speedLines
        grain
      />

      <InformationBand
        {...getIjtcInformationBand(program, {
          eyebrow: "Calendar control / Published rounds",
          title: "Preparation begins before the grid forms.",
          description:
            "Dates and venues remain explicitly marked until sporting approval is complete.",
          items: [
            { label: "Season", value: program.seasonLabel },
            {
              label: "Rounds",
              value: String(program.schedule.length).padStart(2, "0"),
            },
            { label: "Status", value: formatProgramStatus(program.status) },
          ],
        })}
      />

      <section
        className={`ms-reflected-light-surface ms-section ${nextAlternatingSurface()}`}
      >
        <div className="ms-shell">
          <SectionHeader
            index="SCHEDULE"
            eyebrow="Race calendar"
            title="Every published session."
            description="The CMS controls round order, timing, description, and venue information. Placeholder dates remain clearly identified."
          />
          <div className="mt-14 space-y-5">
            {program.schedule.map((entry) => (
              <ScheduleCard key={entry.id} entry={entry} />
            ))}
          </div>
          <p className="mt-8 max-w-3xl border-l border-ms-electric-yellow/55 pl-5 text-sm leading-7 text-ms-warm-white/58">
            Schedule items labelled TBA or demo are not final sporting notices.
            Confirm travel and participation only after the programme team
            publishes approved dates and venues.
          </p>
        </div>
      </section>

      <section
        className={`ms-blue-heat-surface py-12 sm:py-16 ${nextAlternatingSurface()}`}
      >
        <div className="ms-shell flex flex-wrap items-center justify-between gap-6">
          <p className="ms-heading-card max-w-[20ch]">
            Follow the field after every round.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link
              href={`${IJTC_BASE_PATH}/riders`}
              className="border-b border-ms-slipstream-teal/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-slipstream-teal"
            >
              Rider profiles
            </Link>
            <Link
              href={`${IJTC_BASE_PATH}/standings`}
              className="border-b border-ms-electric-yellow/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
            >
              Standings
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
