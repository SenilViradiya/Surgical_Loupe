"use client";

import { Frame } from "@/lib/generated/prisma";

import { useConfiguratorStore } from "@/store/configurator-store";

interface Props {
  frames: Frame[];
}

export function ConfigSummary({
  frames,
}: Props) {
  const { frameUrl } =
    useConfiguratorStore();

  const selectedFrame =
    frames.find(
      (frame) =>
        frame.modelUrl ===
        frameUrl
    );

  const total =
    selectedFrame?.price ?? 0;

  return (
    <div className="rounded-2xl border bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Summary
      </h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span>Frame</span>

          <span>
            {selectedFrame?.name ??
              "-"}
          </span>
        </div>

        <div className="flex items-center justify-between font-semibold">
          <span>Total</span>

          <span>
            ₹{total}
          </span>
        </div>
      </div>
    </div>
  );
}