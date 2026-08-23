import type { Core } from "@strapi/strapi";

type Mode = "off" | "dry-run" | "apply" | "verify" | "navigation";

type DocumentService = {
  findFirst: (params?: Record<string, unknown>) => Promise<any>;
  findMany: (params?: Record<string, unknown>) => Promise<any[]>;
  create: (params: Record<string, unknown>) => Promise<any>;
  update: (params: Record<string, unknown>) => Promise<any>;
  publish: (params: Record<string, unknown>) => Promise<any>;
};

type MigrationDefinition = {
  legacyUid: string;
  dedicatedUid: string;
  fields: string[];
  sourceFilter?: Record<string, unknown>;
};

const DEFINITIONS: MigrationDefinition[] = [
  { legacyUid: "api::event.event", dedicatedUid: "api::motorsport-event.motorsport-event", fields: ["title", "slug", "description", "eventDate", "endDate", "venue", "coverImage", "business", "ticketCtaLabel", "ticketUrl", "ticketIntegrationType", "embedCode", "embedUrl", "eventStatus", "racingCategory", "seriesName", "venueAddress", "circuitName", "schedule", "heroMedia", "gallery", "broadcastUrl", "seo", "motorsportPresentation"] },
  { legacyUid: "api::leadership-person.leadership-person", dedicatedUid: "api::motorsport-leadership-person.motorsport-leadership-person", fields: ["name", "role", "summary", "group", "site", "order", "portrait"] },
  { legacyUid: "api::merchandise-item.merchandise-item", dedicatedUid: "api::motorsport-merchandise-item.motorsport-merchandise-item", fields: ["title", "slug", "description", "image", "priceLabel", "availabilityStatus", "externalUrl", "sortOrder", "seo"] },
  { legacyUid: "api::news-article.news-article", dedicatedUid: "api::motorsport-news-article.motorsport-news-article", fields: ["title", "slug", "excerpt", "body", "coverImage", "category", "publishedDate", "isHotTopic", "author", "relatedBusinesses", "relatedGallery", "seo", "motorsportPresentation"] },
  { legacyUid: "api::partner.partner", dedicatedUid: "api::motorsport-partner.motorsport-partner", fields: ["name", "slug", "logo", "websiteUrl", "partnerType", "sortOrder", "isActive"] },
  { legacyUid: "api::ticket-cta.ticket-cta", dedicatedUid: "api::motorsport-ticket-cta.motorsport-ticket-cta", fields: ["title", "label", "provider", "ctaType", "url", "embedCode", "embedConfigJson", "trackingParams", "activeFrom", "activeUntil", "isActive", "image"] },
  { legacyUid: "api::top-navigation-item.top-navigation-item", dedicatedUid: "api::motorsport-top-navigation-item.motorsport-top-navigation-item", fields: ["internalName", "label", "ariaLabel", "href", "linkType", "enabled", "displayOrder", "emphasis", "openInNewTab"] },
];

// The source schemas are intentionally different. `*` is the safe direct
// population mode here; a shared explicit populate list would make Strapi
// reject keys that do not exist on, for example, Leadership or Navigation.
const POPULATE = "*";

function mode(): Mode {
  const value = process.env.MOTORSPORT_OWNERSHIP_MIGRATION_MODE ?? "off";
  return ["off", "dry-run", "apply", "verify", "navigation"].includes(value) ? value as Mode : "off";
}

function documentService(strapi: Core.Strapi, uid: string) {
  return (strapi.documents as unknown as (contentType: string) => DocumentService)(uid);
}

function documentRelation(value: any): any {
  if (Array.isArray(value)) return value.map(documentRelation).filter(Boolean);
  if (value && typeof value === "object") return value.documentId ?? null;
  return value;
}

function mediaId(value: any): any {
  if (Array.isArray(value)) return value.map(mediaId).filter(Boolean);
  if (value && typeof value === "object") return value.id ?? null;
  return value;
}

function componentData(value: any): any {
  if (Array.isArray(value)) return value.map(componentData);
  if (!value || typeof value !== "object") return value;
  // Upload-file relations use numeric IDs; components retain their structure
  // but must never reuse their source component primary keys.
  if ("mime" in value && "id" in value) return value.id;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !["id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale"].includes(key))
      .map(([key, child]) => [key, componentData(child)]),
  );
}

