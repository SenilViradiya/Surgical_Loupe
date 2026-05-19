import { notFound } from "next/navigation";

import { getConfiguration } from "@/actions/configurations/get-configuration";

import { ConfiguratorScene } from "@/components/3d/configurator-scene";

import { ConfigSummary } from "@/components/configurator/config-summary";

import { RestoreConfiguration } from "@/components/configurator/restore-configuration";
import { ShareConfigButton } from "@/components/configurator/share-config-button";

interface Props {
  params: Promise<{
    configurationId: string;
  }>;
}

export default async function SavedConfigurationPage({
  params,
}: Props) {
  const { configurationId } =
    await params;

  const configuration =
    await getConfiguration(
      configurationId
    );

  if (!configuration) {
    return notFound();
  }

  return (
    <div className="container mx-auto space-y-8 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            Saved Configuration
          </h1>

          <p className="text-muted-foreground mt-2">
            Review your saved setup
          </p>
        </div>

        <ShareConfigButton
          configurationId={
            configuration.id
          }
        />
      </div>
      <ShareConfigButton
        configurationId={
          configuration.id
        }
      />

      <RestoreConfiguration
        configuration={
          configuration
        }
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <ConfiguratorScene
          initialFrame={
            configuration.frame
          }
        />

        <ConfigSummary />
      </div>
    </div>
  );
}