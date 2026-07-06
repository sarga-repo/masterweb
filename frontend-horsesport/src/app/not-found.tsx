import Link from "next/link";

import { ArrowRightIcon } from "@/components/ui/icons";

/** 404 - off the pace. Nested within the shared header/footer chrome. */
export default function NotFound() {
  return (
    <section className="hs-grain relative isolate flex min-h-[70vh] items-center overflow-hidden bg-hs-black">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top right, #ED1B2F14, transparent 55%), radial-gradient(ellipse at bottom left, #FF6B000A, transparent 50%)",
        }}
      />
      <div aria-hidden className="hs-shimmer absolute inset-x-0 bottom-0 h-px" />

      <div className="hs-shell relative z-10 py-24 sm:py-32">
        <p className="hs-kicker text-hs-red">404 - Off the pace</p>
        <h1
          aria-hidden
          className="hs-display mt-6 select-none text-[clamp(7rem,20vw,16rem)] leading-[0.82]"
        >
          <span className="bg-gradient-to-br from-hs-cream/90 via-hs-cream/45 to-hs-cream/10 bg-clip-text text-transparent">
            404
          </span>
        </h1>
        <h2 className="hs-display mt-4 max-w-[16ch] text-[clamp(2rem,5vw,4rem)] text-hs-cream">
          This one left the paddock.
        </h2>
        <p className="mt-7 max-w-xl text-base leading-8 text-hs-cream/55">
          The page you were looking for may have been retired, moved to another
          section, or hasn&apos;t reached the starting gate yet.
        </p>
        <div className="mt-11 flex flex-wrap gap-4">
          <Link
            href="/"
            className="hs-interactive group inline-flex items-center gap-3 bg-hs-red px-7 py-4 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-hs-white hover:bg-hs-orange"
          >
            Back to home
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/events"
            className="hs-interactive group inline-flex items-center gap-3 border border-hs-cream/20 px-7 py-4 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-hs-cream/75 hover:border-hs-orange hover:text-hs-orange"
          >
            Browse events
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
