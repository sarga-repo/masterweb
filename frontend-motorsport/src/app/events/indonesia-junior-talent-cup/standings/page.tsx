import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  InformationBand,
  PageHero,
  SectionHeader,
  StandingsTable,
} from "@/components";
import { fetchMotorsportTheme } from "@/lib/cms-data";
import {
  getIjtcProgram,
  getIjtcInformationBand,
  getIjtcStandings,
  getIjtcSection,
  IJTC_BASE_PATH,
} from "@/lib/ijtc-data";
import { getRequestLocale } from "@/lib/i18n/request";
import { createSurfaceSequencer } from "@/lib/surface-sequencer";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Standings",
  description:
    "Indonesia Junior Talent Cup standings, points, and result summaries.",
};

export default async function IjtcStandingsPage() {
  const locale = await getRequestLocale();
  const [program, standings] = await Promise.all([
    getIjtcProgram(locale),
    getIjtcStandings(locale),
  ]);
  if (!program) notFound();
  const theme = await fetchMotorsportTheme(locale);
  const nextAlternatingSurface = createSurfaceSequencer(theme).nextClass;
  const leader = standings[0];
  const demoData = standings.some((entry) =>
    /demo|demonstration/i.test(`${entry.rider} ${entry.resultSummary ?? ""}`),
  );
  const standingsSection = getIjtcSection(program, "standings");
  const hero = program.presentationHero;

  return (
    <>
      <PageHero
        kicker={hero?.eyebrow ?? `IJTC / ${program.seasonLabel}`}
        kickerColor="orange"
        title={hero?.title ?? "Standings & results."}
        description={
          hero?.description ??
          "One accessible classification for position, rider, team, latest result context, and championship points."
        }
        showKicker={hero?.showEyebrow}
        showTitle={hero?.showTitle}
        showDescription={hero?.showDescription}
        showMedia={hero?.showMedia}
        backgroundImage={hero?.backgroundMedia?.url ?? program.image}
        backgroundAlt={hero?.backgroundMedia?.alt ?? program.imageAlt}
        accent="teal"
        accentPosition="bottom-right"
        surface="heat"
        speedLines
        grain
      />

      <InformationBand
        {...getIjtcInformationBand(program, {
          eyebrow: "Classification control / Current order",
          title: "Every point stays visible.",
          description:
            "The wide classification remains horizontally scrollable on small screens without hiding columns or changing reading order.",
          items: [
            { label: "Season", value: program.seasonLabel },
            {
              label: "Classified",
              value: String(standings.length).padStart(2, "0"),
            },
            {
              label: "Leader",
              value: leader
                ? `#${leader.number ?? leader.position}`
                : "Pending",
            },
          ],
        })}
      />

      <section
        className={`ms-reflected-light-surface ms-section ${nextAlternatingSurface()}`}
      >
        <div className="ms-shell">
          <SectionHeader
            index={standingsSection?.indexLabel ?? "STANDINGS"}
            showIndex={standingsSection?.showIndex ?? true}
            showEyebrow={standingsSection?.showEyebrow ?? true}
            showTitle={standingsSection?.showTitle ?? true}
            showDescription={standingsSection?.showBody ?? true}
            eyebrow={standingsSection?.eyebrow ?? "Points and results"}
            title={standingsSection?.title ?? "Official classification."}
            description={
              standingsSection?.body ??
              "Rider relations, position, points, region, and result summaries are sourced from the shared Motorsport CMS."
            }
          />
          <div className="mt-14">
            <StandingsTable
              entries={standings}
              caption={`IJTC ${program.seasonLabel} standings`}
            />
          </div>
          {demoData ? (
            <p className="mt-8 max-w-3xl border-l border-ms-ignition-orange/60 pl-5 text-sm leading-7 text-ms-warm-white/58">
              This classification contains explicitly labelled demonstration
              results. It must not be treated as an official sporting notice
              until approved records replace the demo data in CMS.
            </p>
          ) : null}
        </div>
      </section>

      <section
        className={`ms-blue-heat-surface py-12 sm:py-16 ${nextAlternatingSurface()}`}
      >
        <div className="ms-shell flex flex-wrap items-center justify-between gap-6">
          <p className="ms-heading-card max-w-[19ch]">
            Read the field behind the points.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link
              href={`${IJTC_BASE_PATH}/riders`}
              className="border-b border-ms-slipstream-teal/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-slipstream-teal"
            >
              Rider profiles
            </Link>
            <Link
              href={`${IJTC_BASE_PATH}/regulation`}
              className="border-b border-ms-electric-yellow/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
            >
              Sporting regulation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
