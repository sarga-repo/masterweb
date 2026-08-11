"use client";

import { LocaleLink as Link } from "@/components/i18n/locale-link";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ArrowRightIcon, LinkedInIcon } from "@/components/ui/icons";
import { careerDisciplines, disciplineLabel } from "@/lib/careers/disciplines";
import { filterOpenJobs, paginateJobs } from "@/lib/careers/job-filters";
import type {
  JobDiscipline,
  JobEmploymentType,
  JobVacancy,
  JobWorkMode,
} from "@/lib/strapi/types";

const PAGE_SIZE = 8;

type JobVacancyBrowserProps = {
  jobs: JobVacancy[];
  initialDiscipline?: JobDiscipline;
};

function formatValue(value: string): string {
  return value.replaceAll("-", " ");
}

export function JobVacancyBrowser({
  jobs,
  initialDiscipline,
}: JobVacancyBrowserProps) {
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState<JobDiscipline | "all">(
    initialDiscipline ?? "all",
  );
  const [employmentType, setEmploymentType] = useState<
    JobEmploymentType | "all"
  >("all");
  const [workMode, setWorkMode] = useState<JobWorkMode | "all">("all");
  const [page, setPage] = useState(1);

  const openJobs = useMemo(
    () => jobs.filter((job) => job.vacancyStatus === "open"),
    [jobs],
  );
  const filteredJobs = useMemo(
    () =>
      filterOpenJobs(openJobs, {
        query,
        discipline,
        employmentType,
        workMode,
      }),
    [discipline, employmentType, openJobs, query, workMode],
  );
  const {
    items: visibleJobs,
    page: safePage,
    pageCount,
  } = paginateJobs(filteredJobs, page, PAGE_SIZE);

  function resetPage(action: () => void) {
    action();
    setPage(1);
  }

  return (
    <div>
      <div
        role="group"
        aria-label="Filter vacancies by discipline"
        className="grid border-l border-t border-sarga-black/20 sm:grid-cols-2 xl:grid-cols-4"
      >
        {careerDisciplines.map((item) => {
          const count = openJobs.filter(
            (job) => job.discipline === item.id,
          ).length;
          const active = discipline === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() =>
                resetPage(() => setDiscipline(active ? "all" : item.id))
              }
              className={`min-h-36 border-b border-r border-sarga-black/20 p-6 text-left transition-colors ${
                active
                  ? "bg-sarga-red text-white"
                  : "bg-white/35 hover:bg-white/70"
              }`}
            >
              <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.15em] opacity-65">
                {item.index} / {count} open
              </span>
              <span className="mt-8 block font-heading text-xl font-bold uppercase leading-none tracking-[-0.03em]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 border-y border-sarga-black/20 py-6 md:grid-cols-3">
        <Input
          label="Search vacancies"
          placeholder="Search title, skill, or location"
          type="search"
          value={query}
          onChange={(event) => resetPage(() => setQuery(event.target.value))}
        />
        <Select
          label="Employment type"
          value={employmentType}
          options={[
            { value: "all", label: "All employment types" },
            { value: "full-time", label: "Full time" },
            { value: "part-time", label: "Part time" },
            { value: "contract", label: "Contract" },
            { value: "internship", label: "Internship" },
          ]}
          onChange={(event) =>
            resetPage(() =>
              setEmploymentType(
                event.target.value as JobEmploymentType | "all",
              ),
            )
          }
        />
        <Select
          label="Work mode"
          value={workMode}
          options={[
            { value: "all", label: "All work modes" },
            { value: "onsite", label: "Onsite" },
            { value: "hybrid", label: "Hybrid" },
            { value: "remote", label: "Remote" },
          ]}
          onChange={(event) =>
            resetPage(() =>
              setWorkMode(event.target.value as JobWorkMode | "all"),
            )
          }
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm text-sarga-text-muted">
          Showing {visibleJobs.length} of {filteredJobs.length} matching open
          roles
        </p>
        {discipline !== "all" ? (
          <button
            type="button"
            onClick={() => resetPage(() => setDiscipline("all"))}
            className="text-[0.65rem] font-extrabold uppercase tracking-[0.15em] text-sarga-red underline underline-offset-4"
          >
            Clear discipline
          </button>
        ) : null}
      </div>

      {visibleJobs.length ? (
        <ol className="mt-8 grid border-l border-t border-sarga-black/20 lg:grid-cols-2">
          {visibleJobs.map((job) => (
            <li
              key={job.slug}
              className="flex min-w-0 flex-col border-b border-r border-sarga-black/20 bg-white/30 p-7 sm:p-9"
            >
              <div className="flex flex-wrap gap-2 text-[0.58rem] font-extrabold uppercase tracking-[0.13em] text-sarga-red">
                <span>{disciplineLabel(job.discipline)}</span>
                <span aria-hidden="true">/</span>
                <span>{formatValue(job.employmentType)}</span>
              </div>
              <h2 className="gateway-card-title mt-7 font-heading uppercase">
                <Link href={`/careers/jobs/${job.slug}`}>{job.title}</Link>
              </h2>
              <p className="mt-5 text-sm leading-7 text-sarga-text-muted">
                {job.summary}
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-sarga-black/15 pt-5 text-xs">
                <div>
                  <dt className="font-extrabold uppercase tracking-[0.12em] text-sarga-text/40">
                    Location
                  </dt>
                  <dd className="mt-2 font-semibold">{job.location}</dd>
                </div>
                <div>
                  <dt className="font-extrabold uppercase tracking-[0.12em] text-sarga-text/40">
                    Work mode
                  </dt>
                  <dd className="mt-2 font-semibold capitalize">
                    {formatValue(job.workMode)}
                  </dd>
                </div>
              </dl>
              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-9">
                <Link
                  href={`/careers/jobs/${job.slug}`}
                  className="group inline-flex items-center gap-3 border-b border-sarga-black pb-2 text-[0.65rem] font-extrabold uppercase tracking-[0.15em]"
                >
                  Role details
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                {job.applicationUrl ? (
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[0.65rem] font-extrabold uppercase tracking-[0.15em] text-[#0a66c2]"
                  >
                    <LinkedInIcon className="h-4 w-4" />
                    Apply
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-8 border border-sarga-black/20 bg-white/35 px-7 py-16 text-center sm:px-12">
          <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-sarga-red">
            Opportunity roster
          </p>
          <h2 className="gateway-section-title mx-auto mt-5 max-w-[18ch] font-heading uppercase">
            No roles match this search.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-sarga-text-muted">
            Adjust the filters or return later. Vacancies appear only after the
            recruitment team publishes an approved role.
          </p>
        </div>
      )}

      {pageCount > 1 ? (
        <nav
          aria-label="Vacancy pagination"
          className="mt-10 flex items-center justify-between border-t border-sarga-black/20 pt-6"
        >
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="text-[0.65rem] font-extrabold uppercase tracking-[0.15em] disabled:cursor-not-allowed disabled:opacity-35"
          >
            Previous
          </button>
          <span className="text-xs font-semibold text-sarga-text-muted">
            Page {safePage} of {pageCount}
          </span>
          <button
            type="button"
            disabled={safePage === pageCount}
            onClick={() =>
              setPage((current) => Math.min(pageCount, current + 1))
            }
            className="text-[0.65rem] font-extrabold uppercase tracking-[0.15em] disabled:cursor-not-allowed disabled:opacity-35"
          >
            Next
          </button>
        </nav>
      ) : null}
    </div>
  );
}
