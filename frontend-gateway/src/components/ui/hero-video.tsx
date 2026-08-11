"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type HeroVideoProps = {
  mp4?: string;
  webm?: string;
  poster?: string;
  paused?: boolean;
  className?: string;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED_MOTION_QUERY);
      query.addEventListener("change", onChange);
      queueMicrotask(onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => true,
  );
}

export function HeroVideo({
  mp4,
  webm,
  poster,
  paused = false,
  className = "",
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    if (paused) {
      video.pause();
      return;
    }
    void video.play().catch(() => setReady(false));
  }, [paused, reducedMotion]);

  if (reducedMotion || (!mp4 && !webm)) return null;

  return (
    <video
      ref={videoRef}
      aria-hidden="true"
      tabIndex={-1}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      onCanPlay={() => setReady(true)}
      onError={() => setReady(false)}
      className={`absolute inset-0 size-full object-cover object-center transition-opacity duration-700 motion-reduce:transition-none ${
        ready ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {webm ? <source src={webm} type="video/webm" /> : null}
      {mp4 ? <source src={mp4} type="video/mp4" /> : null}
    </video>
  );
}
