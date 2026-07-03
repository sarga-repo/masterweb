import { describe, expect, it } from "vitest";
import {
  contactFormSchema,
  flattenFormErrors,
  newsletterFormSchema,
} from "./forms";

const validContact = {
  name: "Sarga Partner",
  email: "partner@example.com",
  phone: "",
  company: "Example Company",
  inquiryType: "partnership",
  message: "A detailed partnership inquiry with enough useful context.",
  sourcePage: "/contact",
  website: "",
  formStartedAt: Date.now() - 2_000,
};

describe("contactFormSchema", () => {
  it("accepts and normalizes a valid inquiry", () => {
    const result = contactFormSchema.safeParse(validContact);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.phone).toBeUndefined();
  });

  it("rejects invalid required fields with field-level messages", () => {
    const result = contactFormSchema.safeParse({
      ...validContact,
      name: "A",
      email: "invalid",
      inquiryType: "unknown",
      message: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(flattenFormErrors(result.error)).toMatchObject({
        name: expect.any(String),
        email: expect.any(String),
        inquiryType: expect.any(String),
        message: expect.any(String),
      });
    }
  });

  it("rejects a filled honeypot", () => {
    expect(
      contactFormSchema.safeParse({ ...validContact, website: "spam.test" })
        .success,
    ).toBe(false);
  });
});

describe("newsletterFormSchema", () => {
  it("accepts a valid email with optional consent", () => {
    expect(
      newsletterFormSchema.safeParse({
        email: "news@example.com",
        consent: true,
        sourcePage: "/",
        website: "",
        formStartedAt: Date.now() - 2_000,
      }).success,
    ).toBe(true);
  });

  it("rejects malformed email addresses", () => {
    expect(
      newsletterFormSchema.safeParse({
        email: "not-an-email",
        website: "",
        formStartedAt: Date.now() - 2_000,
      }).success,
    ).toBe(false);
  });
});
