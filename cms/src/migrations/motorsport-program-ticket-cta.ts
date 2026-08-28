import type { Core } from "@strapi/strapi";

const SOURCE_RELATION_TABLE = "motorsport_programs_related_ticket_ctas_lnk";
const MIGRATION_VERSION = 2;
const MIGRATION_STORE = {
  type: "plugin" as const,
  name: "sarga-motorsport",
  key: "program-ticket-cta-relation-migration",
};

type JsonObject = Record<string, any>;

type DocumentService = {
  findFirst: (params?: Record<string, unknown>) => Promise<any>;
  findMany: (params?: Record<string, unknown>) => Promise<any[]>;
  create: (params: Record<string, unknown>) => Promise<any>;
  update: (params: Record<string, unknown>) => Promise<any>;
  publish: (params: Record<string, unknown>) => Promise<any>;
};

type RelationLink = {
  id: number;
  motorsport_program_id: number;
  ticket_cta_id: number;
  ticket_cta_ord?: number;
};

type ProgramRow = {
  id: number;
  document_id: string;
  locale?: string;
  published_at?: string | null;
};

type TicketRow = {
  id: number;
  document_id: string;
  locale?: string;
  published_at?: string | null;
  title?: string;
};

const TICKET_FIELDS = [
  "title",
  "label",
  "provider",
  "eyebrow",
  "description",
  "eventLabel",
  "eventText",
  "providerLabel",
  "providerText",
  "partnerLabel",
  "footerText",
  "ctaLabel",
  "ctaType",
  "url",
  "embedCode",
  "embedConfigJson",
  "trackingParams",
  "activeFrom",
  "activeUntil",
  "isActive",
  "image",
  "backgroundImage",
  "backgroundImageMobile",
] as const;

function documents(strapi: Core.Strapi, uid: string) {
  return (strapi.documents as unknown as (contentType: string) => DocumentService)(uid);
}

function db(strapi: Core.Strapi): any {
  return (strapi.db as any).connection;
}

function resultRows<T>(result: any): T[] {
  return (result?.rows ?? result) as T[];
}

function mediaId(value: any) {
  if (!value) return value;
  if (Array.isArray(value)) return value.map(mediaId).filter(Boolean);
  return typeof value === "object" ? value.id : value;
}

function copyTicketData(source: JsonObject) {
  const data: JsonObject = {
    legacySourceDocumentId: source.documentId,
  };
  for (const field of TICKET_FIELDS) {
    const value = source[field];
    if (value === undefined || value === null) continue;
    data[field] = ["image", "backgroundImage", "backgroundImageMobile"].includes(field)
      ? mediaId(value)
      : value;
  }
  return data;
}

async function findOrCreateDedicatedTicket(
  strapi: Core.Strapi,
  sourceRow: TicketRow,
) {
  const sourceStatus = sourceRow.published_at ? "published" : "draft";
  const source = await documents(strapi, "api::ticket-cta.ticket-cta").findFirst({
    filters: { documentId: { $eq: sourceRow.document_id } },
    locale: sourceRow.locale || "en",
    status: sourceStatus,
    populate: "*",
  });
  const dedicated = documents(
    strapi,
    "api::motorsport-ticket-cta.motorsport-ticket-cta",
  );
  const existing = await dedicated.findFirst({
    filters: {
      legacySourceDocumentId: { $eq: sourceRow.document_id },
    },
    locale: sourceRow.locale || "en",
    status: "draft",
  });
  const fallback = existing || (sourceRow.title
    ? await dedicated.findFirst({
        filters: { title: { $eq: sourceRow.title } },
        locale: sourceRow.locale || "en",
        status: "draft",
      })
    : null);

  let documentId = fallback?.documentId as string | undefined;
  if (!documentId) {
    if (!source) return null;
    const created = await dedicated.create({
      data: copyTicketData(source),
      locale: sourceRow.locale || "en",
      status: "draft",
    });
    documentId = created.documentId;
  }

  if (sourceStatus === "published") {
    await dedicated.publish({
      documentId,
      locale: sourceRow.locale || "en",
    });
  }
  return documentId;
}

function normalizeTitle(value: string | undefined) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[—–]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function ticketProgramTitle(title: string | undefined) {
  return normalizeTitle(title).replace(/\s+(tickets?|passes?)$/, "");
}

