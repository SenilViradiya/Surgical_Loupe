import { prisma } from "@/lib/prisma";

import { ConfiguratorScene } from "@/components/3d/configurator-scene";

import { FrameSelector } from "@/components/configurator/frame-selector";
import { LensSelector } from "@/components/configurator/lens-selector";
import { HeadlightSelector } from "@/components/configurator/headlight-selector";
import { ConfigSummary } from "@/components/configurator/config-summary";
import { LeadForm } from "@/components/configurator/lead-form";

export default async function ConfiguratorPage() {
  const [
          frames,
          lenses,
          headlights,
        ] = await Promise.all([
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

  return (
    <div className="container mx-auto space-y-8 py-10">
      <div>
        <h1 className="text-4xl font-bold">
          Surgical Loupe Configurator
        </h1>

        <p className="text-muted-foreground mt-2">
          Build your perfect loupe
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ConfiguratorScene
          initialFrame={
            frames[0]
              ? {
                  id: frames[0].id,
                  name: frames[0].name,
                  price: frames[0].price,
                  modelUrl:
                    frames[0].modelUrl,
                }
              : undefined
          }
        />

        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">
              Select Frame
            </h2>

            <FrameSelector
              frames={frames}
            />
            <div>
              <h2 className="mb-4 text-2xl font-semibold">
                Select Lens
              </h2>

              <LensSelector
                lenses={lenses}
              />
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold">
                Select Headlight
              </h2>

              <HeadlightSelector
                headlights={headlights}
              />
            </div>
            <ConfigSummary />
            <LeadForm />
          </div>
        </div>
      </div>
    </div>
  );
}