"use client";

import Image from "next/image";

import { Lens } from "@/lib/generated/prisma";

import { cn } from "@/lib/utils";

import { useConfiguratorStore } from "@/store/configurator-store";

import { OptionSlider } from "./option-slider";
import ProductOptionCard from "./product-option-card";

interface Props {
  lenses: Lens[];
}

export function LensSelector({
  lenses,
}: Props) {
  const {
    lens: selectedLens,
    setLens,
  } =
    useConfiguratorStore();

  return (
    <OptionSlider
      title="Fine-tune the lens"
      description="Use the slider to compare magnification choices without forcing every option onto the screen at once."
    >
      {lenses.map((lens) => {
        const isActive = selectedLens?.id === lens.id;

        return (
          <ProductOptionCard
            key={lens.id}
            isActive={isActive}
            onClick={() =>
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
                <Image src={lens.thumbnailUrl} alt={lens.name} fill sizes="(max-width: 768px) 70vw, 16rem" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center bg-[linear-gradient(135deg,rgba(148,163,184,0.18),rgba(255,255,255,0.55))] text-sm text-slate-500 sm:h-28">
                Preview unavailable
              </div>
            )}

            <div className="space-y-1 p-3 w-full">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold leading-5">{lens.name}</h3>

                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  isActive ? "border-white/20 bg-white/10 text-white" : "border-slate-200 bg-slate-50 text-slate-500"
                )}>
                  {isActive ? "Selected" : "Lens"}
                </span>
              </div>

              <p className={cn("text-xs", isActive ? "text-slate-200" : "text-slate-600")}>
                {lens.magnification}
              </p>

              <p className={cn("text-sm font-medium", isActive ? "text-white" : "text-slate-900")}>
                ₹{lens.price}
              </p>
            </div>
          </ProductOptionCard>
        );
      })}
    </OptionSlider>
  );
}