import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * 404 — "Off Track"
 * Premium not-found page for Sarga Motorsport.
 * Uses brand colours, dot-pattern texture, grain, speed lines, and cinematic
 * typography to deliver a motorsport-flavoured dead-end that still feels
 * intentional and on-brand.
 */
export default function NotFound() {
  return (
    <main className="ms-grain relative isolate flex min-h-svh items-center overflow-hidden bg-ms-black text-ms-warm-white">
      {/* ── Background layers ────────────────────────────────────────── */}

      {/* Dot pattern (track grid) */}
      <div
        aria-hidden="true"
        className="ms-track-grid absolute inset-0 opacity-20"
      />

      {/* Crimson radial bloom — top-right */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top right, #E8192C12, transparent 55%)",
        }}
      />

      {/* Teal counter-glow — bottom-left */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at bottom left, #00C4CC08, transparent 50%)",
        }}
      />

      {/* Speed lines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="ms-speed-line absolute top-[22%] left-0 h-px w-[45%] bg-gradient-to-r from-transparent via-ms-apex-crimson/25 to-transparent" />
        <div className="ms-speed-line-delay-1 absolute top-[48%] left-0 h-px w-[60%] bg-gradient-to-r from-transparent via-ms-ignition-orange/18 to-transparent" />
        <div className="ms-speed-line-delay-2 absolute top-[74%] left-0 h-px w-[38%] bg-gradient-to-r from-transparent via-ms-slipstream-teal/22 to-transparent" />
      </div>

      {/* Shimmer rail */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px ms-shimmer"
      />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="ms-shell relative z-10 py-24 sm:py-32">
        {/* Error code */}
        <p className="ms-kicker text-ms-apex-crimson">404 — Off track</p>

        {/* Giant number */}
        <h1
          className="ms-display mt-6 select-none text-[clamp(6rem,16.5vw,13.5rem)] font-black leading-[0.82] tracking-[-0.04em]"
          aria-hidden="true"
        >
          <span className="bg-gradient-to-br from-ms-warm-white/90 via-ms-warm-white/50 to-ms-warm-white/10 bg-clip-text text-transparent">
            404
          </span>
        </h1>

        {/* Headline */}
        <h2 className="ms-display mt-4 max-w-[14ch] text-[clamp(1.8rem,4.5vw,3.75rem)] leading-[0.88]">
          This route left the circuit.
        </h2>

        <p className="mt-8 max-w-xl text-base leading-8 text-ms-warm-white/55">
          The page you were looking for may have been retired to the paddock,
          moved to a different sector, or hasn&apos;t cleared scrutineering yet.
          Either way, it&apos;s not on the racing line right now.
        </p>

        {/* Actions */}
        <div className="mt-12 flex flex-wrap gap-5">
          <Link
            href="/"
            className="group inline-flex items-center gap-4 bg-ms-apex-crimson px-7 py-4 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white transition-colors hover:bg-ms-ignition-orange"
          >
            Return to pit lane
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/events"
            className="group inline-flex items-center gap-4 border border-ms-warm-white/16 px-7 py-4 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white/70 transition-colors hover:border-ms-warm-white/40 hover:text-ms-warm-white"
          >
            Browse events
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Section indicator */}
        <div className="mt-20 flex items-center gap-4 text-ms-warm-white/28">
          <div className="flex size-8 items-center justify-center rounded-full border border-ms-warm-white/16 text-[0.55rem] font-bold">
            N
          </div>
          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
            / Section 404
          </span>
          <span className="flex gap-1.5">
            <span className="size-1.5 rounded-full bg-ms-apex-crimson/60" />
            <span className="size-1.5 rounded-full bg-ms-warm-white/16" />
            <span className="size-1.5 rounded-full bg-ms-warm-white/16" />
          </span>
        </div>
      </div>
    </main>
  );
}
