import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";
import type { MediaSource } from "@/types/design-system";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type EcosystemPillar = {
  index: string;
  title: string;
  description: string;
  accent?: "crimson" | "orange" | "yellow" | "teal" | "blue";
};

type BrandStoryProps = {
  eyebrow?: string;
  title: string;
  body: string;
  image: MediaSource;
  imageAlt: string;
  cta?: { label: string; href: string };
  pillars?: EcosystemPillar[];
};

/* -------------------------------------------------------------------------- */
/*  Accent map                                                                */
/* -------------------------------------------------------------------------- */

const ACCENT: Record<string, string> = {
  crimson: "bg-ms-apex-crimson",
  orange: "bg-ms-ignition-orange",
  yellow: "bg-ms-electric-yellow",
  teal: "bg-ms-slipstream-teal",
  blue: "bg-ms-draftline-blue",
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function BrandStorySection({
  eyebrow = "The Sarga Motorsport story",
  title,
  body,
  image,
  imageAlt,
  cta,
  pillars = [],
}: BrandStoryProps) {
  return (
    <section className="ms-section relative overflow-hidden">
      {/* Heat glow behind the section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 right-0 h-[40rem] w-[60%] rounded-full bg-ms-apex-crimson/8 blur-[10rem]"
      />

      <div className="ms-shell relative">
        {/* Two-column layout */}
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
          {/* Text column */}
          <div>
            <span className="ms-kicker text-ms-ignition-orange">{eyebrow}</span>
            <h2 className="ms-heading-section mt-8">{title}</h2>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-ms-warm-white/65">
              {body}
            </p>
            {cta ? (
              <Link
                href={cta.href}
                className="group mt-10 inline-flex items-center gap-4 border-b border-ms-apex-crimson pb-3 text-[0.66rem] font-black uppercase tracking-[0.16em] transition-colors hover:text-ms-ignition-orange"
              >
                <span
                  className="size-2 bg-ms-apex-crimson"
                  aria-hidden="true"
                />
                {cta.label}
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : null}
          </div>

          {/* Image column - slanted premium crop */}
          <div className="relative hidden lg:block">
            <div className="ms-slant relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 50vw, 38vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ms-black/70 via-transparent to-transparent"
              />
            </div>
            {/* Decorative data rail */}
            <span className="ms-data-label absolute -left-4 bottom-12 -rotate-90 text-ms-warm-white/30">
              Sarga Motorsport / Est. 2025
            </span>
          </div>
        </div>

        {/* Ecosystem pillars */}
        {pillars.length > 0 ? (
          <div className="mt-20 grid gap-px bg-ms-warm-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="group bg-ms-black p-8 transition-colors hover:bg-ms-graphite"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`mt-1 block h-8 w-1 ${ACCENT[p.accent ?? "crimson"]}`}
                    aria-hidden="true"
                  />
                  <div>
                    <span className="ms-data-label text-ms-warm-white/38">
                      {p.index}
                    </span>
                    <h3 className="ms-heading-card mt-3">{p.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-ms-warm-white/52">
                      {p.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
