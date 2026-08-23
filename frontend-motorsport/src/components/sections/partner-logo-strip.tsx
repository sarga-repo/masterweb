import Image from "next/image";

import type { PartnerItem } from "@/types/design-system";

type PartnerLogoStripProps = {
  partners: PartnerItem[];
  label?: string;
  className?: string;
};

export function PartnerLogoStrip({
  partners,
  label = "Official partners",
  className = "",
}: PartnerLogoStripProps) {
  return (
    <section
      aria-label={label}
      className={`border-y border-ms-warm-white/12 ${className}`}
    >
      <div className="ms-shell grid lg:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="flex items-center border-b border-ms-warm-white/12 py-6 lg:border-b-0 lg:border-r lg:pr-8">
          <h2 className="ms-kicker text-ms-warm-white/60">{label}</h2>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((partner) => {
            const logo = (
              <Image
                src={partner.logo}
                alt={partner.name}
                width={180}
                height={80}
                unoptimized={
                  typeof partner.logo === "string" &&
                  partner.logo.startsWith("http://localhost:1337/")
                }
                className="max-h-10 w-auto max-w-[8rem] object-contain brightness-0 invert opacity-45 transition duration-300 group-hover:opacity-90"
              />
            );
            return (
              <li
                key={partner.name}
                className="group grid min-h-28 place-items-center border-r border-ms-warm-white/10 p-5 last:border-r-0"
              >
                {partner.href ? (
                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={partner.name}
                  >
                    {logo}
                  </a>
                ) : (
                  logo
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
