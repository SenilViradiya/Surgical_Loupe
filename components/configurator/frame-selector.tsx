"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

import { Frame } from "@/lib/generated/prisma";

import { useConfiguratorStore } from "@/store/configurator-store";

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
    <div className="grid grid-cols-2 gap-4">
      {frames.map((frame) => {
        const isActive = selectedFrame?.id === frame.id;

        return (
          <button
            key={frame.id}
            onClick={() =>
              setFrame({
                id: frame.id,
                name: frame.name,
                price: frame.price,
                modelUrl: frame.modelUrl ?? "",
              })
            }
            className={cn(
              "overflow-hidden rounded-2xl border border-white/10 bg-white/95 text-left transition-transform hover:-translate-y-1 hover:shadow-2xl",
              isActive && "ring-2 ring-cyan-300"
            )}
          >
            {frame.thumbnailUrl && (
              <div className="relative h-40 w-full">
                <Image src={frame.thumbnailUrl} alt={frame.name} fill className="object-cover" />
              </div>
            )}

            <div className="space-y-2 p-4">
              <h3 className="font-semibold">{frame.name}</h3>

              <p className="text-sm text-slate-600">₹{frame.price}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}