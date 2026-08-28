import type { Core } from "@strapi/strapi";

const PROGRAM_UID = "api::motorsport-program.motorsport-program";
const PROGRAM_SLUG = "indonesia-junior-talent-cup";
const HERO_MEDIA_NAME = "motorcycle-racing-dusk.png";

type DocumentService = {
  findFirst: (params?: Record<string, unknown>) => Promise<any>;
  update: (params: Record<string, unknown>) => Promise<any>;
};

function componentData(value: any): any {
  if (Array.isArray(value)) return value.map(componentData);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !["id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale"].includes(key))
      .map(([key, child]) => [key, componentData(child)]),
  );
}

function visibleItems(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => ({
    ...componentData(item),
    isActive: (item as any)?.isActive !== false,
  }));
}

/**
 * Restores the original IJTC demo presentation in environments where the
 * programme was seeded before its CMS presentation component was introduced.
 * Existing editor-managed presentation content is deliberately preserved.
 */
export async function ensureIjtcPresentation(strapi: Core.Strapi) {
  const documents = strapi.documents as unknown as (uid: string) => DocumentService;
  const service = documents(PROGRAM_UID);
  const program = await service.findFirst({
    filters: { slug: { $eq: PROGRAM_SLUG } },
    locale: "en",
    status: "published",
    populate: ["motorsportPresentation", "rundown", "eventRules"],
  });

  if (!program || program.motorsportPresentation) return;

  const media = await strapi.db.query("plugin::upload.file").findOne({
    where: { name: HERO_MEDIA_NAME },
    select: ["id"],
  });

  if (!media?.id) {
    strapi.log.warn(
      `[motorsport-ijtc] skipped presentation repair: ${HERO_MEDIA_NAME} is not uploaded`,
    );
    return;
  }

  await service.update({
    documentId: program.documentId,
    locale: "en",
    status: "published",
    data: {
      ...(visibleItems(program.rundown)
        ? { rundown: visibleItems(program.rundown) }
        : {}),
      ...(visibleItems(program.eventRules)
        ? { eventRules: visibleItems(program.eventRules) }
        : {}),
      motorsportPresentation: {
        routeKey: "ijtc",
        hero: {
          isActive: true,
          showEyebrow: true,
          showTitle: true,
          showDescription: true,
          showMedia: true,
          showMetricGroup: true,
          eyebrow: "IJTC / 2026 Season",
          title: "- The next generation - starts here.",
          description:
            "A development program for Indonesia’s next generation of motorcycle racing talent, combining structured race rounds, rider development, standings, and clear sporting regulations.",
          backgroundMedia: media.id,
        },
        informationBand: {
          isActive: true,
          showEyebrow: true,
          showTitle: true,
          showDescription: true,
          showMetricGroup: true,
          title: "Indonesia Junior Talent Cup",
          metrics: [],
        },
      },
    },
  });

  strapi.log.info(
    `[motorsport-ijtc] restored published presentation using ${HERO_MEDIA_NAME}`,
  );
}
