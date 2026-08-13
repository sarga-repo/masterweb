import Image from "next/image";

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
  return (
    <Image
      src={src ?? LOGOS[variant]}
      width={777}
      height={195}
      alt={alt}
      priority={priority}
      className={`h-auto min-w-[8.75rem] object-contain ${className}`}
    />
  );
}
