type InformationBandItem = {
  label: string;
  value: string;
};

type InformationBandProps = {
  isActive?: boolean;
  showMetricGroup?: boolean;
  eyebrow?: string;
  title: string;
  description?: string;
  items?: InformationBandItem[];
};

export function InformationBand({
  isActive = true,
  showMetricGroup = true,
  eyebrow,
  title,
  description,
  items = [],
}: InformationBandProps) {
  if (!isActive) return null;
  const visibleItems = showMetricGroup ? items.slice(0, 3) : [];

  return (
    <section className="ms-blue-band relative overflow-hidden">
      <div
        className="ms-blue-band-grid absolute inset-0 opacity-35"
        aria-hidden="true"
      />
      <div className="ms-shell relative grid gap-10 py-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,.75fr)] lg:items-end lg:py-14">
        <div>
          {eyebrow ? (
            <p className="ms-kicker text-ms-slipstream-teal">{eyebrow}</p>
          ) : null}
          <h2 className="ms-heading-section mt-4 max-w-4xl">{title}</h2>
          {description ? (
            <p className="mt-5 max-w-2xl leading-7 text-ms-warm-white/72">
              {description}
            </p>
          ) : null}
        </div>
        {visibleItems.length > 0 ? (
          <dl className="grid grid-cols-2 border-l border-ms-warm-white/20 sm:grid-cols-3">
            {visibleItems.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className="border-r border-ms-warm-white/20 px-4 py-2"
              >
                <dt className="ms-data-label text-ms-warm-white/52">
                  {item.label}
                </dt>
                  <dd className="ms-blue-band-metric ms-tabular mt-3 text-sm font-extrabold uppercase tracking-[0.06em]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
