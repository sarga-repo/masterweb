import { ResilientImage } from "@/components/ui/resilient-image";
import type { CmsPageAvailability } from "@/lib/cms-data";

type PageComingSoonProps = {
  availability: CmsPageAvailability;
};

export function PageComingSoon({ availability }: PageComingSoonProps) {
  return (
    <section
      data-cms-page-availability="disabled"
      className="ms-blue-heat-surface relative isolate overflow-hidden py-28 sm:py-40"
    >
      {availability.comingSoonMedia?.url ? (
        <>
          <ResilientImage
            src={availability.comingSoonMedia.url}
            alt=""
            fallbackSrc="/media/hero/sarga-motorsport-hero-paddock-ready.jpg"
            fallbackAlt="Sarga Motorsport"
            fill
            sizes="100vw"
            className="absolute inset-0 object-cover opacity-25"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-ms-black/70"
          />
        </>
      ) : null}
      <div className="ms-shell relative z-10 max-w-3xl">
        <p className="ms-kicker text-ms-electric-yellow">
          {availability.comingSoonEyebrow ?? "Part of the Sarga ecosystem"}
        </p>
        <h1 className="ms-heading-page mt-6 text-ms-warm-white">
          {availability.comingSoonTitle ?? "Coming soon"}
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-ms-warm-white/72">
          {availability.comingSoonDescription ??
            "This Motorsport destination is being prepared. Check back soon for the approved public release."}
        </p>
        {availability.launchTargetLabel ? (
          <p className="ms-data-label mt-10 text-ms-slipstream-teal">
            {availability.launchTargetLabel}
          </p>
        ) : null}
      </div>
    </section>
  );
}
