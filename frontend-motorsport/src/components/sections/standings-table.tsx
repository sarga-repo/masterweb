import { LocaleLink as Link } from "@/components/i18n/locale-link";

import { RiderPortrait } from "@/components/ui/rider-portrait";
import type { StandingEntry } from "@/types/design-system";

const IJTC_RIDERS_PATH = "/events/indonesia-junior-talent-cup/riders";

type StandingsTableProps = {
  entries: StandingEntry[];
  caption: string;
  emptyMessage?: string;
};

export function StandingsTable({
  entries,
  caption,
  emptyMessage = "Standings will be published after the first classified round.",
}: StandingsTableProps) {
  return (
    <div className="ms-panel ms-blue-panel overflow-hidden">
      <div className="ms-blue-band flex items-center justify-between gap-6 px-5 py-4 sm:px-7">
        <h2 className="font-display text-lg uppercase">{caption}</h2>
        <span className="ms-data-label text-ms-warm-white/55">
          Official classification
        </span>
      </div>
      {entries.length > 0 ? (
        <div className="ms-scrollbar overflow-x-auto">
          <table className="ms-table min-w-[56rem]">
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr>
                <th scope="col">Pos</th>
                <th scope="col">Rider</th>
                <th scope="col">No.</th>
                <th scope="col">Team / Region</th>
                <th scope="col">Latest result</th>
                <th scope="col" className="text-right!">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={`${entry.position}-${entry.rider}`}>
                  <td className="font-display text-2xl text-ms-electric-yellow">
                    {String(entry.position).padStart(2, "0")}
                  </td>
                  <th scope="row" className="text-left">
                    {entry.riderSlug ? (
                      <Link
                        href={`${IJTC_RIDERS_PATH}/${entry.riderSlug}`}
                        className="group/rider inline-flex items-center gap-3"
                      >
                        <span className="relative block size-12 shrink-0 overflow-hidden border border-ms-warm-white/14 bg-ms-charcoal-black">
                          <RiderPortrait
                            src={entry.portrait}
                            alt={entry.portraitAlt ?? entry.rider}
                            number={entry.number}
                            sizes="48px"
                            className="object-cover transition-transform duration-500 group-hover/rider:scale-105"
                          />
                        </span>
                        <span className="font-display text-lg uppercase transition-colors group-hover/rider:text-ms-electric-yellow">
                          {entry.rider}
                        </span>
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-3">
                        <span className="relative block size-12 shrink-0 overflow-hidden border border-ms-warm-white/14 bg-ms-charcoal-black">
                          <RiderPortrait
                            src={entry.portrait}
                            alt={entry.portraitAlt ?? entry.rider}
                            number={entry.number}
                            sizes="48px"
                            className="object-cover"
                          />
                        </span>
                        <span className="font-display text-lg uppercase">
                          {entry.rider}
                        </span>
                      </span>
                    )}
                  </th>
                  <td className="text-ms-warm-white/62">
                    {entry.number ?? "-"}
                  </td>
                  <td>
                    <span className="block text-sm font-bold">
                      {entry.team ?? "Independent"}
                    </span>
                    {entry.region ? (
                      <span className="ms-data-label mt-1 block text-ms-warm-white/42">
                        {entry.region}
                      </span>
                    ) : null}
                  </td>
                  <td className="text-sm text-ms-warm-white/55">
                    {entry.resultSummary ?? "-"}
                  </td>
                  <td className="text-right font-display text-2xl">
                    {entry.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="p-8 text-sm leading-7 text-ms-warm-white/58">
          {emptyMessage}
        </p>
      )}
    </div>
  );
}
