"use client";

import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * 500 - "Mechanical Failure"
 * Premium error boundary for Sarga Motorsport.
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
    <main className="ms-grain relative isolate flex min-h-svh items-center overflow-hidden bg-ms-black text-ms-warm-white">
      {/* ── Background layers ────────────────────────────────────────── */}

      {/* Dot pattern */}
      <div
        aria-hidden="true"
        className="ms-track-grid absolute inset-0 opacity-20"
      />

      {/* Orange radial bloom - top-left */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top left, #FF6B0014, transparent 55%)",
        }}
      />

      {/* Crimson counter-glow - bottom-right */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at bottom right, #E8192C0A, transparent 50%)",
        }}
      />

      {/* Speed lines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="ms-speed-line absolute top-[28%] left-0 h-px w-[50%] bg-gradient-to-r from-transparent via-ms-ignition-orange/28 to-transparent" />
        <div className="ms-speed-line-delay-1 absolute top-[55%] left-0 h-px w-[42%] bg-gradient-to-r from-transparent via-ms-apex-crimson/20 to-transparent" />
        <div className="ms-speed-line-delay-2 absolute top-[80%] left-0 h-px w-[55%] bg-gradient-to-r from-transparent via-ms-electric-yellow/12 to-transparent" />
      </div>

      {/* Shimmer rail */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px ms-shimmer"
      />

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="ms-shell relative z-10 py-24 sm:py-32">
        {/* Error code */}
        <p className="ms-kicker text-ms-ignition-orange">
          500 - Mechanical failure
        </p>

        {/* Giant number */}
        <h1
          className="ms-display mt-6 select-none text-[clamp(6rem,16.5vw,13.5rem)] font-black leading-[0.82] tracking-[-0.04em]"
          aria-hidden="true"
        >
          <span className="bg-gradient-to-br from-ms-ignition-orange/90 via-ms-apex-crimson/60 to-ms-warm-white/10 bg-clip-text text-transparent">
            500
          </span>
        </h1>

        {/* Headline */}
        <h2 className="ms-heading-section mt-4 max-w-[14ch]">
          The engine stalled.
        </h2>

        <p className="mt-8 max-w-xl text-base leading-8 text-ms-warm-white/55">
          Something unexpected happened in the pit lane. Our engineers have been
          alerted and are working to get things back on the grid. This is a
          temporary setback - the race goes on.
        </p>

        {/* Error digest (dev aid) */}
        {error.digest ? (
          <p className="mt-4 font-mono text-xs text-ms-warm-white/25">
            Error ID: {error.digest}
          </p>
        ) : null}

        {/* Actions */}
        <div className="mt-12 flex flex-wrap gap-5">
          <button
            type="button"
            onClick={reset}
            className="group inline-flex items-center gap-4 bg-ms-ignition-orange px-7 py-4 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-black transition-colors hover:bg-ms-electric-yellow"
          >
            Try again
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
          <Link
            href="/"
            className="group inline-flex items-center gap-4 border border-ms-warm-white/16 px-7 py-4 text-[0.66rem] font-black uppercase tracking-[0.16em] text-ms-warm-white/70 transition-colors hover:border-ms-warm-white/40 hover:text-ms-warm-white"
          >
            Return to pit lane
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Section indicator */}
        <div className="mt-20 flex items-center gap-4 text-ms-warm-white/28">
          <div className="flex size-8 items-center justify-center rounded-full border border-ms-warm-white/16 text-[0.55rem] font-bold">
            N
          </div>
          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.18em]">
            / Section 500
          </span>
          <span className="flex gap-1.5">
            <span className="size-1.5 rounded-full bg-ms-warm-white/16" />
            <span className="size-1.5 rounded-full bg-ms-ignition-orange/60" />
            <span className="size-1.5 rounded-full bg-ms-warm-white/16" />
          </span>
        </div>
      </div>
    </main>
  );
}
