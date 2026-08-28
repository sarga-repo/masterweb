import type { Core } from "@strapi/strapi";

const PROGRAM_UID = "api::motorsport-program.motorsport-program";
const PROGRAM_SLUG = "fia-rallycross-world-cup-indonesia-2026";

type DocumentService = {
  findFirst: (params?: Record<string, unknown>) => Promise<any>;
  update: (params: Record<string, unknown>) => Promise<any>;
};

function visibleItems(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  return value.map((item: any) => ({
    ...componentData(item),
    isActive: item?.isActive !== false,
  }));
}

const sectionDefaults = [
  {
    sectionKey: "format",
    isActive: true,
    showIndex: true,
    indexLabel: "RX / FORMAT",
    showEyebrow: true,
    showTitle: true,
    showBody: true,
    showMedia: true,
    showCta: true,
    eyebrow: "Mixed surface / Maximum pressure",
    title: "Every heat changes the order.",
    body: "Rallycross compresses starts, contact, strategy, and elimination into a format designed for immediate spectator energy.",
    items: [
      {
        isActive: true,
        sortOrder: 0,
        label: "01",
        title: "Launch",
        description:
          "Multiple cars attack the first corner together, turning reaction time into instant track position.",
        accent: "crimson",
      },
      {
        isActive: true,
        sortOrder: 1,
        label: "02",
        title: "Joker lap",
        description:
          "Every driver must take the alternate route, creating a strategy window that can reverse the running order.",
        accent: "orange",
      },
      {
        isActive: true,
        sortOrder: 2,
        label: "03",
        title: "Final",
        description:
          "The fastest qualifiers advance through elimination races into one decisive World Cup showdown.",
        accent: "teal",
      },
    ],
  },
  {
    sectionKey: "rundown",
    isActive: true,
    showIndex: true,
    indexLabel: "RX / RUNDOWN",
    showEyebrow: true,
    showTitle: true,
    showBody: true,
    showMedia: true,
    showCta: true,
    eyebrow: "5-6 December 2026",
    title: "Two days. One World Cup.",
    body: "Session times are managed in the Sarga CMS and remain subject to sporting or operational updates.",
  },
  {
    sectionKey: "race-day-guide",
    isActive: true,
    showIndex: true,
    indexLabel: "RX / GUIDE",
    showEyebrow: true,
    showTitle: true,
    showBody: true,
    showMedia: true,
    showCta: true,
    eyebrow: "Race-day essentials",
    title: "Know before you go.",
    body: "A practical spectator guide for a smooth arrival and a safe, high-energy weekend at the circuit.",
  },
] as const;

function componentData(value: any): any {
  if (Array.isArray(value)) return value.map(componentData);
  if (!value || typeof value !== "object") return value;
  if ("mime" in value && "id" in value) return value.id;
  if ("documentId" in value && value.documentId) return value.documentId;
  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([key]) =>
          ![
            "id",
            "documentId",
            "createdAt",
            "updatedAt",
            "publishedAt",
            "locale",
          ].includes(key),
      )
      .map(([key, child]) => [key, componentData(child)]),
  );
}

/** Creates the editable campaign sections when an older FIA record has none. */
export async function ensureFiaPresentation(strapi: Core.Strapi) {
  const documents = strapi.documents as unknown as (
    uid: string,
  ) => DocumentService;
  const service = documents(PROGRAM_UID);
  const program = await service.findFirst({
    filters: { slug: { $eq: PROGRAM_SLUG } },
    locale: "en",
    status: "published",
    populate: ["presentationSections", "rundown", "eventRules"],
  });

  if (!program) return;

  const existingKeys = new Set(
    (program.presentationSections ?? [])
      .map((section: any) => section.sectionKey)
      .filter(Boolean),
  );
  const missingSections = sectionDefaults.filter(
    (section) => !existingKeys.has(section.sectionKey),
  );
  if (!missingSections.length) return;

  await service.update({
    documentId: program.documentId,
    locale: "en",
    status: "published",
    data: {
      presentationSections: [
        ...(program.presentationSections ?? []).map(componentData),
        ...missingSections,
      ],
      ...(visibleItems(program.rundown)
        ? { rundown: visibleItems(program.rundown) }
        : {}),
      ...(visibleItems(program.eventRules)
        ? { eventRules: visibleItems(program.eventRules) }
        : {}),
    },
  });

  strapi.log.info(
    `[motorsport-fia] created editable presentation sections: ${missingSections.map((section) => section.sectionKey).join(", ")}`,
  );
}
