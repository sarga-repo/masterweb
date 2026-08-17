import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import { InformationBand, PageHero, SectionHeader } from "@/components";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import { notFound } from "next/navigation";
import {
  formatProgramStatus,
  getIjtcInformationBand,
  getIjtcProgram,
  IJTC_BASE_PATH,
} from "@/lib/ijtc-data";
import { getRequestLocale } from "@/lib/i18n/request";

export const metadata: Metadata = {
  title: { absolute: "Indonesia Junior Talent Cup | Sarga Motorsport" },
};

const PROGRAMME_PATHS = [
  {
    index: "01",
    title: "Race schedule",
    description: "Published rounds, sessions, dates, and venue status.",
    href: `${IJTC_BASE_PATH}/race-schedule`,
  },
  {
    index: "02",
    title: "Rider profiles",
    description: "The selected field, teams, regions, and rider backgrounds.",
    href: `${IJTC_BASE_PATH}/riders`,
  },
  {
    index: "03",
    title: "Standings",
    description: "Official classification, points, and latest result context.",
    href: `${IJTC_BASE_PATH}/standings`,
  },
];

export default async function IjtcOverviewPage() {
  const program = await getIjtcProgram(await getRequestLocale());
  if (!program) notFound();
  const status = formatProgramStatus(program.status);

  return (
    <>
      <PageHero
        kicker={`IJTC / ${program.seasonLabel}`}
        kickerColor="yellow"
        title={program.headline ?? program.title}
        description={program.summary}
        backgroundImage={program.image}
        backgroundAlt={program.imageAlt}
        accent="orange"
        accentPosition="bottom-left"
        surface="heat"
        speedLines
        grain
      >
        <Link
          href={program.becomeRidersHref ?? `${IJTC_BASE_PATH}/become-riders`}
          className="group inline-flex h-(--ms-control-height) items-center gap-4 bg-ms-apex-crimson px-8 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white transition-colors hover:bg-ms-ignition-orange"
        >
          {program.becomeRidersLabel ?? "Become Riders"}
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </PageHero>

      <InformationBand
        {...getIjtcInformationBand(program, {
          eyebrow: "Programme control / Talent pathway",
          title: "A clear route from potential to race craft.",
          description:
            "IJTC brings coaching, structured track time, sporting standards, and public classification into one development programme.",
          items: [
          { label: "Season", value: program.seasonLabel },
          { label: "Status", value: status },
          { label: "Sections", value: "07" },
          ],
        })}
      />

      <section className="ms-reflected-light-surface ms-section">
        <div className="ms-shell grid gap-12 lg:grid-cols-[minmax(0,.86fr)_minmax(0,1.14fr)] lg:items-center">
          <div>
            <SectionHeader
              index="OVERVIEW"
              eyebrow="Indonesia Junior Talent Cup"
              title="Built for progression."
              align="left"
            />
            <p className="mt-8 max-w-xl text-lg leading-8 text-ms-warm-white/66">
              The programme is designed for young Indonesian riders who need a
              disciplined bridge between raw pace and professional race craft.
              Every published round connects preparation, coaching, competition,
              and measurable development.
            </p>
            <Link
              href={`${IJTC_BASE_PATH}/about`}
              className="group mt-8 inline-flex items-center gap-3 border-b border-ms-electric-yellow/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
            >
              How IJTC works
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="ms-panel relative aspect-[16/11] overflow-hidden">
            <ResilientImage
              src="/media/sarga-motorsport-discipline-motorcycle-daylight.jpg"
              alt="Young motorcycle racers training together on a daylight circuit"
              fallbackSrc="/media/motorcycle-racing-dusk.png"
              fallbackAlt="Motorcycle racers training on circuit"
              fill
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#071a3d]/55 via-transparent to-transparent"
            />
            <p className="absolute bottom-6 left-6 ms-data-label text-ms-electric-yellow">
              Coaching / Competition / Progression
            </p>
          </div>
        </div>
      </section>

      <section className="ms-blue-heat-surface ms-section">
        <div className="ms-shell">
          <SectionHeader
            index="ROUTES"
            eyebrow="Programme directory"
            title="Follow the season."
            description="Move from the calendar to the published rider field and current classification without leaving the IJTC programme."
          />
          <div className="mt-14 grid gap-4 lg:grid-cols-[1.15fr_.85fr_1fr]">
            {PROGRAMME_PATHS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group ms-blue-panel ms-panel flex min-h-72 flex-col p-7 transition-colors hover:border-ms-electric-yellow/55"
              >
                <span className="font-display text-xl text-ms-electric-yellow">
                  {item.index}
                </span>
                <div className="mt-auto">
                  <h2 className="ms-heading-card">{item.title}</h2>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-ms-warm-white/55">
                    {item.description}
                  </p>
                  <ArrowUpRightIcon className="mt-6 size-5 text-ms-slipstream-teal transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ms-reflected-light-surface py-14 sm:py-20">
        <div className="ms-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="ms-data-label text-ms-slipstream-teal">Next intake</p>
            <h2 className="ms-heading-section mt-5 max-w-[16ch]">
              Ready to introduce your racing journey?
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-ms-warm-white/64">
              The first step is an inquiry, not an account or automatic entry.
              The programme team reviews every submission directly.
            </p>
          </div>
          <Link
            href={`${IJTC_BASE_PATH}/become-riders`}
            className="group inline-flex h-(--ms-control-height) items-center gap-4 bg-ms-apex-crimson px-8 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white transition-colors hover:bg-ms-ignition-orange"
          >
            Become Riders
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
