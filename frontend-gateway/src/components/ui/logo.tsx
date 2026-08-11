import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/locale-link";

type LogoProps = {
  variant?: "default" | "reverse";
};

export function Logo({ variant = "default" }: LogoProps) {
  const src =
    variant === "reverse"
      ? "/assets/logos/logo-sarga-reverse.png"
      : "/assets/logos/logo-sarga.png";

  return (
    <Link aria-label="Sarga.co home" className="inline-flex shrink-0" href="/">
      <Image
        alt="Sarga.co"
        className="h-auto"
        height={41}
        priority
        sizes="(max-width: 640px) 132px, 160px"
        src={src}
        style={{ height: "auto" }}
        width={160}
      />
    </Link>
  );
}
