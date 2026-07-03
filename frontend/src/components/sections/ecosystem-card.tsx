import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { EcosystemBusiness } from "@/lib/strapi/types";

const businessNumbers: Record<string, string> = {
  "sarga-horse-sport": "01",
  "sarga-motorsport": "02",
  "sarga-venues": "03",
  "sarga-media": "04",
  "sarga-tech": "05",
};

export function EcosystemCard({ business }: { business: EcosystemBusiness }) {
  const isActive = business.status === "active";
  const href = isActive ? `/ecosystem/${business.slug}` : undefined;
  const number = businessNumbers[business.slug] ?? "00";

  const inner = (
    <>
      {business.cardImage ? (
        <Image
          src={business.cardImage.url}
          alt={business.cardImage.alt}
          fill
          sizes="(max-width: 768px) 92vw, 42vw"
          className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[linear-gradient(145deg,#283443_0%,#07111f_55%,#000b1d_100%)]"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,11,29,0.08)_0%,rgba(0,11,29,0.12)_35%,rgba(0,11,29,0.94)_100%)]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-sarga-red transition-transform duration-500 group-hover:scale-x-100"
      />

      <div className="relative flex h-full flex-col p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <span className="font-heading text-3xl font-black text-white/92">
            {number}
          </span>
          <span className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-white/58 [writing-mode:vertical-rl]">
            {business.pillar} / Sarga
          </span>
        </div>

        <div className="mt-auto pt-32">
          {!isActive ? (
            <span className="mb-4 inline-block border border-white/30 px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-white/70">
              In development
            </span>
          ) : null}
          <h4 className="max-w-[13ch] font-heading text-3xl font-black uppercase leading-[0.94] tracking-[-0.03em] text-white">
            {business.name}
          </h4>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/68 sm:text-base sm:leading-7">
            {business.shortDescription}
          </p>
          <span className="mt-7 inline-flex items-center gap-4 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-white">
            {business.ctaLabel}
            {isActive ? (
              <span className="flex h-10 w-10 items-center justify-center bg-sarga-red transition-transform duration-300 group-hover:translate-x-1.5">
                <ArrowRightIcon className="h-4 w-4" />
              </span>
            ) : null}
          </span>
        </div>
      </div>
    </>
  );

  const classes = cn(
    "group relative isolate flex min-h-[34rem] overflow-hidden border border-white/15 bg-sarga-dark",
    href &&
      "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-sarga-orange",
  );

  return href ? (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  ) : (
    <article className={classes}>{inner}</article>
  );
}
