import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.35),rgba(15,23,42,0))]" />
        <div className="absolute -bottom-56 left-1/3 h-96 w-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.25),rgba(15,23,42,0))] animate-float-slow" />
        <div className="absolute top-24 right-[-8rem] h-64 w-64 rounded-full border border-white/10 bg-white/5" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-12">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white/10 backdrop-blur" />
          <span className="text-sm uppercase tracking-[0.25em] text-white/60">
            Surgical Loupe
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white/60 hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/configurator"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-white/20 transition hover:-translate-y-0.5"
          >
            Launch configurator
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col gap-16 px-6 pb-20 pt-8 sm:px-12 lg:px-20">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="animate-fade-up space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">
              Precision optics platform
            </p>
            <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              Build custom surgical loupes with clarity, speed, and surgical-grade detail.
            </h1>
            <p className="max-w-xl text-base text-white/70 sm:text-lg">
              Let teams configure frames, lenses, and headlights in minutes. Capture intent, route to dealers, and keep every interaction logged in one refined workspace.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/configurator"
                className="rounded-full bg-cyan-300 px-6 py-3 text-center text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-300/40 transition hover:-translate-y-0.5"
              >
                Start a configuration
              </Link>
              <Link
                href="/admin"
                className="rounded-full border border-white/25 px-6 py-3 text-center text-sm font-semibold text-white/80 transition hover:border-white/60 hover:text-white"
              >
                Open admin dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                label: "Avg. quote time",
                value: "4 min",
              },
              {
                label: "Active dealer hubs",
                value: "38",
              },
              {
                label: "Configuration steps",
                value: "6",
              },
              {
                label: "Customer touchpoints",
                value: "12",
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-white/30"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <p className="text-sm text-white/60">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Immersive configurator",
              description: "Interactive selection flow with price feedback and 3D-ready assets for each frame and lens combination.",
            },
            {
              title: "Lead orchestration",
              description: "Track every inquiry with statuses, dealer assignment, and activity timeline for total accountability.",
            },
            {
              title: "Dealer readiness",
              description: "Instant distribution to coverage zones, with dashboards that surface conversion and performance trends.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)]"
            >
              <h3 className="font-display text-xl">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-white/65">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-300/20 via-white/5 to-fuchsia-300/20 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-3xl text-white">
                Ready to modernize your loupe workflow?
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Start a new configuration or review live leads inside the admin console.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/configurator"
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-slate-900"
              >
                Configure now
              </Link>
              <Link
                href="/admin/leads"
                className="rounded-full border border-white/30 px-6 py-3 text-center text-sm font-semibold text-white/80"
              >
                Review leads
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
