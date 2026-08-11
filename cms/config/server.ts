import type { Core } from "@strapi/strapi";

import { processPendingInquiryNotifications } from "../src/email/inquiry-notification-worker";

const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("PUBLIC_URL", "http://localhost:1337"),
  proxy: {
    koa: env.bool("PROXY_KOA", false),
  },
  app: {
    keys: env.array("APP_KEYS"),
  },
  cron: {
    enabled: env.bool("MAIL_NOTIFICATIONS_ENABLED", false),
    tasks: {
      sargaInquiryNotifications: {
        task: async ({ strapi }) => {
          await processPendingInquiryNotifications(strapi);
        },
        options: {
          rule: env("MAIL_WORKER_CRON", "*/1 * * * *"),
          tz: "Asia/Jakarta",
        },
      },
    },
  },
});

export default config;
