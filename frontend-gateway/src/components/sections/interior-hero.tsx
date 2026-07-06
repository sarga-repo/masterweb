import Image from "next/image";
import { RacingGraphic } from "@/components/ui/racing-graphic";
import type { StrapiImage } from "@/lib/strapi/types";

type InteriorHeroProps = {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  image?: StrapiImage;
  meta?: string[];
  tone?: "dark" | "red";
  brandLogo?: StrapiImage;
};

export function InteriorHero({
  index,
  eyebrow,
  title,
  description,
  image,
  meta = [],
  tone = "dark",
  brandLogo,
}: InteriorHeroProps) {
  return (
    <section
      className={`relative isolate overflow-hidden text-white ${
        tone === "red" ? "bg-sarga-red" : "bg-sarga-black"
      }`}
    >
      {image ? (
        <>
          <Image
            src={image.url}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="-z-30 object-cover object-center opacity-55"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(16,20,27,.98)_0%,rgba(16,20,27,.84)_48%,rgba(16,20,27,.26)_100%),linear-gradient(0deg,rgba(16,20,27,.72),transparent_58%)]"
          />
        </>
      ) : null}
      <RacingGraphic
        variant="bands"
        className="absolute inset-y-0 -left-[18%] -z-10 h-full w-[88%] text-white"
      />
      <span
        aria-hidden="true"
        className="velocity-grain absolute inset-0 -z-[5]"
      />

      {/* Brand logo - top-right */}
      {brandLogo ? (
        <div className="absolute right-6 top-6 z-10 w-[8rem] sm:right-10 sm:top-10 sm:w-[10rem] lg:right-14 lg:top-14 lg:w-[12rem]">
          <Image
            src={brandLogo.url}
            alt={brandLogo.alt}
            width={240}
            height={120}
            className="h-auto w-full object-contain opacity-85"
          />
        </div>
      ) : null}

      <div className="site-container flex min-h-[72svh] flex-col justify-between py-8 sm:py-12 lg:min-h-[78svh] lg:py-16">
        <div className="flex items-center gap-4 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-white/55">
          <span className="text-sarga-orange">{index}</span>
          <span className="h-px w-12 bg-current" />
          <span>{eyebrow}</span>
        </div>

        <div className="py-16 sm:py-20">
          <h1 className="max-w-[13ch] font-heading text-[clamp(2.1rem,9vw,3rem)] font-bold uppercase leading-[0.84] tracking-[-0.055em] sm:text-[clamp(2.75rem,5.2vw,5.4rem)]">
            {title}
          </h1>
        </div>

        <div className="grid gap-8 border-t border-white/20 pt-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <p className="max-w-3xl text-base leading-7 text-white/72 sm:text-xl sm:leading-9">
            {description}
          </p>
          {meta.length ? (
            <ul className="grid grid-cols-2 gap-px border border-white/20 bg-white/20">
              {meta.map((item) => (
                <li
                  key={item}
                  className="bg-sarga-black/80 px-4 py-4 text-[0.6rem] font-bold uppercase leading-4 tracking-[0.14em] text-white/58"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
