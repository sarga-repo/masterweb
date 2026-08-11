import { shouldQueueInquiryNotification } from "../../../../email/inquiry-notifications";

const INTERNAL_FIELDS = [
  "notificationAttempts",
  "notificationNextAttemptAt",
  "notificationLastAttemptAt",
  "notificationSentAt",
  "notificationLastErrorCode",
] as const;

export default {
  beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    const data = event.params.data;

    for (const field of INTERNAL_FIELDS) delete data[field];
    data.notificationAttempts = 0;
    data.notificationStatus = shouldQueueInquiryNotification()
      ? "pending"
      : "disabled";
    data.notificationNextAttemptAt =
      data.notificationStatus === "pending" ? new Date().toISOString() : null;
  },
};
