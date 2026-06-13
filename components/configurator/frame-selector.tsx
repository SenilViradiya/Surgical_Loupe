"use client";

import { cn } from "@/lib/utils";

import { Frame } from "@/lib/generated/prisma";
import FallbackImage from "@/components/shared/fallback-image";

import { useConfiguratorStore } from "@/store/configurator-store";

import { OptionSlider } from "./option-slider";
import ProductOptionCard from "./product-option-card";

interface Props {
  frames: Frame[];
}

export function FrameSelector({
  frames,
}: Props) {
  const {
    frame: selectedFrame,
    setFrame,
  } =
    useConfiguratorStore();

  return (
    <OptionSlider
      title="Choose the frame"
      description="Browse a compact slider of frame options and keep the current selection visible without filling the whole page."
    >
      {frames.length === 0 ? (
        <div className="w-full rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-[#F4F1EA]/70">
          No active frame options are available right now.
        </div>
      ) : frames.map((frame) => {
        const isActive = selectedFrame?.id === frame.id;

        return (
          <ProductOptionCard
            key={frame.id}
            isActive={isActive}
            onClick={() =>
              setFrame({
                id: frame.id,
                name: frame.name,
                price: frame.price,
                modelUrl: frame.modelUrl ?? "",
              })
            }
            className="w-[min(72vw,14rem)] shrink-0 snap-start overflow-hidden sm:w-64"
          >
            {frame.thumbnailUrl ? (
              <div className="relative h-20 w-full overflow-hidden sm:h-24">
                <div className="absolute inset-0">
                  <FallbackImage src={frame.thumbnailUrl} alt={frame.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center bg-[#0B0D10] text-sm text-[#F4F1EA]/50 sm:h-28 w-full border-b border-white/10">
                Preview unavailable
              </div>
            )}

            <div className="space-y-1.5 p-3 w-full">
              <div className="flex items-start justify-between gap-3 text-[#F4F1EA]">
                <h3 className="text-sm font-semibold leading-5">{frame.name}</h3>

                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  isActive ? "border-[#C4A25D]/30 bg-[#C4A25D]/10 text-[#C4A25D]" : "border-white/10 bg-white/5 text-[#F4F1EA]/50"
                )}>
                  {isActive ? "Selected" : "Frame"}
                </span>
              </div>

              <p className={cn("text-sm font-display", isActive ? "text-[#C4A25D]" : "text-[#F4F1EA]/70")}>
                ₹{frame.price}
              </p>
            </div>

          </ProductOptionCard>
        );
      })}
    </OptionSlider>
  );
}
