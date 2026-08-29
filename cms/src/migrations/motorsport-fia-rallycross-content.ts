import type { Core } from "@strapi/strapi";

const PROGRAM_UID = "api::motorsport-program.motorsport-program";
const PROGRAM_SLUG = "fia-rallycross-world-cup-indonesia-2026";

const FORMAT_ITEM_DEFAULTS = [
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
] as const;

type MigrationMode = "off" | "dry-run" | "apply" | "verify";

type DocumentService = {
  findOne: (params: Record<string, unknown>) => Promise<any>;
  update: (params: Record<string, unknown>) => Promise<any>;
};

function mode(): MigrationMode {
  const value = process.env.MOTORSPORT_FIA_GROUPING_MODE ?? "off";
  return ["off", "dry-run", "apply", "verify"].includes(value)
    ? (value as MigrationMode)
    : "off";
}

function stripComponentMetadata(value: any): any {
  if (Array.isArray(value)) return value.map(stripComponentMetadata);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([key]) =>
          !["id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale"].includes(key),
      )
      .map(([key, child]) => [key, stripComponentMetadata(child)]),
  );
}

function copyPresentation(section: any, fallback: Record<string, unknown>) {
  const source = section ?? {};
  return {
    isActive: source.isActive !== false,
    showIndex: source.showIndex !== false,
    indexLabel: source.indexLabel ?? fallback.indexLabel,
    showEyebrow: source.showEyebrow !== false,
    eyebrow: source.eyebrow ?? fallback.eyebrow,
    showTitle: source.showTitle !== false,
    title: source.title ?? fallback.title,
    showBody: source.showBody !== false,
    body: source.body ?? fallback.body,
  };
}

function findLegacySection(program: any, key: string) {
  return (program.presentationSections ?? []).find(
    (section: any) => section.sectionKey === key,
  );
}

function buildContent(program: any) {
  const format = findLegacySection(program, "format");
  const rundown = findLegacySection(program, "rundown");
  const guide = findLegacySection(program, "race-day-guide");

  return {
    formatSection: {
      ...copyPresentation(format, {
        indexLabel: "RX / FORMAT",
        eyebrow: "Mixed surface / Maximum pressure",
        title: "Every heat changes the order.",
        body: "Rallycross compresses starts, contact, strategy, and elimination into a format designed for immediate spectator energy.",
      }),
      formatItems: (format?.items?.length ? format.items : FORMAT_ITEM_DEFAULTS).map(
        (item: any) => ({
        isActive: item.isActive !== false,
        sortOrder: item.sortOrder ?? 0,
        label: item.label,
        title: item.title,
        description: item.description,
        accent: item.accent ?? "crimson",
        }),
      ),
    },
    rundownSection: {
      ...copyPresentation(rundown, {
        indexLabel: "RX / RUNDOWN",
        eyebrow: "5-6 December 2026",
        title: "Two days. One World Cup.",
        body: "Session times are managed in the Sarga CMS and remain subject to sporting or operational updates.",
      }),
      rundownItems: stripComponentMetadata(program.rundown ?? []),
    },
    raceDayGuideSection: {
      ...copyPresentation(guide, {
        indexLabel: "RX / GUIDE",
        eyebrow: "Race-day essentials",
        title: "Know before you go.",
        body: "A practical spectator guide for a smooth arrival and a safe, high-energy weekend at the circuit.",
      }),
      ruleItems: [],
    },
  };
}

function sectionCounts(content: any) {
  return {
    formatItems: content.formatSection?.formatItems?.length ?? 0,
    rundownItems: content.rundownSection?.rundownItems?.length ?? 0,
    ruleItems: content.raceDayGuideSection?.ruleItems?.length ?? 0,
  };
}

/**
 * Additive, opt-in migration from the legacy FIA presentation fields to one
 * logical FIA Rallycross editor group. The legacy fields stay intact until a
 * later, separately verified retirement phase.
 */
export async function migrateFiaRallycrossContent(strapi: Core.Strapi) {
  const migrationMode = mode();
  if (migrationMode === "off") return;

  const documents = strapi.documents as unknown as (
    uid: string,
  ) => DocumentService;
  const service = documents(PROGRAM_UID);
  const programs = await strapi.db.connection("motorsport_programs").where({
    slug: PROGRAM_SLUG,
    locale: "en",
  });

  if (!programs.length) {
    strapi.log.warn("[motorsport-fia-grouping] no FIA Rallycross programme found");
    return;
  }

  for (const program of programs) {
    const status = program.published_at ? "published" : "draft";
    const current = await service.findOne({
      documentId: program.document_id,
      locale: "en",
      status,
      populate: ["presentationSections", "rundown", "fiaRallycrossContent"],
    });
    if (!current) continue;

    const existing = current.fiaRallycrossContent;
    const content = existing ?? buildContent(current);
    const counts = sectionCounts(content);
    strapi.log.info(
      `[motorsport-fia-grouping] ${status} ${migrationMode}: ${JSON.stringify(counts)}`,
    );

    if (migrationMode === "apply" && !existing) {
      await service.update({
        documentId: program.document_id,
        locale: "en",
        status,
        data: { fiaRallycrossContent: content },
      });
      strapi.log.info(
        `[motorsport-fia-grouping] migrated ${status} FIA Rallycross content without deleting legacy fields`,
      );
    }
  }
}
