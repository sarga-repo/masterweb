import type { Core } from "@strapi/strapi";

const CONTENT_MANAGER_STORE = {
  type: "plugin" as const,
  name: "content_manager",
};

const CONTENT_TYPE_CONFIGURATION_PREFIX = "configuration_content_types::";
const COMPONENT_CONFIGURATION_PREFIX = "configuration_components::";

const MOTORSPORT_PAGE_UIDS = [
  "api::motorsport-about-page.motorsport-about-page",
  "api::motorsport-events-page.motorsport-events-page",
  "api::motorsport-news-page.motorsport-news-page",
  "api::motorsport-gallery-page.motorsport-gallery-page",
  "api::motorsport-merchandise-page.motorsport-merchandise-page",
  "api::motorsport-tickets-page.motorsport-tickets-page",
  "api::motorsport-contact-page.motorsport-contact-page",
  "api::motorsport-partners-page.motorsport-partners-page",
  "api::motorsport-experience-page.motorsport-experience-page",
  "api::motorsport-home-page.motorsport-home-page",
] as const;

type JsonObject = Record<string, unknown>;

type ContentManagerStore = {
  get: (params: { key: string }) => Promise<unknown>;
  set: (params: { key: string; value: unknown }) => Promise<void>;
};

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null;
}

function getSchemaMetadata(schema: unknown): JsonObject | null {
  if (!isObject(schema) || !isObject(schema.config)) return null;
  return isObject(schema.config.metadatas) ? schema.config.metadatas : null;
}

/**
 * Repairs persisted Content Manager metadata after schema descriptions are
 * added or changed. Strapi merges persisted metadata over schema defaults, so
 * an older empty description otherwise hides the current schema helper text.
 */
async function repairMetadata(
  strapi: Core.Strapi,
  store: ContentManagerStore,
  uid: string,
  schema: unknown,
): Promise<boolean> {
  const expectedMetadata = getSchemaMetadata(schema);
  if (!expectedMetadata) return false;

  const key = `${
    uid.startsWith("component::")
      ? COMPONENT_CONFIGURATION_PREFIX
      : CONTENT_TYPE_CONFIGURATION_PREFIX
  }${uid.replace(/^component::/, "")}`;
  const raw = await store.get({ key });
  if (!isObject(raw)) return false;

  const currentMetadata = isObject(raw.metadatas) ? raw.metadatas : {};
  const repairedMetadata: JsonObject = { ...currentMetadata };
  let changed = false;

  for (const [fieldName, expected] of Object.entries(expectedMetadata)) {
    if (!isObject(expected) || !isObject(expected.edit)) continue;
    const expectedDescription = expected.edit.description;
    if (typeof expectedDescription !== "string" || expectedDescription.length === 0) {
      continue;
    }

    const current = isObject(repairedMetadata[fieldName])
      ? (repairedMetadata[fieldName] as JsonObject)
      : {};
    const currentEdit = isObject(current.edit) ? current.edit : {};

    if (currentEdit.description === expectedDescription) continue;

    repairedMetadata[fieldName] = {
      ...current,
      edit: {
        ...currentEdit,
        description: expectedDescription,
      },
    };
    changed = true;
  }

  if (!changed) return false;

  await store.set({
    key,
    value: {
      ...raw,
      metadatas: repairedMetadata,
    },
  });
  strapi.log.info(`[motorsport-cm] repaired persisted helper metadata: ${uid}`);
  return true;
}

async function repairSingleTypeMainField(
  strapi: Core.Strapi,
  store: ContentManagerStore,
  uid: string,
) {
  const key = `${CONTENT_TYPE_CONFIGURATION_PREFIX}${uid}`;
  const raw = await store.get({ key });
  if (!isObject(raw)) return;

  const settings = isObject(raw.settings) ? raw.settings : {};
  if (settings.mainField === "id") return;

  await store.set({
    key,
    value: {
      ...raw,
      settings: {
        ...settings,
        mainField: "id",
      },
    },
  });
  strapi.log.info(`[motorsport-cm] repaired single-type title field: ${uid}`);
}

/** Repairs persisted Content Manager titles and schema helper descriptions. */
export async function repairMotorsportContentManagerConfiguration(
  strapi: Core.Strapi,
) {
  const store = strapi.store(
    CONTENT_MANAGER_STORE,
  ) as unknown as ContentManagerStore;

  for (const uid of MOTORSPORT_PAGE_UIDS) {
    await repairSingleTypeMainField(strapi, store, uid);
  }

  const contentTypes = (strapi as unknown as { contentTypes?: Record<string, unknown> })
    .contentTypes ?? {};
  const components = (strapi as unknown as { components?: Record<string, unknown> })
    .components ?? {};

  for (const [uid, schema] of Object.entries(contentTypes)) {
    await repairMetadata(strapi, store, uid, schema);
  }
  for (const [uid, schema] of Object.entries(components)) {
    await repairMetadata(strapi, store, `component::${uid}`, schema);
  }
}
