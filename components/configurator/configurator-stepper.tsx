"use client";

import { useEffect, useState } from "react";

interface Props {
  steps?: string[];
  current?: number;
}

export function ConfiguratorStepper({
  steps = ["Frame", "Lens", "Headlight", "Review", "Quote"],
  current = 0,
}: Props) {
  return (
    <nav aria-label="Configurator steps" className="mb-6">
      <ol className="flex items-center gap-4">
        {steps.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <div
              className={
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium " +
                (i <= current
                  ? "bg-slate-900 text-white ring-2 ring-slate-900/10"
                  : "bg-slate-50 text-slate-600 border border-slate-200")
              }
            >
              {i + 1}
            </div>

            <span className="hidden text-sm font-medium text-slate-700 sm:block">{label}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default ConfiguratorStepper;
