import type { Core } from "@strapi/strapi";
import {
  isPresentationModel,
  isSupportedLocale,
  mergeSharedPresentationFields,
} from "../presentation-config/contract";
import { effectiveSourceLocales } from "../presentation-config/store";

function contentTypeForPath(strapi: Core.Strapi, path: string) {
  const pluralName = path.match(/^\/api\/([^/]+)/)?.[1];
  if (!pluralName) return null;
  return (
    Object.entries(strapi.contentTypes).find(
      ([uid, model]: [string, any]) =>
        uid.startsWith("api::") &&
        (model.info?.pluralName === pluralName ||
          model.info?.singularName === pluralName),
    )?.[0] ?? null
  );
}

async function mergeEntry(
  strapi: Core.Strapi,
  uid: string,
  entry: unknown,
  sourceLocale: "en" | "id" | undefined,
  status: "draft" | "published",
) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) return entry;
  const record = entry as Record<string, unknown>;
  const documentId = record.documentId;
  if (typeof documentId !== "string" || !documentId) return entry;

  if (!sourceLocale) return entry;

  const source = await ((strapi.documents as any)(uid) as any).findOne({
    documentId,
    locale: sourceLocale,
    status,
    populate: "*",
  });
  return source ? mergeSharedPresentationFields(record, source) : entry;
}

export default (_config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    await next();
    // Only rewrite public Content API responses. Admin Content Manager calls
    // use /content-manager/* and therefore always show the actual locale data.
    if (!ctx.path.startsWith("/api/") || !ctx.body?.data) return;
    const uid = contentTypeForPath(strapi, ctx.path);
    if (!uid || !isPresentationModel(strapi, uid)) return;

    const locale = ctx.query?.locale;
    if (!isSupportedLocale(locale)) return;
    const status = ctx.query?.status === "draft" ? "draft" : "published";
    if (Array.isArray(ctx.body.data)) {
      const entries = ctx.body.data as unknown[];
      const documentIds = entries.flatMap((entry) => {
        if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
        const documentId = (entry as Record<string, unknown>).documentId;
        return typeof documentId === "string" && documentId ? [documentId] : [];
      });
      const sourceLocales = await effectiveSourceLocales(
        strapi,
        uid,
        documentIds,
        locale,
      );
      ctx.body.data = await Promise.all(
        entries.map((entry: unknown) => {
          const documentId =
            entry && typeof entry === "object" && !Array.isArray(entry)
              ? (entry as Record<string, unknown>).documentId
              : undefined;
          return mergeEntry(
            strapi,
            uid,
            entry,
            typeof documentId === "string"
              ? sourceLocales.get(documentId)
              : undefined,
            status,
          );
        }),
      );
    } else {
      const documentId =
        typeof ctx.body.data === "object" && ctx.body.data
          ? (ctx.body.data as Record<string, unknown>).documentId
          : undefined;
      const sourceLocales = await effectiveSourceLocales(
        strapi,
        uid,
        typeof documentId === "string" ? [documentId] : [],
        locale,
      );
      ctx.body.data = await mergeEntry(
        strapi,
        uid,
        ctx.body.data,
        typeof documentId === "string" ? sourceLocales.get(documentId) : undefined,
        status,
      );
    }
  };
};
