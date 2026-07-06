type HorseSportLogoProps = {
  /** `white` for dark surfaces, `black` for light/cream surfaces. */
  variant?: "white" | "black";
  className?: string;
  priority?: boolean;
};

const LOGOS = {
  white: "/brand/sarga_horse_sport_logo_white_text_smooth.png",
  black: "/brand/sarga_horse_sport_logo_black_text_smooth.png",
} as const;

/**
 * Sarga Horse Sport wordmark + horse-jockey mark. The source artwork is
 * 3640×1056 (~3.45:1). Use the white logo on dark hero/header/footer surfaces
 * and the black logo on warm cream/editorial sections (docs/horsesport/07).
 */
export function HorseSportLogo({
  variant = "white",
  className = "w-[clamp(9rem,15vw,12.5rem)]",
  priority = false,
}: HorseSportLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGOS[variant]}
      width={3640}
      height={1056}
      alt="Sarga Horse Sport"
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`h-auto min-w-[8.5rem] object-contain ${className}`}
    />
  );
}
