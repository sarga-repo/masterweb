import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  variant?: "default" | "reverse";
};

export function Logo({ variant = "default" }: LogoProps) {
  const src =
    variant === "reverse"
      ? "/assets/logos/logo-sarga-reverse.png"
      : "/assets/logos/logo-sarga.png";

  return (
    <Link aria-label="Sarga.co home" className="inline-flex" href="/">
      <Image
        alt="Sarga.co"
        height={41}
        priority
        sizes="(max-width: 640px) 132px, 160px"
        src={src}
        width={160}
      />
    </Link>
  );
}
