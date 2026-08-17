import {
  fetchProgramBySlug,
  fetchProgramRiderBySlug,
  fetchProgramRegulations,
  fetchProgramRiders,
  fetchProgramStandings,
} from "@/lib/cms-data";
import type {
  MotorsportProgramDetail,
  MotorsportRegulation,
  MotorsportRider,
  ProgramNavItem,
  StandingEntry,
} from "@/types/design-system";
import type { Locale } from "@/lib/i18n/config";
import { isStrapiPreviewEnabled } from "@/lib/strapi/client";

export const IJTC_SLUG = "indonesia-junior-talent-cup";
export const IJTC_BASE_PATH = `/events/${IJTC_SLUG}`;

export const IJTC_NAV_ITEMS: ProgramNavItem[] = [
  { label: "Overview", href: IJTC_BASE_PATH, exact: true },
  {
    label: "Race Schedule",
    href: `${IJTC_BASE_PATH}/race-schedule`,
    exact: true,
  },
  { label: "Riders", href: `${IJTC_BASE_PATH}/riders` },
  { label: "Standings", href: `${IJTC_BASE_PATH}/standings`, exact: true },
  { label: "About IJTC", href: `${IJTC_BASE_PATH}/about`, exact: true },
  { label: "Regulation", href: `${IJTC_BASE_PATH}/regulation`, exact: true },
];

export const IJTC_BECOME_RIDERS_LINK: ProgramNavItem = {
  label: "Become Riders",
  href: `${IJTC_BASE_PATH}/become-riders`,
  exact: true,
};

export function formatProgramStatus(
  status: MotorsportProgramDetail["status"],
): string {
  const labels: Record<MotorsportProgramDetail["status"], string> = {
    announced: "Announced",
    registrationOpen: "Registration open",
    ticketsOpen: "Tickets open",
    live: "Live",
    completed: "Completed",
    hidden: "Hidden",
  };
  return labels[status];
}

export function isIjtcHidden(program: MotorsportProgramDetail | null): boolean {
  return !program || program.status === "hidden";
}

export function getIjtcInformationBand(
  program: MotorsportProgramDetail,
  fallback: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{ label: string; value: string }>;
  },
) {
  const band = program.informationBand;
  return {
    isActive: band?.isActive ?? true,
    showMetricGroup: band?.showMetricGroup ?? true,
    eyebrow: band?.eyebrow ?? fallback.eyebrow,
    title: band?.title ?? fallback.title,
    description: band?.description ?? fallback.description,
    items: band?.metrics?.length ? band.metrics : fallback.items,
  };
}

