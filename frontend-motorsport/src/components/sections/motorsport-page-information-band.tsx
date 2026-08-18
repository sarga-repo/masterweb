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
   * Legacy section copy is retained as a safe migration fallback. Once a
   * page's dedicated `informationBand` exists, its copy, metrics, and
   * visibility flags are authoritative.
   */
  fallback?: MotorsportInformationBandFallback;
};

export function MotorsportPageInformationBand({
  band,
  fallback,
}: MotorsportPageInformationBandProps) {
  const isActive =
    (band?.isActive ?? fallback?.isActive ?? true) &&
    fallback?.isActive !== false;
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
      items={useCmsBand ? band?.metrics ?? [] : fallback?.metrics ?? []}
    />
  );
}
