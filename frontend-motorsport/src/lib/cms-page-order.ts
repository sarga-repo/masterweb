export type OrderedCmsPageSection = {
  __component?: string;
  sectionKey: string;
  enabled?: boolean;
  showIndex?: boolean;
  indexLabel?: string;
  showEyebrow?: boolean;
  showTitle?: boolean;
  showBody?: boolean;
  showDescription?: boolean;
  showMedia?: boolean;
  showCta?: boolean;
  supportLabel?: string;
  supportBody?: string;
  legalText?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaTarget?: "sameWindow" | "newWindow";
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  secondaryCtaTarget?: "sameWindow" | "newWindow";
  media?: { id: number; url: string; [key: string]: unknown } | null;
  theme?: "default" | "dark" | "light" | "accent";
  cards?: Array<{
    internalName?: string;
    enabled?: boolean;
    indexLabel?: string;
    title?: string;
    description?: string;
    sortOrder?: number;
    accent?: "crimson" | "orange" | "yellow" | "teal" | "blue";
  }>;
  items?: Array<{
    isActive?: boolean;
    sortOrder?: number;
    label?: string;
    title?: string;
    description?: string;
    media?: { id: number; url: string; alternativeText?: string } | null;
    mediaAlt?: string;
    accent?: "crimson" | "orange" | "yellow" | "teal" | "blue";
    href?: string;
    hrefLabel?: string;
  }>;
};

export type OrderedCmsSinglePage = {
  routePath?: string;
  [key: string]: unknown;
};

type KeyedCmsSection = {
  sectionKey: string;
  enabled?: boolean;
};

/**
 * Merge a primary section source with a legacy fallback without allowing
 * duplicate keys to bypass an explicit visibility choice. The first position
 * remains authoritative for ordering, while a false value is sticky across
 * duplicates until the CMS data is normalized.
 */
export function mergeAuthoritativeCmsSections<T extends KeyedCmsSection>(
  primary: T[],
  fallback: Array<T | (KeyedCmsSection & Partial<T>)> = [],
): T[] {
  const merged: T[] = [];
  const positions = new Map<string, number>();

  const add = (section: T) => {
    const existingPosition = positions.get(section.sectionKey);
    if (existingPosition == null) {
      positions.set(section.sectionKey, merged.length);
      merged.push(section);
      return;
    }

    const existing = merged[existingPosition];
    merged[existingPosition] = {
      ...existing,
      ...section,
      enabled:
        existing.enabled === false || section.enabled === false
          ? false
          : (section.enabled ?? existing.enabled),
    };
  };

  primary.forEach(add);
  fallback.forEach((section) => {
    if (!positions.has(section.sectionKey)) add(section as T);
  });

  return merged;
}

const MOTORSPORT_PAGE_SECTION_ORDER: Record<string, string[]> = {
  "/about": [
    "profileSection",
    "capabilities",
    "teamSection",
    "contactCtaSection",
    "ecosystemCtaSection",
  ],
  "/events": ["programmesSection", "calendarSection"],
  "/news": ["leadStorySection", "archiveIntroSection", "galleryCtaSection"],
  "/gallery": ["archiveSection"],
  "/merchandise": ["catalogueSection", "finalCtaSection"],
  "/tickets": [
    "featuredTicketSection",
    "ticketedEventsSection",
    "ticketInfoSection",
  ],
  "/partners": ["partnerNetworkSection", "finalCtaSection"],
  "/experience": ["pillarsSection", "trackSection", "finalCtaSection"],
  "/contact": ["inquiryFormSection", "finalCtaSection"],
};

const MOTORSPORT_PAGE_SECTION_KEYS: Record<string, string> = {
  teamSection: "team-intro",
};

function fallbackPageSectionOrder(page: OrderedCmsSinglePage): string[] {
  return Object.keys(page).filter(
    (key) => key === "capabilities" || key.endsWith("Section"),
  );
}

function pageSectionKey(field: string): string {
  return (
    MOTORSPORT_PAGE_SECTION_KEYS[field] ??
    field
      .replace(/Section$/, "")
      .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
  );
}

