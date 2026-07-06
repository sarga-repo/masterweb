import type { StaticImageData } from "next/image";

export type MediaSource = string | StaticImageData;

export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

/** Accent tokens available across Horse Sport components. */
export type HorseSportAccent = "red" | "orange" | "sand" | "turf" | "brown";

/** Presentational card shapes (pages map CMS records into these). */
export type EventCardData = {
  title: string;
  href: string;
  dateLabel?: string;
  venue?: string;
  discipline?: string;
  status?: string;
  image?: string;
  imageAlt?: string;
};

export type ArticleCardData = {
  title: string;
  href: string;
  category?: string;
  dateLabel?: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
};

export type VenueCardData = {
  name: string;
  href?: string;
  location?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
};

export type GalleryItemData = {
  id: string;
  image: string;
  imageAlt: string;
  caption?: string;
  category?: string;
};

export type PartnerItemData = {
  name: string;
  logo?: string;
  href?: string;
};

export type StatItem = {
  label: string;
  value: string;
};

export type CrumbItem = {
  label: string;
  href?: string;
};

export const HS_ACCENT_HEX: Record<HorseSportAccent, string> = {
  red: "#ED1B2F",
  orange: "#FF6B00",
  sand: "#E8D9A8",
  turf: "#8CA89A",
  brown: "#7A3B2E",
};
