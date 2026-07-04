import { z } from "zod/v4";

/**
 * Motorsport contact / inquiry form validation.
 *
 * Mirrors the gateway validation pattern but with motorsport-specific
 * categories. Anti-spam honeypot + timing fields included.
 */

export const inquiryCategories = [
  "general",
  "partnership",
  "media",
  "event-ticket",
  "vendor",
] as const;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.email("Please enter a valid email address.").max(254),
  category: z.enum(inquiryCategories, {
    error: "Please choose an inquiry category.",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Please provide at least 20 characters of context.")
    .max(5000),
  /* Honeypot — must remain empty. */
  website: z.string().max(0, "Spam check failed.").optional().default(""),
  /* Timestamp of when the form was first rendered (anti-bot timing). */
  formStartedAt: z.number().int().positive(),
  /* Optional reCAPTCHA token. */
  recaptchaToken: z
    .string()
    .trim()
    .max(4096)
    .optional()
    .transform((value) => value || undefined),
  sourcePage: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((value) => value || undefined),
});

export type ContactFormInput = z.input<typeof contactFormSchema>;

export type FormFieldErrors = Record<string, string>;

export function flattenFormErrors(error: z.core.$ZodError): FormFieldErrors {
  const fields: FormFieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    if (key && !fields[key]) fields[key] = issue.message;
  }
  return fields;
}
