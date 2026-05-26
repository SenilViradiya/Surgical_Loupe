"use client";

import Image from "next/image";

import { Headlight } from "@/lib/generated/prisma";

import { cn } from "@/lib/utils";

import { useConfiguratorStore } from "@/store/configurator-store";

import { OptionSlider } from "./option-slider";

interface Props {
  headlights: Headlight[];
}

export function HeadlightSelector({
  headlights,
}: Props) {
  const {
    headlight: selectedHeadlight,
    setHeadlight,
  } =
    useConfiguratorStore();

  return (
    <OptionSlider
      title="Add the headlight"
      description="Scroll through compact lighting options and keep the page balanced while you compare the best fit."
    >
      {headlights.map((headlight) => {
        const isActive = selectedHeadlight?.id === headlight.id;

        return (
          <button
            key={headlight.id}
            type="button"
            onClick={() =>
              setHeadlight({
                id: headlight.id,
                name: headlight.name,
                price: headlight.price,
                modelUrl: headlight.modelUrl ?? "",
              })
            }
            className={cn(
              "group w-[min(72vw,14rem)] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg sm:w-64",
              isActive && "border-slate-400 bg-slate-950 text-white ring-2 ring-slate-900/10"
            )}
          >
            {headlight.thumbnailUrl && (
              <div className="relative h-20 w-full overflow-hidden sm:h-24">
                <Image src={headlight.thumbnailUrl} alt={headlight.name} fill sizes="(max-width: 768px) 70vw, 16rem" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
            )}

            {!headlight.thumbnailUrl && (
              <div className="flex h-24 items-center justify-center bg-[linear-gradient(135deg,rgba(148,163,184,0.18),rgba(255,255,255,0.55))] text-sm text-slate-500 sm:h-28">
                Preview unavailable
              </div>
            )}

            <div className="space-y-1 p-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold leading-5">{headlight.name}</h3>

                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  isActive ? "border-white/20 bg-white/10 text-white" : "border-slate-200 bg-slate-50 text-slate-500"
                )}>
                  {isActive ? "Selected" : "Light"}
                </span>
              </div>

              <p className={cn("text-sm font-medium", isActive ? "text-white" : "text-slate-900")}>
                ₹{headlight.price}
              </p>
            </div>
          </button>
        );
      })}
    </OptionSlider>
  );
}