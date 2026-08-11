import type { Core } from "@strapi/strapi";
import { createMicrosoftEmailPluginConfig } from "../src/email/microsoft-smtp-config";

const config = ({
}: Core.Config.Shared.ConfigParams): Core.Config.Plugin =>
  createMicrosoftEmailPluginConfig() as Core.Config.Plugin;

export default config;
