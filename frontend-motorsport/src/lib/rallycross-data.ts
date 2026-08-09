import { fetchCampaignProgramBySlug } from "@/lib/cms-data";
import type { MotorsportCampaignDetail } from "@/types/design-system";

export const FIA_RALLYCROSS_SLUG = "fia-rallycross-world-cup-indonesia-2026";
export const FIA_RALLYCROSS_PATH = `/campaign/${FIA_RALLYCROSS_SLUG}`;

const fallbackCampaign: MotorsportCampaignDetail = {
  title: "FIA Rallycross World Cup Indonesia 2026",
  slug: FIA_RALLYCROSS_SLUG,
  href: FIA_RALLYCROSS_PATH,
  programType: "rallycross",
  status: "ticketsOpen",
  seasonLabel: "2026 Season",
  summary:
    "World-class mixed-surface racing arrives in Jakarta for two days of short-format intensity, instant launches, and fan-close action.",
  headline: "First Time, Wild Action, Closer Than Ever",
  dateLabel: "5-6 December 2026",
  venue: "Jakarta International E-Prix Circuit",
  image: "/media/sarga-motorsport-discipline-rallycross-daylight.jpg",
  imageAlt: "Rallycross cars competing on a mixed-surface circuit in daylight",
  ctaLabel: "Get Your Ticket Now",
  schedule: [
    {
      id: "rallycross-saturday-practice",
      roundLabel: "Saturday / 05 Dec",
      title: "Gates Open & Free Practice",
      dateLabel: "5 December 2026",
      venue: "Jakarta International E-Prix Circuit",
      status: "upcoming",
      description:
        "Enter the fan zone, find your grandstand, and watch the field establish the first mixed-surface benchmark.",
      sessions: [
        { label: "Start", time: "09:00" },
        { label: "Finish", time: "11:30" },
      ],
    },
    {
      id: "rallycross-saturday-qualifying",
      roundLabel: "Saturday / 05 Dec",
      title: "Qualifying Heats",
      dateLabel: "5 December 2026",
      venue: "Jakarta International E-Prix Circuit",
      status: "upcoming",
      description:
        "Head-to-head starts and joker-lap strategy decide the first championship order of the weekend.",
      sessions: [
        { label: "Start", time: "13:00" },
        { label: "Finish", time: "16:00" },
      ],
    },
    {
      id: "rallycross-sunday-warm-up",
      roundLabel: "Sunday / 06 Dec",
      title: "Gates Open & Warm-Up",
      dateLabel: "6 December 2026",
      venue: "Jakarta International E-Prix Circuit",
      status: "upcoming",
      description:
        "Race-day access begins with the final setup window before elimination racing gets under way.",
      sessions: [
        { label: "Start", time: "08:30" },
        { label: "Finish", time: "09:30" },
      ],
    },
    {
      id: "rallycross-sunday-qualifying",
      roundLabel: "Sunday / 06 Dec",
      title: "Final Qualifying Heats",
      dateLabel: "6 December 2026",
      venue: "Jakarta International E-Prix Circuit",
      status: "upcoming",
      description:
        "Every launch matters as the grid fights for the semifinal transfer positions.",
      sessions: [
        { label: "Start", time: "10:00" },
        { label: "Finish", time: "12:00" },
      ],
    },
    {
      id: "rallycross-sunday-finals",
      roundLabel: "Sunday / 06 Dec",
      title: "Semifinals & World Cup Final",
      dateLabel: "6 December 2026",
      venue: "Jakarta International E-Prix Circuit",
      status: "upcoming",
      description:
        "The fastest qualifiers advance into an all-action conclusion and the first Indonesia World Cup podium.",
      sessions: [
        { label: "Start", time: "13:30" },
        { label: "Finish", time: "16:00" },
      ],
    },
  ],
  slides: [
    {
      id: "rallycross-first-time",
      eyebrow: "FIA Rallycross / Campaign 01",
      headline: "First Time",
      description:
        "A landmark World Cup weekend brings international rallycross competition to Indonesia.",
      eventTitle: "FIA Rallycross World Cup Indonesia 2026",
      dateLabel: "5-6 December 2026",
      venue: "Jakarta International E-Prix Circuit",
      image: "/media/hero/sarga-motorsport-hero-rally-highlands.jpg",
      imageAlt: "Rally car attacking a warm highland stage",
      cta: { label: "Get Your Ticket Now", href: "/tickets" },
    },
    {
      id: "rallycross-wild-action",
      eyebrow: "FIA Rallycross / Campaign 02",
      headline: "Wild Action",
      description:
        "Explosive starts, mixed surfaces, and joker-lap strategy compress a full race story into every heat.",
      eventTitle: "FIA Rallycross World Cup Indonesia 2026",
      dateLabel: "5-6 December 2026",
      venue: "Jakarta International E-Prix Circuit",
      image: "/media/sarga-motorsport-discipline-rallycross-daylight.jpg",
      imageAlt: "Rallycross cars fighting through a dusty circuit section",
      cta: {
        label: "View the Rundown",
        href: `${FIA_RALLYCROSS_PATH}#rundown`,
      },
    },
    {
      id: "rallycross-closer-than-ever",
      eyebrow: "FIA Rallycross / Campaign 03",
      headline: "Closer Than Ever",
      description:
        "Grandstands, fan zones, and compact racing put spectators close to every launch and decisive move.",
      eventTitle: "FIA Rallycross World Cup Indonesia 2026",
      dateLabel: "5-6 December 2026",
      venue: "Jakarta International E-Prix Circuit",
      image: "/media/sarga-motorsport-race-nascar-1.png",
      imageAlt: "Race cars competing in front of a packed grandstand",
      cta: {
        label: "Plan Race Day",
        href: `${FIA_RALLYCROSS_PATH}#race-day-guide`,
      },
    },
  ],
  rules: [
    {
      id: "rallycross-do-ticket",
      type: "do",
      title: "Keep your ticket ready",
      description:
        "Have your approved digital or printed ticket available before reaching the entry checkpoint.",
    },
    {
      id: "rallycross-do-early",
      type: "do",
      title: "Arrive before the first heat",
      description:
        "Allow time for security, wayfinding, and the fan zone before the racing programme begins.",
    },
    {
      id: "rallycross-do-weather",
      type: "do",
      title: "Prepare for changing weather",
      description:
        "Use sun protection, stay hydrated, and bring a compact rain layer suitable for an outdoor circuit.",
    },
    {
      id: "rallycross-dont-track",
      type: "dont",
      title: "Do not enter restricted areas",
      description:
        "Track, paddock, and operational zones are accessible only with the correct event accreditation.",
    },
    {
      id: "rallycross-dont-drone",
      type: "dont",
      title: "Do not fly drones",
      description:
        "Personal drones and remotely piloted cameras are not permitted anywhere within the event perimeter.",
    },
    {
      id: "rallycross-dont-glass",
      type: "dont",
      title: "Do not bring glass containers",
      description:
        "Glass bottles and other prohibited items will be refused at the security screening point.",
    },
  ],
  ticketCta: {
    label: "Get Your Ticket Now",
    href: "/tickets",
    provider: "Official ticketing partner",
  },
  seo: {
    title: "FIA Rallycross World Cup Indonesia 2026",
    description:
      "FIA Rallycross World Cup Indonesia 2026 takes over Jakarta International E-Prix Circuit on 5-6 December 2026.",
    ogTitle: "First Time, Wild Action, Closer Than Ever",
    ogDescription:
      "Explore the official rundown, race-day guide, and approved ticket route for Indonesia's FIA Rallycross World Cup weekend.",
    image: "/media/sarga-motorsport-discipline-rallycross-daylight.jpg",
    canonical: FIA_RALLYCROSS_PATH,
    noIndex: false,
  },
};

export async function getFiaRallycrossCampaign(): Promise<MotorsportCampaignDetail> {
  try {
    const campaign = await fetchCampaignProgramBySlug(FIA_RALLYCROSS_SLUG);
    if (!campaign) return fallbackCampaign;
    return {
      ...fallbackCampaign,
      ...campaign,
      schedule: campaign.schedule.length
        ? campaign.schedule
        : fallbackCampaign.schedule,
      slides: campaign.slides.length
        ? campaign.slides
        : fallbackCampaign.slides,
      rules: campaign.rules.length ? campaign.rules : fallbackCampaign.rules,
      ticketCta: campaign.ticketCta ?? fallbackCampaign.ticketCta,
      seo: { ...fallbackCampaign.seo, ...campaign.seo },
    };
  } catch {
    return fallbackCampaign;
  }
}
