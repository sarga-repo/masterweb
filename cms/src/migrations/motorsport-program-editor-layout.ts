import type { Core } from "@strapi/strapi";

const CONTENT_MANAGER_STORE = {
  type: "plugin" as const,
  name: "content_manager",
};

const PROGRAM_KEY =
  "configuration_content_types::api::motorsport-program.motorsport-program";
const HOME_PAGE_KEY =
  "configuration_content_types::api::motorsport-home-page.motorsport-home-page";
const EVENT_KEY =
  "configuration_content_types::api::motorsport-event.motorsport-event";
const NEWS_ARTICLE_KEY =
  "configuration_content_types::api::motorsport-news-article.motorsport-news-article";
const RIDER_KEY =
  "configuration_content_types::api::motorsport-rider.motorsport-rider";
const TICKET_CTA_KEY =
  "configuration_content_types::api::motorsport-ticket-cta.motorsport-ticket-cta";
const PAGE_SECTION_KEY = "configuration_components::motorsport.page-section";
const PAGE_SECTION_ITEM_KEY =
  "configuration_components::motorsport.page-section-item";
const TICKET_MAP_SECTION_KEY =
  "configuration_components::motorsport.ticket-map-section";
const PAGE_LAYOUT_PREFIX = "configuration_content_types::api::";

type LayoutRow = Array<{ name: string; size: number }>;
type ContentManagerConfiguration = {
  layouts?: { edit?: unknown; [key: string]: unknown };
  [key: string]: unknown;
};
type ContentManagerStore = {
  get: (params: { key: string }) => Promise<unknown>;
  set: (params: { key: string; value: unknown }) => Promise<void>;
};

// Keep programme identity immediately visible to editors, then follow with the
// public campaign presentation and programme-specific content groups.
const PROGRAM_EDIT_LAYOUT: LayoutRow[] = [
  [
    { name: "title", size: 6 },
    { name: "slug", size: 6 },
  ],
  [
    { name: "eventMenuLabel", size: 6 },
    { name: "eventMenuEnabled", size: 4 },
  ],
  [
    { name: "programType", size: 6 },
    { name: "programStatus", size: 6 },
  ],
  [{ name: "seasonLabel", size: 6 }],
  [{ name: "summary", size: 12 }],
  [
    { name: "mainHeadline", size: 6 },
    { name: "eventStartDate", size: 6 },
  ],
  [
    { name: "eventEndDate", size: 6 },
    { name: "venue", size: 6 },
  ],
  [{ name: "motorsportPresentation", size: 12 }],
  [{ name: "heroMedia", size: 6 }],
  [{ name: "bannerSlides", size: 12 }],
  [{ name: "fiaRallycrossContent", size: 12 }],
  [{ name: "presentationSections", size: 12 }],
  [{ name: "rundown", size: 12 }],
  [
    { name: "primaryCtaLabel", size: 6 },
    { name: "primaryCtaUrl", size: 6 },
  ],
  [
    { name: "becomeRidersLabel", size: 6 },
    { name: "becomeRidersUrl", size: 6 },
  ],
  [{ name: "ticketMapSection", size: 12 }],
  [
    { name: "relatedEvents", size: 6 },
    { name: "relatedTicketCtas", size: 6 },
  ],
  [
    { name: "riders", size: 6 },
    { name: "standings", size: 6 },
  ],
  [
    { name: "regulations", size: 6 },
    { name: "siteScope", size: 6 },
  ],
  [{ name: "sites", size: 6 }],
  [{ name: "seo", size: 12 }],
];

const TICKET_MAP_SECTION_EDIT_LAYOUT: LayoutRow[] = [
  [{ name: "isActive", size: 4 }],
  [
    { name: "image", size: 8 },
    { name: "imageAlt", size: 4 },
  ],
];

const PAGE_SECTION_EDIT_LAYOUT: LayoutRow[] = [
  [
    { name: "isActive", size: 4 },
    { name: "showIndex", size: 4 },
    { name: "showEyebrow", size: 4 },
  ],
  [
    { name: "showTitle", size: 4 },
    { name: "showBody", size: 4 },
    { name: "showMedia", size: 4 },
  ],
  [
    { name: "showCta", size: 4 },
    { name: "indexLabel", size: 6 },
  ],
  [
    { name: "eyebrow", size: 6 },
    { name: "title", size: 12 },
  ],
  [{ name: "body", size: 12 }],
  [
    { name: "media", size: 6 },
    { name: "ctaLabel", size: 6 },
  ],
  [
    { name: "ctaUrl", size: 6 },
    { name: "ctaTarget", size: 6 },
  ],
  [
    { name: "secondaryCtaLabel", size: 6 },
    { name: "secondaryCtaUrl", size: 6 },
  ],
  [{ name: "secondaryCtaTarget", size: 6 }],
  [
    { name: "theme", size: 6 },
    { name: "supportLabel", size: 6 },
  ],
  [{ name: "supportBody", size: 12 }],
  [{ name: "legalText", size: 12 }],
  [{ name: "items", size: 12 }],
];

