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
      <div className="flex flex-1 flex-col bg-slate-50">
        {navbar}

        <main className="flex-1 p-8 lg:p-10">
          <div className="mx-auto w-full max-w-7xl">
            <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}