import type { JobDiscipline } from "../strapi/types";

export type CareerDiscipline = {
  id: JobDiscipline;
  index: string;
  label: string;
  description: string;
};

export const careerDisciplines: CareerDiscipline[] = [
  {
    id: "sport-operations",
    index: "01",
    label: "Sport operations",
    description:
      "Competition delivery, athlete services, sporting regulation, and performance programs.",
  },
  {
    id: "venue-experience",
    index: "02",
    label: "Venue & experience",
    description:
      "Track operations, hospitality, guest experience, safety, and event production.",
  },
  {
    id: "media-creative",
    index: "03",
    label: "Media & creative",
    description:
      "Broadcast, editorial, brand systems, content production, and commercial storytelling.",
  },
  {
    id: "technology-group",
    index: "04",
    label: "Technology & group",
    description:
      "Product, data, partnerships, finance, governance, and shared corporate operations.",
  },
];

export function disciplineLabel(id: JobDiscipline): string {
  return (
    careerDisciplines.find((discipline) => discipline.id === id)?.label ?? id
  );
}
