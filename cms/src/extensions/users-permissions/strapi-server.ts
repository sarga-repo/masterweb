import type { Core } from "@strapi/strapi";
import nodemailerProvider from "@strapi/provider-email-nodemailer";

import { createMicrosoftEmailPluginConfig, redactMailError } from "../../email/microsoft-smtp-config";
import {
  getMotorsportMailSettings,
  resolveMotorsportMailEnvironment,
  updateMotorsportMailSettings,
} from "../../email/motorsport-mail-settings";
import {
  getPresentationStatus,
  resetPresentationLocale,
  setGlobalPresentationLocale,
  useGlobalPresentationLocale,
} from "../../presentation-config/store";

const SUPER_ADMIN_CODE = "strapi-super-admin";
const MOTORSPORT_ADMIN_CODE = "sarga-motorsport-admin";

function currentStrapi() {
  return (globalThis as typeof globalThis & { strapi?: Core.Strapi }).strapi;
}

async function requireMotorsportAdmin(ctx: any) {
  const strapi = currentStrapi();
  const userId = ctx.state?.user?.id;
  if (!strapi || !userId) ctx.throw(401, "Admin authentication is required.");

  const user = await strapi.db.query("admin::user").findOne({
    where: { id: userId },
    populate: ["roles"],
  });
  const roleCodes = (user?.roles ?? []).map((role: { code?: string }) => role.code);
  if (!roleCodes.includes(SUPER_ADMIN_CODE) && !roleCodes.includes(MOTORSPORT_ADMIN_CODE)) {
    ctx.throw(403, "Motorsport mail settings are restricted to Motorsport Admin and Super Admin.");
  }
  return strapi;
}

function requireAuthenticatedAdmin(ctx: any) {
  const strapi = currentStrapi();
  if (!strapi || !ctx.state?.user?.id) {
    ctx.throw(401, "Admin authentication is required.");
  }
  return strapi;
}

function safeError(error: unknown) {
  return redactMailError(error);
}

export default (plugin: any) => {
  plugin.routes ??= {};
  plugin.routes.admin ??= { type: "admin", routes: [] };
  plugin.routes.admin.routes.push(
    {
      method: "GET",
      path: "/sarga-motorsport-mail-settings",
      handler: async (ctx: any) => {
        const strapi = await requireMotorsportAdmin(ctx);
        ctx.body = { data: await getMotorsportMailSettings(strapi) };
      },
    },
    {
      method: "PUT",
      path: "/sarga-motorsport-mail-settings",
      handler: async (ctx: any) => {
        const strapi = await requireMotorsportAdmin(ctx);
        try {
          const data = ctx.request.body?.data ?? ctx.request.body ?? {};
          ctx.body = {
            data: await updateMotorsportMailSettings(strapi, data),
          };
        } catch (error) {
          ctx.throw(400, safeError(error));
        }
      },
    },
    {
      method: "POST",
      path: "/sarga-motorsport-mail-settings/verify",
      handler: async (ctx: any) => {
        const strapi = await requireMotorsportAdmin(ctx);
        let provider: { verify: () => Promise<unknown>; close: () => void } | null = null;
        try {
          const env = await resolveMotorsportMailEnvironment(strapi);
          const config = createMicrosoftEmailPluginConfig(env) as any;
          const emailConfig = config.email?.config;
          if (!emailConfig) {
            ctx.throw(400, "SMTP mail is disabled or incomplete.");
          }
          provider = nodemailerProvider.init(
            emailConfig.providerOptions,
            emailConfig.settings,
          ) as typeof provider;
          await provider.verify();
          ctx.body = { data: { verified: true } };
        } catch (error) {
          ctx.throw(400, safeError(error));
        } finally {
          provider?.close();
        }
      },
    },
    {
      method: "GET",
      path: "/sarga-presentation-config",
      handler: async (ctx: any) => {
        const strapi = requireAuthenticatedAdmin(ctx);
        try {
          ctx.body = {
            data: await getPresentationStatus(strapi, {
              contentTypeUid: ctx.query?.contentTypeUid,
              documentId: ctx.query?.documentId,
              locale: ctx.query?.locale,
            }),
          };
        } catch (error) {
          ctx.throw(400, error instanceof Error ? error.message : "Invalid request.");
        }
      },
    },
    {
      method: "POST",
      path: "/sarga-presentation-config/set-global",
      handler: async (ctx: any) => {
        const strapi = requireAuthenticatedAdmin(ctx);
        try {
          ctx.body = {
            data: await setGlobalPresentationLocale(
              strapi,
              ctx.request.body?.data ?? ctx.request.body ?? {},
            ),
          };
        } catch (error) {
          ctx.throw(400, error instanceof Error ? error.message : "Invalid request.");
        }
      },
    },
    {
      method: "POST",
      path: "/sarga-presentation-config/use-global",
      handler: async (ctx: any) => {
        const strapi = requireAuthenticatedAdmin(ctx);
        try {
          ctx.body = {
            data: await useGlobalPresentationLocale(
              strapi,
              ctx.request.body?.data ?? ctx.request.body ?? {},
            ),
          };
        } catch (error) {
          ctx.throw(400, error instanceof Error ? error.message : "Invalid request.");
        }
      },
    },
    {
      method: "POST",
      path: "/sarga-presentation-config/reset-local",
      handler: async (ctx: any) => {
        const strapi = requireAuthenticatedAdmin(ctx);
        try {
          ctx.body = {
            data: await resetPresentationLocale(
              strapi,
              ctx.request.body?.data ?? ctx.request.body ?? {},
            ),
          };
        } catch (error) {
          ctx.throw(400, error instanceof Error ? error.message : "Invalid request.");
        }
      },
    },
  );

  return plugin;
};
