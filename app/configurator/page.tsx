import { prisma } from "@/lib/prisma";

import { ConfiguratorScene } from "@/components/3d/configurator-scene";

import { FrameSelector } from "@/components/configurator/frame-selector";
import { ConfigSummary } from "@/components/configurator/config-summary";

export default async function ConfiguratorPage() {
  const frames =
    await prisma.frame.findMany({
      where: {
        status: "ACTIVE",
      },
    });

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
          initialFrameUrl={
            frames[0]?.modelUrl
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
            <ConfigSummary
              frames={frames}
            />
          </div>
        </div>
      </div>
    </div>
  );
}