import { disciplineLabel } from "./disciplines";
import type {
  JobDiscipline,
  JobEmploymentType,
  JobVacancy,
  JobWorkMode,
} from "../strapi/types";

export type JobFilters = {
  query: string;
  discipline: JobDiscipline | "all";
  employmentType: JobEmploymentType | "all";
  workMode: JobWorkMode | "all";
};

export function filterOpenJobs(
  jobs: JobVacancy[],
  filters: JobFilters,
): JobVacancy[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return jobs.filter((job) => {
    const searchable = [
      job.title,
      job.summary,
      job.location,
      job.seniority,
      disciplineLabel(job.discipline),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      job.vacancyStatus === "open" &&
      (!normalizedQuery || searchable.includes(normalizedQuery)) &&
      (filters.discipline === "all" || job.discipline === filters.discipline) &&
      (filters.employmentType === "all" ||
        job.employmentType === filters.employmentType) &&
      (filters.workMode === "all" || job.workMode === filters.workMode)
    );
  });
}

export function paginateJobs(
  jobs: JobVacancy[],
  requestedPage: number,
  pageSize: number,
) {
  const pageCount = Math.max(1, Math.ceil(jobs.length / pageSize));
  const page = Math.min(Math.max(1, requestedPage), pageCount);
  return {
    page,
    pageCount,
    items: jobs.slice((page - 1) * pageSize, page * pageSize),
  };
}
