import type { MotorsportInformationBandMetric } from "@/lib/motorsport-page-foundation";

type MotorsportMetricGroupProps = {
  items: MotorsportInformationBandMetric[];
  columns?: "two" | "three";
  labelClassName?: string;
  valueClassName?: string;
  className?: string;
};

export function MotorsportMetricGroup({
  items,
  columns = "three",
  labelClassName = "text-ms-slipstream-teal",
  valueClassName = "text-ms-warm-white",
  className = "",
}: MotorsportMetricGroupProps) {
  const visibleItems = items.slice(0, 3);
  if (visibleItems.length === 0) return null;

  return (
    <dl
      className={`grid ${columns === "two" ? "grid-cols-2" : "grid-cols-3"} border-l border-ms-warm-white/20 ${className}`}
    >
      {visibleItems.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="border-r border-ms-warm-white/20 px-4 py-2"
        >
          <dt className={`ms-data-label ${labelClassName}`}>{item.label}</dt>
          <dd
            className={`ms-tabular mt-3 text-xs font-extrabold uppercase tracking-[0.06em] sm:text-sm ${valueClassName}`}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