async function recoverRelationsByContent(
  strapi: Core.Strapi,
) {
  const dedicated = documents(
    strapi,
    "api::motorsport-ticket-cta.motorsport-ticket-cta",
  );
  const programService = documents(
    strapi,
    "api::motorsport-program.motorsport-program",
  );
  const programs = await programService.findMany({
    locale: "*",
    status: "draft",
    populate: ["relatedEvents"],
  });
  const publishedPrograms = await programService.findMany({
    locale: "*",
    status: "published",
  });
  const publishedProgramKeys = new Set(
    publishedPrograms.map((program: any) => `${program.documentId}:${program.locale || "en"}`),
  );
  const tickets = await dedicated.findMany({
    locale: "*",
    status: "draft",
    populate: ["relatedEvent", "relatedProgram"],
  });
  const publishedTickets = await dedicated.findMany({
    locale: "*",
    status: "published",
  });
  const publishedTicketKeys = new Set(
    publishedTickets.map((ticket: any) => `${ticket.documentId}:${ticket.locale || "en"}`),
  );
  let recovered = 0;

  for (const ticket of tickets) {
    if (ticket.relatedProgram?.documentId) continue;
    const ticketTitle = ticketProgramTitle(ticket.title);
    const relatedEventTitle = normalizeTitle(ticket.relatedEvent?.title);
    const program = programs.find((candidate: any) => {
      if ((candidate.locale || "en") !== (ticket.locale || "en")) return false;
      const programTitle = normalizeTitle(candidate.title);
      const eventTitles = (candidate.relatedEvents ?? []).map((event: any) => normalizeTitle(event.title));
      return (
        ticketTitle === programTitle ||
        (relatedEventTitle.length > 0 && relatedEventTitle === programTitle) ||
        eventTitles.includes(relatedEventTitle)
      );
    });
    if (!program) continue;

    await dedicated.update({
      documentId: ticket.documentId,
      locale: ticket.locale || "en",
      data: { relatedProgram: program.documentId },
      status: "draft",
    });
    if (
      publishedTicketKeys.has(`${ticket.documentId}:${ticket.locale || "en"}`) &&
      publishedProgramKeys.has(`${program.documentId}:${program.locale || "en"}`)
    ) {
      await dedicated.publish({
        documentId: ticket.documentId,
        locale: ticket.locale || "en",
      });
    }
    recovered += 1;
  }

  strapi.log.info(`[motorsport-program-ticket-cta] recovered ${recovered} relation(s) by content identity`);
  return recovered;
}

/** Moves Motorsport Program ticket relations to the dedicated CTA collection. */
export async function migrateMotorsportProgramTicketCtas(strapi: Core.Strapi) {
  const store = strapi.store(MIGRATION_STORE);
  const marker = await store.get();
  if (
    (marker as JsonObject | null)?.completed === true &&
    (marker as JsonObject | null)?.version === MIGRATION_VERSION
  ) return;

  const connection = db(strapi);
  const hasSourceTable = await connection.schema.hasTable(SOURCE_RELATION_TABLE);
  if (!hasSourceTable) {
    const recovered = await recoverRelationsByContent(strapi);
    await store.set({ value: { completed: true, version: MIGRATION_VERSION, migrated: recovered } });
    return;
  }

  const links = resultRows<RelationLink>(
    await connection(SOURCE_RELATION_TABLE).select(
      "id",
      "motorsport_program_id",
      "ticket_cta_id",
      "ticket_cta_ord",
    ),
  );
  if (links.length === 0) {
    const recovered = await recoverRelationsByContent(strapi);
    await store.set({ value: { completed: true, version: MIGRATION_VERSION, migrated: recovered } });
    return;
  }

  const programIds = [...new Set(links.map((link) => link.motorsport_program_id))];
  const ticketIds = [...new Set(links.map((link) => link.ticket_cta_id))];
  const programs = await connection("motorsport_programs")
    .whereIn("id", programIds)
    .select("id", "document_id", "locale", "published_at");
  const tickets = await connection("ticket_ctas")
    .whereIn("id", ticketIds)
    .select("id", "document_id", "locale", "published_at", "title");
  const programById = new Map<number, ProgramRow>(programs.map((row: ProgramRow) => [row.id, row]));
  const ticketById = new Map<number, TicketRow>(tickets.map((row: TicketRow) => [row.id, row]));
  const dedicated = documents(
    strapi,
    "api::motorsport-ticket-cta.motorsport-ticket-cta",
  );
  const migratedTargetIds = new Set<string>();
  let migrated = 0;
  const unresolved: number[] = [];

  for (const link of links) {
    const program = programById.get(link.motorsport_program_id);
    const ticket = ticketById.get(link.ticket_cta_id);
    if (!program || !ticket) {
      unresolved.push(link.id);
      continue;
    }
    const targetDocumentId = await findOrCreateDedicatedTicket(strapi, ticket);
    if (!targetDocumentId) {
      unresolved.push(link.id);
      continue;
    }
    const targetKey = `${targetDocumentId}:${ticket.locale || "en"}`;
    if (migratedTargetIds.has(targetKey)) {
      unresolved.push(link.id);
      continue;
    }
    await dedicated.update({
      documentId: targetDocumentId,
      locale: ticket.locale || "en",
      data: { relatedProgram: program.document_id },
      status: "draft",
    });
    if (program.published_at && ticket.published_at) {
      await dedicated.publish({
        documentId: targetDocumentId,
        locale: ticket.locale || "en",
      });
    }
    migratedTargetIds.add(targetKey);
    migrated += 1;
  }

  if (unresolved.length > 0) {
    throw new Error(
      `[motorsport-program-ticket-cta] unresolved legacy relation links: ${unresolved.join(", ")}`,
    );
  }

  // The owning relation is now `Motorsport Ticket CTA.relatedProgram`; the old
  // generic many-to-many join rows must not remain as a second source of truth.
  await connection(SOURCE_RELATION_TABLE).del();
  await store.set({ value: { completed: true, version: MIGRATION_VERSION, migrated } });
  strapi.log.info(`[motorsport-program-ticket-cta] migrated ${migrated} relation(s)`);
}
