"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

import { Frame } from "@/lib/generated/prisma";

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
    frame : selectedFrame,
    setFrame,
  } =
    useConfiguratorStore();

  return (
    <OptionSlider
      title="Choose the frame"
      description="Browse a compact slider of frame options and keep the current selection visible without filling the whole page."
    >
      {frames.map((frame) => {
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
                <Image src={frame.thumbnailUrl} alt={frame.name} fill sizes="(max-width: 768px) 70vw, 16rem" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center bg-[linear-gradient(135deg,rgba(148,163,184,0.18),rgba(255,255,255,0.55))] text-sm text-slate-500 sm:h-28">
                Preview unavailable
              </div>
            )}

            <div className="space-y-1.5 p-3 w-full">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold leading-5">{frame.name}</h3>

                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  isActive ? "border-white/20 bg-white/10 text-white" : "border-slate-200 bg-slate-50 text-slate-500"
                )}>
                  {isActive ? "Selected" : "Frame"}
                </span>
              </div>

              <p className={cn("text-sm", isActive ? "text-slate-200" : "text-slate-600")}>
                ₹{frame.price}
              </p>
            </div>
          </ProductOptionCard>
        );
      })}
    </OptionSlider>
  );
}