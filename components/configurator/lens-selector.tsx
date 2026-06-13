"use client";

import FallbackImage from "@/components/shared/fallback-image";

import { Lens } from "@/lib/generated/prisma";

import { cn } from "@/lib/utils";

import { useConfiguratorStore } from "@/store/configurator-store";
import type { CompatibilitySnapshot } from "@/lib/compatibility/compatibility-types";
import type { InventorySnapshot } from "@/lib/inventory/inventory-types";

import { OptionSlider } from "./option-slider";
import ProductOptionCard from "./product-option-card";

interface Props {
  lenses: Lens[];
  compatibility: CompatibilitySnapshot;
  inventory?: InventorySnapshot | null;
}

export function LensSelector({
  lenses,
  compatibility,
  inventory = null,
}: Props) {
  const {
    frame: selectedFrame,
    lens: selectedLens,
    setLens,
  } =
    useConfiguratorStore();

  const frameLocksLens = compatibility.frameLens.some(
    (relation) => relation.sourceId === selectedFrame?.id
  );

  const frameAllowedLensIds = new Map(
    compatibility.frameLens
      .filter((relation) => relation.sourceId === selectedFrame?.id)
      .map((relation) => [relation.targetId, relation.reason ?? undefined])
  );

  const availabilityLookup = new Map<string, { available: number; status?: string }>();
  if (inventory?.lenses) {
    for (const item of inventory.lenses) {
      availabilityLookup.set(item.productId, { available: item.available, status: item.status });
    }
  }

  const isLensCompatible = (lensId: string) => {
    const avail = availabilityLookup.get(lensId);

    if (avail && avail.available <= 0) return false;

    if (!selectedFrame) return true;

    if (!frameLocksLens) return true;

    if (!frameAllowedLensIds.has(lensId)) return false;

    return true;
  };

  const getLensDisabledReason = (lensId: string) => {
    const avail = availabilityLookup.get(lensId);

    if (avail && avail.available <= 0) return "Out of stock";

    if (!selectedFrame) return undefined;

    if (frameLocksLens && !frameAllowedLensIds.has(lensId)) {
      return "Not compatible with selected frame";
    }

    return undefined;
  };

  return (
    <OptionSlider
      title="Fine-tune the lens"
      description="Use the slider to compare magnification choices without forcing every option onto the screen at once."
    >
      {lenses.length === 0 ? (
        <div className="w-full rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-[#F4F1EA]/70">
          No active lens options are available right now.
        </div>
      ) : lenses.map((lens) => {
        const isActive = selectedLens?.id === lens.id;

        return (
          <ProductOptionCard
            key={lens.id}
            isActive={isActive}
            disabled={!isLensCompatible(lens.id)}
            disabledReason={getLensDisabledReason(lens.id)}
            onClick={() =>
              isLensCompatible(lens.id) &&
              setLens({
                id: lens.id,
                name: lens.name,
                price: lens.price,
                modelUrl: lens.modelUrl ?? "",
              })
            }
            className="w-[min(72vw,14rem)] shrink-0 snap-start overflow-hidden sm:w-64"
          >
            {lens.thumbnailUrl ? (
              <div className="relative h-20 w-full overflow-hidden sm:h-24">
                <div className="absolute inset-0">
                  <FallbackImage src={lens.thumbnailUrl} alt={lens.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center bg-[#0B0D10] text-sm text-[#F4F1EA]/50 sm:h-28 w-full border-b border-white/10">
                Preview unavailable
              </div>
            )}

            <div className="space-y-1 p-3 w-full">
              <div className="flex items-start justify-between gap-3 text-[#F4F1EA]">
                <h3 className="text-sm font-semibold leading-5">{lens.name}</h3>

                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  isActive ? "border-[#C4A25D]/30 bg-[#C4A25D]/10 text-[#C4A25D]" : "border-white/10 bg-white/5 text-[#F4F1EA]/50"
                )}>
                  {isActive ? "Selected" : "Lens"}
                </span>
              </div>

              <p className={cn("text-xs font-medium", isActive ? "text-[#C4A25D]" : "text-[#F4F1EA]/50")}>
                {lens.magnification}
              </p>

              <p className={cn("text-sm font-display", isActive ? "text-[#C4A25D]" : "text-[#F4F1EA]/70")}>
                ₹{lens.price}
              </p>
            </div>

          </ProductOptionCard>
        );
      })}
    </OptionSlider>
  );
}
