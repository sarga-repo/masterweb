import type { LinkItem } from "@/types/design-system";

/**
 * One source of truth for the public Motorsport information architecture.
 * Ticket stays in sequence but the header renders it as the strongest CTA.
 */
export const MOTORSPORT_NAVIGATION: LinkItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Event", href: "/events" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Merchandise", href: "/merchandise" },
  { label: "Contact", href: "/contact" },
  { label: "Ticket", href: "/tickets" },
];

export const MOTORSPORT_TICKET_LINK: LinkItem = {
  label: "Get tickets",
  href: "/tickets",
};
