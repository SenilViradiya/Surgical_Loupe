interface Props {
  dealers: {
    id: string;

    name: string;

    totalLeads: number;

    converted: number;
  }[];
}

export function DealerPerformance({
  dealers,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Dealer Performance
        </h2>

        <p className="text-muted-foreground text-sm">
          Dealer conversion overview
        </p>
      </div>

      <div className="space-y-4">
        {dealers.map(
          (dealer) => (
            <div
              key={dealer.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <p className="font-medium">
                  {
                    dealer.name
                  }
                </p>

                <p className="text-muted-foreground text-sm">
                  {
                    dealer.totalLeads
                  }{" "}
                  leads
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold">
                  {
                    dealer.converted
                  }
                </p>

                <p className="text-muted-foreground text-sm">
                  Converted
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}