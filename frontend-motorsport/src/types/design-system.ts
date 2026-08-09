import type { StaticImageData } from "next/image";

export type MediaSource = string | StaticImageData;

export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type HomepageHeroSlide = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  image: MediaSource;
  mobileImage?: MediaSource;
  imageAlt: string;
  subjectAnchor: "left" | "center" | "right";
  cta?: LinkItem;
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

export type MotorsportAccent =
  "crimson" | "orange" | "yellow" | "teal" | "blue";

export type DisciplineItem = {
  title: string;
  shortLabel?: string;
  href: string;
  image: MediaSource;
  imageAlt: string;
  accent: MotorsportAccent;
};

export type CampaignSlide = {
  id: string;
  eyebrow?: string;
  headline: string;
  description?: string;
  eventTitle: string;
  dateLabel?: string;
  venue?: string;
  image: MediaSource;
  imageAlt: string;
  cta?: LinkItem;
};

export type ProgramNavItem = LinkItem & {
  exact?: boolean;
};

export type ScheduleEntry = {
  id: string;
  roundLabel: string;
  title: string;
  dateLabel: string;
  venue: string;
  status?: "upcoming" | "live" | "completed";
  description?: string;
  sessions?: Array<{ label: string; time: string }>;
};

export type StandingEntry = {
  position: number;
  rider: string;
  riderSlug?: string;
  number?: string | number;
  team?: string;
  region?: string;
  portrait?: MediaSource;
  portraitAlt?: string;
  points: number | string;
  resultSummary?: string;
};

export type MotorsportProgram = {
  title: string;
  slug: string;
  href: string;
  programType: "juniorTalentCup" | "rallycross" | "raceWeekend" | "other";
  status:
    "announced" | "registrationOpen" | "ticketsOpen" | "live" | "completed";
  seasonLabel: string;
  summary: string;
  headline?: string;
  dateLabel?: string;
  venue?: string;
  image: MediaSource;
  imageAlt: string;
  ctaLabel: string;
};

export type MotorsportProgramDetail = MotorsportProgram & {
  schedule: ScheduleEntry[];
  becomeRidersLabel?: string;
  becomeRidersHref?: string;
};

export type CampaignRule = {
  id: string;
  type: "do" | "dont";
  title: string;
  description: string;
};

export type CampaignSeo = {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  image?: MediaSource;
  canonical?: string;
  noIndex?: boolean;
};

export type MotorsportCampaignDetail = MotorsportProgramDetail & {
  slides: CampaignSlide[];
  rules: CampaignRule[];
  ticketCta?: LinkItem & { provider?: string };
  seo?: CampaignSeo;
};

export type MotorsportRider = {
  name: string;
  slug: string;
  number?: string;
  team?: string;
  region?: string;
  nationality?: string;
  portrait?: MediaSource;
  portraitAlt?: string;
  bio?: string;
};

export type MotorsportRegulation = {
  title: string;
  version: string;
  effectiveDate: string;
  summary?: string;
  fileHref?: string;
  fileLabel?: string;
};

export type MerchandiseItem = {
  title: string;
  slug: string;
  description?: string;
  image: MediaSource;
  imageAlt: string;
  priceLabel?: string;
  availability: "comingSoon" | "availableExternal" | "inquiryOnly";
  href?: string;
};

export type TeamMember = {
  name: string;
  role?: string;
  group?: "board" | "executive" | "advisor";
  summary?: string;
  portrait: MediaSource;
  portraitAlt: string;
};

export type EcosystemSite = {
  name: string;
  slug: string;
  href: string;
  description?: string;
  themeKey?: string;
  logo?: MediaSource;
  logoAlt?: string;
  external: boolean;
};
