import Link from "next/link";

import { DownloadIcon } from "@/components/ui/icons";

type RegulationDownloadPanelProps = {
  title: string;
  summary?: string;
  version?: string;
  effectiveDate?: string;
  fileHref?: string;
  fileLabel?: string;
  fileSizeLabel?: string;
};

export function RegulationDownloadPanel({
  title,
  summary,
  version,
  effectiveDate,
  fileHref,
  fileLabel = "Download regulation PDF",
  fileSizeLabel,
}: RegulationDownloadPanelProps) {
  return (
    <aside className="ms-panel ms-ticket-panel-reflected relative overflow-hidden">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="p-7 sm:p-10 lg:p-12">
          <p className="ms-kicker text-ms-slipstream-teal">Official document</p>
          <h2 className="ms-heading-section mt-5 max-w-4xl">{title}</h2>
          {summary ? <p className="ms-copy-lg mt-6">{summary}</p> : null}
          {version || effectiveDate ? (
            <dl className="ms-tabular mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-ms-warm-white/12 pt-5">
              {version ? (
                <div>
                  <dt className="ms-data-label text-ms-warm-white/42">
                    Version
                  </dt>
                  <dd className="mt-2 text-sm font-bold">{version}</dd>
                </div>
              ) : null}
              {effectiveDate ? (
                <div>
                  <dt className="ms-data-label text-ms-warm-white/42">
                    Effective
                  </dt>
                  <dd className="mt-2 text-sm font-bold">{effectiveDate}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </div>

        {fileHref ? (
          <Link
            href={fileHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group ms-blue-band flex min-h-64 flex-col justify-between border-t border-ms-warm-white/14 p-7 transition-colors hover:bg-ms-apex-crimson lg:min-h-full lg:border-l lg:border-t-0"
          >
            <span className="ms-data-label text-ms-warm-white/52">
              PDF {fileSizeLabel ? `/ ${fileSizeLabel}` : "/ Approved file"}
            </span>
            <span className="font-display text-2xl uppercase leading-tight">
              {fileLabel}
            </span>
            <DownloadIcon className="size-8 transition-transform group-hover:translate-y-1" />
          </Link>
        ) : (
          <div className="flex min-h-52 flex-col justify-between border-t border-ms-warm-white/12 bg-ms-warm-white/4 p-7 lg:min-h-full lg:border-l lg:border-t-0">
            <span className="ms-data-label text-ms-electric-yellow">
              Document pending
            </span>
            <p className="max-w-xs text-sm leading-6 text-ms-warm-white/55">
              No approved regulation file is available. Publication must remain
              inactive until the official PDF is supplied.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
