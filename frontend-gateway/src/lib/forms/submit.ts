import "server-only";

import {
  subscribeNewsletter,
  submitInquiry,
  type InquiryPayload,
  type NewsletterPayload,
} from "@/lib/strapi/forms";

type SubmissionResult = { ok: true; placeholder: boolean } | { ok: false };

function isPlaceholderMode(): boolean {
  const mode = process.env.FORM_SUBMISSION_MODE;
  return (
    mode === "placeholder" || (!mode && process.env.NODE_ENV !== "production")
  );
}

export async function deliverInquiry(
  payload: InquiryPayload,
): Promise<SubmissionResult> {
  if (isPlaceholderMode()) return { ok: true, placeholder: true };
  const result = await submitInquiry(payload);
  return result.ok ? { ok: true, placeholder: false } : { ok: false };
}

export async function deliverNewsletter(
  payload: NewsletterPayload,
): Promise<SubmissionResult> {
  if (isPlaceholderMode()) return { ok: true, placeholder: true };
  const result = await subscribeNewsletter(payload);
  return result.ok ? { ok: true, placeholder: false } : { ok: false };
}
