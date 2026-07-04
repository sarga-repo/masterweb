import { afterEach, describe, expect, it, vi } from "vitest";
import { safeTicketEmbedUrl, safeTicketUrl } from "./safe-url";

afterEach(() => vi.unstubAllEnvs());

describe("safeTicketUrl", () => {
  it("accepts HTTPS partner destinations", () => {
    expect(safeTicketUrl("https://tickets.example.com/event")).toBe(
      "https://tickets.example.com/event",
    );
  });

  it("rejects executable and malformed URLs", () => {
    expect(safeTicketUrl("javascript:alert(1)")).toBeUndefined();
    expect(safeTicketUrl("not a url")).toBeUndefined();
  });

  it("accepts only configured custom deep-link schemes", () => {
    vi.stubEnv("TICKETING_DEEP_LINK_SCHEMES", "approved-app");
    expect(safeTicketUrl("approved-app://event/42", "deepLink")).toBe(
      "approved-app://event/42",
    );
    expect(safeTicketUrl("other-app://event/42", "deepLink")).toBeUndefined();
  });
});

describe("safeTicketEmbedUrl", () => {
  it("allows exact and subdomain matches from the embed allowlist", () => {
    vi.stubEnv("TICKETING_EMBED_ALLOWLIST", "tickets.example.com");
    expect(safeTicketEmbedUrl("https://tickets.example.com/embed/42")).toBe(
      "https://tickets.example.com/embed/42",
    );
    expect(
      safeTicketEmbedUrl("https://checkout.tickets.example.com/embed/42"),
    ).toBe("https://checkout.tickets.example.com/embed/42");
  });

  it("rejects unlisted and lookalike hosts", () => {
    vi.stubEnv("TICKETING_EMBED_ALLOWLIST", "tickets.example.com");
    expect(
      safeTicketEmbedUrl("https://tickets.example.com.attacker.test/embed"),
    ).toBeUndefined();
    expect(
      safeTicketEmbedUrl("https://unapproved.example.com/embed"),
    ).toBeUndefined();
  });
});
