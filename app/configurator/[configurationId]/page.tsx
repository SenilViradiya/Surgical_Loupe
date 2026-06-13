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
    <div className="bg-[#0B0D10] min-h-screen px-6 py-6 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl space-y-8 py-6 lg:py-12">
        <RestoreConfiguration
          configuration={
            configuration
          }
        />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4">
            <p className="text-xs font-bold tracking-[0.3em] text-[#C4A25D] uppercase">
              Saved configuration
            </p>

            <h1 className="font-display text-4xl text-[#F4F1EA] lg:text-5xl">
              Saved Configuration
            </h1>

            <p className="text-sm text-[#F4F1EA]/70 sm:text-base max-w-xl leading-relaxed">
              Below is the customized loupe setup you previously drafted. You can share this link or proceed to request a formal quote.
            </p>
          </div>

          <ShareConfigButton
            configurationId={
              configuration.id
            }
            className="w-full sm:w-auto bg-white/5 border-white/10 text-white hover:bg-white/10"
          />
        </div>

        <ConfiguratorLayout
          aside={<StickySummary><ConfigSummary /></StickySummary>}
        >
          <div className="rounded-[2rem] border border-white/10 bg-[#11141A] p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.5)]">
            <ConfiguratorScene initialFrame={configuration.frame} />
          </div>
        </ConfiguratorLayout>
      </div>
    </div>
  );
}
