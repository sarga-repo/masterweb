"use client";

import { useState, useSyncExternalStore } from "react";

export type HeroVideoSource = {
  webm: string;
  mp4: string;
  poster?: string;
  /** Tailwind object-position utility to match the poster framing. */
  objectClassName?: string;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** SSR-safe subscription to the reduced-motion preference. */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION_QUERY);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    // Server / first paint: assume reduced motion so the static poster shows
    // until the client confirms motion is allowed, then the video enhances in.
    () => true,
  );
}

/**
 * Cinematic hero background loop. Sits above the poster <Image> and below the
 * hero gradient overlay. Skipped entirely when the user prefers reduced motion,
 * so the static poster remains the experience (docs/motorsport/04 accessibility).
 */
export function HeroVideo({
  webm,
  mp4,
  poster,
  objectClassName = "object-cover object-center",
}: HeroVideoSource) {
  const [ready, setReady] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <video
      aria-hidden="true"
      tabIndex={-1}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      onCanPlay={() => setReady(true)}
      className={`absolute inset-0 size-full ${objectClassName} transition-opacity duration-700 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