function copyData(
  source: any,
  definition: MigrationDefinition,
  locale = "en",
) {
  const data: Record<string, unknown> = { legacySourceDocumentId: source.documentId };
  for (const field of definition.fields) {
    // Stable route fields belong to the English master and cannot be changed
    // through an i18n localization update.
    if (locale !== "en" && ["slug", "routePath"].includes(field)) continue;
    const value = source[field];
    if (value === undefined || value === null) continue;
    if (["coverImage", "heroMedia", "gallery", "portrait", "image", "logo"].includes(field)) {
      data[field] = mediaId(value);
    } else if (["business", "site", "relatedBusinesses", "relatedGallery"].includes(field)) {
      data[field] = documentRelation(value);
    } else if (["seo", "motorsportPresentation", "schedule"].includes(field)) {
      data[field] = componentData(value);
    } else {
      data[field] = value;
    }
  }
  return data;
}

function relationDocumentId(value: any): string | undefined {
  return value?.documentId ?? (typeof value === "string" ? value : undefined);
}

export async function migrateMotorsportOwnership(strapi: Core.Strapi) {
  const executionMode = mode();
  if (executionMode === "off") return;
  const applyMode = executionMode === "apply" || executionMode === "navigation";
  const definitions =
    executionMode === "navigation"
      ? DEFINITIONS.filter(
          (definition) =>
            definition.dedicatedUid ===
            "api::motorsport-top-navigation-item.motorsport-top-navigation-item",
        )
      : DEFINITIONS;

  const report = { mode: executionMode, source: 0, created: 0, updated: 0, published: 0, skipped: 0, unresolvedRelations: 0, byType: {} as Record<string, { source: number; target: number }> };
  const sourceToTarget = new Map<string, string>();

  for (const definition of definitions) {
    const legacy = documentService(strapi, definition.legacyUid);
    const dedicated = documentService(strapi, definition.dedicatedUid);
    const sourceRecords: any[] = [];
    // Query locales separately instead of relying on the ordering of locale
    // "*". Strapi's i18n middleware requires the English document to be
    // created before its Indonesian localization can be created.
    for (const sourceLocale of ["en", "id"] as const) {
      const localizedRecords = await legacy.findMany({
        filters: { siteScope: { $eq: "motorsport" }, ...(definition.sourceFilter ?? {}) },
        locale: sourceLocale,
        status: "draft",
        populate: POPULATE,
      });
      sourceRecords.push(
        ...localizedRecords.map((record) => ({
          ...record,
          locale: record.locale ?? sourceLocale,
        })),
      );
    }
    report.byType[definition.dedicatedUid] = { source: sourceRecords.length, target: 0 };
    report.source += sourceRecords.length;

    for (const source of sourceRecords) {
      const locale = source.locale || "en";
      if (locale !== "en") {
        const englishTargetId = sourceToTarget.get(`${source.documentId}:en`);
        if (!englishTargetId) {
          report.skipped += 1;
          continue;
        }
        const localizedExisting = await dedicated.findFirst({
          filters: { documentId: { $eq: englishTargetId } },
          locale,
          status: "draft",
        });
        if (localizedExisting) {
          sourceToTarget.set(`${source.documentId}:${locale}`, englishTargetId);
          report.updated += 1;
          report.byType[definition.dedicatedUid].target += 1;
          continue;
        }
        if (!applyMode) continue;
        await dedicated.update({
          documentId: englishTargetId,
          locale,
          data: copyData(source, definition, locale),
          status: "draft",
        });
        sourceToTarget.set(`${source.documentId}:${locale}`, englishTargetId);
        report.created += 1;
        report.byType[definition.dedicatedUid].target += 1;
        continue;
      }

      const existing = await dedicated.findFirst({
        filters: { legacySourceDocumentId: { $eq: source.documentId } },
        locale,
        status: "draft",
      });
      if (existing) {
        sourceToTarget.set(`${source.documentId}:${locale}`, existing.documentId);
        report.updated += 1;
        report.byType[definition.dedicatedUid].target += 1;
        continue;
      }
      if (!applyMode) continue;
      const created = await dedicated.create({ data: copyData(source, definition, locale), locale, status: "draft" });
      sourceToTarget.set(`${source.documentId}:${locale}`, created.documentId);
      report.created += 1;
      report.byType[definition.dedicatedUid].target += 1;
    }
  }

  if (executionMode === "apply") {
    const eventTarget = documentService(strapi, "api::motorsport-event.motorsport-event");
    const newsTarget = documentService(strapi, "api::motorsport-news-article.motorsport-news-article");
    const ticketTarget = documentService(strapi, "api::motorsport-ticket-cta.motorsport-ticket-cta");
    const partnerTarget = documentService(strapi, "api::motorsport-partner.motorsport-partner");
    const legacyEvents = await documentService(strapi, "api::event.event").findMany({ filters: { siteScope: { $eq: "motorsport" } }, locale: "*", status: "draft", populate: ["ticketCtas", "sponsors"] });
    const legacyNews = await documentService(strapi, "api::news-article.news-article").findMany({ filters: { siteScope: { $eq: "motorsport" } }, locale: "*", status: "draft", populate: ["relatedEvent"] });
    const legacyTickets = await documentService(strapi, "api::ticket-cta.ticket-cta").findMany({ filters: { siteScope: { $eq: "motorsport" } }, locale: "*", status: "draft", populate: ["relatedEvent"] });

    for (const source of legacyNews) {
      const targetId = sourceToTarget.get(`${source.documentId}:${source.locale || "en"}`);
      const eventId = sourceToTarget.get(`${relationDocumentId(source.relatedEvent)}:${source.locale || "en"}`);
      if (targetId && eventId) await newsTarget.update({ documentId: targetId, locale: source.locale || "en", data: { relatedEvent: eventId }, status: "draft" });
      else if (source.relatedEvent) report.unresolvedRelations += 1;
    }
    for (const source of legacyTickets) {
      const targetId = sourceToTarget.get(`${source.documentId}:${source.locale || "en"}`);
      const eventId = sourceToTarget.get(`${relationDocumentId(source.relatedEvent)}:${source.locale || "en"}`);
      if (targetId && eventId) await ticketTarget.update({ documentId: targetId, locale: source.locale || "en", data: { relatedEvent: eventId }, status: "draft" });
      else if (source.relatedEvent) report.unresolvedRelations += 1;
    }
    for (const source of legacyEvents) {
      const targetId = sourceToTarget.get(`${source.documentId}:${source.locale || "en"}`);
      if (!targetId) continue;
      const sponsorIds = (source.sponsors || []).map((item: any) => sourceToTarget.get(`${relationDocumentId(item)}:${source.locale || "en"}`)).filter(Boolean);
      if (sponsorIds.length) await eventTarget.update({ documentId: targetId, locale: source.locale || "en", data: { sponsors: sponsorIds }, status: "draft" });
    }

    for (const definition of definitions) {
      const legacyPublished = await documentService(strapi, definition.legacyUid).findMany({ filters: { siteScope: { $eq: "motorsport" } }, locale: "*", status: "published" });
      const dedicated = documentService(strapi, definition.dedicatedUid);
      for (const source of legacyPublished) {
        const targetId = sourceToTarget.get(`${source.documentId}:${source.locale || "en"}`);
        if (!targetId) continue;
        await dedicated.publish({ documentId: targetId, locale: source.locale || "en" });
        report.published += 1;
      }
    }
  }

  if (executionMode === "navigation") {
    const navigation = documentService(
      strapi,
      "api::motorsport-top-navigation-item.motorsport-top-navigation-item",
    );
    for (const locale of ["en", "id"] as const) {
      const records = await navigation.findMany({ locale, status: "draft" });
      for (const record of records) {
        await navigation.publish({ documentId: record.documentId, locale });
      }
    }
  }

  strapi.log.info(`[motorsport-ownership] ${JSON.stringify(report)}`);
  if (executionMode === "apply" && report.unresolvedRelations) {
    throw new Error(`[motorsport-ownership] refused completion: ${report.unresolvedRelations} required migrated relations were unresolved`);
  }
}
