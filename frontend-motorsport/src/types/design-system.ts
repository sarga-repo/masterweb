import type { StaticImageData } from "next/image";

export type MediaSource = string | StaticImageData;

export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type MotorsportStatus =
  | "announced"
  | "tickets-open"
  | "live"
  | "sold-out"
  | "completed"
  | "cancelled";

export type MotorsportEvent = {
  title: string;
  slug?: string;
  href: string;
  dateLabel: string;
  venue: string;
  image: MediaSource;
  imageAlt: string;
  status: MotorsportStatus;
  category?: string;
  seriesName?: string;
  ticketHref?: string;
  ticketLabel?: string;
};

export type MotorsportArticle = {
  title: string;
  href: string;
  image: MediaSource;
  imageAlt: string;
  category: string;
  publishedLabel: string;
  excerpt?: string;
};

export type GalleryItem = {
  id: string;
  image: MediaSource;
  imageAlt: string;
  caption?: string;
  eyebrow?: string;
};

export type PartnerItem = {
  name: string;
  logo: MediaSource;
  href?: string;
};
