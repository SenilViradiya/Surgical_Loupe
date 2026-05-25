import { prisma } from "@/lib/prisma";

import { ConfiguratorScene } from "@/components/3d/configurator-scene";

import { FrameSelector } from "@/components/configurator/frame-selector";
import { LensSelector } from "@/components/configurator/lens-selector";
import { HeadlightSelector } from "@/components/configurator/headlight-selector";
import { ConfigSummary } from "@/components/configurator/config-summary";
import { LeadForm } from "@/components/configurator/lead-form";

export default async function ConfiguratorPage() {
  const [frames, lenses, headlights] = await Promise.all([
    prisma.frame.findMany({
      where: {
        status: "ACTIVE",
      },
    }),
    prisma.lens.findMany({
      where: {
        status: "ACTIVE",
      },
    }),
    prisma.headlight.findMany({
      where: {
        status: "ACTIVE",
      },
    }),
  ]);

  const heroHighlights = [
    {
      label: "Precision fit",
      value: "Frame, lens, and light stay aligned as you browse",
    },
    {
      label: "Guided selection",
      value: "Every option is presented with context, pricing, and preview",
    },
    {
      label: "Fast quote flow",
      value: "Submit a polished request without leaving the page",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f7f8fb_0%,#eef3f5_48%,#f8fafc_100%)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-128 bg-[radial-gradient(circle_at_top_left,rgba(67,90,111,0.18),transparent_40%),radial-gradient(circle_at_top_right,rgba(108,122,137,0.16),transparent_34%)]" />

      <div className="container relative mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
        <section className="space-y-8">
          <div className="space-y-4">
            <p className="inline-flex items-center rounded-full border border-slate-200/80 bg-white/80 px-4 py-1 text-xs font-medium tracking-[0.24em] text-slate-600 uppercase shadow-sm backdrop-blur">
              Precision configurator
            </p>

            <h1 className="max-w-3xl font-display text-4xl leading-tight text-slate-950 md:text-5xl lg:text-6xl">
              Build a loupe setup that feels calibrated for the clinic, not just configured on a screen.
            </h1>

            <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Compare frame, lens, and headlight combinations in one flow. The preview updates as you select each part, while the page gives your customer a clear explanation of what they are choosing and why it matters.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {heroHighlights.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.label}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start">
            <div className="space-y-6 xl:sticky xl:top-6">
              <div className="rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                <div className="mb-4 flex items-center justify-between gap-4 px-2 pt-1">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
                      Live preview
                    </p>

                    <h2 className="mt-2 font-heading text-2xl text-slate-950">
                      Main configuration
                    </h2>
                  </div>

                  <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
                    3D canvas
                  </div>
                </div>

                <ConfiguratorScene initialFrame={undefined} />
              </div>

              <ConfigSummary />

              <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-6 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
                  What happens next
                </p>

                <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
                  <p>
                    Share your contact details and our team can review the selected configuration, confirm compatibility, and prepare the next recommendation.
                  </p>

                  <p>
                    The quote request keeps the experience focused on the customer journey, with enough context to feel reassuring without becoming cluttered.
                  </p>
                </div>
              </div>

              <LeadForm />
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
                  Step 1
                </p>
                <div className="mt-4">
                  <FrameSelector frames={frames} />
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
                  Step 2
                </p>
                <div className="mt-4">
                  <LensSelector lenses={lenses} />
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
                  Step 3
                </p>
                <div className="mt-4">
                  <HeadlightSelector headlights={headlights} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}