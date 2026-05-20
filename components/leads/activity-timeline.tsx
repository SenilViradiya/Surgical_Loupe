interface Props {
  activities: {
    id: string;

    action: string;

    description: string | null;

    userEmail: string | null;

    createdAt: Date;
  }[];
}

export function ActivityTimeline({
  activities,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Activity Timeline
        </h2>

        <p className="text-muted-foreground text-sm">
          Audit history for this lead
        </p>
      </div>

      <div className="space-y-6">
        {activities.map(
          (activity) => (
            <div
              key={
                activity.id
              }
              className="relative border-l pl-6"
            >
              <div className="absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full bg-black" />

              <p className="font-medium">
                {
                  activity.action
                }
              </p>

              <p className="text-muted-foreground text-sm">
                {
                  activity.description
                }
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {
                  activity.userEmail
                }{" "}
                •{" "}
                {new Date(
                  activity.createdAt
                ).toLocaleString()}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}