const FALLBACK_PROGRAM: MotorsportProgramDetail = {
  title: "Indonesia Junior Talent Cup",
  slug: IJTC_SLUG,
  href: IJTC_BASE_PATH,
  programType: "juniorTalentCup",
  status: "registrationOpen",
  seasonLabel: "2026 Season",
  summary:
    "A development programme for Indonesia's next generation of motorcycle racing talent, combining structured race rounds, rider development, standings, and clear sporting regulations.",
  headline: "The next generation starts here.",
  image: "/media/sarga-motorsport-discipline-motorcycle-daylight.jpg",
  imageAlt: "Junior motorcycle racers competing on a daylight circuit",
  ctaLabel: "Explore IJTC",
  becomeRidersLabel: "Become Riders",
  becomeRidersHref: `${IJTC_BASE_PATH}/become-riders`,
  schedule: [
    {
      id: "ijtc-round-01",
      roundLabel: "Round 01",
      title: "Selection and orientation weekend",
      dateLabel: "Demo / 14–15 Feb 2026",
      venue: "Sentul International Karting Circuit",
      description:
        "Candidate assessment, rider briefing, safety orientation, and programme onboarding.",
      status: "upcoming",
      sessions: [
        { label: "Briefing", time: "08:00" },
        { label: "Track", time: "10:30" },
      ],
    },
    {
      id: "ijtc-round-02",
      roundLabel: "Round 02",
      title: "Race development weekend",
      dateLabel: "Demo / 28–29 Mar 2026",
      venue: "Pertamina Mandalika Circuit",
      description:
        "Coached track sessions and structured race simulations for the selected rider group.",
      status: "upcoming",
      sessions: [
        { label: "Practice", time: "09:00" },
        { label: "Race", time: "14:00" },
      ],
    },
    {
      id: "ijtc-round-03",
      roundLabel: "Round 03",
      title: "Cornering and race-craft round",
      dateLabel: "Demo / 09–10 May 2026",
      venue: "Sentul International Circuit",
      description:
        "Race-line development, overtaking drills, and supervised sprint competition.",
      status: "upcoming",
    },
    {
      id: "ijtc-round-04",
      roundLabel: "Round 04",
      title: "Mid-season classification round",
      dateLabel: "Demo / 20–21 Jun 2026",
      venue: "Pertamina Mandalika Circuit",
      description:
        "A two-day programme checkpoint with practice, qualifying, and classified races.",
      status: "upcoming",
    },
    {
      id: "ijtc-round-05",
      roundLabel: "Round 05",
      title: "Wet-weather control workshop",
      dateLabel: "Demo / 01–02 Aug 2026",
      venue: "Sentul International Karting Circuit",
      description:
        "Controlled drills focused on grip management, visibility, and safe race decisions.",
      status: "upcoming",
    },
    {
      id: "ijtc-round-06",
      roundLabel: "Round 06",
      title: "National development round",
      dateLabel: "Demo / 12–13 Sep 2026",
      venue: "Gelora Bung Tomo Circuit",
      description:
        "A travelling round that adds circuit adaptation and team communication to the programme.",
      status: "upcoming",
    },
    {
      id: "ijtc-round-07",
      roundLabel: "Round 07",
      title: "Performance consolidation weekend",
      dateLabel: "Demo / 17–18 Oct 2026",
      venue: "Sentul International Circuit",
      description:
        "Data review, qualifying execution, and race consistency ahead of the finale.",
      status: "upcoming",
    },
    {
      id: "ijtc-round-08",
      roundLabel: "Round 08",
      title: "Season finale and review",
      dateLabel: "Demo / 28–29 Nov 2026",
      venue: "Pertamina Mandalika Circuit",
      description:
        "Final classification races followed by programme review and development feedback.",
      status: "upcoming",
    },
  ],
};

const FALLBACK_RIDER_SPECS = [
  ["Arka Pranata", "07", "Apex Junior Racing", "West Java"],
  ["Nara Ayuningtyas", "11", "Velocity Academy", "Central Java"],
  ["Bima Kresna", "14", "Garuda Corse", "East Java"],
  ["Citra Maheswari", "18", "Ignition Talent", "Bali"],
  ["Daffa Ramadhan", "21", "Apex Junior Racing", "Banten"],
  ["Elang Saputra", "24", "Velocity Academy", "Yogyakarta"],
  ["Farah Nabila", "27", "Garuda Corse", "West Sumatra"],
  ["Galang Wiratama", "31", "Ignition Talent", "South Sulawesi"],
  ["Hana Putri", "34", "Apex Junior Racing", "North Sumatra"],
  ["Iqbal Santoso", "39", "Velocity Academy", "East Kalimantan"],
  ["Jihan Larasati", "42", "Garuda Corse", "Jakarta"],
  ["Keanu Adiputra", "46", "Ignition Talent", "West Java"],
  ["Laila Maharani", "51", "Apex Junior Racing", "Central Java"],
  ["Miko Wibowo", "55", "Velocity Academy", "East Java"],
  ["Nadia Kirana", "61", "Garuda Corse", "Bali"],
  ["Oka Prasetya", "64", "Ignition Talent", "Riau"],
  ["Putra Mahendra", "72", "Apex Junior Racing", "South Sumatra"],
  ["Qori Anindita", "77", "Velocity Academy", "West Nusa Tenggara"],
  ["Raka Firmansyah", "84", "Garuda Corse", "South Kalimantan"],
  ["Sari Wulandari", "93", "Ignition Talent", "East Nusa Tenggara"],
] as const;