function mapSectionItems(
  value: Record<string, unknown>,
  resolveMedia: (url: string) => string,
): OrderedCmsPageSection["items"] {
  if (!Array.isArray(value.items)) return [];
  return value.items
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object",
    )
    .sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
    .map((item) => {
      const media = item.media as
        | { id: number; url: string; alternativeText?: string }
        | null
        | undefined;
      return {
        isActive: item.isActive !== false,
        sortOrder: Number(item.sortOrder ?? 0),
        label: typeof item.label === "string" ? item.label : undefined,
        title: typeof item.title === "string" ? item.title : undefined,
        description:
          typeof item.description === "string" ? item.description : undefined,
        media: media ? { ...media, url: resolveMedia(media.url) } : null,
        mediaAlt: typeof item.mediaAlt === "string" ? item.mediaAlt : undefined,
        accent:
          typeof item.accent === "string"
            ? (item.accent as NonNullable<
                NonNullable<OrderedCmsPageSection["items"]>[number]["accent"]
              >)
            : undefined,
        href: typeof item.href === "string" ? item.href : undefined,
        hrefLabel:
          typeof item.hrefLabel === "string" ? item.hrefLabel : undefined,
      };
    });
}

export function mapMotorsportSinglePageSections(
  page: OrderedCmsSinglePage,
  resolveMedia: (url: string) => string = (url) => url,
): OrderedCmsPageSection[] {
  const sections: OrderedCmsPageSection[] = [];
  const sectionFields =
    MOTORSPORT_PAGE_SECTION_ORDER[page.routePath ?? ""] ??
    fallbackPageSectionOrder(page);

  for (const key of sectionFields) {
    const value = page[key] as Record<string, unknown> | null | undefined;
    if (!value) continue;

    if (key === "capabilities") {
      sections.push({
        ...(value as OrderedCmsPageSection),
        __component: "motorsport.about-capabilities",
        sectionKey: "about-capabilities",
        enabled: value.enabled !== false,
      });
      continue;
    }

    const media = value.media as OrderedCmsPageSection["media"];
    sections.push({
      __component: "shared.page-section",
      sectionKey: pageSectionKey(key),
      indexLabel:
        typeof value.indexLabel === "string" ? value.indexLabel : undefined,
      showIndex: value.showIndex !== false,
      showEyebrow: value.showEyebrow !== false,
      showTitle: value.showTitle !== false,
      showBody: value.showBody !== false,
      showMedia: value.showMedia !== false,
      showCta: value.showCta !== false,
      supportLabel:
        typeof value.supportLabel === "string" ? value.supportLabel : undefined,
      supportBody:
        typeof value.supportBody === "string" ? value.supportBody : undefined,
      legalText:
        typeof value.legalText === "string" ? value.legalText : undefined,
      eyebrow: typeof value.eyebrow === "string" ? value.eyebrow : undefined,
      title: typeof value.title === "string" ? value.title : undefined,
      body: typeof value.body === "string" ? value.body : undefined,
      description:
        typeof value.description === "string" ? value.description : undefined,
      ctaLabel: typeof value.ctaLabel === "string" ? value.ctaLabel : undefined,
      ctaUrl: typeof value.ctaUrl === "string" ? value.ctaUrl : undefined,
      ctaTarget: value.ctaTarget === "newWindow" ? "newWindow" : "sameWindow",
      secondaryCtaLabel:
        typeof value.secondaryCtaLabel === "string"
          ? value.secondaryCtaLabel
          : undefined,
      secondaryCtaUrl:
        typeof value.secondaryCtaUrl === "string"
          ? value.secondaryCtaUrl
          : undefined,
      secondaryCtaTarget:
        value.secondaryCtaTarget === "newWindow" ? "newWindow" : "sameWindow",
      enabled: value.isActive !== false,
      media: media ? { ...media, url: resolveMedia(media.url) } : null,
      items: mapSectionItems(value, resolveMedia),
      theme: value.theme as OrderedCmsPageSection["theme"],
    });
  }

  return sections;
}
