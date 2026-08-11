import { LocaleLink as Link } from "@/components/i18n/locale-link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
/** `dark` = placed on dark surfaces, `light` = placed on light surfaces (affects secondary/ghost). */
type ButtonTone = "dark" | "light";

const base =
  "group inline-flex items-center justify-center gap-4 font-extrabold uppercase tracking-[0.08em] transition-[background-color,border-color,color,transform] duration-300 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-sarga-orange disabled:cursor-not-allowed disabled:opacity-60";

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-[0.65rem]",
  md: "min-h-12 px-6 text-[0.68rem]",
  lg: "min-h-14 px-7 text-[0.68rem] sm:px-8",
};

function variantClasses(variant: ButtonVariant, tone: ButtonTone): string {
  switch (variant) {
    case "primary":
      return "bg-sarga-red-dark text-white hover:-translate-y-1 hover:bg-sarga-red";
    case "secondary":
      return tone === "dark"
        ? "border border-white/45 text-white hover:-translate-y-1 hover:border-white hover:bg-white/10"
        : "border border-sarga-text/35 text-sarga-text hover:-translate-y-1 hover:border-sarga-text hover:bg-black/5";
    case "ghost":
      return tone === "dark"
        ? "text-white hover:text-sarga-red"
        : "text-sarga-text hover:text-sarga-red";
  }
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  tone?: ButtonTone;
  /** Show a trailing arrow icon (defaults on for primary). */
  withArrow?: boolean;
  /** Stretch to full width (useful for stacked mobile CTAs). */
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    tone = "dark",
    withArrow,
    fullWidth,
    className,
    children,
    ...rest
  } = props;

  const showArrow = withArrow ?? variant === "primary";

  const classes = cn(
    base,
    sizes[size],
    variantClasses(variant, tone),
    fullWidth ? "w-full" : "w-full sm:w-auto",
    className,
  );

  const content = (
    <>
      {children}
      {showArrow ? (
        <ArrowRightIcon className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1.5" />
      ) : null}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } =
      rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
      };
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
