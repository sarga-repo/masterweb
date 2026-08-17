import type { Core } from "@strapi/strapi";

export const MOTORSPORT_APPROVED_PAGE_PATHS = [
  "/",
  "/about",
  "/events",
  "/news",
  "/gallery",
  "/merchandise",
  "/tickets",
  "/contact",
  "/partners",
  "/experience",
] as const;

export type MotorsportApprovedPagePath =
  (typeof MOTORSPORT_APPROVED_PAGE_PATHS)[number];

export const MOTORSPORT_PAGE_ROUTE_DEFINITIONS = [
  { uid: "api::motorsport-home-page.motorsport-home-page", endpoint: "motorsport-home-page", defaultPath: "/" },
  { uid: "api::motorsport-about-page.motorsport-about-page", endpoint: "motorsport-about-page", defaultPath: "/about" },
  { uid: "api::motorsport-events-page.motorsport-events-page", endpoint: "motorsport-events-page", defaultPath: "/events" },
  { uid: "api::motorsport-news-page.motorsport-news-page", endpoint: "motorsport-news-page", defaultPath: "/news" },
  { uid: "api::motorsport-gallery-page.motorsport-gallery-page", endpoint: "motorsport-gallery-page", defaultPath: "/gallery" },
  { uid: "api::motorsport-merchandise-page.motorsport-merchandise-page", endpoint: "motorsport-merchandise-page", defaultPath: "/merchandise" },
  { uid: "api::motorsport-tickets-page.motorsport-tickets-page", endpoint: "motorsport-tickets-page", defaultPath: "/tickets" },
  { uid: "api::motorsport-contact-page.motorsport-contact-page", endpoint: "motorsport-contact-page", defaultPath: "/contact" },
  { uid: "api::motorsport-partners-page.motorsport-partners-page", endpoint: "motorsport-partners-page", defaultPath: "/partners" },
  { uid: "api::motorsport-experience-page.motorsport-experience-page", endpoint: "motorsport-experience-page", defaultPath: "/experience" },
] as const satisfies ReadonlyArray<{
  uid: string;
  endpoint: string;
  defaultPath: MotorsportApprovedPagePath;
}>;

type DocumentService = {
  findFirst: (params?: Record<string, unknown>) => Promise<any>;
  findMany: (params?: Record<string, unknown>) => Promise<any[]>;
  update: (params: Record<string, unknown>) => Promise<any>;
};

const pathSet = new Set<string>(MOTORSPORT_APPROVED_PAGE_PATHS);

export function isApprovedMotorsportPagePath(
  path: unknown,
): path is MotorsportApprovedPagePath {
  return typeof path === "string" && pathSet.has(path);
}

function documentIdFrom(params: Record<string, any>) {
  return params.documentId ?? params.where?.documentId;
}

function normalizedAliases(value: unknown) {
  return Array.isArray(value)
    ? value.filter((path): path is MotorsportApprovedPagePath =>
        isApprovedMotorsportPagePath(path),
      )
    : [];
}

async function existingDocument(
  strapi: Core.Strapi,
  uid: string,
  documentId?: string,
) {
  if (!documentId) return null;
  const documents = strapi.documents as unknown as (uid: string) => DocumentService;
  return documents(uid).findFirst({ documentId, locale: "en", status: "draft" });
}

async function assertPathAvailable(
  strapi: Core.Strapi,
  path: MotorsportApprovedPagePath,
  currentUid: string,
  currentDocumentId?: string,
) {
  const documents = strapi.documents as unknown as (uid: string) => DocumentService;
  for (const definition of MOTORSPORT_PAGE_ROUTE_DEFINITIONS) {
    const entries = await documents(definition.uid).findMany({
      locale: "en",
      status: "draft",
      fields: ["documentId", "routePath"],
    });
    for (const entry of entries) {
      // Each registered model is a Strapi Single Type. Its own document (and
      // localizations) may be updated without conflicting with itself; the
      // cross-model check is what prevents two Motorsport pages claiming one
      // approved public path.
      if (definition.uid === currentUid) {
        continue;
      }
      const effectivePath = entry.routePath ?? definition.defaultPath;
      if (effectivePath === path) {
        throw new Error(
          `Motorsport route '${path}' is already assigned to ${definition.endpoint}.`,
        );
      }
    }
  }
}

/**
 * Applies the constrained route contract to document-service creates/updates.
 * Previous CMS paths are retained as aliases for the frontend redirect layer.
 */
export function registerMotorsportPageRouteGuards(strapi: Core.Strapi) {
  strapi.db.lifecycles.subscribe({
    models: MOTORSPORT_PAGE_ROUTE_DEFINITIONS.map(({ uid }) => uid),
    beforeCreate: async (event) => {
      const data = (event.params.data ?? {}) as Record<string, unknown>;
      const definition = MOTORSPORT_PAGE_ROUTE_DEFINITIONS.find(
        ({ uid }) => uid === event.model.uid,
      );
      if (!definition) return;
      const routePath = data.routePath ?? definition.defaultPath;
      if (!isApprovedMotorsportPagePath(routePath)) {
        throw new Error("Select one of the approved Motorsport page paths.");
      }
      await assertPathAvailable(strapi, routePath, event.model.uid);
      data.routePath = routePath;
      event.params.data = data;
    },
    beforeUpdate: async (event) => {
      const data = (event.params.data ?? {}) as Record<string, unknown>;
      if (data.routePath === undefined) return;
      if (!isApprovedMotorsportPagePath(data.routePath)) {
        throw new Error("Select one of the approved Motorsport page paths.");
      }
      const documentId = documentIdFrom(event.params as Record<string, any>);
      await assertPathAvailable(strapi, data.routePath, event.model.uid, documentId);
      const existing = await existingDocument(strapi, event.model.uid, documentId);
      const previousPath = existing?.routePath;
      if (isApprovedMotorsportPagePath(previousPath) && previousPath !== data.routePath) {
        data.routeAliases = Array.from(
          new Set([...normalizedAliases(existing.routeAliases), previousPath]),
        ).filter((path) => path !== data.routePath);
      }
      event.params.data = data;
    },
  });
}

/** Backfills pre-routePath Single Types once, without replacing editor values. */
export async function backfillMotorsportPageRoutes(strapi: Core.Strapi) {
  const documents = strapi.documents as unknown as (uid: string) => DocumentService;
  let updated = 0;
  for (const definition of MOTORSPORT_PAGE_ROUTE_DEFINITIONS) {
    for (const status of ["draft", "published"] as const) {
      const existing = await documents(definition.uid).findFirst({
        locale: "en",
        status,
        fields: ["documentId", "routePath"],
      });
      if (!existing?.documentId || isApprovedMotorsportPagePath(existing.routePath)) {
        continue;
      }
      await documents(definition.uid).update({
        documentId: existing.documentId,
        locale: "en",
        data: { routePath: definition.defaultPath },
        status,
      });
      updated += 1;
    }
  }
  strapi.log.info(`[motorsport-page-routes] ${updated} route paths backfilled.`);
}
