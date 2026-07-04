import Image from "next/image";
import Link from "next/link";

import { HeroVideo, type HeroVideoSource } from "@/components/ui/hero-video";
import { ArrowRightIcon } from "@/components/ui/icons";
import type { LinkItem, MediaSource } from "@/types/design-system";

type HeroMeta = { label: string; value: string };

type MotorsportHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  image: MediaSource;
  imageAlt: string;
  /** Optional cinematic background loop; the image stays as poster/fallback. */
  video?: HeroVideoSource;
  /**
   * Optional "Part of Sarga.co" endorsement mark pinned bottom-right on wide
   * screens. Backed by a dark corner scrim that also masks the small residual
   * from watermark removal on the background video.
   */
  endorsement?: { src: MediaSource; alt: string };
  primaryCta?: LinkItem;
  secondaryCta?: LinkItem;
  meta?: HeroMeta[];
  priority?: boolean;
  height?: "screen" | "compact";
};

function HeroLink({
  item,
  primary = false,
}: {
  item: LinkItem;
  primary?: boolean;
}) {
  return (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      className={`group inline-flex min-h-12 items-center gap-5 border-b py-3 text-[0.66rem] font-black uppercase tracking-[0.16em] transition-colors ${
        primary
          ? "border-ms-apex-crimson text-ms-warm-white hover:text-ms-ignition-orange"
          : "border-ms-warm-white/24 text-ms-warm-white/62 hover:border-ms-warm-white hover:text-ms-warm-white"
      }`}
    >
      <span
        className={
          primary ? "size-2 bg-ms-apex-crimson" : "size-2 border border-current"
        }
        aria-hidden="true"
      />
      {item.label}
      <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function MotorsportHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  video,
  endorsement,
  primaryCta,
  secondaryCta,
  meta = [],
  priority = false,
  height = "screen",
}: MotorsportHeroProps) {
  const [lead, ...rest] = title.split(" ");

  return (
    <section
      className={`ms-grain relative isolate overflow-hidden bg-ms-black ${height === "screen" ? "min-h-[calc(100svh-var(--ms-header-height))]" : "min-h-[42rem]"}`}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority={priority}
        className="object-cover object-[64%_center]"
        sizes="100vw"
      />
      {video ? <HeroVideo {...video} /> : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,.98)_0%,rgba(5,5,5,.7)_38%,rgba(5,5,5,.08)_72%),linear-gradient(0deg,rgba(5,5,5,.96)_0%,transparent_52%,rgba(5,5,5,.44)_100%)]"
      />
      <div
        aria-hidden="true"
        className="ms-track-grid absolute inset-0 opacity-18"
      />
      {endorsement ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 hidden h-[56%] w-1/2 lg:block"
          style={{
            background:
              "radial-gradient(125% 120% at 100% 100%, rgba(5,5,5,.92) 0%, rgba(5,5,5,.55) 42%, transparent 72%)",
          }}
        />
      ) : null}

      <div className="ms-shell relative z-10 flex min-h-[inherit] flex-col py-8 sm:py-10">
        <div className="grid grid-cols-2 gap-4 border-b border-ms-warm-white/18 pb-4 md:grid-cols-4">
          <span className="ms-data-label text-ms-ignition-orange">
            {eyebrow}
          </span>
          <span className="ms-data-label hidden text-ms-warm-white/38 md:block">
            Feed / Motorsport_01
          </span>
          <span className="ms-data-label hidden text-ms-slipstream-teal md:block">
            Signal / Live
          </span>
          <span className="ms-data-label text-right text-ms-warm-white/38">
            IDN / GMT+7
          </span>
        </div>

        <div className="grid flex-1 items-end gap-10 pb-8 pt-24 lg:grid-cols-[minmax(0,1fr)_17rem] lg:pt-16">
          <div>
            <h1 className="ms-display max-w-[10ch] text-[clamp(4.25rem,11vw,10.5rem)]">
              <span className="block text-ms-warm-white">{lead}</span>
              {rest.length ? (
                <span className="ms-outline-type block">{rest.join(" ")}</span>
              ) : null}
            </h1>
            <div className="mt-8 grid max-w-4xl gap-7 border-l-2 border-ms-apex-crimson pl-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              {description ? (
                <p className="max-w-2xl text-base leading-7 text-ms-warm-white/68 sm:text-lg">
                  {description}
                </p>
              ) : (
                <span />
              )}
              {primaryCta || secondaryCta ? (
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                  {primaryCta ? <HeroLink item={primaryCta} primary /> : null}
                  {secondaryCta ? <HeroLink item={secondaryCta} /> : null}
                </div>
              ) : null}
            </div>
          </div>

          {meta.length ? (
            <aside
              className="ms-panel hidden bg-ms-black/76 backdrop-blur-md lg:block"
              aria-label="Session data"
            >
              <div className="flex items-center justify-between border-b border-ms-warm-white/14 px-4 py-3">
                <span className="ms-data-label text-ms-warm-white/42">
                  Session data
                </span>
                <span
                  className="size-2 bg-ms-electric-yellow"
                  aria-hidden="true"
                />
              </div>
              <dl>
                {meta.map((item, index) => (
                  <div
                    key={item.label}
                    className="grid grid-cols-[2rem_1fr] border-b border-ms-warm-white/10 p-4 last:border-b-0"
                  >
                    <span className="font-mono text-[0.6rem] text-ms-warm-white/24">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <dt className="ms-data-label text-ms-warm-white/34">
                        {item.label}
                      </dt>
                      <dd className="mt-2 text-sm font-bold uppercase tracking-[0.08em] text-ms-warm-white">
                        {item.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </aside>
          ) : null}
        </div>
      </div>

      {endorsement ? (
        <Image
          src={endorsement.src}
          alt={endorsement.alt}
          width={590}
          height={112}
          className="pointer-events-none absolute bottom-6 right-[var(--ms-page-gutter)] z-20 hidden h-auto w-40 opacity-85 lg:block xl:w-48"
        />
      ) : null}

      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 hidden h-1 w-[32%] bg-[linear-gradient(90deg,#E8192C,#FF6B00,#F5C800,#00C4CC)] lg:block"
      />
    </section>
  );
}
