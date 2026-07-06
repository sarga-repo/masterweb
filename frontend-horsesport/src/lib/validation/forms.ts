import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || undefined);

/**
 * Anti-spam fields shared by every public form:
 *  - `website` is a honeypot (must stay empty),
 *  - `formStartedAt` powers the timing check (bots submit instantly).
 */
const antiSpamFields = {
  website: z.string().max(0, "Spam check failed.").optional().default(""),
  formStartedAt: z.number().int().positive(),
  recaptchaToken: optionalText(4096),
};

/** Horse Sport inquiry desks (docs/horsesport/05 - contact / inquiry forms). */
export const inquiryTypes = [
  "ticketing",
  "partnership",
  "sponsorship",
  "media",
  "event",
  "venue",
  "stable",
  "general",
] as const;

export type InquiryType = (typeof inquiryTypes)[number];

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.email("Please enter a valid email address.").max(254),
  phone: optionalText(40),
  company: optionalText(160),
  inquiryType: z.enum(inquiryTypes, {
    error: "Please choose an inquiry type.",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Please provide at least 20 characters of context.")
    .max(5000),
  sourcePage: optionalText(500),
  ...antiSpamFields,
});

export type ContactFormInput = z.input<typeof contactFormSchema>;

export type FormFieldErrors = Record<string, string>;

/** Reduce a ZodError to the first message per top-level field, for the UI. */
export function flattenFormErrors(error: z.ZodError): FormFieldErrors {
  const fields: FormFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
  }
  return fields;
}
