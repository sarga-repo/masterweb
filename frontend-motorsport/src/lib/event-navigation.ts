import type { LinkItem, MotorsportProgram } from "@/types/design-system";

type EventMenuProgram = Pick<
  MotorsportProgram,
  "title" | "href" | "eventMenuLabel" | "eventMenuEnabled" | "status"
>;

const FALLBACK_EVENT_PROGRAMS: EventMenuProgram[] = [
  {
    title: "FIA Rallycross World Cup Indonesia 2026",
    eventMenuLabel: "FIA Rallycross",
    eventMenuEnabled: true,
    href: "/events/fia-rallycross-world-cup-indonesia-2026",
    status: "ticketsOpen",
  },
  {
    title: "Indonesia Junior Talent Cup",
    eventMenuLabel: "IJTC",
    eventMenuEnabled: true,
    href: "/events/indonesia-junior-talent-cup",
    status: "registrationOpen",
  },
];

function shortLabel(program: EventMenuProgram) {
  const label = program.eventMenuLabel?.trim();
  if (label) return label;
  return program.title.length > 30
    ? `${program.title.slice(0, 27).trimEnd()}…`
    : program.title;
}

/**
 * Build the Event dropdown from the same CMS program records on every route.
 * Explicit opt-in is required; hidden programs never leak into navigation.
 */
export function buildEventMenuLinks(
  programs: EventMenuProgram[],
  isPreview: boolean,
): LinkItem[] {
  const source =
    programs.length > 0 ? programs : isPreview ? [] : FALLBACK_EVENT_PROGRAMS;

  const seen = new Set<string>();
  return source
    .filter(
      (program) =>
        program.status !== "hidden" && program.eventMenuEnabled === true,
    )
    .map((program) => ({
      label: shortLabel(program),
      href: program.href,
    }))
    .filter((item) => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    });
}
