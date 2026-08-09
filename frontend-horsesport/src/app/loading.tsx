/** Branded route-loading state (nested within the shared layout chrome). */
export default function Loading() {
  return (
    <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-hs-black">
      <div className="relative flex flex-col items-center gap-6">
        <span
          aria-hidden
          className="hs-rule inline-block h-px w-40 animate-pulse"
        />
        <p className="hs-kicker hs-eyebrow-gradient">Loading</p>
        <span className="sr-only">Loading content…</span>
      </div>
      <div
        aria-hidden
        className="hs-shimmer absolute inset-x-0 bottom-0 h-px"
      />
    </div>
  );
}
