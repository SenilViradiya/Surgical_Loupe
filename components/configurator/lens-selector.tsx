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
    <div className="grid grid-cols-2 gap-4">
      {lenses.map((lens) => {
        const isActive = selectedLens?.id === lens.id;

        return (
          <button
            key={lens.id}
            onClick={() =>
              setLens({
                id: lens.id,
                name: lens.name,
                price: lens.price,
                modelUrl: lens.modelUrl ?? "",
              })
            }
            className={cn(
              "overflow-hidden rounded-2xl border border-white/10 bg-white/95 text-left transition-transform hover:-translate-y-1 hover:shadow-2xl",
              isActive && "ring-2 ring-cyan-300"
            )}
          >
            {lens.thumbnailUrl && (
              <div className="relative h-32 w-full">
                <Image src={lens.thumbnailUrl} alt={lens.name} fill className="object-cover" />
              </div>
            )}

            <div className="space-y-1 p-4">
              <h3 className="font-semibold">{lens.name}</h3>

              <p className="text-sm text-slate-600">{lens.magnification}</p>

              <p className="text-sm font-medium">₹{lens.price}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}