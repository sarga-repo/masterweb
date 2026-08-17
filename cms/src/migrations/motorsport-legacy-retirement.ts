import type { Core } from "@strapi/strapi";

type RetirementMode = "off" | "dry-run" | "apply" | "verify" | "restore";

type DocumentService = {
  findMany: (params?: Record<string, unknown>) => Promise<any[]>;
  unpublish: (params: Record<string, unknown>) => Promise<any>;
  publish: (params: Record<string, unknown>) => Promise<any>;
};

type RetirementEntry = {
  uid: string;
  documentId: string;
  locale: string;
  title?: string;
  slug?: string;
  routePath?: string;
  wasPublished: boolean;
};

type RetirementManifest = {
  retired: boolean;
  retiredAt?: string;
  entries: RetirementEntry[];
};

const STORE = {
  type: "plugin" as const,
  name: "sarga-motorsport",
  key: "legacy-content-retirement",
};

const LEGACY_MOTORSPORT_UIDS = [
  "api::site-page.site-page",
  "api::event.event",
  "api::leadership-person.leadership-person",
  "api::merchandise-item.merchandise-item",
  "api::news-article.news-article",
  "api::partner.partner",
  "api::ticket-cta.ticket-cta",
  "api::top-navigation-item.top-navigation-item",
] as const;

function mode(): RetirementMode {
  const value = process.env.MOTORSPORT_LEGACY_RETIREMENT_MODE ?? "off";
  return ["off", "dry-run", "apply", "verify", "restore"].includes(value)
    ? (value as RetirementMode)
    : "off";
}

function documents(strapi: Core.Strapi, uid: string) {
  return (strapi.documents as unknown as (contentType: string) => DocumentService)(uid);
}

function store(strapi: Core.Strapi) {
  return strapi.store(STORE);
}

async function readManifest(strapi: Core.Strapi): Promise<RetirementManifest> {
  const value = await store(strapi).get();
  if (!value || typeof value !== "object") return { retired: false, entries: [] };
  const candidate = value as Partial<RetirementManifest>;
  return {
    retired: candidate.retired === true,
    retiredAt: candidate.retiredAt,
    entries: Array.isArray(candidate.entries) ? candidate.entries : [],
  };
}

/** Used by the demo seed to ensure archived records are never recreated. */
export async function isMotorsportLegacyContentRetired(strapi: Core.Strapi) {
  return (await readManifest(strapi)).retired;
}

export async function retireMotorsportLegacyContent(strapi: Core.Strapi) {
  const executionMode = mode();
  if (executionMode === "off") return;

  const manifest = await readManifest(strapi);
  const report = {
    mode: executionMode,
    candidates: 0,
    archived: 0,
    restored: 0,
    remainingPublished: 0,
  };

  if (executionMode === "restore") {
    for (const entry of manifest.entries) {
      const service = documents(strapi, entry.uid);
      if (entry.wasPublished) {
        await service.publish({ documentId: entry.documentId, locale: entry.locale });
      }
      report.restored += 1;
    }
    await store(strapi).set({ value: { retired: false, entries: manifest.entries } });
    strapi.log.info(`[motorsport-legacy-retirement] ${JSON.stringify(report)}`);
    return;
  }

  // In Strapi v5, a draft document read does not consistently include
  // `publishedAt` for its published counterpart. Read both states and merge
  // them by document + locale so the archive operation cannot leave a
  // published legacy record behind.
  const candidateMap = new Map<string, RetirementEntry>();
  for (const uid of LEGACY_MOTORSPORT_UIDS) {
    for (const status of ["draft", "published"] as const) {
      const records = await documents(strapi, uid).findMany({
        filters: { siteScope: { $eq: "motorsport" } },
        locale: "*",
        status,
        limit: 1_000,
      });
      for (const record of records) {
        const locale = record.locale || "en";
        const key = `${uid}:${record.documentId}:${locale}`;
        const existing = candidateMap.get(key);
        candidateMap.set(key, {
          uid,
          documentId: record.documentId,
          locale,
          title: record.title || record.name || record.internalName,
          slug: record.slug,
          routePath: record.routePath,
          wasPublished: Boolean(existing?.wasPublished || status === "published"),
        });
      }
    }
  }
  const candidates = [...candidateMap.values()];
  report.candidates = candidates.length;

  if (executionMode === "apply") {
    for (const entry of candidates) {
      const service = documents(strapi, entry.uid);
      if (entry.wasPublished) {
        await service.unpublish({
          documentId: entry.documentId,
          locale: entry.locale,
        });
      }
      report.archived += 1;
    }
    await store(strapi).set({
      value: {
        retired: true,
        retiredAt: new Date().toISOString(),
        entries: candidates,
      } satisfies RetirementManifest,
    });
  }

  if (executionMode === "verify") {
    for (const uid of LEGACY_MOTORSPORT_UIDS) {
      const remaining = await documents(strapi, uid).findMany({
        filters: { siteScope: { $eq: "motorsport" } },
        locale: "*",
        status: "published",
        limit: 1_000,
      });
      report.remainingPublished += remaining.length;
    }
    if (!manifest.retired || report.remainingPublished > 0) {
      throw new Error(
        `[motorsport-legacy-retirement] verification failed: retired=${manifest.retired}, published=${report.remainingPublished}`,
      );
    }
  }

  strapi.log.info(`[motorsport-legacy-retirement] ${JSON.stringify(report)}`);
}
