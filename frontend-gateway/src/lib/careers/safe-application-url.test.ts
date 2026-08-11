import { describe, expect, it } from "vitest";
import { safeLinkedInApplicationUrl } from "./safe-application-url";

describe("safeLinkedInApplicationUrl", () => {
  it("accepts HTTPS LinkedIn and regional LinkedIn URLs", () => {
    expect(
      safeLinkedInApplicationUrl("https://www.linkedin.com/jobs/view/123"),
    ).toBe("https://www.linkedin.com/jobs/view/123");
    expect(
      safeLinkedInApplicationUrl("https://id.linkedin.com/jobs/view/456"),
    ).toBe("https://id.linkedin.com/jobs/view/456");
  });

  it("rejects non-LinkedIn, insecure, credentialed, and malformed URLs", () => {
    expect(
      safeLinkedInApplicationUrl("https://linkedin.example/jobs/1"),
    ).toBeUndefined();
    expect(
      safeLinkedInApplicationUrl("http://linkedin.com/jobs/1"),
    ).toBeUndefined();
    expect(
      safeLinkedInApplicationUrl("https://user:pass@linkedin.com/jobs/1"),
    ).toBeUndefined();
    expect(safeLinkedInApplicationUrl("not-a-url")).toBeUndefined();
  });
});
