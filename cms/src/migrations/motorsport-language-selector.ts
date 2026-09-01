import type { Core } from "@strapi/strapi";

type SiteService = {
  findFirst: (params?: Record<string, unknown>) => Promise<any>;
  update: (params: Record<string, unknown>) => Promise<any>;
};

/** Backfills the new header visibility setting without changing editor choices. */
export async function ensureMotorsportLanguageSelectorSetting(
  strapi: Core.Strapi,
) {
  const service = (strapi.documents as unknown as (uid: string) => SiteService)(
    "api::site.site",
  );
  const site = await service.findFirst({
    filters: { slug: { $eq: "sarga-motorsport" } },
  });

  if (
    !site ||
    (site.showLanguageSelector !== null &&
      site.showLanguageSelector !== undefined)
  ) {
    return;
  }

  await service.update({
    documentId: site.documentId,
    data: { showLanguageSelector: true },
    status: "published",
  });
  strapi.log.info(
    "[motorsport-language-selector] enabled the default language selector setting",
  );
}
