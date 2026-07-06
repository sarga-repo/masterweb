import type { SVGProps } from "react";

/**
 * Sarga Horse Sport custom icon pack.
 *
 * A cohesive, equestrian-flavoured stroke set (24×24, 1.6 stroke, rounded
 * caps/joins, currentColor) - including sport-specific marks (horseshoe, jockey
 * helmet, horse, rosette, turf track, stable) that set the site apart from
 * generic icon libraries. Decorative by default; pass a `title` for standalone
 * meaningful icons.
 */

type HsIconProps = SVGProps<SVGSVGElement> & { title?: string };

function Base({ title, children, ...props }: HsIconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function HorseshoeIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <path d="M7.5 20.5c-2.4-1.7-3.5-4.6-3.5-7.5C4 8 7.6 4 12 4s8 4 8 9c0 2.9-1.1 5.8-3.5 7.5" />
      <path d="M7.5 20.5 6 18M16.5 20.5 18 18" />
      <circle cx="8.2" cy="9.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="15.8" cy="9.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="7" cy="13" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="17" cy="13" r="0.5" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function JockeyHelmetIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <path d="M3.5 14a8.5 8.5 0 0 1 17 0" />
      <path d="M20.5 14H10l-6.5 1.5A1.5 1.5 0 0 0 3.5 17H20a.5.5 0 0 0 .5-.5V14Z" />
      <path d="M12 5.5V4" />
      <path d="M8 8.5c1-1.3 2.4-2 4-2s3 .7 4 2" />
    </Base>
  );
}

export function HorseIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <path d="M5 21c0-4 1.5-6.5 4-8 .6-2.2.4-4-1-6l3 1 1.5-2 .8 2.6 2.7 1.4c2 1.1 3.3 3.2 3.3 5.6V21" />
      <path d="M11 6.5 9.6 5" />
      <circle cx="12.5" cy="8.5" r="0.5" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function RosetteIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="9" r="5" />
      <circle cx="12" cy="9" r="1.6" />
      <path d="M9.5 13.5 8 22l4-2 4 2-1.5-8.5" />
    </Base>
  );
}

export function TrophyIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4.5a2.5 2.5 0 0 0 2.5 2.5M17 6h2.5A2.5 2.5 0 0 1 17 8.5" />
      <path d="M12 13v3M9 20h6M10 20l.5-4M14 20l-.5-4" />
    </Base>
  );
}

export function TicketIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h13A1.5 1.5 0 0 1 20 8.5v1a2 2 0 0 0 0 5v1a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 15.5v-1a2 2 0 0 0 0-5v-1Z" />
      <path d="M13 7v10" strokeDasharray="1.5 2" />
    </Base>
  );
}

export function CalendarIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M4 9.5h16M8 3.5V6M16 3.5V6" />
      <circle cx="12" cy="14" r="0.7" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function PinIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <path d="M12 21c4-4.5 6-7.8 6-10.5a6 6 0 1 0-12 0C6 13.2 8 16.5 12 21Z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </Base>
  );
}

export function TrackIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <rect x="2.5" y="7" width="19" height="10" rx="5" />
      <rect x="6.5" y="10" width="11" height="4" rx="2" />
    </Base>
  );
}

export function StableIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <path d="M4 10 12 4l8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9Z" />
      <path d="M9.5 20v-5a2.5 2.5 0 0 1 5 0v5" />
      <path d="M4 12h16" />
    </Base>
  );
}

export function ClockIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 1.5" />
    </Base>
  );
}

export function SparkleIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <path d="M12 3c.5 4.5 1.5 5.5 6 6-4.5.5-5.5 1.5-6 6-.5-4.5-1.5-5.5-6-6 4.5-.5 5.5-1.5 6-6Z" />
    </Base>
  );
}

export function QuoteIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <path d="M9 7c-2.5 1-4 3-4 6v4h5v-5H6.5C6.5 9.5 7.5 8.3 9 7.8ZM19 7c-2.5 1-4 3-4 6v4h5v-5h-3.5c0-2.5 1-3.7 2.5-4.2Z" />
    </Base>
  );
}

export function UsersIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8M17 14.5a5.5 5.5 0 0 1 3.5 4.5" />
    </Base>
  );
}

export function PlayIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.5 9.2 15 12l-4.5 2.8V9.2Z" fill="currentColor" />
    </Base>
  );
}

export function MailIcon(props: HsIconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 8 7.3 5a1.2 1.2 0 0 0 1.4 0L20 8" />
    </Base>
  );
}
