import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

import { InformationBand, PageHero, SectionHeader } from "@/components";
import { MarkdownContent } from "@/components/content/markdown-content";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import { fetchMotorsportTheme } from "@/lib/cms-data";
import {
  getIjtcInformationBand,
  getIjtcProgram,
  getIjtcSection,
  IJTC_BASE_PATH,
} from "@/lib/ijtc-data";
import { getRequestLocale } from "@/lib/i18n/request";
import { createSurfaceSequencer } from "@/lib/surface-sequencer";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "About IJTC",
  description:
    "How the Indonesia Junior Talent Cup develops riders through coaching, competition, and sporting standards.",
};

const PRINCIPLES = [
  {
    index: "01",
    title: "Structured coaching",
    body: "Briefings, track feedback, and repeatable preparation turn speed into disciplined race craft.",
  },
  {
    index: "02",
    title: "Measured competition",
    body: "Published rounds and classifications give every rider a clear view of progress and performance.",
  },
  {
    index: "03",
    title: "Sporting responsibility",
    body: "Safety, regulation, conduct, and respect for officials remain part of development at every stage.",
  },
];

export default async function AboutIjtcPage() {
  const locale = await getRequestLocale();
  const [program, theme] = await Promise.all([
    getIjtcProgram(locale),
    fetchMotorsportTheme(locale),
  ]);
  if (!program) notFound();
  const nextAlternatingSurface = createSurfaceSequencer(theme).nextClass;
  const purposeSection = getIjtcSection(program, "purpose");
  const modelSection = getIjtcSection(program, "model");
  const entrySection = getIjtcSection(program, "become-riders");
  const hero = program.presentationHero;
  const principles = modelSection?.items?.length
    ? modelSection.items
        .filter((item) => item.isActive !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((item, index) => ({
          index: item.label ?? String(index + 1).padStart(2, "0"),
          title: item.title,
          body: item.description ?? "",
        }))
    : PRINCIPLES;

  return (
    <>
      <PageHero
        kicker={hero?.eyebrow ?? `About IJTC / ${program.seasonLabel}`}
        kickerColor="yellow"
        title={hero?.title ?? "Built for progression."}
        description={hero?.description ?? program.summary}
        showKicker={hero?.showEyebrow}
        showTitle={hero?.showTitle}
        showDescription={hero?.showDescription}
        showMedia={hero?.showMedia}
        backgroundImage={hero?.backgroundMedia?.url ?? program.image}
        backgroundAlt={hero?.backgroundMedia?.alt ?? program.imageAlt}
        accent="orange"
        accentPosition="bottom-left"
        surface="heat"
        speedLines
        grain
      />

      <InformationBand
        {...getIjtcInformationBand(program, {
          eyebrow: "Programme brief / Development model",
          title: "Talent needs structure around it.",
          description:
            "IJTC combines practical track development with published sporting information and direct programme support.",
          items: [
            { label: "Focus", value: "Rider growth" },
            { label: "Format", value: "Season" },
            { label: "Path", value: "Inquiry first" },
          ],
        })}
      />

      <section
        className={`ms-reflected-light-surface ms-section ${nextAlternatingSurface()}`}
      >
        <div className="ms-shell grid gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] lg:items-center">
          <div className="ms-panel relative aspect-[16/11] overflow-hidden">
            <ResilientImage
              src={
                purposeSection?.media ??
                "/media/sarga-motorsport-discipline-motorcycle-daylight.jpg"
              }
              alt="Motorcycle riders developing race craft on a daylight circuit"
              fallbackSrc="/media/motorcycle-racing-dusk.png"
              fallbackAlt="Motorcycle riders on circuit"
              fill
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#071a3d]/55 via-transparent to-transparent"
            />
          </div>
          <div>
            <SectionHeader
              index={purposeSection?.indexLabel ?? "PURPOSE"}
              showIndex={purposeSection?.showIndex ?? true}
              showEyebrow={purposeSection?.showEyebrow ?? true}
              showTitle={purposeSection?.showTitle ?? true}
              showDescription={purposeSection?.showBody ?? false}
              eyebrow={purposeSection?.eyebrow ?? "Why IJTC exists"}
              title={
                purposeSection?.title ?? "A bridge to professional race craft."
              }
              align="left"
            />
            <MarkdownContent
              value={
                purposeSection?.body ??
                "Young riders need more than isolated track time. IJTC creates a programme environment where coaching, competition, standards, and public progress reinforce each other throughout the season."
              }
              className="ms-rich-text mt-8 text-lg leading-8 text-ms-warm-white/66"
            />
          </div>
        </div>
      </section>

      <section
        className={`ms-blue-heat-surface ms-section ${nextAlternatingSurface()}`}
      >
        <div className="ms-shell">
          <SectionHeader
            index={modelSection?.indexLabel ?? "MODEL"}
            showIndex={modelSection?.showIndex ?? true}
            showEyebrow={modelSection?.showEyebrow ?? true}
            showTitle={modelSection?.showTitle ?? true}
            showDescription={modelSection?.showBody ?? true}
            eyebrow={modelSection?.eyebrow ?? "Development principles"}
            title={modelSection?.title ?? "How progression is built."}
            description={
              modelSection?.body ??
              "Three connected principles shape the public programme and the rider experience behind it."
            }
          />
          <div className="mt-14 grid gap-4 lg:grid-cols-[1.05fr_.95fr_1fr]">
            {principles.map((principle) => (
              <article
                key={principle.index}
                className="ms-blue-panel ms-panel min-h-72 p-7"
              >
                <span className="font-display text-xl text-ms-electric-yellow">
                  {principle.index}
                </span>
                <h2 className="ms-heading-card mt-20">{principle.title}</h2>
                <p className="mt-5 text-sm leading-7 text-ms-warm-white/58">
                  {principle.body}
                </p>
              </article>
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
              {entrySection?.eyebrow ?? "Programme entry"}
            </p>
            <h2 className="ms-heading-section mt-5 max-w-[15ch]">
              {entrySection?.title ?? "Start with a direct rider inquiry."}
            </h2>
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
