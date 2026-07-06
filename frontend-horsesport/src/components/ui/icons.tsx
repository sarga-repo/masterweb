import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 12h15M14 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 19 19 5M8 5h11v11" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3 7h18M7 12h14M3 17h18"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
