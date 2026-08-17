import type { Core } from "@strapi/strapi";

const UID = "api::motorsport-theme-settings.motorsport-theme-settings";
const TITLE = "Motorsport Theme Settings";
const CONTENT_MANAGER_STORE = {
  type: "plugin" as const,
  name: "content_manager",
};
const CONTENT_MANAGER_KEY = `configuration_content_types::${UID}`;
type DocumentService = {
  findFirst: (params?: Record<string, unknown>) => Promise<any>;
  create: (params: Record<string, unknown>) => Promise<any>;
  update: (params: Record<string, unknown>) => Promise<any>;
};

type ContentManagerStore = {
  get: (params: { key: string }) => Promise<unknown>;
  set: (params: { key: string; value: unknown }) => Promise<void>;
};

async function ensureContentManagerMainField(strapi: Core.Strapi) {
  const contentManagerStore = strapi.store(
    CONTENT_MANAGER_STORE,
  ) as unknown as ContentManagerStore;
  const configuration = await contentManagerStore.get({
    key: CONTENT_MANAGER_KEY,
  });

  if (!configuration || typeof configuration !== "object") return;

  const current = configuration as {
    settings?: Record<string, unknown>;
  };
  const settings = current.settings ?? {};
  if (
    settings.mainField === "title" &&
    settings.defaultSortBy === "title"
  ) {
    return;
  }

  await contentManagerStore.set({
    key: CONTENT_MANAGER_KEY,
    value: {
      ...current,
      settings: {
        ...settings,
        mainField: "title",
        defaultSortBy: "title",
      },
    },
  });
  strapi.log.info("[motorsport-theme] set Content Manager main field to title");
}

/** Creates or repairs the safe, backward-compatible theme setting. */
export async function ensureMotorsportThemeSettings(strapi: Core.Strapi) {
  await ensureContentManagerMainField(strapi);
  const documents = strapi.documents as unknown as (uid: string) => DocumentService;
  const service = documents(UID);
  const existing = await service.findFirst({ status: "published" });
  if (existing) {
    if (existing.title === TITLE) return;
    await service.update({
      documentId: existing.documentId,
      data: { title: TITLE },
      status: "published",
    });
    strapi.log.info("[motorsport-theme] repaired settings title");
    return;
  }

  await service.create({
    data: {
      title: TITLE,
      siteScope: "motorsport",
      themePreset: "current-motorsport",
    },
    status: "published",
  });
  strapi.log.info("[motorsport-theme] created current-motorsport default");
}
