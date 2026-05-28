"use client";

import { cn } from "@/lib/utils";

interface StepItem {
  label: string;
  id: string;
}

interface Props {
  steps?: StepItem[];
  current?: number;
  onStepClick?: (index: number) => void;
}

export function ConfiguratorStepper({
  steps = [
    { label: "Frame", id: "frame" },
    { label: "Lens", id: "lens" },
    { label: "Headlight", id: "headlight" },
    { label: "Review", id: "review" },
    { label: "Quote Request", id: "quote" },
  ],
  current = 0,
  onStepClick,
}: Props) {
  return (
    <nav aria-label="Configurator steps" className="mb-6 rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur">
      <ol className="flex flex-wrap items-center gap-3 sm:gap-4">
        {steps.map((step, i) => {
          const isActive = i <= current;

          return (
            <li key={step.id} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                aria-current={current === i ? "step" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-full px-3 py-2 text-left transition-all duration-300",
                  isActive
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
                    current === i
                      ? "bg-white text-slate-900"
                      : isActive
                        ? "bg-white/10 text-white ring-1 ring-white/15"
                        : "bg-slate-50 text-slate-600 border border-slate-200"
                  )}
                >
                  {i + 1}
                </span>

                <span className="hidden text-sm font-medium sm:block">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default ConfiguratorStepper;
