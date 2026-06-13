"use client";

import FallbackImage from "@/components/shared/fallback-image";

import { Headlight } from "@/lib/generated/prisma";

import { cn } from "@/lib/utils";

import { useConfiguratorStore } from "@/store/configurator-store";
import type { CompatibilitySnapshot } from "@/lib/compatibility/compatibility-types";
import type { InventorySnapshot } from "@/lib/inventory/inventory-types";

import { OptionSlider } from "./option-slider";
import ProductOptionCard from "./product-option-card";

interface Props {
  headlights: Headlight[];
  compatibility: CompatibilitySnapshot;
  inventory?: InventorySnapshot | null;
}

export function HeadlightSelector({
  headlights,
  compatibility,
  inventory = null,
}: Props) {
  const {
    frame: selectedFrame,
    lens: selectedLens,
    headlight: selectedHeadlight,
    setHeadlight,
  } =
    useConfiguratorStore();

  const frameRules = compatibility.frameHeadlight.filter(
    (relation) => relation.sourceId === selectedFrame?.id
  );

  const lensRules = compatibility.lensHeadlight.filter(
    (relation) => relation.sourceId === selectedLens?.id
  );

  const frameLocksHeadlight = frameRules.length > 0;
  const lensLocksHeadlight = lensRules.length > 0;

  const frameAllowedIds = new Map(frameRules.map((relation) => [relation.targetId, relation.reason ?? undefined]));
  const lensAllowedIds = new Map(lensRules.map((relation) => [relation.targetId, relation.reason ?? undefined]));

  const availabilityLookup = new Map<string, { available: number; status?: string }>();
  if (inventory?.headlights) {
    for (const item of inventory.headlights) {
      availabilityLookup.set(item.productId, { available: item.available, status: item.status });
    }
  }

  const isHeadlightCompatible = (headlightId: string) => {
    const avail = availabilityLookup.get(headlightId);

    if (avail && avail.available <= 0) return false;

    if (!selectedFrame && !selectedLens) return true;

    const frameCompatible = !frameLocksHeadlight || frameAllowedIds.has(headlightId);
    const lensCompatible = !lensLocksHeadlight || lensAllowedIds.has(headlightId);
    if (!(frameCompatible && lensCompatible)) return false;

    return true;
  };

  const getHeadlightDisabledReason = (headlightId: string) => {
    const avail = availabilityLookup.get(headlightId);

    if (avail && avail.available <= 0) return "Out of stock";

    if (frameLocksHeadlight && !frameAllowedIds.has(headlightId)) {
      return "Not compatible with selected frame";
    }

    if (lensLocksHeadlight && !lensAllowedIds.has(headlightId)) {
      return "Not compatible with selected lens";
    }

    return undefined;
  };

  return (
    <OptionSlider
      title="Add the headlight"
      description="Scroll through compact lighting options and keep the page balanced while you compare the best fit."
    >
      {headlights.length === 0 ? (
        <div className="w-full rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-[#F4F1EA]/70">
          No active headlight options are available right now.
        </div>
      ) : headlights.map((headlight) => {
        const isActive = selectedHeadlight?.id === headlight.id;

        return (
          <ProductOptionCard
            key={headlight.id}
            isActive={isActive}
            disabled={!isHeadlightCompatible(headlight.id)}
            disabledReason={getHeadlightDisabledReason(headlight.id)}
            onClick={() =>
              isHeadlightCompatible(headlight.id) &&
              setHeadlight({
                id: headlight.id,
                name: headlight.name,
                price: headlight.price,
                modelUrl: headlight.modelUrl ?? "",
              })
            }
            className="w-[min(72vw,14rem)] shrink-0 snap-start overflow-hidden sm:w-64"
          >
            {headlight.thumbnailUrl ? (
              <div className="relative h-20 w-full overflow-hidden sm:h-24">
                <div className="absolute inset-0">
                  <FallbackImage src={headlight.thumbnailUrl} alt={headlight.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center bg-[#0B0D10] text-sm text-[#F4F1EA]/50 sm:h-28 w-full border-b border-white/10">
                Preview unavailable
              </div>
            )}

            <div className="space-y-1 p-3 w-full border-t border-white/5 mt-auto">
              <div className="flex items-start justify-between gap-3 text-[#F4F1EA]">
                <h3 className="text-sm font-semibold leading-5">{headlight.name}</h3>

                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  isActive ? "border-[#C4A25D]/30 bg-[#C4A25D]/10 text-[#C4A25D]" : "border-white/10 bg-white/5 text-[#F4F1EA]/50"
                )}>
                  {isActive ? "Selected" : "Light"}
                </span>
              </div>

              <p className={cn("text-sm font-display", isActive ? "text-[#C4A25D]" : "text-[#F4F1EA]/70")}>
                ₹{headlight.price}
              </p>
            </div>

          </ProductOptionCard>
        );
      })}
    </OptionSlider>
  );
}
