import type { MotorsportStatus } from "@/types/design-system";

type StatusChipProps = {
  status: MotorsportStatus;
  label?: string;
  className?: string;
};

const STATUS_STYLE: Record<MotorsportStatus, string> = {
  announced: "border-ms-slipstream-teal/45 text-ms-slipstream-teal",
  "tickets-open":
    "border-ms-electric-yellow/50 bg-ms-electric-yellow text-ms-black",
  live: "border-ms-apex-crimson bg-ms-apex-crimson text-ms-warm-white",
  "sold-out": "border-ms-ignition-orange/55 text-ms-ignition-orange",
  completed: "border-ms-warm-white/25 text-ms-warm-white/60",
  cancelled: "border-ms-warm-white/20 text-ms-warm-white/45 line-through",
};

export function StatusChip({ status, label, className = "" }: StatusChipProps) {
  return (
    <span
      className={`inline-flex min-h-7 items-center border px-2.5 py-1 text-[0.625rem] font-extrabold uppercase tracking-[0.16em] ${STATUS_STYLE[status]} ${className}`}
    >
      {status === "live" ? (
        <span
          className="mr-2 size-1.5 rounded-full bg-current"
          aria-hidden="true"
        />
      ) : null}
      {label ?? status.replace("-", " ")}
    </span>
  );
}
