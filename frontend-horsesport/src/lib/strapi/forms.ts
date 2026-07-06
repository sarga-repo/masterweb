import "server-only";

import { strapiPost, type StrapiMutationResult } from "./client";
import type { InquiryType } from "@/lib/validation/forms";

export type InquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType: InquiryType;
  message: string;
  sourcePage?: string;
};

/**
 * Persist a contact inquiry to the shared CMS. Every submission from this
 * frontend is tagged `sourceSite: "horsesport"` so the inquiry desk can route
 * and report per-site (docs/horsesport/05).
 */
export async function submitInquiry(
  payload: InquiryPayload,
): Promise<StrapiMutationResult> {
  return strapiPost("inquiry-submissions", {
    ...payload,
    sourceSite: "horsesport",
    submittedAt: new Date().toISOString(),
    status: "new",
  });
}
