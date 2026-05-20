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
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/30 to-white/5 p-6">
      <h2 className="mb-4 text-xl font-semibold">Summary</h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700">Frame</span>

          <span className="text-sm text-slate-900">{frame?.name ?? "-"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700">Lens</span>

          <span className="text-sm text-slate-900">{lens?.name ?? "-"}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700">Headlight</span>

          <span className="text-sm text-slate-900">{headlight?.name ?? "-"}</span>
        </div>

        <div className="mt-4 flex items-center justify-between text-lg font-semibold">
          <span>Total</span>

          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
}