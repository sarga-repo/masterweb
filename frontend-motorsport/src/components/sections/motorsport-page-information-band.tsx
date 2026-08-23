import { InformationBand } from "./information-band";
import type { MotorsportPageInformationBand } from "@/lib/motorsport-page-foundation";

export type MotorsportInformationBandFallback = {
  isActive?: boolean;
  eyebrow?: string;
  title: string;
  description?: string;
  metrics?: Array<{ label: string; value: string }>;
};

type MotorsportPageInformationBandProps = {
  band?: MotorsportPageInformationBand | null;
  /**
   * Legacy section copy is retained only as a migration-era content fallback.
   * It cannot control visibility; `informationBand.isActive` is the sole
   * visible section switch.
   */
  fallback?: MotorsportInformationBandFallback;
};

export function MotorsportPageInformationBand({
  band,
  fallback,
}: MotorsportPageInformationBandProps) {
  const isActive = band?.isActive !== false;
  const useCmsBand = Boolean(band);

  return (
    <InformationBand
      isActive={isActive}
      showEyebrow={useCmsBand ? band?.showEyebrow : true}
      showTitle={useCmsBand ? band?.showTitle : true}
      showDescription={useCmsBand ? band?.showDescription : true}
      showMetricGroup={useCmsBand ? band?.showMetricGroup : true}
      eyebrow={band?.eyebrow ?? fallback?.eyebrow}
      title={band?.title || fallback?.title || "Motorsport"}
      description={band?.description ?? fallback?.description}
      items={useCmsBand ? (band?.metrics ?? []) : (fallback?.metrics ?? [])}
    />
  );
}
