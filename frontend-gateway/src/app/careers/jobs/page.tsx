import type { Metadata } from "next";
import { EditorialHeading } from "@/components/sections/editorial-heading";
import { InteriorHero } from "@/components/sections/interior-hero";
import { JobVacancyBrowser } from "@/components/sections/job-vacancy-browser";
import { careerDisciplines } from "@/lib/careers/disciplines";
import { createMetadata } from "@/lib/seo/metadata";
import { getJobVacancies } from "@/lib/strapi/jobs";
import type { JobDiscipline } from "@/lib/strapi/types";
import { getRequestLocale } from "@/lib/i18n/request";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return createMetadata({
    title: "Job Vacancies",
    description:
      "Search current Sarga opportunities across sport, venues, media, technology, and group functions.",
    path: "/careers/jobs",
    locale,
    isFallback: locale === "id",
  });
}

type JobsPageProps = {
  searchParams: Promise<{ discipline?: string | string[] }>;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const locale = await getRequestLocale();
  const params = await searchParams;
  const requestedDiscipline = Array.isArray(params.discipline)
    ? params.discipline[0]
    : params.discipline;
  const initialDiscipline = careerDisciplines.some(
    (item) => item.id === requestedDiscipline,
  )
    ? (requestedDiscipline as JobDiscipline)
    : undefined;
  const jobs = await getJobVacancies(locale);
  const openCount = jobs.filter((job) => job.vacancyStatus === "open").length;

  return (
    <>
      <InteriorHero
        index="06"
        eyebrow="Opportunity roster"
        title="Find the work that moves you."
        description="Search current openings across the Sarga ecosystem. Role details are managed by the recruitment team and applications continue securely to LinkedIn."
        meta={[
          `${openCount} open ${openCount === 1 ? "role" : "roles"}`,
          "Four disciplines",
          "CMS managed",
          "Apply via LinkedIn",
        ]}
        tone="slate"
      />
      <section className="gateway-warm-panel py-20 sm:py-28 lg:py-36">
        <div className="site-container">
          <EditorialHeading
            index="01"
            eyebrow="Search the roster"
            title="A precise place to begin."
            description="Use a discipline menu, keyword, employment type, and work mode to narrow the current vacancy list."
          />
          <div className="mt-14">
            <JobVacancyBrowser
              jobs={jobs}
              initialDiscipline={initialDiscipline}
            />
          </div>
        </div>
      </section>
    </>
  );
}
