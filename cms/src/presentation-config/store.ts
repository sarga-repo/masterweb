import type { Core } from "@strapi/strapi";
import {
  PRESENTATION_CONFIG_UID,
  type PresentationConfigRecord,
  type PresentationLocale,
  type PresentationMode,
  isPresentationModel,
  isSupportedLocale,
  normalizeDocumentId,
  sharedPresentationUpdateData,
} from "./contract";

type PresentationStore = {
  findOne: (params: Record<string, unknown>) => Promise<PresentationConfigRecord | null>;
  findMany: (params: Record<string, unknown>) => Promise<PresentationConfigRecord[]>;
  create: (params: Record<string, unknown>) => Promise<PresentationConfigRecord>;
  update: (params: Record<string, unknown>) => Promise<PresentationConfigRecord>;
};

function store(strapi: Core.Strapi) {
  return strapi.db.query(PRESENTATION_CONFIG_UID) as unknown as PresentationStore;
}

export function validateRequest(
  strapi: Core.Strapi,
  input: Record<string, unknown>,
) {
  const contentTypeUid =
    typeof input.contentTypeUid === "string" ? input.contentTypeUid.trim() : "";
  const documentId = normalizeDocumentId(input.documentId);
  const locale = input.locale;

  if (!isPresentationModel(strapi, contentTypeUid)) {
    throw new Error("This content type does not support shared presentation configuration.");
  }
  if (!documentId) throw new Error("A documentId is required.");
  if (!isSupportedLocale(locale)) throw new Error("Locale must be en or id.");

  return { contentTypeUid, documentId, locale };
}

async function findConfig(
  strapi: Core.Strapi,
  contentTypeUid: string,
  documentId: string,
  locale: PresentationLocale,
) {
  return store(strapi).findOne({
    where: { contentTypeUid, documentIdRef: documentId, locale },
  });
}

async function upsertConfig(
  strapi: Core.Strapi,
  input: {
    contentTypeUid: string;
    documentId: string;
    locale: PresentationLocale;
    mode: PresentationMode;
    sourceLocale?: PresentationLocale | null;
  },
) {
  const existing = await findConfig(
    strapi,
    input.contentTypeUid,
    input.documentId,
    input.locale,
  );
  const data = {
    contentTypeUid: input.contentTypeUid,
    documentIdRef: input.documentId,
    locale: input.locale,
    mode: input.mode,
    sourceLocale: input.sourceLocale ?? null,
  };

  return existing
    ? store(strapi).update({ where: { id: existing.id }, data })
    : store(strapi).create({ data });
}

async function assertLocalizedDocument(
  strapi: Core.Strapi,
  contentTypeUid: string,
  documentId: string,
  locale: PresentationLocale,
) {
  const document = await ((strapi.documents as any)(contentTypeUid) as any).findOne({
    documentId,
    locale,
    status: "draft",
    fields: ["documentId"],
  });
  if (!document) throw new Error("The requested locale does not exist for this document.");
}

export async function getPresentationStatus(
  strapi: Core.Strapi,
  input: Record<string, unknown>,
) {
  const request = validateRequest(strapi, input);
  const rows = await store(strapi).findMany({
    where: {
      contentTypeUid: request.contentTypeUid,
      documentIdRef: request.documentId,
    },
  });
  const global = rows.find((row) => row.mode === "global");
  const current = rows.find((row) => row.locale === request.locale);

  return {
    contentTypeUid: request.contentTypeUid,
    documentId: request.documentId,
    locale: request.locale,
    mode: current?.mode ?? "local",
    sourceLocale:
      current?.mode === "inherit"
        ? current.sourceLocale ?? global?.locale ?? null
        : current?.mode === "global"
          ? current.locale
          : null,
    globalLocale: global?.locale ?? null,
    availableLocales: ["en", "id"].filter((locale) =>
      rows.some((row) => row.locale === locale),
    ),
  };
}

