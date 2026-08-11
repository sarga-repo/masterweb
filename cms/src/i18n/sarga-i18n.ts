import type { Core } from "@strapi/strapi";
import { errors } from "@strapi/utils";

const { ValidationError } = errors;

export const SUPPORTED_LOCALES = ["en", "id"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const NAVIGATION_UID =
  "api::top-navigation-item.top-navigation-item" as const;

export const NAVIGATION_STRUCTURAL_FIELDS = [
  "internalName",
  "siteScope",
  "href",
  "linkType",
  "enabled",
  "displayOrder",
  "emphasis",
  "openInNewTab",
] as const;

export const STABLE_ROUTE_FIELDS = ["slug", "routePath"] as const;

type NavigationStructuralField = (typeof NAVIGATION_STRUCTURAL_FIELDS)[number];

type NavigationData = Partial<
  Record<NavigationStructuralField | "label" | "ariaLabel" | "locale", unknown>
>;

const LOCAL_DEVELOPMENT_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export async function ensureSargaLocales(strapi: Core.Strapi) {
  const localeService = strapi.plugin("i18n")?.service("locales");
  if (!localeService) {
    throw new Error("[Sarga i18n] Strapi i18n service is unavailable.");
  }

  const english = await localeService.findByCode("en");
  if (!english) {
    await localeService.create({ name: "English (en)", code: "en" });
    strapi.log.info("[Sarga i18n] Created English locale (en).");
  }

  const indonesian = await localeService.findByCode("id");
  if (!indonesian) {
    await localeService.create({
      name: "Bahasa Indonesia (id)",
      code: "id",
    });
    strapi.log.info("[Sarga i18n] Created Bahasa Indonesia locale (id).");
  }

  if ((await localeService.getDefaultLocale()) !== "en") {
    await localeService.setDefaultLocale({ code: "en" });
    strapi.log.info("[Sarga i18n] Restored English (en) as default locale.");
  }
}

export function validateNavigationLink(data: NavigationData) {
  if (typeof data.href !== "string" || data.href.trim().length === 0) {
    throw new ValidationError("Top Navigation href is required.");
  }

  const href = data.href.trim();
  if (/\p{C}/u.test(href) || href.includes("\\")) {
    throw new ValidationError(
      "Top Navigation href contains unsafe characters.",
    );
  }

  if (data.linkType === "internal") {
    if (!href.startsWith("/") || href.startsWith("//")) {
      throw new ValidationError(
        "Internal Top Navigation links must start with a single slash.",
      );
    }
    if (data.openInNewTab === true) {
      throw new ValidationError(
        "Internal Top Navigation links cannot open in a new tab.",
      );
    }
    return;
  }

  if (data.linkType !== "external" && data.linkType !== "crossSite") {
    throw new ValidationError("Top Navigation linkType is invalid.");
  }

  let url: URL;
  try {
    url = new URL(href);
  } catch {
    throw new ValidationError(
      "External and cross-site Top Navigation links must be absolute URLs.",
    );
  }

  const isLocalDevelopmentUrl =
    url.protocol === "http:" && LOCAL_DEVELOPMENT_HOSTS.has(url.hostname);
  if (url.protocol !== "https:" && !isLocalDevelopmentUrl) {
    throw new ValidationError(
      "External and cross-site Top Navigation links must use HTTPS.",
    );
  }
}

export function assertNavigationStructuralParity(
  data: NavigationData,
  englishMaster: NavigationData | null,
) {
  if (!englishMaster) {
    throw new ValidationError(
      "Create and save the English Top Navigation item before adding Indonesian labels.",
    );
  }

  for (const field of NAVIGATION_STRUCTURAL_FIELDS) {
    if (
      Object.prototype.hasOwnProperty.call(data, field) &&
      data[field] !== englishMaster[field]
    ) {
      throw new ValidationError(
        `Indonesian Top Navigation cannot change structural field "${field}". Edit the English master instead.`,
      );
    }
  }
}

export function assertStableLocalizedRoutes(
  data: Record<string, unknown>,
  englishMaster: Record<string, unknown> | null,
) {
  const submittedFields = STABLE_ROUTE_FIELDS.filter((field) =>
    Object.prototype.hasOwnProperty.call(data, field),
  );
  if (submittedFields.length === 0) return;
  if (!englishMaster) {
    throw new ValidationError(
      "Create and save the English document before adding an Indonesian localization.",
    );
  }
  for (const field of submittedFields) {
    if (data[field] !== englishMaster[field]) {
      throw new ValidationError(
        `Indonesian localization cannot change stable route field "${field}". Edit the English master instead.`,
      );
    }
  }
}

export function registerSargaI18nGuards(strapi: Core.Strapi) {
  strapi.documents.use(async (context, next) => {
    const documentContext = context as any;
    const contentType = documentContext.contentType;
    const action = documentContext.action as string;
    const shouldInspect =
      ["create", "update", "clone"].includes(action) ||
      (contentType?.uid === NAVIGATION_UID && action === "publish");
    if (!shouldInspect) return next();

    const params = documentContext.params ?? {};
    const data = (params.data ?? {}) as NavigationData;
    const requestContext = strapi.requestContext.get();
    const locale = resolveLocale(params, data, requestContext);
    const documentId = params.documentId as string | undefined;

    if (
      contentType?.pluginOptions?.i18n?.localized === true &&
      locale === "id" &&
      ["create", "update", "clone"].includes(action)
    ) {
      const englishMaster = documentId
        ? ((await strapi.db.query(contentType.uid).findOne({
            where: { documentId, locale: "en" },
            orderBy: [{ publishedAt: "asc" }, { updatedAt: "desc" }],
          })) as Record<string, unknown> | null)
        : null;
      assertStableLocalizedRoutes(data, englishMaster);
    }

    if (contentType?.uid !== NAVIGATION_UID) return next();

    if (["create", "update", "clone"].includes(action)) {
      const current = documentId
        ? await findNavigationVersion(strapi, documentId, locale)
        : null;
      const merged = { ...current, ...data } as NavigationData;
      validateNavigationLink(merged);

      if (locale !== "en") {
        const englishMaster = documentId
          ? await findNavigationVersion(strapi, documentId, "en")
          : null;
        assertNavigationStructuralParity(data, englishMaster);
      }

      if (locale === "en") {
        await assertUniqueNavigationIdentity(strapi, merged, documentId);
      }
    }

    if (action === "publish" && locale === "en" && documentId) {
      await assertNavigationCapacity(strapi, documentId);
    }

    return next();
  });
}

function resolveLocale(
  params: Record<string, unknown>,
  data: NavigationData,
  requestContext: any,
): SupportedLocale {
  const candidate =
    params.locale ??
    data.locale ??
    requestContext?.request?.body?.locale ??
    requestContext?.request?.query?.locale ??
    "en";

  if (candidate !== "en" && candidate !== "id") {
    throw new ValidationError(`Unsupported locale "${String(candidate)}".`);
  }
  return candidate;
}

async function findNavigationVersion(
  strapi: Core.Strapi,
  documentId: string,
  locale: SupportedLocale,
) {
  return (await strapi.db.query(NAVIGATION_UID).findOne({
    where: { documentId, locale },
    orderBy: [{ publishedAt: "asc" }, { updatedAt: "desc" }],
  })) as NavigationData | null;
}

async function assertUniqueNavigationIdentity(
  strapi: Core.Strapi,
  data: NavigationData,
  documentId?: string,
) {
  if (
    typeof data.internalName !== "string" ||
    data.internalName.trim().length < 2 ||
    typeof data.siteScope !== "string"
  ) {
    throw new ValidationError(
      "Top Navigation internalName and siteScope are required.",
    );
  }

  const matches = (await strapi.db.query(NAVIGATION_UID).findMany({
    where: {
      internalName: data.internalName.trim(),
      siteScope: data.siteScope,
      locale: "en",
    },
    select: ["documentId"],
  })) as Array<{ documentId: string }>;

  if (matches.some((entry) => entry.documentId !== documentId)) {
    throw new ValidationError(
      "Top Navigation internalName must be unique inside its site workspace.",
    );
  }
}

async function assertNavigationCapacity(
  strapi: Core.Strapi,
  documentId: string,
) {
  const candidate = (await strapi.db.query(NAVIGATION_UID).findOne({
    where: { documentId, locale: "en" },
    orderBy: [{ publishedAt: "asc" }, { updatedAt: "desc" }],
  })) as {
    enabled?: boolean;
    siteScope?: string;
  } | null;

  if (!candidate?.enabled || !candidate.siteScope) return;

  const published = (await strapi.db.query(NAVIGATION_UID).findMany({
    where: {
      locale: "en",
      siteScope: candidate.siteScope,
      enabled: true,
      publishedAt: { $notNull: true },
    },
    select: ["documentId"],
  })) as Array<{ documentId: string }>;
  const publishedDocumentIds = new Set(
    published.map((entry) => entry.documentId),
  );

  if (!publishedDocumentIds.has(documentId) && publishedDocumentIds.size >= 8) {
    throw new ValidationError(
      "A site can publish at most eight enabled Top Navigation items.",
    );
  }
}
