"use client";

import Image from "next/image";
import { useState } from "react";

import type { MediaSource } from "@/types/design-system";

type RiderPortraitProps = {
  src?: MediaSource;
  alt: string;
  number?: string | number;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function RiderPortrait({
  src,
  alt,
  number,
  sizes,
  className = "object-cover",
  priority = false,
}: RiderPortraitProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={`${alt}. Portrait unavailable.`}
        className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_22%_82%,rgba(232,25,44,.62),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(0,196,204,.24),transparent_30%),linear-gradient(145deg,#071a3d,#192957)]"
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[18%] size-[28%] -translate-x-1/2 rounded-full bg-ms-warm-white/18"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-[-8%] left-1/2 h-[58%] w-[72%] -translate-x-1/2 rounded-t-[48%] bg-ms-warm-white/14"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-4 right-5 font-display text-6xl leading-none text-ms-warm-white/12"
        >
          {number ?? "--"}
        </span>
      </div>
    );
  }

  const isLocalCmsMedia =
    typeof src === "string" &&
    /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\//.test(src);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={isLocalCmsMedia}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
