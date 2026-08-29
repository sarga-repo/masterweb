import type { Core } from "@strapi/strapi";

type MigrationMode = "off" | "dry-run" | "apply" | "verify";

const PROGRAMS_TABLE = "motorsport_programs";
const PROGRAM_COMPONENTS_TABLE = "motorsport_programs_cmps";
const FIA_SLUG = "fia-rallycross-world-cup-indonesia-2026";
const PROGRAM_UID = "api::motorsport-program.motorsport-program";

const SINGLE_TYPE_LEGACY_FIELDS = [
  ["motorsport-events-page_cmps", "eventControlSection"],
  ["motorsport-news-page_cmps", "newsControlSection"],
  ["motorsport-merchandise-page_cmps", "merchControlSection"],
  ["motorsport-tickets-page_cmps", "ticketControlSection"],
  ["motorsport-contact-page_cmps", "inquiryControlSection"],
  ["motorsport-partners-page_cmps", "partnerControlSection"],
  ["motorsport-experience-page_cmps", "experienceControlSection"],
] as const;

const COMPONENT_TABLE_BY_FIELD = {
  eventRules: "components_motorsport_rule_items",
  rundown: "components_motorsport_rundown_items",
  bannerSlides: "components_motorsport_campaign_slides",
  presentationSections: "components_motorsport_page_sections",
  eventControlSection: "components_motorsport_page_sections",
  newsControlSection: "components_motorsport_page_sections",
  merchControlSection: "components_motorsport_page_sections",
  ticketControlSection: "components_motorsport_page_sections",
  inquiryControlSection: "components_motorsport_page_sections",
  partnerControlSection: "components_motorsport_page_sections",
  experienceControlSection: "components_motorsport_page_sections",
} as const;

function mode(): MigrationMode {
  const value = process.env.MOTORSPORT_LEGACY_FIELD_RETIREMENT_MODE ?? "off";
  return ["off", "dry-run", "apply", "verify"].includes(value)
    ? (value as MigrationMode)
    : "off";
}

function uniqueNumbers(values: unknown[]) {
  return [...new Set(values.filter((value): value is number => typeof value === "number"))];
}

async function componentReferenceTables(trx: any): Promise<string[]> {
  const result = await trx("information_schema.columns")
    .select("table_name")
    .where({ table_schema: "public", column_name: "cmp_id" });
  return [...new Set(result.map((row: { table_name: string }) => row.table_name as string))] as string[];
}

async function collectLinks(trx: any, table: string, field: string, entityIds?: number[]) {
  const query = trx(table).select("id", "cmp_id").where({ field });
  if (entityIds?.length) query.whereIn("entity_id", entityIds);
  return query;
}

async function countLinks(trx: any, table: string, field: string, entityIds?: number[]) {
  const query: any = trx(table).where({ field });
  if (entityIds?.length) query.whereIn("entity_id", entityIds);
  const result = await query.count("id as count");
  return Number(result[0]?.count ?? 0);
}

/**
 * Retires only data proven to be superseded by the grouped FIA model or to be
 * an unconsumed migration-era control section. IJTC rundown remains intact.
 * The operation is opt-in and idempotent; the source backup is the rollback.
 */
