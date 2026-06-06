interface Props {
  title: string;

  description?: string;
}

export function EmptyState({
  title,
  description,
}: Props) {
  return (
    <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed">
      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      {description && (
        <p className="text-muted-foreground mt-2 text-sm">
          {description}
        </p>
      )}
    </div>
  );
}
