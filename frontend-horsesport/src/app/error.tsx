"use client";

import { LocaleLink as Link } from "@/components/i18n/locale-link";

import { ArrowRightIcon } from "@/components/ui/icons";
import { usePathname } from "next/navigation";

/** Route-level error boundary (nested within the shared layout chrome). */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const isIndonesian = pathname === "/id" || pathname.startsWith("/id/");
  return (
    <section className="hs-grain relative isolate flex min-h-[70vh] items-center overflow-hidden bg-hs-black">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top left, #FF6B0014, transparent 55%), radial-gradient(ellipse at bottom right, #ED1B2F0A, transparent 50%)",
        }}
      />

      <div className="hs-shell relative z-10 py-24 sm:py-32">
        <p className="hs-kicker text-hs-orange">Something went wrong</p>
        <h1 className="hs-display mt-6 max-w-[16ch] text-[clamp(2.2rem,6vw,5rem)] text-hs-cream">
          {isIndonesian ? "Start yang tertunda." : "A false start."}
        </h1>
        <p className="mt-7 max-w-xl text-base leading-8 text-hs-cream/55">
          Something unexpected happened while loading this page. The team has
          been alerted - this is a temporary setback.
        </p>
        {error.digest ? (
          <p className="mt-4 font-mono text-xs text-hs-cream/25">
            Error ID: {error.digest}
          </p>
        ) : null}
        <div className="mt-11 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={reset}
            className="hs-interactive group inline-flex items-center gap-3 bg-hs-orange px-7 py-4 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-hs-black hover:bg-hs-red hover:text-hs-white"
          >
            {isIndonesian ? "Coba lagi" : "Try again"}
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
          <Link
            href="/"
            className="hs-interactive group inline-flex items-center gap-3 border border-hs-cream/20 px-7 py-4 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-hs-cream/75 hover:border-hs-orange hover:text-hs-orange"
          >
            {isIndonesian ? "Kembali ke beranda" : "Back to home"}
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
