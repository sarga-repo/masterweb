import "server-only";

import { strapiPost, type StrapiMutationResult } from "@/lib/strapi/client";

/**
 * Form submission services (docs/05 → Inquiry Submission, Newsletter Subscription).
 *
 * These POST server-side to Strapi. They are wired into UI, validated
 * (Zod/React Hook Form), and given anti-spam protection in Phase 6; here they
 * provide the typed, safe transport layer.
 */

export type InquiryType =
  | "partnership"
  | "sponsorship"
  | "media"
  | "event"
  | "venue"
  | "career"
  | "general";

export type InquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType: InquiryType;
  message: string;
  sourcePage?: string;
};

export type NewsletterPayload = {
  email: string;
  sourcePage?: string;
  consent?: boolean;
};

/** Submit a contact inquiry to Strapi. */
export async function submitInquiry(
  payload: InquiryPayload,
): Promise<StrapiMutationResult> {
  return strapiPost("inquiry-submissions", {
    ...payload,
    submittedAt: new Date().toISOString(),
    status: "new",
  });
}

/** Subscribe an email to the newsletter. */
export async function subscribeNewsletter(
  payload: NewsletterPayload,
): Promise<StrapiMutationResult> {
  return strapiPost("newsletter-subscriptions", {
    ...payload,
    subscribedAt: new Date().toISOString(),
    status: "active",
  });
}
