import { describe, expect, it } from "vitest";
import { cn, formatDisplayDate } from "./utils";

describe("cn", () => {
  it("combines nested class values and removes falsy entries", () => {
    expect(cn("base", false, ["nested", null, ["deep"]], 2)).toBe(
      "base nested deep 2",
    );
  });
});

describe("formatDisplayDate", () => {
  it("formats ISO dates deterministically in UTC", () => {
    expect(formatDisplayDate("2025-07-24")).toBe("JULY 24, 2025");
  });

  it("returns invalid input unchanged", () => {
    expect(formatDisplayDate("not-a-date")).toBe("not-a-date");
  });
});
