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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {frames.map((frame) => {
        const isActive = selectedFrame?.id === frame.id;

        return (
          <button
            key={frame.id}
            type="button"
            onClick={() =>
              setFrame({
                id: frame.id,
                name: frame.name,
                price: frame.price,
                modelUrl: frame.modelUrl ?? "",
              })
            }
            className={cn(
              "group overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl",
              isActive && "border-slate-400 bg-slate-950 text-white ring-2 ring-slate-900/10"
            )}
          >
            {frame.thumbnailUrl && (
              <div className="relative h-40 w-full overflow-hidden">
                <Image src={frame.thumbnailUrl} alt={frame.name} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
            )}

            {!frame.thumbnailUrl && (
              <div className="flex h-40 items-center justify-center bg-[linear-gradient(135deg,rgba(148,163,184,0.18),rgba(255,255,255,0.55))] text-sm text-slate-500">
                Preview unavailable
              </div>
            )}

            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold leading-5">{frame.name}</h3>

                <span className={cn(
                  "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                  isActive ? "border-white/20 bg-white/10 text-white" : "border-slate-200 bg-slate-50 text-slate-500"
                )}>
                  {isActive ? "Selected" : "Frame"}
                </span>
              </div>

              <p className={cn("text-sm", isActive ? "text-slate-200" : "text-slate-600")}>
                ₹{frame.price}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}