import Link from "next/link";
import { RacingGraphic } from "@/components/ui/racing-graphic";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[72svh] items-center overflow-hidden bg-sarga-black py-20 text-white">
      {/* Racing graphic bands */}
      <RacingGraphic
        variant="bands"
        className="absolute inset-0 -z-20 h-full w-full text-white"
      />

      {/* Grain overlay */}
      <span
        aria-hidden="true"
        className="velocity-grain absolute inset-0 -z-18"
      />

      {/* Ambient glow */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-16"
        style={{
          background:
            "radial-gradient(ellipse at 25% 40%, rgb(226 50 30 / 14%), transparent 50%), radial-gradient(ellipse at 75% 60%, rgb(255 80 50 / 10%), transparent 45%)",
          filter: "blur(32px)",
        }}
      />

      {/* Speed lines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-15 overflow-hidden pointer-events-none"
      >
        <div className="gateway-speed-line absolute top-[22%] left-0 w-[60%]" />
        <div className="gateway-speed-line absolute top-[48%] left-0 w-[48%] opacity-40" />
        <div className="gateway-speed-line absolute top-[74%] left-0 w-[52%] opacity-30" />
      </div>

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

        {/* Section indicator */}
        <div className="mt-20 flex items-center gap-4 text-white/28">
          <div className="flex size-8 items-center justify-center rounded-full border border-white/16 text-[0.55rem] font-bold">
            S
          </div>
          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
            / Section 404
          </span>
          <span className="flex gap-1.5">
            <span className="size-1.5 rounded-full bg-white/16" />
            <span className="size-1.5 rounded-full bg-sarga-orange/60" />
            <span className="size-1.5 rounded-full bg-white/16" />
          </span>
        </div>
      </div>

      {/* Shimmer rail at bottom */}
      <span
        aria-hidden="true"
        className="gateway-shimmer absolute inset-x-0 bottom-0"
      />
    </section>
  );
}
