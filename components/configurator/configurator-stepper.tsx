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
    <nav aria-label="Configurator steps" className="sticky top-3 z-30 mb-6 rounded-[1.5rem] border border-white/10 bg-[#11141A]/90 p-2.5 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.5)] backdrop-blur transition-shadow duration-300 hover:shadow-[0_22px_50px_-28px_rgba(0,0,0,0.6)] sm:top-4 lg:top-24">
      <ol className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth scrollbar-none px-0.5 py-1.5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:gap-3 lg:flex-wrap lg:overflow-visible lg:px-1">
        {steps.map((step, i) => {
          const isActive = i <= current;
          const isCurrent = i === current;

          return (
            <li key={step.id} className="shrink-0 snap-start flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "group flex min-w-max items-center gap-2 rounded-full px-3 py-2 text-left transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A25D]/30 focus-visible:ring-offset-2 sm:gap-3 sm:px-4",
                  isCurrent
                    ? "bg-[#C4A25D] text-slate-950 shadow-[0_14px_30px_-16px_rgba(0,0,0,0.5)]"
                    : isActive
                      ? "bg-white/5 text-[#C4A25D] hover:bg-white/10"
                      : "bg-transparent text-[#F4F1EA]/50 hover:bg-white/5 hover:text-[#F4F1EA]"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 group-hover:scale-[1.03]",
                    isCurrent
                      ? "bg-slate-950 text-[#C4A25D] shadow-sm"
                      : isActive
                        ? "bg-[#C4A25D]/10 text-[#C4A25D] ring-1 ring-[#C4A25D]/20"
                        : "border border-white/10 bg-white/5 text-[#F4F1EA]/40"
                  )}
                >
                  {i + 1}
                </span>

                <span className={cn("text-xs font-bold leading-none tracking-widest uppercase sm:text-sm", isCurrent ? "text-slate-950" : "")}>{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>

  );
}

export default ConfiguratorStepper;
