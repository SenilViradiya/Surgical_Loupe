import { notFound } from "next/navigation";

import { getConfiguration } from "@/actions/configurations/get-configuration";

import { ConfiguratorScene } from "@/components/3d/configurator-scene";

import { ConfigSummary } from "@/components/configurator/config-summary";

import { RestoreConfiguration } from "@/components/configurator/restore-configuration";
import { ShareConfigButton } from "@/components/configurator/share-config-button";

import ConfiguratorLayout from "@/components/configurator/configurator-layout";
import StickySummary from "@/components/configurator/sticky-summary";

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
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f7f8fb_0%,#eef3f5_48%,#f8fafc_100%)]">
      <div className="container mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
              Saved configuration
            </p>

            <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
            Saved Configuration
            </h1>

            <p className="text-sm text-slate-600 sm:text-base">
              Review your saved setup
            </p>
          </div>

          <ShareConfigButton
            configurationId={
              configuration.id
            }
            className="w-full sm:w-auto"
          />
        </div>

        <RestoreConfiguration
          configuration={
            configuration
          }
        />

        <ConfiguratorLayout
          aside={<StickySummary><ConfigSummary /></StickySummary>}
        >
          <ConfiguratorScene initialFrame={configuration.frame} />
        </ConfiguratorLayout>
      </div>
    </div>
  );
}