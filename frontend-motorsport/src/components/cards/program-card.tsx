import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/ui/icons";
import { ResilientImage } from "@/components/ui/resilient-image";
import type { MotorsportProgram } from "@/types/design-system";

const STATUS_LABELS: Record<MotorsportProgram["status"], string> = {
  announced: "Announced",
  registrationOpen: "Registration open",
  ticketsOpen: "Tickets open",
  live: "Live",
  completed: "Completed",
};

const PROGRAM_TYPE_LABELS: Record<MotorsportProgram["programType"], string> = {
  rallycross: "Rallycross",
  juniorTalentCup: "Junior Talent Cup",
  raceWeekend: "Race Weekend",
  other: "Motorsport programme",
};

export function ProgramCard({
  program,
  feature = false,
}: {
  program: MotorsportProgram;
  feature?: boolean;
}) {
  return (
    <article
      className={`group grid overflow-hidden border border-ms-warm-white/14 bg-[#071a3d]/88 backdrop-blur-sm ${
        feature ? "lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,.65fr)]" : ""
      }`}
    >
      <Link
        href={program.href}
        className={`relative block overflow-hidden bg-ms-charcoal ${
          feature ? "min-h-[28rem] lg:min-h-[36rem]" : "aspect-[4/3]"
        }`}
      >
        <ResilientImage
          src={program.image}
          alt={program.imageAlt}
          fallbackSrc={
            program.programType === "rallycross"
              ? "/media/sarga-motorsport-bike-and-rally.png"
              : "/media/sarga-motorsport-motorbike-race.png"
          }
          fallbackAlt="Sarga Motorsport programme race action"
          fill
          sizes={feature ? "(max-width: 1024px) 100vw, 65vw" : "50vw"}
          className="object-cover transition duration-700 ease-(--ease-ms-out) group-hover:scale-[1.025] group-hover:saturate-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ms-black/90 via-ms-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="ms-kicker text-ms-ignition-orange">
            {program.seasonLabel} / {PROGRAM_TYPE_LABELS[program.programType]}
          </p>
          <h3 className="ms-heading-card mt-4 max-w-[13ch]">
            {program.headline || program.title}
          </h3>
        </div>
      </Link>

      <div className="flex flex-col p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ms-warm-white/12 pb-5">
          <span className="ms-data-label text-ms-slipstream-teal">
            Programme file
          </span>
          <span className="border border-ms-electric-yellow/45 px-3 py-2 text-[0.58rem] font-black uppercase tracking-[0.14em] text-ms-electric-yellow">
            {STATUS_LABELS[program.status]}
          </span>
        </div>
        <h3 className="ms-heading-feature mt-7">{program.title}</h3>
        <p className="mt-5 text-sm leading-7 text-ms-warm-white/60">
          {program.summary}
        </p>
        {program.dateLabel || program.venue ? (
          <dl className="mt-8 grid gap-4 border-t border-ms-warm-white/12 pt-5 sm:grid-cols-2">
            {program.dateLabel ? (
              <div>
                <dt className="ms-data-label text-ms-warm-white/34">Date</dt>
                <dd className="ms-tabular mt-2 text-sm uppercase">
                  {program.dateLabel}
                </dd>
              </div>
            ) : null}
            {program.venue ? (
              <div>
                <dt className="ms-data-label text-ms-warm-white/34">Venue</dt>
                <dd className="mt-2 text-sm uppercase">{program.venue}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
        <Link
          href={program.href}
          className="mt-auto flex min-h-14 items-center justify-between border-t border-ms-warm-white/12 pt-7 text-[0.65rem] font-black uppercase tracking-[0.16em] transition-colors hover:text-ms-electric-yellow"
        >
          {program.ctaLabel}
          <ArrowUpRightIcon className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </div>
    </article>
  );
}
