"use client";

import { ReactNode } from "react";
import { useConfiguratorStore } from "@/store/configurator-store";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  aside?: ReactNode;
}

export function ConfiguratorLayout({
  children,
  aside,
}: Props) {
  const { frame, lens, headlight } = useConfiguratorStore();

  const total = (frame?.price ?? 0) + (lens?.price ?? 0) + (headlight?.price ?? 0);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 pb-32 lg:px-8 lg:py-10 lg:pb-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <main className="min-w-0 lg:col-span-8">{children}</main>

        <aside className="lg:col-span-4">
          <div className="sticky top-20">{aside}</div>
        </aside>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed left-0 right-0 bottom-0 z-50 sm:hidden">
        <div className="mx-auto max-w-7xl px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
          <div className="flex items-center justify-between rounded-[1.35rem] border border-slate-200/80 bg-white/92 p-3 shadow-[0_-16px_40px_-24px_rgba(15,23,42,0.42)] backdrop-blur-xl">
            <div>
              <div className="text-xs text-slate-500">Total</div>
              <div className="text-lg font-semibold">₹{total}</div>
            </div>

            <Button
              onClick={() => {
                const el = document.getElementById("lead-form");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="rounded-full bg-slate-950 px-5 py-2 text-white shadow-[0_12px_28px_-16px_rgba(15,23,42,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-18px_rgba(15,23,42,0.68)] active:translate-y-0"
            >
              Request Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfiguratorLayout;