export async function retireMotorsportLegacyFields(strapi: Core.Strapi) {
  const executionMode = mode();
  if (executionMode === "off") return;

  const report = await strapi.db.connection.transaction(async (trx) => {
    const programs = await trx(PROGRAMS_TABLE)
      .select("id", "slug", "program_type")
      .whereIn("slug", [FIA_SLUG]);
    const fiaIds = programs.map((program: { id: number }) => program.id);
    const ijtcIds = await trx(PROGRAMS_TABLE)
      .select("id")
      .where("program_type", "juniorTalentCup")
      .then((rows: Array<{ id: number }>) => rows.map((row) => row.id));

    const targets = [
      {
        table: PROGRAM_COMPONENTS_TABLE,
        field: "presentationSections",
        entityIds: fiaIds,
        componentTable: COMPONENT_TABLE_BY_FIELD.presentationSections,
      },
      {
        table: PROGRAM_COMPONENTS_TABLE,
        field: "eventRules",
        entityIds: fiaIds,
        componentTable: COMPONENT_TABLE_BY_FIELD.eventRules,
      },
      {
        table: PROGRAM_COMPONENTS_TABLE,
        field: "rundown",
        entityIds: fiaIds,
        componentTable: COMPONENT_TABLE_BY_FIELD.rundown,
      },
      {
        table: PROGRAM_COMPONENTS_TABLE,
        field: "bannerSlides",
        entityIds: ijtcIds,
        componentTable: COMPONENT_TABLE_BY_FIELD.bannerSlides,
      },
      ...SINGLE_TYPE_LEGACY_FIELDS.map(([table, field]) => ({
        table,
        field,
        entityIds: undefined,
        componentTable: COMPONENT_TABLE_BY_FIELD[field],
      })),
    ];

    const linksByComponentTable = new Map<string, number[]>();
    let candidateLinks = 0;
    for (const target of targets) {
      const links = await collectLinks(trx, target.table, target.field, target.entityIds);
      candidateLinks += links.length;
      const ids = links.map((link: { cmp_id: number }) => link.cmp_id);
      linksByComponentTable.set(target.componentTable, [
        ...(linksByComponentTable.get(target.componentTable) ?? []),
        ...ids,
      ]);
    }
    const heroMediaLinks = await trx("files_related_mph")
      .select("related_id", "file_id")
      .where({ related_type: PROGRAM_UID })
      .whereIn("related_id", fiaIds);
    candidateLinks += heroMediaLinks.length;

    const result = {
      mode: executionMode,
      fiaPrograms: fiaIds.length,
      ijtcPrograms: ijtcIds.length,
      candidateLinks,
      removedLinks: 0,
      removedHeroMediaLinks: 0,
      removedComponents: 0,
      remainingLinks: 0,
    };

    if (executionMode === "dry-run") return result;

    if (executionMode === "apply") {
      for (const target of targets) {
        const deleted = await trx(target.table)
          .where({ field: target.field })
          .modify((query: any) => {
            if (target.entityIds?.length) query.whereIn("entity_id", target.entityIds);
          })
          .del();
        result.removedLinks += deleted;
      }
      if (heroMediaLinks.length) {
        result.removedHeroMediaLinks = await trx("files_related_mph")
          .where({ related_type: PROGRAM_UID })
          .whereIn("related_id", fiaIds)
          .del();
      }

      const referenceTables = await componentReferenceTables(trx);
      for (const [componentTable, rawIds] of linksByComponentTable) {
        const ids = uniqueNumbers(rawIds);
        const orphanIds: number[] = [];
        for (const id of ids) {
          let referenced = false;
          for (const table of referenceTables) {
            const referenceQuery: any = trx(table);
            const row = await referenceQuery.select("cmp_id").where({ cmp_id: id }).first();
            if (row) {
              referenced = true;
              break;
            }
          }
          if (!referenced) orphanIds.push(id);
        }
        if (orphanIds.length) {
          result.removedComponents += await trx(componentTable).whereIn("id", orphanIds).del();
        }
      }
      return result;
    }

    for (const target of targets) {
      result.remainingLinks += await countLinks(
        trx,
        target.table,
        target.field,
        target.entityIds,
      );
    }
    result.remainingLinks += await trx("files_related_mph")
      .where({ related_type: PROGRAM_UID })
      .whereIn("related_id", fiaIds)
      .count("related_id as count")
      .then((rows: Array<{ count: string }>) => Number(rows[0]?.count ?? 0));
    if (result.remainingLinks > 0) {
      throw new Error(
        `[motorsport-legacy-field-retirement] verification failed: ${result.remainingLinks} legacy links remain`,
      );
    }
    return result;
  });

  strapi.log.info(`[motorsport-legacy-field-retirement] ${JSON.stringify(report)}`);
}
