import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { PageAvailability } from "@/lib/strapi/types";

type ComingSoonPageProps = {
  name: string;
  description: string;
  availability?: PageAvailability;
  backHref?: string;
  backLabel?: string;
  accent?: "venue" | "media" | "technology" | "default";
};

const accentGradients = {
  default:
    "bg-[radial-gradient(circle_at_75%_30%,rgba(226,50,30,.35),transparent_30%),linear-gradient(110deg,#12141b_10%,#283443_58%,#4b2520_100%)]",
  venue:
    "bg-[radial-gradient(circle_at_75%_28%,rgba(255,145,83,.38),transparent_28%),linear-gradient(115deg,#2a1520_5%,#713226_52%,#b96338_100%)]",
  media:
    "bg-[radial-gradient(circle_at_78%_25%,rgba(226,50,30,.32),transparent_30%),linear-gradient(115deg,#14243b_5%,#3d526b_55%,#744039_100%)]",
  technology:
    "bg-[radial-gradient(circle_at_76%_26%,rgba(0,196,204,.25),transparent_28%),linear-gradient(115deg,#102830_4%,#28535a_55%,#74402d_100%)]",
} as const;

export function ComingSoonPage({
  name,
  description,
  availability,
  backHref = "/ecosystem",
  backLabel = "Back to the ecosystem",
  accent = "default",
}: ComingSoonPageProps) {
  const media = availability?.comingSoonMedia;

  return (
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] overflow-hidden bg-sarga-black text-white">
      {media ? (
        <div className="absolute inset-0 -z-20">
          <Image
            src={media.url}
            alt={media.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 ${accentGradients[accent]}`}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-[9] bg-[linear-gradient(90deg,rgba(18,20,27,.96)_0%,rgba(18,20,27,.78)_52%,rgba(18,20,27,.35)_100%)]"
      />

      <div className="site-container flex w-full flex-col justify-center py-20 sm:py-28 lg:py-36">
        <p className="eyebrow">
          {availability?.comingSoonEyebrow ?? "Part of the Sarga ecosystem"}
        </p>
        <h1 className="mt-6 max-w-[14ch] font-heading text-[clamp(2.8rem,7vw,5.8rem)] font-bold uppercase leading-[0.92] tracking-[-0.05em]">
          {availability?.comingSoonTitle ?? `${name} is coming soon.`}
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
          {availability?.comingSoonDescription ?? description}
        </p>
        {availability?.launchTargetLabel ? (
          <p className="mt-8 border-l-2 border-sarga-orange pl-4 text-xs font-extrabold uppercase tracking-[0.18em] text-white/55">
            {availability.launchTargetLabel}
          </p>
        ) : null}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href={backHref} variant="secondary" tone="dark" size="lg">
            {backLabel}
          </Button>
          {availability?.showNotifyCta ? (
            <Button href="/#newsletter" size="lg">
              Notify me
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
