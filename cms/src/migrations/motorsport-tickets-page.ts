import type { Core } from "@strapi/strapi";

const TICKETS_PAGE_UID = "api::motorsport-tickets-page.motorsport-tickets-page";

type DocumentService = {
  findFirst: (params?: Record<string, unknown>) => Promise<any>;
  create: (params: Record<string, unknown>) => Promise<any>;
  update: (params: Record<string, unknown>) => Promise<any>;
};

const section = (sectionKey: string, eyebrow: string, title: string, body: string) => ({
  sectionKey,
  isActive: true,
  showIndex: true,
  showEyebrow: true,
  showTitle: true,
  showBody: true,
  showMedia: true,
  showCta: true,
  eyebrow,
  title,
  body,
});

const TICKETS_PAGE_DATA = {
  siteScope: "motorsport",
  routePath: "/tickets",
  routeAliases: [],
  title: "Sarga Motorsport Tickets",
  navigationLabel: "Tickets",
  hero: {
    isActive: true,
    showEyebrow: true,
    showTitle: true,
    showDescription: true,
    showMedia: true,
    showPrimaryCta: true,
    showSecondaryCta: true,
    title: "Tickets",
    description:
      "Sarga Motorsport partners with approved ticketing platforms. Every CTA below redirects to a secure partner checkout - we never process payment directly.",
  },
  informationBand: {
    isActive: true,
    showMetricGroup: false,
    title: "Your seat. Their secure checkout.",
    description:
      "Sarga Motorsport publishes approved destinations but never stores payment details or runs an internal ticket engine.",
  },
  featuredTicketSection: section(
    "featured-ticket",
    "Featured ticket",
    "Secure your seat.",
    "Checkout is handled by our approved ticketing partner. Secure payment, guaranteed entry, zero markup.",
  ),
  ticketedEventsSection: section(
    "ticketed-events",
    "Events with tickets available",
    "On sale now.",
    "Published Motorsport events with an approved external ticket destination.",
  ),
  ticketInfoSection: section(
    "ticket-info",
    "Ticket support",
    "How it works.",
    "Select an event and continue securely to its approved ticketing partner. Contact the Motorsport desk for event-specific support.",
  ),
};

/**
 * Repairs an older staging/local database where the Tickets single type was
 * created in the schema but its document was never migrated. Without a
 * document Strapi returns 404 for the editor, so its native Preview card is
 * correctly omitted even though the preview route is configured.
 */
export async function ensureMotorsportTicketsPage(strapi: Core.Strapi) {
  const documents = strapi.documents as unknown as (uid: string) => DocumentService;
  const service = documents(TICKETS_PAGE_UID);
  const existing = await service.findFirst({ locale: "en", status: "published" });
  if (existing) return;

  const created = await service.create({
    data: TICKETS_PAGE_DATA,
    locale: "en",
    status: "published",
  });

  try {
    await service.update({
      documentId: created.documentId,
      data: TICKETS_PAGE_DATA,
      locale: "id",
      status: "published",
    });
  } catch (error) {
    strapi.log.warn(
      `[motorsport-tickets-page] Indonesian localization deferred: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    );
  }

  strapi.log.info("[motorsport-tickets-page] repaired missing Tickets page document");
}
