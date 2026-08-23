import type { MotorsportThemePreset } from "@/lib/motorsport-theme";

/**
 * The homepage alternation is deliberately server-side and render-order based.
 * A hidden CMS section never calls `nextClass`, so it cannot consume a surface
 * slot. Keeping this logic pure also lets other route compositions reuse the
 * same contract without coupling them to React or the browser.
 */
export function createSurfaceSequencer(
  theme: MotorsportThemePreset | string | null | undefined,
) {
  const isVendorEditorial =
    theme === "vendor-editorial" || theme === "theme-vendor-editorial";
  let visibleSectionIndex = 0;

  return {
    nextClass(): string {
      if (!isVendorEditorial) {
        return "";
      }

      const surface =
        visibleSectionIndex % 2 === 0
          ? "ms-home-alternating-surface ms-home-alternating-surface--light ms-editorial-surface"
          : "ms-home-alternating-surface ms-home-alternating-surface--dark ms-editorial-dark-surface";

      visibleSectionIndex += 1;
      return surface;
    },
  };
}
