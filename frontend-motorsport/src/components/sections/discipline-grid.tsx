import { DisciplineTile } from "@/components/cards/discipline-tile";
import type { DisciplineItem } from "@/types/design-system";

type DisciplineGridProps = {
  items: DisciplineItem[];
  label?: string;
};

export function DisciplineGrid({
  items,
  label = "Motorsport disciplines",
}: DisciplineGridProps) {
  return (
    <div
      aria-label={label}
      className="ms-scrollbar flex snap-x snap-mandatory gap-px overflow-x-auto bg-ms-warm-white/15 pb-2 xl:grid xl:grid-cols-6 xl:overflow-visible xl:pb-0"
    >
      {items.map((item, index) => (
        <div
          key={`${item.title}-${item.href}`}
          className="w-[82vw] shrink-0 snap-start sm:w-[42vw] xl:w-auto"
        >
          <DisciplineTile item={item} priority={index < 2} />
        </div>
      ))}
    </div>
  );
}
