"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { RacingGraphic } from "@/components/ui/racing-graphic";

/**
 * 500 — "Signal Lost"
 * Premium error boundary for Sarga.co gateway.
 * Next.js requires `error.tsx` to be a Client Component.
 * Shows a "try again" button that calls `reset()` to re-render the route.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="relative isolate flex min-h-svh items-center overflow-hidden bg-sarga-black text-white">
      {/* Background decorative layers */}

      {/* Racing graphic bands */}
      <RacingGraphic
        variant="bands"
        className="absolute inset-0 -z-20 h-full w-full text-white"
      />

      {/* Dot grid pattern */}
      <div
        aria-hidden="true"
        className="gateway-dot-grid absolute inset-0 -z-18 opacity-20"
      />

      {/* Ambient radial blooms */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-16"
        style={{
          background:
            "radial-gradient(ellipse at 20% 35%, rgb(226 50 30 / 14%), transparent 50%), radial-gradient(ellipse at 80% 65%, rgb(255 80 50 / 10%), transparent 45%), radial-gradient(ellipse at 50% 90%, rgb(217 164 65 / 6%), transparent 38%)",
          filter: "blur(36px)",
        }}
      />

      {/* Speed lines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-15 overflow-hidden pointer-events-none"
      >
        <div className="gateway-speed-line absolute top-[28%] left-0 w-[55%]" />
        <div className="gateway-speed-line absolute top-[52%] left-0 w-[45%] opacity-40" />
        <div className="gateway-speed-line absolute top-[78%] left-0 w-[50%] opacity-30" />
      </div>

      {/* Grain overlay */}
      <span
        aria-hidden="true"
        className="velocity-grain absolute inset-0 -z-14"
      />

      {/* Content */}
      <div className="site-container relative z-10 py-24 sm:py-32">
        {/* Error code */}
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sarga-red">
          500 — Signal lost
        </p>

        {/* Giant number */}
        <p
          className="mt-6 select-none font-heading text-[clamp(8rem,22vw,18rem)] font-black leading-[0.82] tracking-[-0.04em]"
          aria-hidden="true"
        >
          <span className="bg-gradient-to-br from-sarga-red/90 via-sarga-orange/60 to-white/10 bg-clip-text text-transparent">
            500
          </span>
        </p>

        {/* Headline */}
        <h1 className="mt-4 max-w-[14ch] font-heading text-[clamp(2.4rem,6vw,5rem)] font-black uppercase leading-[0.88] tracking-[-0.04em]">
          Connection interrupted.
        </h1>

        <p className="mt-8 max-w-xl text-base leading-8 text-white/55">
          Something unexpected happened in the signal chain. Our engineers have
          been alerted and are working to restore full connectivity. This is a
          temporary disruption — the network remains online.
        </p>

        {/* Error digest (dev aid) */}
        {error.digest ? (
          <p className="mt-4 font-mono text-xs text-white/25">
            Error ID: {error.digest}
          </p>
        ) : null}

        {/* Actions */}
        <div className="mt-12 flex flex-wrap gap-5">
          <button
            type="button"
            onClick={reset}
            className="group inline-flex items-center gap-4 bg-sarga-red px-7 py-4 text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-white transition-colors hover:bg-sarga-red-dark"
          >
            Try again
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <Link
            href="/"
            className="group inline-flex items-center gap-4 border border-white/16 px-7 py-4 text-[0.66rem] font-extrabold uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            Return to gateway
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Section indicator */}
        <div className="mt-20 flex items-center gap-4 text-white/28">
          <div className="flex size-8 items-center justify-center rounded-full border border-white/16 text-[0.55rem] font-bold">
            S
          </div>
          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
            / Section 500
          </span>
          <span className="flex gap-1.5">
            <span className="size-1.5 rounded-full bg-white/16" />
            <span className="size-1.5 rounded-full bg-sarga-red/60" />
            <span className="size-1.5 rounded-full bg-white/16" />
          </span>
        </div>
      </div>

      {/* Shimmer rail at bottom */}
      <span
        aria-hidden="true"
        className="gateway-shimmer absolute inset-x-0 bottom-0"
      />
    </main>
  );
}