export async function setGlobalPresentationLocale(
  strapi: Core.Strapi,
  input: Record<string, unknown>,
) {
  const request = validateRequest(strapi, input);
  await assertLocalizedDocument(strapi, request.contentTypeUid, request.documentId, request.locale);

  const rows = await store(strapi).findMany({
    where: {
      contentTypeUid: request.contentTypeUid,
      documentIdRef: request.documentId,
    },
  });

  // Keep existing inheritors attached to the newly selected source. Existing
  // local locales remain local and can be restored without data loss.
  for (const row of rows) {
    if (!row.id || row.locale === request.locale) continue;
    if (row.mode === "global") {
      await store(strapi).update({
        where: { id: row.id },
        data: { mode: "local", sourceLocale: null },
      });
    } else if (row.mode === "inherit") {
      await store(strapi).update({
        where: { id: row.id },
        data: { sourceLocale: request.locale },
      });
    }
  }

  await upsertConfig(strapi, {
    ...request,
    mode: "global",
    sourceLocale: request.locale,
  });
  return getPresentationStatus(strapi, request);
}

export async function useGlobalPresentationLocale(
  strapi: Core.Strapi,
  input: Record<string, unknown>,
) {
  const request = validateRequest(strapi, input);
  await assertLocalizedDocument(strapi, request.contentTypeUid, request.documentId, request.locale);
  const status = await getPresentationStatus(strapi, request);
  if (!status.globalLocale) throw new Error("Set a global locale before using global configuration.");
  if (status.globalLocale === request.locale) throw new Error("The global locale already uses its own configuration.");

  const service = (strapi.documents as any)(request.contentTypeUid) as any;
  const [target, source] = await Promise.all([
    service.findOne({
      documentId: request.documentId,
      locale: request.locale,
      status: "draft",
      populate: "*",
    }),
    service.findOne({
      documentId: request.documentId,
      locale: status.globalLocale,
      status: "draft",
      populate: "*",
    }),
  ]);
  if (!target || !source) {
    throw new Error("Both locale entries must exist before using global configuration.");
  }

  const data = sharedPresentationUpdateData(target, source);
  if (Object.keys(data).length > 0) {
    await service.update({
      documentId: request.documentId,
      locale: request.locale,
      status: "draft",
      data,
    });
  }

  await upsertConfig(strapi, {
    ...request,
    mode: "inherit",
    sourceLocale: status.globalLocale as PresentationLocale,
  });
  return getPresentationStatus(strapi, request);
}

export async function resetPresentationLocale(
  strapi: Core.Strapi,
  input: Record<string, unknown>,
) {
  const request = validateRequest(strapi, input);
  await assertLocalizedDocument(strapi, request.contentTypeUid, request.documentId, request.locale);
  await upsertConfig(strapi, { ...request, mode: "local", sourceLocale: null });
  return getPresentationStatus(strapi, request);
}

export async function effectiveSourceLocale(
  strapi: Core.Strapi,
  contentTypeUid: string,
  documentId: string,
  locale: PresentationLocale,
) {
  const status = await getPresentationStatus(strapi, {
    contentTypeUid,
    documentId,
    locale,
  });
  return status.mode === "inherit" && status.sourceLocale !== locale
    ? (status.sourceLocale as PresentationLocale | null)
    : null;
}

export async function effectiveSourceLocales(
  strapi: Core.Strapi,
  contentTypeUid: string,
  documentIds: string[],
  locale: PresentationLocale,
) {
  if (!documentIds.length) return new Map<string, PresentationLocale>();
  const rows = await store(strapi).findMany({
    where: {
      contentTypeUid,
      documentIdRef: { $in: documentIds },
    },
  });
  const globalLocale = rows.find((row) => row.mode === "global")?.locale;
  const sources = new Map<string, PresentationLocale>();
  for (const row of rows) {
    if (row.locale !== locale || row.mode !== "inherit") continue;
    const sourceLocale = row.sourceLocale ?? globalLocale;
    if (sourceLocale && sourceLocale !== locale) {
      sources.set(row.documentIdRef, sourceLocale);
    }
  }
  return sources;
}
