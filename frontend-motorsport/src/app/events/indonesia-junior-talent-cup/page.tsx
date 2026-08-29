import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import { InformationBand, PageHero, SectionHeader } from "@/components";
import { MarkdownContent } from "@/components/content/markdown-content";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import { notFound } from "next/navigation";
import {
  formatProgramStatus,
  getIjtcInformationBand,
  getIjtcProgram,
  getIjtcSection,
  IJTC_BASE_PATH,
} from "@/lib/ijtc-data";
import { fetchMotorsportTheme } from "@/lib/cms-data";
import { getRequestLocale } from "@/lib/i18n/request";
import { createSurfaceSequencer } from "@/lib/surface-sequencer";

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
  const locale = await getRequestLocale();
  const [program, theme] = await Promise.all([
    getIjtcProgram(locale),
    fetchMotorsportTheme(locale),
  ]);
  if (!program) notFound();
  const status = formatProgramStatus(program.status);
  const nextAlternatingSurface = createSurfaceSequencer(theme).nextClass;
  const overviewSection = getIjtcSection(program, "overview");
  const routesSection = getIjtcSection(program, "routes");
  const intakeSection = getIjtcSection(program, "become-riders");
  const programmePaths = routesSection?.items?.length
    ? routesSection.items
        .filter((item) => item.isActive !== false && item.href)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((item, index) => ({
          index: item.label ?? String(index + 1).padStart(2, "0"),
          title: item.title ?? "Programme route",
          description: item.description ?? "",
          href: item.href!,
        }))
    : PROGRAMME_PATHS;

  return (
    <>
      <PageHero
        kicker={
          program.presentationHero?.eyebrow ?? `IJTC / ${program.seasonLabel}`
        }
        kickerColor="yellow"
        title={
          program.presentationHero?.title || program.headline || program.title
        }
        description={program.presentationHero?.description ?? program.summary}
        showKicker={program.presentationHero?.showEyebrow}
        showTitle={program.presentationHero?.showTitle}
        showDescription={program.presentationHero?.showDescription}
        showMedia={program.presentationHero?.showMedia}
        backgroundImage={
          program.presentationHero?.backgroundMedia?.url ?? program.image
        }
        backgroundAlt={
          program.presentationHero?.backgroundMedia?.alt ?? program.imageAlt
        }
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

      <section
        className={`ms-reflected-light-surface ms-section ${nextAlternatingSurface()}`}
      >
        <div className="ms-shell grid gap-12 lg:grid-cols-[minmax(0,.86fr)_minmax(0,1.14fr)] lg:items-center">
          <div>
            <SectionHeader
              index={overviewSection?.indexLabel ?? "OVERVIEW"}
              showIndex={overviewSection?.showIndex ?? true}
              showEyebrow={overviewSection?.showEyebrow ?? true}
              showTitle={overviewSection?.showTitle ?? true}
              eyebrow={
                overviewSection?.eyebrow ?? "Indonesia Junior Talent Cup"
              }
              title={overviewSection?.title ?? "Built for progression."}
              align="left"
            />
            <MarkdownContent
              value={
                overviewSection?.body ??
                "The programme is designed for young Indonesian riders who need a disciplined bridge between raw pace and professional race craft. Every published round connects preparation, coaching, competition, and measurable development."
              }
              className="ms-rich-text mt-8 max-w-xl text-lg leading-8 text-ms-warm-white/66"
            />
            <Link
              href={overviewSection?.ctaUrl ?? `${IJTC_BASE_PATH}/about`}
              className="group mt-8 inline-flex items-center gap-3 border-b border-ms-electric-yellow/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
            >
              {overviewSection?.ctaLabel ?? "How IJTC works"}
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="ms-panel relative aspect-[16/11] overflow-hidden">
            <ResilientImage
              src={
                overviewSection?.media ??
                "/media/sarga-motorsport-discipline-motorcycle-daylight.jpg"
              }
              alt={
                "Young motorcycle racers training together on a daylight circuit"
              }
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

      <section
        className={`ms-blue-heat-surface ms-section ${nextAlternatingSurface()}`}
      >
        <div className="ms-shell">
          <SectionHeader
            index={routesSection?.indexLabel ?? "ROUTES"}
            showIndex={routesSection?.showIndex ?? true}
            showEyebrow={routesSection?.showEyebrow ?? true}
            showTitle={routesSection?.showTitle ?? true}
            showDescription={routesSection?.showBody ?? true}
            eyebrow={routesSection?.eyebrow ?? "Programme directory"}
            title={routesSection?.title ?? "Follow the season."}
            description={
              routesSection?.body ??
              "Move from the calendar to the published rider field and current classification without leaving the IJTC programme."
            }
          />
          <div className="mt-14 grid gap-4 lg:grid-cols-[1.15fr_.85fr_1fr]">
            {programmePaths.map((item) => (
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
                  <MarkdownContent
                    value={item.description}
                    className="ms-rich-text mt-4 max-w-sm text-sm leading-6 text-ms-warm-white/55"
                  />
                  <ArrowUpRightIcon className="mt-6 size-5 text-ms-slipstream-teal transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`ms-reflected-light-surface py-14 sm:py-20 ${nextAlternatingSurface()}`}
      >
        <div className="ms-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
              <p className="ms-data-label text-ms-slipstream-teal">
                {intakeSection?.eyebrow ?? "Next intake"}
              </p>
            <h2 className="ms-heading-section mt-5 max-w-[16ch]">
              {intakeSection?.title ?? "Ready to introduce your racing journey?"}
            </h2>
            <MarkdownContent
              value={
                intakeSection?.body ??
                "The first step is an inquiry, not an account or automatic entry. The programme team reviews every submission directly."
              }
              className="ms-rich-text mt-5 max-w-xl text-base leading-7 text-ms-warm-white/64"
            />
          </div>
          <Link
            href={intakeSection?.ctaUrl ?? `${IJTC_BASE_PATH}/become-riders`}
            className="group inline-flex h-(--ms-control-height) items-center gap-4 bg-ms-apex-crimson px-8 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white transition-colors hover:bg-ms-ignition-orange"
          >
            {intakeSection?.ctaLabel ?? "Become Riders"}
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
