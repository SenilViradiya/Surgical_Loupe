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
        const isActive =
          selectedLens?.id ===
          lens.id;

        return (
          <button
            key={lens.id}
            onClick={() =>
              setLens({
                id: lens.id,
                name: lens.name,
                price: lens.price,
                modelUrl:
                  lens.modelUrl ??
                  "",
              })
            }
            className={cn(
              "overflow-hidden rounded-2xl border bg-white text-left transition-all hover:shadow-lg",
              isActive &&
                "border-black ring-2 ring-black"
            )}
          >
            {lens.thumbnailUrl && (
              <div className="relative h-32 w-full">
                <Image
                  src={
                    lens.thumbnailUrl
                  }
                  alt={lens.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-1 p-4">
              <h3 className="font-semibold">
                {lens.name}
              </h3>

              <p className="text-muted-foreground text-sm">
                {lens.magnification}
              </p>

              <p className="text-sm font-medium">
                ₹{lens.price}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}