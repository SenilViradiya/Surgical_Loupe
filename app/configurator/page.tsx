import ConfiguratorWorkspace from "@/components/configurator/configurator-workspace";
import { getConfiguratorCompatibilityCatalog } from "@/lib/compatibility/compatibility-service";

export default async function ConfiguratorPage() {
  const { frames, lenses, headlights, snapshot, inventory } =
    await getConfiguratorCompatibilityCatalog();

  return (
    <div className="bg-[#0B0D10] min-h-screen">
      <ConfiguratorWorkspace
        frames={frames}
        lenses={lenses}
        headlights={headlights}
        compatibility={snapshot}
        inventory={inventory}
      />
    </div>
  );
}

