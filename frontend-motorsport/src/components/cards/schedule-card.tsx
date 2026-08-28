import { MarkdownContent } from "@/components/content/markdown-content";
import type { ScheduleEntry } from "@/types/design-system";

type ScheduleCardProps = {
  entry: ScheduleEntry;
};

const statusStyles: Record<NonNullable<ScheduleEntry["status"]>, string> = {
  upcoming: "text-ms-electric-yellow",
  live: "text-ms-slipstream-teal",
  completed: "text-ms-warm-white/42",
};

export function ScheduleCard({ entry }: ScheduleCardProps) {
  const status = entry.status ?? "upcoming";

  return (
    <article className="ms-panel ms-blue-panel grid overflow-hidden md:grid-cols-[minmax(11rem,13rem)_minmax(0,1fr)]">
      <div className="ms-blue-band flex min-w-0 flex-col justify-between border-b border-ms-warm-white/14 p-5 md:border-b-0 md:border-r md:p-6">
        <p className="ms-data-label text-ms-warm-white/55">
          {entry.roundLabel}
        </p>
        <p className="ms-tabular mt-8 max-w-full font-display text-[clamp(1.15rem,2vw,1.65rem)] uppercase leading-[0.92] [overflow-wrap:anywhere]">
          {entry.dateLabel}
        </p>
      </div>
      <div className="grid gap-7 p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start lg:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <p className={`ms-data-label ${statusStyles[status]}`}>{status}</p>
            <span className="size-1 bg-ms-warm-white/32" aria-hidden="true" />
            <p className="ms-data-label text-ms-warm-white/42">{entry.venue}</p>
          </div>
          <h3 className="ms-heading-card mt-4">{entry.title}</h3>
          {entry.description ? (
            <MarkdownContent
              value={entry.description}
              className="ms-rich-text mt-4 max-w-2xl text-sm leading-6 text-ms-warm-white/58"
            />
          ) : null}
        </div>
        {entry.sessions?.length ? (
          <dl className="min-w-56 border-l border-ms-warm-white/12 pl-5">
            {entry.sessions.map((session) => (
              <div
                key={`${session.label}-${session.time}`}
                className="ms-tabular flex justify-between gap-8 border-b border-ms-warm-white/10 py-2 text-xs uppercase"
              >
                <dt className="text-ms-warm-white/52">{session.label}</dt>
                <dd className="font-extrabold">{session.time}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </article>
  );
}
