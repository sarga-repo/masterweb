export const MOTORSPORT_THEME_PRESETS = [
  "current-motorsport",
  "vendor-editorial",
  "vendor-night",
] as const;

export type MotorsportThemePreset = (typeof MOTORSPORT_THEME_PRESETS)[number];

export const DEFAULT_MOTORSPORT_THEME: MotorsportThemePreset =
  "current-motorsport";

export function isMotorsportThemePreset(
  value: unknown,
): value is MotorsportThemePreset {
  return (
    typeof value === "string" &&
    (MOTORSPORT_THEME_PRESETS as readonly string[]).includes(value)
  );
}

export function resolveMotorsportTheme(value: unknown): MotorsportThemePreset {
  return isMotorsportThemePreset(value) ? value : DEFAULT_MOTORSPORT_THEME;
}

export function motorsportThemeAttribute(
  value: unknown,
): `theme-${MotorsportThemePreset}` {
  return `theme-${resolveMotorsportTheme(value)}`;
}
