import { factories } from "@strapi/strapi";
import { getPresentationStatus } from "../../../presentation-config/store";

const controller = factories.createCoreController(
  "api::localized-presentation-config.localized-presentation-config",
);

export default {
  ...controller,
  async resolve(ctx: any) {
    try {
      const strapi = (globalThis as typeof globalThis & { strapi?: any }).strapi;
      if (!strapi) ctx.throw(503, "CMS is not ready.");
      const status = await getPresentationStatus(strapi, {
        contentTypeUid: ctx.query?.contentTypeUid,
        documentId: ctx.query?.documentId,
        locale: ctx.query?.locale,
      });
      ctx.body = { data: status };
    } catch (error) {
      ctx.throw(400, error instanceof Error ? error.message : "Invalid request.");
    }
  },
};
