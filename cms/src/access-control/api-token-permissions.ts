import crypto from "node:crypto";

import type { Core } from "@strapi/strapi";

/**
 * Read actions required by the frontends, including draft reads used by the
 * Motorsport preview route. Strapi API tokens are separate from the public
 * role, so granting public permissions alone does not make these endpoints
 * readable with STRAPI_API_TOKEN.
 */
export const FRONTEND_API_TOKEN_READ_ACTIONS = [
  "api::motorsport-theme-settings.motorsport-theme-settings.find",
  "api::motorsport-theme-settings.motorsport-theme-settings.findOne",
  "api::site-page.site-page.find",
  "api::site-page.site-page.findOne",
  "api::motorsport-home-page.motorsport-home-page.find",
  "api::motorsport-home-page.motorsport-home-page.findOne",
  "api::motorsport-about-page.motorsport-about-page.find",
  "api::motorsport-about-page.motorsport-about-page.findOne",
  "api::motorsport-events-page.motorsport-events-page.find",
  "api::motorsport-events-page.motorsport-events-page.findOne",
  "api::motorsport-news-page.motorsport-news-page.find",
  "api::motorsport-news-page.motorsport-news-page.findOne",
  "api::motorsport-gallery-page.motorsport-gallery-page.find",
  "api::motorsport-gallery-page.motorsport-gallery-page.findOne",
  "api::motorsport-merchandise-page.motorsport-merchandise-page.find",
  "api::motorsport-merchandise-page.motorsport-merchandise-page.findOne",
  "api::motorsport-tickets-page.motorsport-tickets-page.find",
  "api::motorsport-tickets-page.motorsport-tickets-page.findOne",
  "api::motorsport-contact-page.motorsport-contact-page.find",
  "api::motorsport-contact-page.motorsport-contact-page.findOne",
  "api::motorsport-partners-page.motorsport-partners-page.find",
  "api::motorsport-partners-page.motorsport-partners-page.findOne",
  "api::motorsport-experience-page.motorsport-experience-page.find",
  "api::motorsport-experience-page.motorsport-experience-page.findOne",
  "api::motorsport-event.motorsport-event.find",
  "api::motorsport-event.motorsport-event.findOne",
  "api::motorsport-leadership-person.motorsport-leadership-person.find",
  "api::motorsport-leadership-person.motorsport-leadership-person.findOne",
  "api::motorsport-merchandise-item.motorsport-merchandise-item.find",
  "api::motorsport-merchandise-item.motorsport-merchandise-item.findOne",
  "api::motorsport-news-article.motorsport-news-article.find",
  "api::motorsport-news-article.motorsport-news-article.findOne",
  "api::motorsport-partner.motorsport-partner.find",
  "api::motorsport-partner.motorsport-partner.findOne",
  "api::motorsport-ticket-cta.motorsport-ticket-cta.find",
  "api::motorsport-ticket-cta.motorsport-ticket-cta.findOne",
  "api::motorsport-top-navigation-item.motorsport-top-navigation-item.find",
  "api::motorsport-top-navigation-item.motorsport-top-navigation-item.findOne",
] as const;

type KnexLike = {
  (table: string): any;
  transaction: <T>(handler: (trx: any) => Promise<T>) => Promise<T>;
};

/**
 * Ensure the named custom API token can read the content used by the
 * frontends. This is intentionally idempotent and runs on every bootstrap so
 * a restored database or a newly-created token does not silently regress.
 */
export async function ensureFrontendApiTokenPermissions(strapi: Core.Strapi) {
  const tokenName = process.env.CMS_PREVIEW_API_TOKEN_NAME ?? "Read Only";
  const db = strapi.db as unknown as { connection?: KnexLike };
  const knex = db.connection;

  if (!knex) {
    strapi.log.warn(
      "[api-token] Database connection unavailable; skipped frontend token permission sync.",
    );
    return;
  }

  const token = await knex("strapi_api_tokens")
    .select(["id", "name", "type"])
    .where({ name: tokenName, type: "custom" })
    .first();

  if (!token) {
    strapi.log.warn(
      `[api-token] Custom API token '${tokenName}' was not found; ` +
        "set CMS_PREVIEW_API_TOKEN_NAME to the token used by the frontends.",
    );
    return;
  }

  const added = await knex.transaction(async (trx) => {
    const maxOrderRow = await trx("strapi_api_token_permissions_token_lnk")
      .where({ api_token_id: token.id })
      .max({ maxOrder: "api_token_permission_ord" })
      .first();
    let nextOrder = Number(maxOrderRow?.maxOrder ?? 0) + 1;
    let created = 0;

    for (const action of FRONTEND_API_TOKEN_READ_ACTIONS) {
      const existing = await trx("strapi_api_token_permissions as permission")
        .join(
          "strapi_api_token_permissions_token_lnk as link",
          "link.api_token_permission_id",
          "permission.id",
        )
        .where("link.api_token_id", token.id)
        .andWhere("permission.action", action)
        .select("permission.id")
        .first();

      if (existing) continue;

      const now = new Date();
      const [permission] = await trx("strapi_api_token_permissions")
        .insert({
          document_id: crypto.randomUUID(),
          action,
          created_at: now,
          updated_at: now,
          published_at: now,
        })
        .returning("id");
      const permissionId =
        typeof permission === "number" ? permission : permission?.id;

      await trx("strapi_api_token_permissions_token_lnk").insert({
        api_token_permission_id: permissionId,
        api_token_id: token.id,
        api_token_permission_ord: nextOrder++,
      });
      created += 1;
    }

    return created;
  });

  strapi.log.info(
    `[api-token] '${token.name}' frontend read permissions are synchronized ` +
      `(${added} added).`,
  );
}
