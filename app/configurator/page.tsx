import ConfiguratorWorkspace from "@/components/configurator/configurator-workspace";
import { getConfiguratorCompatibilityCatalog } from "@/lib/compatibility/compatibility-service";

export default async function ConfiguratorPage() {
  const { frames, lenses, headlights, snapshot, inventory } =
    await getConfiguratorCompatibilityCatalog();

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f7f8fb_0%,#eef3f5_48%,#f8fafc_100%)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-128 bg-[radial-gradient(circle_at_top_left,rgba(67,90,111,0.18),transparent_40%),radial-gradient(circle_at_top_right,rgba(108,122,137,0.16),transparent_34%)]" />

      <div className="container relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <ConfiguratorWorkspace
          frames={frames}
          lenses={lenses}
          headlights={headlights}
          compatibility={snapshot}
          inventory={inventory}
        />
      </div>
    </div>
  );
}
