import type { Core } from "@strapi/strapi";
import nodemailerProvider from "@strapi/provider-email-nodemailer";

import {
  assertMailAuthenticationWindow,
  createMicrosoftEmailPluginConfig,
} from "./microsoft-smtp-config";
import { resolveMotorsportMailEnvironment } from "./motorsport-mail-settings";

import {
  assertInquiryNotificationEnvironment,
  runInquiryNotificationBatch,
  shouldQueueInquiryNotification,
  type InquiryNotificationRecord,
  type NotificationRepository,
} from "./inquiry-notifications";

const INQUIRY_UID = "api::inquiry-submission.inquiry-submission";
const STALE_PROCESSING_MS = 10 * 60 * 1_000;

function createRepository(strapi: Core.Strapi): NotificationRepository {
  const query = strapi.db.query(INQUIRY_UID as any);
  return {
    async findDue(now, limit) {
      const records = (await query.findMany({
        where: {
          notificationStatus: { $in: ["pending", "failed", "processing"] },
        },
        orderBy: [{ notificationNextAttemptAt: "asc" }, { id: "asc" }],
        limit: Math.max(limit * 3, limit),
      })) as InquiryNotificationRecord[];
      return records
        .filter((record) => {
          if (record.notificationStatus === "processing") {
            const lastAttempt = record.notificationLastAttemptAt
              ? new Date(record.notificationLastAttemptAt).getTime()
              : 0;
            return lastAttempt <= now.getTime() - STALE_PROCESSING_MS;
          }
          if (
            record.notificationStatus === "failed" &&
            !record.notificationNextAttemptAt
          ) {
            return false;
          }
          if (!record.notificationNextAttemptAt) return true;
          return new Date(record.notificationNextAttemptAt).getTime() <= now.getTime();
        })
        .slice(0, limit);
    },
    async markProcessing(id, attempt, at) {
      await query.update({
        where: { id },
        data: {
          notificationStatus: "processing",
          notificationAttempts: attempt,
          notificationLastAttemptAt: at.toISOString(),
          notificationNextAttemptAt: null,
          notificationLastErrorCode: null,
        },
      });
    },
    async markSent(id, at) {
      await query.update({
        where: { id },
        data: {
          notificationStatus: "sent",
          notificationSentAt: at.toISOString(),
          notificationNextAttemptAt: null,
          notificationLastErrorCode: null,
        },
      });
    },
    async markFailed(id, code, nextAttemptAt) {
      await query.update({
        where: { id },
        data: {
          notificationStatus: "failed",
          notificationLastErrorCode: code,
          notificationNextAttemptAt: nextAttemptAt?.toISOString() ?? null,
        },
      });
    },
  };
}

export async function processPendingInquiryNotifications(strapi: Core.Strapi) {
  const env = await resolveMotorsportMailEnvironment(strapi);
  assertInquiryNotificationEnvironment(env);
  if (!shouldQueueInquiryNotification(env)) {
    return { selected: 0, sent: 0, failed: 0, deferred: 0 };
  }

  assertMailAuthenticationWindow(env);
  const plugins = createMicrosoftEmailPluginConfig(env) as any;
  const emailConfig = plugins.email?.config;
  if (!emailConfig) {
    throw new Error("[Sarga Mail] Microsoft email configuration is unavailable.");
  }
  const provider = nodemailerProvider.init(
    emailConfig.providerOptions,
    emailConfig.settings,
  ) as any;

  let result;
  try {
    result = await runInquiryNotificationBatch({
      repository: createRepository(strapi),
      env,
      mailer: {
        async send(mail) {
          assertMailAuthenticationWindow(env);
          await provider.send(mail);
        },
      },
    });
  } finally {
    provider.close();
  }

  if (result.selected > 0) {
    strapi.log.info(
      `[Sarga Mail] inquiry batch selected=${result.selected} sent=${result.sent} failed=${result.failed} deferred=${result.deferred}`,
    );
  }
  return result;
}
