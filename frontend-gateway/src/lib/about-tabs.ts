import { aboutTabs } from "@/lib/mock-data";
import type { AboutTab, AboutTabItem } from "@/lib/mock-data";
import type {
  LeadershipPerson,
  SitePage,
  TimelineItem,
} from "@/lib/strapi/types";

/**
 * Normalise the shared CMS records used by both the homepage and About page.
 * Mock records remain a development fallback only; live Strapi records win.
 */
export function buildAboutTabs(
  timelineItems: TimelineItem[],
  leadershipPeople: LeadershipPerson[],
  reportPages: SitePage[],
): AboutTab[] {
  const historyFallback = aboutTabs.find((tab) => tab.id === "history");
  const leadershipFallback = aboutTabs.find((tab) => tab.id === "leadership");

  const historyItems: AboutTabItem[] =
    timelineItems.length > 0
      ? timelineItems.map((item) => ({
          meta: `${item.year} — ${item.label}`,
          title: item.title,
          description: item.description,
          image: item.image,
          href: "/about/history",
        }))
      : (historyFallback?.items.map((item) => ({
          ...item,
          href: "/about/history",
        })) ?? []);

  const leadershipItems: AboutTabItem[] =
    leadershipPeople.length > 0
      ? leadershipPeople.map((person) => ({
          meta: person.role,
          title: person.name,
          description:
            person.biography ??
            `Member of the ${person.group === "board" ? "Board of Directors" : "Executive Council"}.`,
          image: person.portrait,
          href: "/about/board-of-directors",
        }))
      : (leadershipFallback?.items.map((item) => ({
          ...item,
          href: "/about/board-of-directors",
        })) ?? []);

  const reportItems: AboutTabItem[] = reportPages.map((page) => ({
    meta: page.navigationLabel ?? "Corporate publication",
    title: page.heroTitle ?? page.title,
    description:
      page.heroDescription ??
      page.sections[0]?.body ??
      "Approved corporate publications are managed through Sarga CMS.",
    image: page.heroMedia,
    href: page.routePath,
  }));

  return [
    {
      id: "history",
      label: "History Timeline",
      items: historyItems,
      emptyMessage: historyFallback?.emptyMessage,
    },
    {
      id: "leadership",
      label: "Leadership Council",
      items: leadershipItems,
      emptyMessage:
        leadershipFallback?.emptyMessage ??
        "Leadership profiles will appear when the approved council roster is published.",
    },
    {
      id: "reports",
      label: "Reports & Charters",
      items: reportItems,
      emptyMessage:
        "Corporate reports and sustainability charters will appear when approved in Sarga CMS.",
    },
  ];
}
