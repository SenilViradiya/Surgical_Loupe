"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
      <div className="mt-4 flex items-center justify-end space-x-2">
        {/* Use sonner toast for feedback and disable when required selections missing */}
        <SaveDraftButton frame={frame} lens={lens} headlight={headlight} />
      </div>
    </div>
  );
}

function SaveDraftButton({ frame, lens, headlight }: any) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const disabled = !frame || !lens || saving;

  return (
    <button
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
      className={`rounded-md px-3 py-1 text-sm text-white ${disabled ? "bg-slate-400" : "bg-slate-700 hover:bg-slate-600"}`}
    >
      {saving ? "Saving..." : "Save Draft"}
    </button>
  );
}