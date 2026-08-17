import type { Core } from "@strapi/strapi";

type DocumentService = {
  findFirst: (params?: Record<string, unknown>) => Promise<any>;
  findMany: (params?: Record<string, unknown>) => Promise<any[]>;
  create: (params: Record<string, unknown>) => Promise<any>;
  update: (params: Record<string, unknown>) => Promise<any>;
};

const PAGE_DEFINITIONS = [
  { slug: "motorsport-home", uid: "api::motorsport-home-page.motorsport-home-page", endpoint: "motorsport-home-page", sections: { "upcoming-events": "upcomingEventsSection", "latest-news": "latestNewsSection", gallery: "gallerySection", "connected-records": "connectedRecordsSection" } },
  { slug: "motorsport-about", uid: "api::motorsport-about-page.motorsport-about-page", endpoint: "motorsport-about-page", sections: { profile: "profileSection", "team-intro": "teamSection", "contact-cta": "contactCtaSection", "ecosystem-cta": "ecosystemCtaSection" } },
  { slug: "motorsport-events", uid: "api::motorsport-events-page.motorsport-events-page", endpoint: "motorsport-events-page", sections: { "event-control": "eventControlSection", programmes: "programmesSection", calendar: "calendarSection" } },
  { slug: "motorsport-news", uid: "api::motorsport-news-page.motorsport-news-page", endpoint: "motorsport-news-page", sections: { "news-control": "newsControlSection", "lead-story": "leadStorySection", "archive-intro": "archiveIntroSection", "news-gallery-cta": "galleryCtaSection" } },
  { slug: "motorsport-gallery", uid: "api::motorsport-gallery-page.motorsport-gallery-page", endpoint: "motorsport-gallery-page", sections: { "gallery-archive": "archiveSection", "gallery-intro": "archiveSection" } },
  { slug: "motorsport-merchandise", uid: "api::motorsport-merchandise-page.motorsport-merchandise-page", endpoint: "motorsport-merchandise-page", sections: { "merch-control": "merchControlSection", "merchandise-catalog": "catalogueSection", "merch-final-cta": "finalCtaSection" } },
  { slug: "motorsport-tickets", uid: "api::motorsport-tickets-page.motorsport-tickets-page", endpoint: "motorsport-tickets-page", sections: { "ticket-control": "ticketControlSection", "featured-ticket": "featuredTicketSection", "ticketed-events": "ticketedEventsSection", "ticket-info": "ticketInfoSection" } },
  { slug: "motorsport-contact", uid: "api::motorsport-contact-page.motorsport-contact-page", endpoint: "motorsport-contact-page", sections: { "inquiry-control": "inquiryControlSection", "inquiry-form": "inquiryFormSection", "contact-final-cta": "finalCtaSection" } },
  { slug: "motorsport-partners", uid: "api::motorsport-partners-page.motorsport-partners-page", endpoint: "motorsport-partners-page", sections: { "partner-control": "partnerControlSection", "partner-network": "partnerNetworkSection", "partners-final-cta": "finalCtaSection" } },
  { slug: "motorsport-experience", uid: "api::motorsport-experience-page.motorsport-experience-page", endpoint: "motorsport-experience-page", sections: { "experience-control": "experienceControlSection", "experience-pillars": "pillarsSection", "experience-track": "trackSection", "experience-final-cta": "finalCtaSection" } },
] as const;

const component = (value: any) => value && typeof value === "object" ? value : null;

function namedSection(section: any) {
  if (!section || section.__component !== "shared.page-section") return null;
  return {
    isActive: section.enabled !== false,
    eyebrow: section.eyebrow,
    title: section.title || "Section",
    body: section.body || section.description,
    media: section.media?.id,
    ctaLabel: section.ctaLabel,
    ctaUrl: section.ctaUrl,
    theme: section.theme || "default",
  };
}

