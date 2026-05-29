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
    <nav aria-label="Configurator steps" className="sticky top-3 z-30 mb-6 rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-2.5 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.28)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_22px_50px_-28px_rgba(15,23,42,0.32)] sm:top-4 lg:top-24">
      <ol className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth scrollbar-none px-0.5 py-1.5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:gap-3 lg:flex-wrap lg:overflow-visible lg:px-1">
        {steps.map((step, i) => {
          const isActive = i <= current;

          return (
            <li key={step.id} className="shrink-0 snap-start flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                aria-current={current === i ? "step" : undefined}
                className={cn(
                  "group flex min-w-max items-center gap-2 rounded-full px-3 py-2 text-left transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/15 focus-visible:ring-offset-2 sm:gap-3 sm:px-4",
                  isActive
                    ? "bg-slate-950 text-white shadow-[0_14px_30px_-16px_rgba(15,23,42,0.55)]"
                    : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 group-hover:scale-[1.03]",
                    current === i
                      ? "bg-white text-slate-950 shadow-sm"
                      : isActive
                        ? "bg-white/10 text-white ring-1 ring-white/15"
                        : "border border-slate-200 bg-slate-50 text-slate-600"
                  )}
                >
                  {i + 1}
                </span>

                <span className={cn("text-xs font-medium leading-none tracking-[0.01em] sm:text-sm", current === i ? "text-inherit" : "")}>{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default ConfiguratorStepper;
