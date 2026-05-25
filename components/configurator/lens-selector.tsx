"use client";

import Image from "next/image";

import { Lens } from "@/lib/generated/prisma";

import { cn } from "@/lib/utils";

import { useConfiguratorStore } from "@/store/configurator-store";

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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {lenses.map((lens) => {
        const isActive = selectedLens?.id === lens.id;

        return (
          <button
            key={lens.id}
            type="button"
            onClick={() =>
              setLens({
                id: lens.id,
                name: lens.name,
                price: lens.price,
                modelUrl: lens.modelUrl ?? "",
              })
            }
            className={cn(
              "group overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl",
              isActive && "border-slate-400 bg-slate-950 text-white ring-2 ring-slate-900/10"
            )}
          >
            {lens.thumbnailUrl && (
              <div className="relative h-32 w-full overflow-hidden">
                <Image src={lens.thumbnailUrl} alt={lens.name} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
            )}

            {!lens.thumbnailUrl && (
              <div className="flex h-32 items-center justify-center bg-[linear-gradient(135deg,rgba(148,163,184,0.18),rgba(255,255,255,0.55))] text-sm text-slate-500">
                Preview unavailable
              </div>
            )}

            <div className="space-y-1 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold leading-5">{lens.name}</h3>

                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                  isActive ? "border-white/20 bg-white/10 text-white" : "border-slate-200 bg-slate-50 text-slate-500"
                )}>
                  {isActive ? "Selected" : "Lens"}
                </span>
              </div>

              <p className={cn("text-sm", isActive ? "text-slate-200" : "text-slate-600")}>
                {lens.magnification}
              </p>

              <p className={cn("text-sm font-medium", isActive ? "text-white" : "text-slate-900")}>
                ₹{lens.price}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}