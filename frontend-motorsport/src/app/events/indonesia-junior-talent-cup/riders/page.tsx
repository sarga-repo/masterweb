import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import {
  InformationBand,
  PageHero,
  RiderCatalog,
  SectionHeader,
} from "@/components";
import { fetchMotorsportTheme } from "@/lib/cms-data";
import {
  getIjtcInformationBand,
  getIjtcProgram,
  getIjtcRiders,
  IJTC_BASE_PATH,
} from "@/lib/ijtc-data";
import { getRequestLocale } from "@/lib/i18n/request";
import { createSurfaceSequencer } from "@/lib/surface-sequencer";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Riders",
  description:
    "Indonesia Junior Talent Cup rider profiles, teams, and regions.",
};

export default async function IjtcRidersPage() {
  const locale = await getRequestLocale();
  const [program, riders] = await Promise.all([
    getIjtcProgram(locale),
    getIjtcRiders(locale),
  ]);
  if (!program) notFound();
  const theme = await fetchMotorsportTheme(locale);
  const nextAlternatingSurface = createSurfaceSequencer(theme).nextClass;
  const demoCount = riders.filter((rider) =>
    /demo|demonstration/i.test(`${rider.name} ${rider.bio ?? ""}`),
  ).length;

  return (
    <>
      <PageHero
        kicker={`IJTC / ${program.seasonLabel}`}
        kickerColor="yellow"
        title="The rider field."
        description="Published rider profiles connect number, team, region, and development context in one programme view."
        backgroundImage={program.image}
        backgroundAlt={program.imageAlt}
        accent="orange"
        accentPosition="bottom-left"
        surface="heat"
        speedLines
        grain
      />

      <InformationBand
        {...getIjtcInformationBand(program, {
          eyebrow: "Rider control / Published field",
          title: "Every number carries a development story.",
          description:
            "Portraits and participant information appear only after programme publication. Demo records remain explicitly labelled.",
          items: [
            {
              label: "Profiles",
              value: String(riders.length).padStart(2, "0"),
            },
            { label: "Demo", value: String(demoCount).padStart(2, "0") },
            { label: "Nation", value: "Indonesia" },
          ],
        })}
      />

      <section
        className={`ms-reflected-light-surface ms-section ${nextAlternatingSurface()}`}
      >
        <div className="ms-shell">
          <SectionHeader
            index="RIDERS"
            eyebrow="Selected field"
            title="Meet the programme."
            description="Twelve riders appear per page in a responsive four-column catalogue. Editor-managed portraits fall back to a numbered silhouette when photography is not yet approved."
          />
          <div className="mt-14">
            <RiderCatalog riders={riders} />
          </div>
          {demoCount > 0 ? (
            <p className="mt-8 max-w-3xl border-l border-ms-ignition-orange/60 pl-5 text-sm leading-7 text-ms-warm-white/58">
              Demo names, teams, results, and biographies are content-model
              examples—not confirmed participants. Editors must replace or
              approve them before launch.
            </p>
          ) : null}
        </div>
      </section>

      <section
        className={`ms-blue-heat-surface py-12 sm:py-16 ${nextAlternatingSurface()}`}
      >
        <div className="ms-shell flex flex-wrap items-center justify-between gap-6">
          <p className="ms-heading-card max-w-[19ch]">
            Track the field through the season.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link
              href={`${IJTC_BASE_PATH}/standings`}
              className="border-b border-ms-electric-yellow/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
            >
              View standings
            </Link>
            <Link
              href={`${IJTC_BASE_PATH}/become-riders`}
              className="border-b border-ms-slipstream-teal/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-slipstream-teal"
            >
              Rider inquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
