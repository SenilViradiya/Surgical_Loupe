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
    <div className="container mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8">{children}</main>

        <aside className="lg:col-span-4">
          <div className="sticky top-24">{aside}</div>
        </aside>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed left-0 right-0 bottom-0 z-50 sm:hidden">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="rounded-xl bg-white/95 ring-1 ring-slate-200 shadow-lg p-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Total</div>
              <div className="text-lg font-semibold">₹{total}</div>
            </div>

            <Button
              onClick={() => {
                const el = document.getElementById("lead-form");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="rounded-full px-5 py-2"
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
