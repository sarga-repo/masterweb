import nodemailerProvider from "@strapi/provider-email-nodemailer";

import {
  createMicrosoftEmailPluginConfig,
  mailAuthMode,
  redactMailError,
} from "./microsoft-smtp-config";

async function main() {
  if (!/^(1|true|yes|on)$/i.test(process.env.MAIL_ENABLED || "")) {
    throw new Error(
      "[Sarga Mail] Set MAIL_ENABLED=true and supply approved staging credentials before verification.",
    );
  }

  const plugins = createMicrosoftEmailPluginConfig() as any;
  const emailConfig = plugins.email?.config;
  if (!emailConfig) {
    throw new Error("[Sarga Mail] Microsoft email configuration is unavailable.");
  }

  const provider = nodemailerProvider.init(
    emailConfig.providerOptions,
    emailConfig.settings,
  );

  try {
    await provider.verify();
    process.stdout.write(
      `Microsoft Exchange Online ${mailAuthMode().toUpperCase()} SMTP connection verified; no email was sent.\n`,
    );
  } finally {
    provider.close();
  }
}

main().catch((error) => {
  process.stderr.write(`${redactMailError(error)}\n`);
  process.exitCode = 1;
});
