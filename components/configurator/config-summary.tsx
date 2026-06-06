"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfiguratorStore } from "@/store/configurator-store";
import { Button } from "@/components/ui/button";

interface SelectedPart {
  id: string;
  name: string;
  price: number;
  modelUrl: string;
}

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
    <div className="rounded-[2rem] border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur sm:p-6">
      <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
        Configuration summary
      </p>

      <h2 className="mt-2 font-heading text-3xl text-slate-950">
        Your selected build
      </h2>

      <div className="mt-5 space-y-3 rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-col gap-1 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span className="text-sm text-slate-500">Frame</span>

          <span className="text-sm font-medium text-slate-900 sm:text-right">
            {frame?.name ?? "Select a frame"}
          </span>
        </div>

        <div className="flex flex-col gap-1 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span className="text-sm text-slate-500">Lens</span>

          <span className="text-sm font-medium text-slate-900 sm:text-right">
            {lens?.name ?? "Select a lens"}
          </span>
        </div>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <span className="text-sm text-slate-500">Headlight</span>

          <span className="text-sm font-medium text-slate-900 sm:text-right">
            {headlight?.name ?? "Optional"}
          </span>
        </div>

        <div className="mt-2 rounded-2xl bg-white px-4 py-4 shadow-md ring-1 ring-slate-200">
          <div className="flex items-center justify-between text-xl font-semibold text-slate-950">
            <span>Total</span>

            <span className="text-2xl">₹{total}</span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Pricing updates as you refine the configuration.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {/* Use sonner toast for feedback and disable when required selections missing */}
        <SaveDraftButton frame={frame} lens={lens} headlight={headlight} />
      </div>
    </div>
  );
}

function SaveDraftButton({
  frame,
  lens,
  headlight,
}: {
  frame?: SelectedPart;
  lens?: SelectedPart;
  headlight?: SelectedPart;
}) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const disabled = !frame || !lens || saving;

  return (
    <Button
      type="button"
      disabled={disabled}
      onClick={async () => {
        if (!frame || !lens) {
          // import toast dynamically to avoid top-level client-only issues
          const { toast } = await import("sonner");
          toast.error("Please select frame and lens before saving a draft");
          return;
        }

        setSaving(true);

        try {
          const payload = {
            frameId: frame.id,
            lensId: lens.id,
            headlightId: headlight?.id ?? null,
          };

          const res = await fetch("/api/configurations/save-draft", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const json = await res.json();

          const { toast } = await import("sonner");

          if (json?.success) {
            toast.success("Draft saved");

            if (json.configurationId) {
              router.push(`/configurator/${json.configurationId}`);
            }
          } else {
            toast.error(json?.message ?? "Failed to save draft");
          }
        } catch (err) {
          console.error(err);
          const { toast } = await import("sonner");
          toast.error("Failed to save draft");
        } finally {
          setSaving(false);
        }
      }}
      variant="secondary"
      className="rounded-full px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {saving ? "Saving..." : "Save Draft"}
    </Button>
  );
}