import Image from "next/image";
import type { PartnerItemData } from "@/types/design-system";

type PartnerLogoStripProps = {
  partners: PartnerItemData[];
  label?: string;
};

/**
 * Simple partner strip — a small label + a clean row of partner logos/names,
 * no cards or monogram boxes (motorsport-style). Renders bare content so it can
 * sit inside any section band.
 */
export function PartnerLogoStrip({
  partners,
  label = "Trusted partners",
}: PartnerLogoStripProps) {
  if (partners.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
      <h2 className="hs-kicker shrink-0 text-hs-cream/40">{label}</h2>
      <ul className="flex flex-1 flex-wrap items-center gap-x-10 gap-y-4">
        {partners.map((partner) => {
          const inner = partner.logo ? (
            <Image
              src={partner.logo}
              alt={partner.name}
              width={140}
              height={40}
              className="h-7 w-auto max-w-[9rem] object-contain opacity-55 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
            />
          ) : (
            <span className="text-sm font-semibold uppercase tracking-[0.12em] text-hs-cream/45 transition-colors duration-300 hover:text-hs-cream/85">
              {partner.name}
            </span>
          );
          return (
            <li key={partner.name}>
              {partner.href ? (
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={partner.name}
                >
                  {inner}
                </a>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