function informationBand(page: any) {
  const old = component(page.motorsportInformationBand);
  if (old) {
    return {
      isActive: old.enabled !== false,
      eyebrow: old.eyebrow,
      title: old.title || old.heading || page.title,
      description: old.description,
      showMetricGroup: old.showMetricGroup !== false,
      metrics: [
        [old.nextEventLabel, old.nextEventValue],
        [old.ticketStatusLabel, old.ticketStatusValue],
        [old.regionLabel, old.regionValue],
      ].filter(([label, value]) => label != null && value != null && String(label).trim() && String(value).trim()).map(([label, value]) => ({ isActive: true, label: String(label), value: String(value) })),
    };
  }
  return { isActive: true, title: page.heroTitle || page.title, showMetricGroup: false, metrics: [] };
}

function singleData(page: any, definition: (typeof PAGE_DEFINITIONS)[number]) {
  const fields: Record<string, unknown> = {
    siteScope: "motorsport",
    routePath: routeFor(definition.slug),
    title: page.title || definition.slug,
    navigationLabel: page.navigationLabel,
    hero: {
      isActive: page.heroEnabled !== false,
      title: page.heroTitle || page.title || definition.slug,
      description: page.heroDescription,
      backgroundMedia: page.heroMedia?.id,
      backgroundAlt: page.heroMedia?.alternativeText,
    },
    informationBand: informationBand(page),
    pageAvailability: page.pageAvailability || undefined,
    seo: page.seo || undefined,
  };

  if (definition.slug === "motorsport-home") {
    fields.heroSlides = (page.heroSlides || []).map((slide: any) => ({ ...slide, image: slide.image?.id, mobileImage: slide.mobileImage?.id }));
    fields.worldSection = page.motorsportWorldSection || undefined;
    fields.ticketSection = page.motorsportTicketSection ? { ...page.motorsportTicketSection, backgroundImage: page.motorsportTicketSection.backgroundImage?.id } : undefined;
  }
  for (const section of page.sections || []) {
    if (section.__component === "motorsport.about-capabilities") {
      fields.capabilities = section;
      continue;
    }
    const target = definition.sections[String(section.sectionKey) as keyof typeof definition.sections];
    const value = namedSection(section);
    if (target && value) fields[target] = value;
  }
  const galleryIntro = (page.sections || []).find((section: any) => section.sectionKey === "gallery-intro");
  if (definition.slug === "motorsport-gallery" && galleryIntro) {
    (fields.hero as Record<string, unknown>).eyebrow = galleryIntro.eyebrow;
  }
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));
}

export async function migrateMotorsportPageSingleTypes(strapi: Core.Strapi) {
  if (process.env.MOTORSPORT_PAGE_SINGLE_TYPES_MIGRATE !== "true") return;
  const documents = strapi.documents as unknown as (uid: string) => DocumentService;
  const legacy = documents("api::site-page.site-page");
  const pages = await legacy.findMany({ filters: { siteScope: { $eq: "motorsport" } }, populate: ["heroMedia", "heroSlides.image", "heroSlides.mobileImage", "motorsportInformationBand", "motorsportWorldSection.disciplines.image", "motorsportTicketSection.backgroundImage", "sections", "pageAvailability.comingSoonMedia", "seo.ogImage"], locale: "en", status: "published" });
  for (const definition of PAGE_DEFINITIONS) {
    const source = pages.find((page: any) => page.slug === definition.slug || page.routePath === routeFor(definition.slug));
    if (!source) continue;
    const service = documents(definition.uid);
    const existing = await service.findFirst({ locale: "en", status: "published" });
    if (!existing) {
      const created = await service.create({ data: singleData(source, definition), locale: "en", status: "published" });
      try { await service.update({ documentId: created.documentId, locale: "id", data: singleData(source, definition), status: "published" }); } catch (error) { strapi.log.warn(`[motorsport-single-types] Indonesian localization deferred for ${definition.endpoint}: ${error instanceof Error ? error.message : "unknown error"}`); }
      strapi.log.info(`[motorsport-single-types] migrated ${definition.slug}`);
    }
  }
}

function routeFor(slug: string) {
  const routes: Record<string, string> = { "motorsport-home": "/", "motorsport-about": "/about", "motorsport-events": "/events", "motorsport-news": "/news", "motorsport-gallery": "/gallery", "motorsport-merchandise": "/merchandise", "motorsport-tickets": "/tickets", "motorsport-contact": "/contact", "motorsport-partners": "/partners", "motorsport-experience": "/experience" };
  return routes[slug];
}
