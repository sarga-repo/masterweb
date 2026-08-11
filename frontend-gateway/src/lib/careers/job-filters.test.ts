import { describe, expect, it } from "vitest";
import { filterOpenJobs, paginateJobs } from "./job-filters";
import type { JobVacancy } from "../strapi/types";

function vacancy(
  index: number,
  overrides: Partial<JobVacancy> = {},
): JobVacancy {
  return {
    title: `Role ${index}`,
    slug: `role-${index}`,
    discipline: "sport-operations",
    summary: "Competition and performance role",
    description: "Role description",
    location: "Jakarta",
    employmentType: "full-time",
    workMode: "onsite",
    applicationUrl: `https://www.linkedin.com/jobs/view/${index}`,
    vacancyStatus: "open",
    postedDate: "2026-08-10",
    featured: false,
    order: index,
    siteScope: "gateway",
    ...overrides,
  };
}

describe("job vacancy filtering and pagination", () => {
  const jobs = [
    vacancy(1),
    vacancy(2, {
      title: "Broadcast producer",
      discipline: "media-creative",
      employmentType: "contract",
      workMode: "hybrid",
      location: "Bali",
    }),
    vacancy(3, { vacancyStatus: "closed" }),
  ];

  it("excludes closed roles and combines all filters", () => {
    expect(
      filterOpenJobs(jobs, {
        query: "broadcast",
        discipline: "media-creative",
        employmentType: "contract",
        workMode: "hybrid",
      }).map((job) => job.slug),
    ).toEqual(["role-2"]);
  });

  it("returns stable pages and clamps an out-of-range page", () => {
    const manyJobs = Array.from({ length: 20 }, (_, index) =>
      vacancy(index + 1),
    );
    expect(paginateJobs(manyJobs, 1, 8).items).toHaveLength(8);
    expect(paginateJobs(manyJobs, 3, 8).items).toHaveLength(4);
    expect(paginateJobs(manyJobs, 99, 8)).toMatchObject({
      page: 3,
      pageCount: 3,
    });
  });
});