const FALLBACK_RIDERS: MotorsportRider[] = FALLBACK_RIDER_SPECS.map(
  ([name, number, team, region], index) => ({
    name,
    slug: `ijtc-demo-rider-${String(index + 1).padStart(2, "0")}`,
    number,
    team,
    region,
    nationality: "Indonesia",
    portrait: `/media/riders/ijtc-grid-rider-portrait-${String(index + 1).padStart(2, "0")}.png`,
    portraitAlt: `Fictional demonstration portrait for ${name}`,
    bio: `Fictional demonstration rider profile for CMS and layout testing. ${name} represents the programme pathway from ${region}; replace all profile details with approved IJTC participant data before launch.`,
  }),
);

const FALLBACK_STANDINGS: StandingEntry[] = FALLBACK_RIDERS.map(
  (rider, index) => ({
    position: index + 1,
    rider: rider.name,
    riderSlug: rider.slug,
    number: rider.number,
    team: rider.team,
    region: rider.region,
    portrait: rider.portrait,
    portraitAlt: rider.portraitAlt,
    points: Math.max(18, 152 - index * 7),
    resultSummary: `Demo Round 04 classification: P${String((index % 10) + 1).padStart(2, "0")}.`,
  }),
);

const FALLBACK_REGULATION: MotorsportRegulation = {
  title: "IJTC Sporting Regulation",
  version: "Awaiting approved release",
  effectiveDate: "Publication pending",
  summary:
    "The regulation download will be enabled only after the approved sporting PDF is uploaded and activated by the Motorsport editorial team.",
};

async function isIjtcPreview() {
  try {
    return await isStrapiPreviewEnabled();
  } catch {
    // Static generation has no request context and must use published behavior.
    return false;
  }
}

export async function getIjtcProgram(
  locale?: Locale,
): Promise<MotorsportProgramDetail | null> {
  const [program, isPreview] = await Promise.all([
    fetchProgramBySlug(IJTC_SLUG, locale).catch(() => null),
    isIjtcPreview(),
  ]);
  if (!program) return isPreview ? null : FALLBACK_PROGRAM;
  return {
    ...program,
    schedule: program.schedule.length
      ? program.schedule
      : isPreview
        ? []
        : FALLBACK_PROGRAM.schedule,
    becomeRidersHref: program.becomeRidersHref ?? IJTC_BECOME_RIDERS_LINK.href,
  };
}

export async function getIjtcRiders(
  locale?: Locale,
): Promise<MotorsportRider[]> {
  const [riders, isPreview] = await Promise.all([
    fetchProgramRiders(IJTC_SLUG, locale).catch(() => []),
    isIjtcPreview(),
  ]);
  return riders.length || isPreview ? riders : FALLBACK_RIDERS;
}

export async function getIjtcRider(
  riderSlug: string,
  locale?: Locale,
): Promise<MotorsportRider | null> {
  const [rider, isPreview] = await Promise.all([
    fetchProgramRiderBySlug(IJTC_SLUG, riderSlug, locale).catch(() => null),
    isIjtcPreview(),
  ]);
  if (rider || isPreview) return rider;
  return FALLBACK_RIDERS.find((entry) => entry.slug === riderSlug) ?? null;
}

export async function getIjtcStandings(
  locale?: Locale,
): Promise<StandingEntry[]> {
  const [standings, isPreview] = await Promise.all([
    fetchProgramStandings(IJTC_SLUG, locale).catch(() => []),
    isIjtcPreview(),
  ]);
  return standings.length || isPreview ? standings : FALLBACK_STANDINGS;
}

export async function getIjtcRegulation(
  locale?: Locale,
): Promise<MotorsportRegulation | null> {
  const [regulations, isPreview] = await Promise.all([
    fetchProgramRegulations(IJTC_SLUG, locale).catch(() => []),
    isIjtcPreview(),
  ]);
  return regulations[0] ?? (isPreview ? null : FALLBACK_REGULATION);
}
