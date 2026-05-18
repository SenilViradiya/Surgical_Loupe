"use client";

import { useConfiguratorStore } from "@/store/configurator-store";

export function ConfigSummary() {
  const {
    frame,
    lens,
    headlight,
  } =
    useConfiguratorStore();

  const total =
    (frame?.price ?? 0) +
    (lens?.price ?? 0) +
    (headlight?.price ?? 0);

  

  return (
    <div className="rounded-2xl border bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Summary
      </h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span>Frame</span>

          <span>
            {frame?.name ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between">
            <span>Lens</span>

            <span>
                {lens?.name ?? "-"}
            </span>
            </div>

            <div className="flex items-center justify-between">
            <span>Headlight</span>

            <span>
                {headlight?.name ?? "-"}
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