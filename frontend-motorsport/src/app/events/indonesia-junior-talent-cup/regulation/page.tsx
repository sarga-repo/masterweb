import type { Metadata } from "next";
import Link from "next/link";

import {
  InformationBand,
  PageHero,
  RegulationDownloadPanel,
  SectionHeader,
} from "@/components";
import { ArrowRightIcon } from "@/components/ui/icons";
import {
  getIjtcProgram,
  getIjtcRegulation,
  IJTC_BASE_PATH,
} from "@/lib/ijtc-data";

export const metadata: Metadata = {
  title: "Regulation",
  description:
    "Published sporting regulation and document status for the Indonesia Junior Talent Cup.",
};

const PUBLICATION_STEPS = [
  {
    index: "01",
    title: "Document supplied",
    body: "The programme team provides the controlled sporting PDF and release metadata.",
  },
  {
    index: "02",
    title: "Editorial review",
    body: "Version, effective date, programme relation, and file status are checked in the CMS.",
  },
  {
    index: "03",
    title: "Public release",
    body: "Only an active record with an approved PDF becomes available from this page.",
  },
];

export default async function IjtcRegulationPage() {
  const [program, regulation] = await Promise.all([
    getIjtcProgram(),
    getIjtcRegulation(),
  ]);
  const isPublished = Boolean(regulation.fileHref);

  return (
    <>
      <PageHero
        kicker={`IJTC / ${program.seasonLabel}`}
        kickerColor="yellow"
        title="Sporting regulation."
        description="One controlled source for the programme rules, document version, and effective date."
        backgroundImage="/media/sarga-motorsport-motorbike-race.png"
        backgroundAlt="Motorcycle racers contesting a circuit round"
        accent="orange"
        accentPosition="bottom-left"
        surface="heat"
        speedLines
        grain
      />

      <InformationBand
        eyebrow="Document control / Sporting notice"
        title="Race from the approved rulebook."
        description="This page never substitutes a draft or placeholder file for an official regulation."
        items={[
          { label: "Season", value: program.seasonLabel },
          { label: "Status", value: isPublished ? "Published" : "Pending" },
          { label: "Format", value: "PDF" },
        ]}
      />

      <section className="ms-reflected-light-surface ms-section">
        <div className="ms-shell">
          <SectionHeader
            index="RULEBOOK"
            eyebrow="Official publication"
            title="The current controlled document."
            description="Publication is CMS-managed. When an approved file is activated, the download control appears automatically."
          />
          <div className="mt-14">
            <RegulationDownloadPanel
              title={regulation.title}
              summary={regulation.summary}
              version={regulation.version}
              effectiveDate={regulation.effectiveDate}
              fileHref={regulation.fileHref}
              fileLabel="Open regulation PDF"
            />
          </div>
        </div>
      </section>

      <section className="ms-blue-heat-surface ms-section">
        <div className="ms-shell">
          <SectionHeader
            index="CONTROL"
            eyebrow="Publication workflow"
            title="Approved before it goes live."
            description="The public download follows a deliberate three-step release path."
          />
          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {PUBLICATION_STEPS.map((step) => (
              <article
                key={step.index}
                className="ms-blue-panel ms-panel min-h-72 p-7"
              >
                <span className="font-display text-xl text-ms-electric-yellow">
                  {step.index}
                </span>
                <h2 className="ms-heading-card mt-20">{step.title}</h2>
                <p className="mt-5 text-sm leading-7 text-ms-warm-white/58">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ms-reflected-light-surface py-14 sm:py-20">
        <div className="ms-shell flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="ms-data-label text-ms-slipstream-teal">
              Programme support
            </p>
            <h2 className="ms-heading-section mt-5 max-w-[15ch]">
              Questions about participation?
            </h2>
          </div>
          <Link
            href={`${IJTC_BASE_PATH}/become-riders`}
            className="group inline-flex h-(--ms-control-height) items-center gap-4 bg-ms-apex-crimson px-8 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white transition-colors hover:bg-ms-ignition-orange"
          >
            Send rider inquiry
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