const PAGE_SECTION_ITEM_EDIT_LAYOUT: LayoutRow[] = [
  [
    { name: "isActive", size: 4 },
    { name: "sortOrder", size: 4 },
    { name: "accent", size: 4 },
  ],
  [
    { name: "label", size: 6 },
    { name: "title", size: 6 },
  ],
  [{ name: "description", size: 12 }],
  [
    { name: "media", size: 6 },
    { name: "mediaAlt", size: 6 },
  ],
  [
    { name: "hrefLabel", size: 6 },
    { name: "href", size: 6 },
  ],
];

const HOME_PAGE_EDIT_LAYOUT: LayoutRow[] = [
  [
    { name: "title", size: 6 },
    { name: "navigationLabel", size: 6 },
  ],
  [{ name: "hero", size: 12 }],
  [{ name: "heroSlides", size: 12 }],
  [{ name: "informationBand", size: 12 }],
  [{ name: "worldSection", size: 12 }],
  [{ name: "featuredEvent", size: 12 }],
  [{ name: "featuredProgram", size: 12 }],
  [{ name: "upcomingEventsSection", size: 12 }],
  [{ name: "ticketSection", size: 12 }],
  [{ name: "latestNewsSection", size: 12 }],
  [{ name: "connectedRecordsSection", size: 12 }],
  [{ name: "gallerySection", size: 12 }],
  [{ name: "partnersSection", size: 12 }],
  [{ name: "newsletterSection", size: 12 }],
  [{ name: "showPartnersOnHomepage", size: 6 }],
  [{ name: "pageAvailability", size: 12 }],
  [{ name: "seo", size: 12 }],
  [
    { name: "routePath", size: 6 },
    { name: "routeAliases", size: 6 },
  ],
  [{ name: "siteScope", size: 6 }],
];

// Keep collection editors in the same order as their public detail routes:
// presentation/hero, page content, supporting records, then SEO and advanced
// compatibility fields.
const EVENT_EDIT_LAYOUT: LayoutRow[] = [
  [{ name: "motorsportPresentation", size: 12 }],
  [
    { name: "title", size: 6 },
    { name: "slug", size: 6 },
  ],
  [
    { name: "heroMedia", size: 6 },
    { name: "coverImage", size: 6 },
  ],
  [{ name: "gallery", size: 12 }],
  [{ name: "description", size: 12 }],
  [
    { name: "eventDate", size: 6 },
    { name: "endDate", size: 6 },
  ],
  [
    { name: "eventStatus", size: 6 },
    { name: "racingCategory", size: 6 },
  ],
  [
    { name: "seriesName", size: 6 },
    { name: "venue", size: 6 },
  ],
  [
    { name: "venueAddress", size: 6 },
    { name: "circuitName", size: 6 },
  ],
  [{ name: "schedule", size: 12 }],
  [{ name: "ticketCtas", size: 12 }],
  [{ name: "sponsors", size: 12 }],
  [
    { name: "ticketCtaLabel", size: 6 },
    { name: "ticketUrl", size: 6 },
  ],
  [
    { name: "ticketIntegrationType", size: 6 },
    { name: "broadcastUrl", size: 6 },
  ],
  [
    { name: "embedUrl", size: 6 },
    { name: "embedCode", size: 6 },
  ],
  [{ name: "business", size: 6 }],
  [{ name: "seo", size: 12 }],
];

const NEWS_ARTICLE_EDIT_LAYOUT: LayoutRow[] = [
  [{ name: "motorsportPresentation", size: 12 }],
  [
    { name: "title", size: 6 },
    { name: "slug", size: 6 },
  ],
  [{ name: "coverImage", size: 12 }],
  [{ name: "excerpt", size: 12 }],
  [{ name: "body", size: 12 }],
  [
    { name: "category", size: 6 },
    { name: "publishedDate", size: 6 },
  ],
  [
    { name: "isHotTopic", size: 6 },
    { name: "author", size: 6 },
  ],
  [
    { name: "relatedEvent", size: 4 },
    { name: "relatedGallery", size: 4 },
    { name: "relatedBusinesses", size: 4 },
  ],
  [{ name: "seo", size: 12 }],
];

