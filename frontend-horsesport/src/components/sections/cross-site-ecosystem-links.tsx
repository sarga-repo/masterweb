import Image from "next/image";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import type { LinkItem } from "@/types/design-system";

type EcosystemLink = LinkItem & {
  description?: string;
  /** Brand logo path */
  logo?: string;
};

type CrossSiteEcosystemLinksProps = {
  eyebrow?: string;
  title?: string;
  links: EcosystemLink[];
};

/**
 * Cross-links into the wider Sarga ecosystem - simple capsule links (logo +
 * short description + arrow), consistent with the site's pill language. Renders
 * bare content so it can sit inside a shared section band.
 */
export function CrossSiteEcosystemLinks({
  eyebrow = "Part of the Sarga ecosystem",
  title = "Explore the wider world of Sarga.",
  links,
}: CrossSiteEcosystemLinksProps) {
  if (links.length === 0) return null;

  return (
    <div>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-end">
        <div>
          <span className="hs-kicker inline-flex items-center gap-2.5 text-hs-orange">
            <span
              aria-hidden
              className="hs-rule inline-block h-px w-8 align-middle"
            />
            {eyebrow}
          </span>
          <h2 className="hs-display mt-4 max-w-[12ch] text-[clamp(1.6rem,3.5vw,2.6rem)] tracking-tight text-hs-cream">
            {title}
          </h2>
        </div>
        <p className="max-w-[18rem] text-sm leading-7 text-hs-cream/46 xl:justify-self-end">
          Move from horse sport into the wider Sarga network without losing the
          same premium visual language.
        </p>
      </div>

      <div className="mt-9 grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
            className="group flex items-center gap-4 rounded-full border border-hs-cream/12 bg-hs-cream/[0.03] px-6 py-4 backdrop-blur-md transition-colors duration-400 hover:border-hs-orange/40 hover:bg-hs-cream/[0.05] sm:px-7 sm:py-5"
          >
            {link.logo ? (
              <Image
                src={link.logo}
                alt={link.label}
                width={160}
                height={40}
                className="h-6 w-auto max-w-[8.5rem] shrink-0 object-contain sm:h-7"
              />
            ) : (
              <span className="hs-display shrink-0 text-lg text-hs-cream">
                {link.label}
              </span>
            )}
            {link.description ? (
              <span className="hidden min-w-0 flex-1 truncate text-[0.8rem] text-hs-cream/50 sm:block">
                {link.description}
              </span>
            ) : (
              <span className="flex-1" />
            )}
            <span className="hs-button-icon size-9 shrink-0 transition-colors group-hover:text-hs-orange">
              <ArrowUpRightIcon className="size-4" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
