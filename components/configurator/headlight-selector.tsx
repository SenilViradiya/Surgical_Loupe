"use client";

import Image from "next/image";

import { Headlight } from "@/lib/generated/prisma";

import { cn } from "@/lib/utils";

import { useConfiguratorStore } from "@/store/configurator-store";

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
    <div className="grid grid-cols-2 gap-4">
      {headlights.map(
        (headlight) => {
          const isActive =
            selectedHeadlight?.id ===
            headlight.id;

          return (
            <button
              key={headlight.id}
              onClick={() =>
                setHeadlight({
                  id: headlight.id,
                  name: headlight.name,
                  price:
                    headlight.price,
                  modelUrl:
                    headlight.modelUrl ??
                    "",
                })
              }
              className={cn(
                "overflow-hidden rounded-2xl border bg-white text-left transition-all hover:shadow-lg",
                isActive &&
                  "border-black ring-2 ring-black"
              )}
            >
              {headlight.thumbnailUrl && (
                <div className="relative h-32 w-full">
                  <Image
                    src={
                      headlight.thumbnailUrl
                    }
                    alt={
                      headlight.name
                    }
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-1 p-4">
                <h3 className="font-semibold">
                  {headlight.name}
                </h3>

                <p className="text-sm font-medium">
                  ₹
                  {
                    headlight.price
                  }
                </p>
              </div>
            </button>
          );
        }
      )}
    </div>
  );
}