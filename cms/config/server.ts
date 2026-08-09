import type { Core } from "@strapi/strapi";

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
});

export default config;
