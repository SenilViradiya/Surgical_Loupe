interface Props {
  sidebar: React.ReactNode;
  navbar: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardShell({
  sidebar,
  navbar,
  children,
}: Props) {
  return (
    <div className="flex min-h-screen">
      {sidebar}

      <div className="flex flex-1 flex-col">
        {navbar}

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}