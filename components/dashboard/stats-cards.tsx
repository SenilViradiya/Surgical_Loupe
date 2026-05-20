interface Props {
  stats: {
    totalLeads: number;

    convertedLeads: number;

    totalDealers: number;

    totalFrames: number;

    conversionRate: string | number;
  };
}

export function StatsCards({
  stats,
}: Props) {
  const items = [
    {
      label:
        "Total Leads",

      value:
        stats.totalLeads,
    },

    {
      label:
        "Converted Leads",

      value:
        stats.convertedLeads,
    },

    {
      label:
        "Conversion Rate",

      value: `${stats.conversionRate}%`,
    },

    {
      label:
        "Dealers",

      value:
        stats.totalDealers,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border bg-white p-6"
        >
          <p className="text-muted-foreground text-sm">
            {item.label}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}