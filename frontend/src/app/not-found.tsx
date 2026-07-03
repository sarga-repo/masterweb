import Link from "next/link";
import { RacingGraphic } from "@/components/ui/racing-graphic";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[72svh] items-center overflow-hidden bg-sarga-black py-20 text-white">
      <RacingGraphic
        variant="bands"
        className="absolute inset-0 -z-10 h-full w-full text-white"
      />
      <div className="site-container">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sarga-red">
          404 — Off circuit
        </p>
        <h1 className="mt-8 max-w-[12ch] font-heading text-[clamp(3.5rem,12vw,4.5rem)] font-black uppercase leading-[0.84] tracking-[-0.055em] sm:text-[clamp(3.5rem,6.4vw,6rem)]">
          This route left the track.
        </h1>
        <p className="mt-8 max-w-xl text-base leading-8 text-white/60">
          The requested page may have moved, expired, or is not yet published
          through the Sarga network.
        </p>
        <Link
          href="/"
          className="group mt-10 inline-flex items-center gap-4 bg-sarga-red px-7 py-5 text-xs font-extrabold uppercase tracking-[0.16em]"
        >
          Return to the gateway
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
