import Image, { type ImageProps } from "next/image";

type MotorsportLogoProps = {
  variant?: "full" | "part-of-sarga" | "symbol-sport";
  src?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
};

const LOGOS = {
  full: "/brand/logo-sarga-motorsport-full.png",
  "part-of-sarga": "/brand/logo-sarga-motorsport-part-of-sarga.png",
  "symbol-sport": "/brand/logo-sarga-motorsport-symbol-sport.png",
} as const;

export function MotorsportLogo({
  variant = "full",
  src,
  alt = "Sarga Motorsport",
  className = "w-[clamp(8.75rem,14vw,12rem)]",
  priority = false,
}: MotorsportLogoProps) {
  const resolvedSrc = src ?? LOGOS[variant];
  const dimensions = resolvedSrc.includes("main-brandmark-inverse")
    ? { width: 5812, height: 1655 }
    : { width: 777, height: 195 };
  const isLocalCmsMedia =
    typeof resolvedSrc === "string" &&
    /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\//.test(resolvedSrc);

  return (
    <Image
      src={resolvedSrc}
      width={dimensions.width}
      height={dimensions.height}
      alt={alt}
      priority={priority}
      unoptimized={isLocalCmsMedia}
      className={`h-auto min-w-[8.75rem] object-contain ${className}`}
    />
  );
}
