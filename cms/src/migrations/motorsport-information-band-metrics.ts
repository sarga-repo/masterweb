import type { Core } from "@strapi/strapi";

type DocumentService = {
  findMany: (params?: Record<string, unknown>) => Promise<any[]>;
  update: (params: Record<string, unknown>) => Promise<any>;
};

const PAGE_DEFINITIONS = [
  {
    uid: "api::motorsport-about-page.motorsport-about-page",
    title: "Competition creates the moment.",
    description:
      "Professional competition, talent development, event experience, and media move the Sarga Motorsport platform forward.",
    metrics: [
      { label: "Property", value: "Motorsport" },
      { label: "Region", value: "Indonesia" },
      { label: "Standard", value: "International" },
    ],
  },
  {
    uid: "api::motorsport-tickets-page.motorsport-tickets-page",
    title: "Your seat. Their secure checkout.",
    description:
      "Sarga Motorsport publishes approved destinations but never stores payment details or runs an internal ticket engine.",
    metrics: [
      { label: "Checkout", value: "Partner" },
      { label: "Payment", value: "External" },
      { label: "Support", value: "Available" },
    ],
  },
] as const;

const statuses = ["draft", "published"] as const;

function documents(strapi: Core.Strapi, uid: string) {
  return (
    strapi.documents as unknown as (contentType: string) => DocumentService
  )(uid);
}

function componentData(value: any): any {
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([key]) =>
          !["id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale"].includes(
            key,
          ),
      )
      .map(([key, child]) => [key, componentData(child)]),
  );
}

function hasMetrics(value: any) {
  return Array.isArray(value?.metrics) && value.metrics.length > 0;
}

/**
 * Repairs dedicated About/Tickets information bands created before their
 * metric component values were migrated. The operation only fills an empty
 * metrics array; editor-managed metrics and visibility values are preserved.
 */
export async function ensureMotorsportInformationBandMetrics(strapi: Core.Strapi) {
  for (const definition of PAGE_DEFINITIONS) {
    const service = documents(strapi, definition.uid);

    for (const status of statuses) {
      const records = await service.findMany({
        locale: "*",
        status,
        // Metrics are a nested repeatable component relation. Populate them
        // before checking whether the band needs a repair; otherwise every
        // restart sees an empty metrics array and writes the same data again.
        populate: ["informationBand.metrics"],
      });

      for (const record of records) {
        if (!record.informationBand || hasMetrics(record.informationBand)) continue;

        const existing = componentData(record.informationBand);
        await service.update({
          documentId: record.documentId,
          locale: record.locale || "en",
          status,
          data: {
            informationBand: {
              ...existing,
              isActive: existing.isActive !== false,
              showEyebrow: existing.showEyebrow !== false,
              showTitle: existing.showTitle !== false,
              showDescription: existing.showDescription !== false,
              showMetricGroup: existing.showMetricGroup !== false,
              title: existing.title || definition.title,
              description: existing.description || definition.description,
              metrics: definition.metrics.map((metric) => ({
                ...metric,
                isActive: true,
              })),
            },
          },
        });

        strapi.log.info(
          `[motorsport-information-band] backfilled metrics for ${definition.uid} ${record.documentId}:${record.locale || "en"} (${status})`,
        );
      }
    }
  }
}
