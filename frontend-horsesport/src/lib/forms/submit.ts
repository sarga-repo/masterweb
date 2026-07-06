import "server-only";

import { submitInquiry, type InquiryPayload } from "@/lib/strapi/forms";

type SubmissionResult = { ok: true; placeholder: boolean } | { ok: false };

/**
 * Placeholder mode validates and accepts submissions without writing to Strapi.
 * Explicitly enabled via FORM_SUBMISSION_MODE=placeholder, and the default in
 * any non-production environment so local dev never needs a write token.
 */
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
