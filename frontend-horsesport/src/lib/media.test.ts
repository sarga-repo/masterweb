import { describe, expect, it } from "vitest";
import { resolveImageAlt } from "./media-alt";

describe("media fallback contract", () => {
  it("uses non-empty fallback alt text", () => {
    expect(resolveImageAlt("  ", "Race-day image")).toBe("Race-day image");
    expect(resolveImageAlt("Jockey", "Race-day image")).toBe("Jockey");
  });
});