const RIDER_EDIT_LAYOUT: LayoutRow[] = [
  [{ name: "motorsportPresentation", size: 12 }],
  [
    { name: "name", size: 6 },
    { name: "slug", size: 6 },
  ],
  [
    { name: "portrait", size: 6 },
    { name: "bio", size: 6 },
  ],
  [{ name: "program", size: 12 }],
  [
    { name: "number", size: 4 },
    { name: "team", size: 4 },
    { name: "region", size: 4 },
  ],
  [{ name: "nationality", size: 6 }],
  [
    { name: "isActive", size: 6 },
    { name: "sortOrder", size: 6 },
  ],
  [
    { name: "siteScope", size: 6 },
    { name: "sites", size: 6 },
  ],
  [{ name: "seo", size: 12 }],
];

// Keep the dedicated Motorsport CTA self-contained and make the ownership
// fields adjacent: editors can see whether a CTA belongs to an event, a
// program, or both without hunting through the form.
const TICKET_CTA_EDIT_LAYOUT: LayoutRow[] = [
  [
    { name: "title", size: 6 },
    { name: "label", size: 6 },
  ],
  [
    { name: "provider", size: 6 },
    { name: "eyebrow", size: 6 },
  ],
  [{ name: "description", size: 12 }],
  [
    { name: "eventLabel", size: 6 },
    { name: "eventText", size: 6 },
  ],
  [
    { name: "providerLabel", size: 6 },
    { name: "providerText", size: 6 },
  ],
  [
    { name: "partnerLabel", size: 6 },
    { name: "footerText", size: 6 },
  ],
  [
    { name: "ctaLabel", size: 6 },
    { name: "ctaType", size: 6 },
  ],
  [{ name: "url", size: 12 }],
  [
    { name: "embedCode", size: 6 },
    { name: "embedConfigJson", size: 6 },
  ],
  [{ name: "trackingParams", size: 12 }],
  [
    { name: "activeFrom", size: 6 },
    { name: "activeUntil", size: 6 },
  ],
  [{ name: "isActive", size: 4 }],
  [
    { name: "image", size: 4 },
    { name: "backgroundImage", size: 4 },
    { name: "backgroundImageMobile", size: 4 },
  ],
  [
    { name: "relatedEvent", size: 6 },
    { name: "relatedProgram", size: 6 },
  ],
];

function pageEditLayout(sectionNames: string[]): LayoutRow[] {
  return [
    [
      { name: "title", size: 6 },
      { name: "navigationLabel", size: 6 },
    ],
    [{ name: "hero", size: 12 }],
    [{ name: "informationBand", size: 12 }],
    ...sectionNames.map((name) => [{ name, size: 12 }]),
    [{ name: "pageAvailability", size: 12 }],
    [{ name: "seo", size: 12 }],
    [
      { name: "routePath", size: 6 },
      { name: "routeAliases", size: 6 },
    ],
    [{ name: "siteScope", size: 6 }],
  ];
}

