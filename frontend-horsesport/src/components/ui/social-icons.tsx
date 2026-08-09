import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Monochrome social brand marks (currentColor). Decorative - pair with an
 *  aria-label on the wrapping link. */

export function InstagramIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path
        d="M10.5 9.3 15.2 12l-4.7 2.7V9.3Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.5 3h3.02l-6.6 7.54L21.7 21h-5.86l-4.59-6-5.25 6H3l7.06-8.07L2.6 3h6.01l4.15 5.49L17.5 3Zm-1.06 16.2h1.67L7.64 4.7H5.85l10.59 14.5Z" />
    </svg>
  );
}

export function ThreadsIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 21c-4.7 0-7.7-3.1-7.7-9S7.3 3 12 3c3.5 0 5.8 1.7 6.7 4.3" />
      <path d="M8.8 13.6c0-1.7 1.4-2.8 3.4-2.8 2.4 0 3.8 1.5 3.8 3.7 0 2.5-1.8 3.9-3.9 3.6-1.4-.2-2.3-1.1-2.3-2.2 0-1.2 1-2 2.4-2 2.6 0 4.1 1.9 4.1 4.3" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.8 21v-7.9h2.6l.4-3h-3V8.2c0-.87.24-1.46 1.5-1.46h1.6V4.06A21.6 21.6 0 0 0 14.56 4c-2.32 0-3.9 1.42-3.9 4.02v2.08H8v3h2.66V21h3.14Z" />
    </svg>
  );
}
