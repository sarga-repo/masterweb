import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { MarkdownContent } from "@/components/content/markdown-content";

import { ArrowRightIcon } from "@/components/ui/icons";
import { RiderPortrait } from "@/components/ui/rider-portrait";
import type { MotorsportRider } from "@/types/design-system";

type RiderProfileCardProps = {
  rider: MotorsportRider;
  index: string;
  href: string;
  featured?: boolean;
  compact?: boolean;
  className?: string;
};

export function RiderProfileCard({
  rider,
  index,
  href,
  featured = false,
  compact = false,
  className = "",
}: RiderProfileCardProps) {
  const isDemo = /demo|demonstration/i.test(`${rider.name} ${rider.bio ?? ""}`);

  return (
    <article
      className={`ms-panel ms-blue-panel group overflow-hidden ${className}`}
    >
      <Link
        href={href}
        aria-label={`View rider profile for ${rider.name}`}
        className={`grid h-full ${
          featured
            ? "min-h-[34rem] md:grid-cols-[1.05fr_.95fr]"
            : "min-h-[25rem]"
        }`}
      >
        <div
          className={`relative overflow-hidden ${
            featured ? "min-h-72" : compact ? "min-h-72" : "min-h-64"
          }`}
        >
          <RiderPortrait
            src={rider.portrait}
            alt={rider.portraitAlt ?? rider.name}
            number={rider.number ?? index}
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 52vw"
                : "(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <span className="absolute bottom-5 left-6 font-display text-4xl text-ms-electric-yellow">
            #{rider.number ?? "--"}
          </span>
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <span className="ms-data-label text-ms-warm-white/38">
              Rider {index}
            </span>
            {isDemo ? (
              <span className="ms-data-label text-ms-ignition-orange">
                Demo data
              </span>
            ) : null}
          </div>
          <h3
            className={
              compact ? "ms-heading-card mt-7" : "ms-heading-feature mt-7"
            }
          >
            {rider.name}
          </h3>
          <dl className="mt-7 grid grid-cols-2 gap-5 border-y border-ms-warm-white/12 py-5">
            <div>
              <dt className="ms-data-label text-ms-warm-white/38">Team</dt>
              <dd className="mt-2 text-sm font-bold uppercase">
                {rider.team ?? "Independent"}
              </dd>
            </div>
            <div>
              <dt className="ms-data-label text-ms-warm-white/38">Region</dt>
              <dd className="mt-2 text-sm font-bold uppercase">
                {rider.region ?? rider.nationality ?? "Indonesia"}
              </dd>
            </div>
          </dl>
          {rider.bio && !compact ? (
            <MarkdownContent
              value={rider.bio}
              className="ms-rich-text mt-6 text-sm leading-7 text-ms-warm-white/58"
            />
          ) : null}
          <span className="mt-auto flex items-center gap-3 pt-7 text-[0.62rem] font-black uppercase tracking-[0.14em] text-ms-electric-yellow">
            View profile
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </article>
  );
}
