import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  InformationBand,
  PageHero,
  RiderPortrait,
  SectionHeader,
} from "@/components";
import { ArrowRightIcon } from "@/components/ui/icons";
import {
  getIjtcProgram,
  getIjtcRider,
  getIjtcRiders,
  IJTC_BASE_PATH,
} from "@/lib/ijtc-data";

type RiderPageProps = {
  params: Promise<{ riderSlug: string }>;
};

export async function generateStaticParams() {
  const riders = await getIjtcRiders();
  return riders.map((rider) => ({ riderSlug: rider.slug }));
}

export async function generateMetadata({
  params,
}: RiderPageProps): Promise<Metadata> {
  const { riderSlug } = await params;
  const rider = await getIjtcRider(riderSlug);
  if (!rider) return { title: "Rider not found" };

  return {
    title: rider.name,
    description: `${rider.name}, number ${rider.number ?? "pending"}, ${rider.team ?? "IJTC rider"} profile.`,
  };
}

export default async function IjtcRiderProfilePage({ params }: RiderPageProps) {
  const { riderSlug } = await params;
  const [program, rider] = await Promise.all([
    getIjtcProgram(),
    getIjtcRider(riderSlug),
  ]);
  if (!rider) notFound();

  const isDemo = /demo|demonstration|fictional/i.test(
    `${rider.name} ${rider.bio ?? ""}`,
  );

  return (
    <>
      <PageHero
        kicker={`IJTC / Rider #${rider.number ?? "--"}`}
        kickerColor="yellow"
        title={rider.name}
        description={
          rider.bio ||
          "Published rider profile for the Indonesia Junior Talent Cup programme."
        }
        backgroundImage={
          rider.portrait ||
          "/media/hero/sarga-motorsport-hero-paddock-ready.jpg"
        }
        backgroundAlt={rider.portraitAlt ?? rider.name}
        accent="orange"
        accentPosition="bottom-left"
        surface="heat"
        grain
      />

      <InformationBand
        eyebrow={`Rider profile / ${program.seasonLabel}`}
        title={`Number ${rider.number ?? "pending"}. One development path.`}
        description="This shared profile template is populated from the selected rider record in the Motorsport CMS."
        items={[
          { label: "Team", value: rider.team ?? "Independent" },
          { label: "Region", value: rider.region ?? "Indonesia" },
          { label: "Nation", value: rider.nationality ?? "Indonesia" },
        ]}
      />

      <section className="ms-reflected-light-surface ms-section">
        <div className="ms-shell grid gap-12 lg:grid-cols-[minmax(20rem,.82fr)_minmax(0,1.18fr)] lg:items-center">
          <div className="ms-panel relative aspect-[4/5] overflow-hidden">
            <RiderPortrait
              src={rider.portrait}
              alt={rider.portraitAlt ?? rider.name}
              number={rider.number}
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
              priority
            />
            <span className="absolute bottom-6 left-6 font-display text-4xl text-ms-electric-yellow">
              #{rider.number ?? "--"}
            </span>
          </div>
          <div>
            <SectionHeader
              index="PROFILE"
              eyebrow={
                isDemo ? "Fictional demonstration record" : "Published rider"
              }
              title="Built one lap at a time."
              description="Biography, team, region, number, and portrait remain editor-configurable while the public structure stays consistent for every rider."
              align="left"
            />
            <p className="mt-8 text-lg leading-8 text-ms-warm-white/68">
              {rider.bio ||
                "The programme team has not yet published a rider biography."}
            </p>
            {isDemo ? (
              <p className="mt-6 border-l border-ms-ignition-orange/60 pl-5 text-sm leading-7 text-ms-warm-white/58">
                This fictional profile exists for CMS and layout demonstration.
                Replace the name, image, biography, team, and region with
                approved participant information before launch.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="ms-blue-heat-surface py-12 sm:py-16">
        <div className="ms-shell flex flex-wrap items-center justify-between gap-6">
          <p className="ms-heading-card max-w-[20ch]">
            Follow the complete IJTC field.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link
              href={`${IJTC_BASE_PATH}/riders`}
              className="group flex items-center gap-3 border-b border-ms-slipstream-teal/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-slipstream-teal"
            >
              All riders
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={`${IJTC_BASE_PATH}/standings`}
              className="border-b border-ms-electric-yellow/55 pb-2 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-electric-yellow"
            >
              View standings
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
