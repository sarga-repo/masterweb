"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ResilientImageProps = ImageProps & {
  fallbackSrc: ImageProps["src"];
  fallbackAlt?: string;
};

export function ResilientImage({
  src,
  alt,
  fallbackSrc,
  fallbackAlt,
  onError,
  unoptimized,
  ...props
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = failed ? fallbackSrc : src;
  const isLocalCmsMedia =
    typeof resolvedSrc === "string" &&
    /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\//.test(resolvedSrc);

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={failed ? (fallbackAlt ?? alt) : alt}
      unoptimized={unoptimized ?? isLocalCmsMedia}
      onError={(event) => {
        if (!failed) setFailed(true);
        onError?.(event);
      }}
    />
  );
}
