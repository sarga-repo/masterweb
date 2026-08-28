import type { Core } from "@strapi/strapi";

const PROGRAM_UID = "api::motorsport-program.motorsport-program";
const PROGRAM_SLUG = "fia-rallycross-world-cup-indonesia-2026";

type DocumentService = {
  update: (params: Record<string, unknown>) => Promise<any>;
};

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

const SECTION_KEYS_BY_LABEL: Record<string, string> = {
  "RX / FORMAT": "format",
  "RX / RUNDOWN": "rundown",
  "RX / GUIDE": "race-day-guide",
};

/**
 * Repeatable components are linked through a join table. Removing duplicate
 * links directly is intentional here: sending id-less component arrays to a
 * Strapi document update appends new components instead of replacing the old
 * ones. The retained component is the first in CMS order, unless a duplicate
 * is explicitly hidden; hidden wins so an editor's choice is never lost.
 */
async function normalizePresentationLinks(
  strapi: Core.Strapi,
  entityId: number,
) {
  const database = strapi.db.connection;
  return database.transaction(async (transaction) => {
    const links = await transaction("motorsport_programs_cmps")
      .where({
        entity_id: entityId,
        field: "presentationSections",
        component_type: "motorsport.page-section",
      })
      .orderBy([
        { column: "order", order: "asc" },
        { column: "id", order: "asc" },
      ]);

    if (!links.length) return { hasSections: false, removed: 0 };

    const components = await transaction("components_motorsport_page_sections")
      .whereIn(
        "id",
        links.map((link: any) => link.cmp_id),
      )
      .select(["id", "section_key", "index_label", "is_active"]);
    const componentsById = new Map(
      components.map((component: any) => [component.id, component]),
    );
    const groups = new Map<string, any[]>();

    for (const link of links) {
      const component = componentsById.get(link.cmp_id);
      if (!component) continue;
      const sectionKey =
        component.section_key ||
        SECTION_KEYS_BY_LABEL[component.index_label] ||
        `legacy-${component.id}`;
      const group = groups.get(sectionKey) ?? [];
      group.push({ link, component, sectionKey });
      groups.set(sectionKey, group);
    }

    const groupsInOrder = [...groups.values()].sort(
      (a, b) => Number(a[0].link.order) - Number(b[0].link.order),
    );
    const removeLinkIds: number[] = [];
    const removeComponentIds: number[] = [];

    for (const [index, group] of groupsInOrder.entries()) {
      const selected =
        group.find((item: any) => item.component.is_active === false) ??
        group[0];
      await transaction("components_motorsport_page_sections")
        .where({ id: selected.component.id })
        .update({ section_key: selected.sectionKey });
      await transaction("motorsport_programs_cmps")
        .where({ id: selected.link.id })
        .update({ order: index + 1 });

      for (const item of group) {
        if (item.link.id !== selected.link.id) {
          removeLinkIds.push(item.link.id);
          removeComponentIds.push(item.component.id);
        }
      }
    }

    if (removeLinkIds.length) {
      await transaction("motorsport_programs_cmps")
        .whereIn("id", removeLinkIds)
        .del();
      await transaction("components_motorsport_page_sections")
        .whereIn("id", removeComponentIds)
        .del();
    }

    return { hasSections: true, removed: removeLinkIds.length };
  });
}

/** Creates the editable campaign sections when an older FIA record has none. */
export async function ensureFiaPresentation(strapi: Core.Strapi) {
  const documents = strapi.documents as unknown as (
    uid: string,
  ) => DocumentService;
  const service = documents(PROGRAM_UID);
  const programs = await strapi.db.connection("motorsport_programs").where({
    slug: PROGRAM_SLUG,
    locale: "en",
  });

  if (!programs.length) return;

  for (const program of programs) {
    const normalized = await normalizePresentationLinks(strapi, program.id);
    if (normalized.hasSections) {
      if (normalized.removed) {
        strapi.log.info(
          `[motorsport-fia] removed ${normalized.removed} duplicate presentation section links from ${program.published_at ? "published" : "draft"} content`,
        );
      }
      continue;
    }

    await service.update({
      documentId: program.document_id,
      locale: "en",
      status: program.published_at ? "published" : "draft",
      data: {
        presentationSections: sectionDefaults,
      },
    });

    strapi.log.info(
      `[motorsport-fia] created editable presentation sections for ${program.published_at ? "published" : "draft"} content`,
    );
  }
}
