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
    <div className="min-h-screen bg-[#0B0D10] px-6 py-6 pb-32 sm:px-12 lg:px-20 lg:py-10 lg:pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <main className="min-w-0">{children}</main>

          <aside className="hidden lg:block relative">
            <div className="sticky top-28">{aside}</div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed left-0 right-0 bottom-0 z-50 sm:hidden">
        <div className="mx-auto max-w-7xl px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
          <div className="flex items-center justify-between rounded-[1.35rem] border border-white/10 bg-[#11141A]/92 p-3 shadow-[0_-16px_40px_-24px_rgba(0,0,0,0.5)] backdrop-blur-xl text-[#F4F1EA]">
            <div>
              <div className="text-xs text-[#F4F1EA]/50 uppercase tracking-wider">Total</div>
              <div className="text-lg font-display text-[#C4A25D]">₹{total}</div>
            </div>

            <Button
              onClick={() => {
                const el = document.getElementById("lead-form");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="rounded-full bg-[#C4A25D] px-5 py-2 text-slate-950 font-bold shadow-[0_12px_28px_-16px_rgba(0,0,0,0.6)] transition-all duration-300 hover:bg-[#D8BD80] hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-18px_rgba(0,0,0,0.68)] active:translate-y-0"
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
