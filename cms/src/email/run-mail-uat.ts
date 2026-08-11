import nodemailerProvider from "@strapi/provider-email-nodemailer";

import {
  createMicrosoftEmailPluginConfig,
  redactMailError,
} from "./microsoft-smtp-config";
import { maskMailbox, validateMailUatEnvironment } from "./inquiry-notifications";

async function main() {
  const { recipient } = validateMailUatEnvironment();
  const plugins = createMicrosoftEmailPluginConfig() as any;
  const emailConfig = plugins.email?.config;
  if (!emailConfig) {
    throw new Error("[Sarga Mail] Microsoft email configuration is unavailable.");
  }
  const provider = nodemailerProvider.init(
    emailConfig.providerOptions,
    emailConfig.settings,
  );
  const timestamp = new Date().toISOString();

  try {
    await provider.verify();
    await provider.send({
      to: recipient,
      subject: `[Sarga Mail UAT] Controlled staging delivery ${timestamp}`,
      text: [
        "This is an approved Sarga CMS staging mail-delivery test.",
        `Timestamp: ${timestamp}`,
        "No visitor data is included in this message.",
      ].join("\n"),
      html: `<p>This is an approved Sarga CMS staging mail-delivery test.</p><p>Timestamp: ${timestamp}</p><p>No visitor data is included in this message.</p>`,
    });
    process.stdout.write(
      `Controlled staging message accepted for ${maskMailbox(recipient)}.\n`,
    );
  } finally {
    provider.close();
  }
}

main().catch((error) => {
  process.stderr.write(`${redactMailError(error)}\n`);
  process.exitCode = 1;
});