const PAGE_EDIT_LAYOUTS: Array<{
  key: string;
  layout: LayoutRow[];
  legacyFields: string[];
}> = [
  {
    key: `${PAGE_LAYOUT_PREFIX}motorsport-about-page.motorsport-about-page`,
    layout: pageEditLayout([
      "profileSection",
      "capabilities",
      "teamSection",
      "contactCtaSection",
      "ecosystemCtaSection",
    ]),
    legacyFields: [],
  },
  {
    key: `${PAGE_LAYOUT_PREFIX}motorsport-events-page.motorsport-events-page`,
    layout: pageEditLayout(["programmesSection", "calendarSection"]),
    legacyFields: [],
  },
  {
    key: `${PAGE_LAYOUT_PREFIX}motorsport-news-page.motorsport-news-page`,
    layout: pageEditLayout([
      "leadStorySection",
      "archiveIntroSection",
      "galleryCtaSection",
    ]),
    legacyFields: [],
  },
  {
    key: `${PAGE_LAYOUT_PREFIX}motorsport-gallery-page.motorsport-gallery-page`,
    layout: pageEditLayout(["archiveSection"]),
    legacyFields: [],
  },
  {
    key: `${PAGE_LAYOUT_PREFIX}motorsport-merchandise-page.motorsport-merchandise-page`,
    layout: pageEditLayout(["catalogueSection", "finalCtaSection"]),
    legacyFields: [],
  },
  {
    key: `${PAGE_LAYOUT_PREFIX}motorsport-tickets-page.motorsport-tickets-page`,
    layout: pageEditLayout([
      "featuredTicketSection",
      "ticketedEventsSection",
      "ticketInfoSection",
    ]),
    legacyFields: [],
  },
  {
    key: `${PAGE_LAYOUT_PREFIX}motorsport-contact-page.motorsport-contact-page`,
    layout: pageEditLayout(["inquiryFormSection", "finalCtaSection"]),
    legacyFields: [],
  },
  {
    key: `${PAGE_LAYOUT_PREFIX}motorsport-partners-page.motorsport-partners-page`,
    layout: pageEditLayout(["partnerNetworkSection", "finalCtaSection"]),
    legacyFields: [],
  },
  {
    key: `${PAGE_LAYOUT_PREFIX}motorsport-experience-page.motorsport-experience-page`,
    layout: pageEditLayout([
      "pillarsSection",
      "trackSection",
      "finalCtaSection",
    ]),
    legacyFields: [],
  },
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function startsWithRows(layout: unknown, expected: LayoutRow[]) {
  if (!Array.isArray(layout) || layout.length < expected.length) return false;
  return expected.every((row, rowIndex) => {
    const actual = layout[rowIndex];
    return (
      Array.isArray(actual) &&
      actual.length === row.length &&
      row.every(
        (field, fieldIndex) =>
          isObject(actual[fieldIndex]) &&
          actual[fieldIndex].name === field.name,
      )
    );
  });
}

function containsField(layout: unknown, fieldNames: string[]) {
  if (!Array.isArray(layout) || fieldNames.length === 0) return false;
  return layout.some(
    (row) =>
      Array.isArray(row) &&
      row.some(
        (field) => isObject(field) && fieldNames.includes(String(field.name)),
      ),
  );
}

async function repairEditLayout(
  strapi: Core.Strapi,
  store: ContentManagerStore,
  key: string,
  expected: LayoutRow[],
  expectedPrefix: LayoutRow[],
  forbiddenFields: string[] = [],
) {
  const raw = await store.get({ key });
  if (!isObject(raw)) return;

  const current = raw as ContentManagerConfiguration;
  if (
    startsWithRows(current.layouts?.edit, expectedPrefix) &&
    !containsField(current.layouts?.edit, forbiddenFields)
  )
    return;

  await store.set({
    key,
    value: {
      ...current,
      layouts: {
        ...(isObject(current.layouts) ? current.layouts : {}),
        edit: expected,
      },
    },
  });
  strapi.log.info(`[motorsport-cm] repaired persisted layout: ${key}`);
}

/** Repairs Strapi's persisted Content Manager layouts after schema changes. */
export async function ensureMotorsportProgramEditorLayout(strapi: Core.Strapi) {
  const store = strapi.store(
    CONTENT_MANAGER_STORE,
  ) as unknown as ContentManagerStore;

  await repairEditLayout(
    strapi,
    store,
    PROGRAM_KEY,
    PROGRAM_EDIT_LAYOUT,
    PROGRAM_EDIT_LAYOUT.slice(0, 16),
  );
  await repairEditLayout(
    strapi,
    store,
    HOME_PAGE_KEY,
    HOME_PAGE_EDIT_LAYOUT,
    HOME_PAGE_EDIT_LAYOUT.slice(0, 14),
  );
  await repairEditLayout(
    strapi,
    store,
    EVENT_KEY,
    EVENT_EDIT_LAYOUT,
    EVENT_EDIT_LAYOUT.slice(0, 5),
  );
  await repairEditLayout(
    strapi,
    store,
    NEWS_ARTICLE_KEY,
    NEWS_ARTICLE_EDIT_LAYOUT,
    NEWS_ARTICLE_EDIT_LAYOUT.slice(0, 5),
  );
  await repairEditLayout(
    strapi,
    store,
    RIDER_KEY,
    RIDER_EDIT_LAYOUT,
    RIDER_EDIT_LAYOUT.slice(0, 4),
  );
  await repairEditLayout(
    strapi,
    store,
    TICKET_CTA_KEY,
    TICKET_CTA_EDIT_LAYOUT,
    TICKET_CTA_EDIT_LAYOUT,
  );
  for (const page of PAGE_EDIT_LAYOUTS) {
    await repairEditLayout(
      strapi,
      store,
      page.key,
      page.layout,
      page.layout.slice(0, 3),
      page.legacyFields,
    );
  }
  await repairEditLayout(
    strapi,
    store,
    PAGE_SECTION_KEY,
    PAGE_SECTION_EDIT_LAYOUT,
    PAGE_SECTION_EDIT_LAYOUT.slice(0, 3),
  );
  await repairEditLayout(
    strapi,
    store,
    PAGE_SECTION_ITEM_KEY,
    PAGE_SECTION_ITEM_EDIT_LAYOUT,
    PAGE_SECTION_ITEM_EDIT_LAYOUT.slice(0, 1),
  );
  await repairEditLayout(
    strapi,
    store,
    TICKET_MAP_SECTION_KEY,
    TICKET_MAP_SECTION_EDIT_LAYOUT,
    TICKET_MAP_SECTION_EDIT_LAYOUT,
  );
}
