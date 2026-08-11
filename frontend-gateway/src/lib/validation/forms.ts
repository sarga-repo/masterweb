import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || undefined);

const antiSpamFields = {
  website: z.string().max(0, "Spam check failed.").optional().default(""),
  formStartedAt: z.number().int().positive(),
  recaptchaToken: optionalText(4096),
};

const sourceLocale = z.enum(["en", "id"]).default("en");

export const inquiryTypes = [
  "partnership",
  "sponsorship",
  "media",
  "event",
  "venue",
  "career",
  "general",
] as const;

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
  sourceLocale,
  ...antiSpamFields,
});

export const newsletterFormSchema = z.object({
  email: z.email("Please enter a valid email address.").max(254),
  consent: z.boolean().optional().default(false),
  sourcePage: optionalText(500),
  sourceLocale,
  ...antiSpamFields,
});

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type NewsletterFormInput = z.input<typeof newsletterFormSchema>;

export type FormFieldErrors = Record<string, string>;

export function flattenFormErrors(error: z.ZodError): FormFieldErrors {
  const fields: FormFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
  }
  return fields;
}
