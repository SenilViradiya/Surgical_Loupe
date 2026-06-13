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
    <div className="rounded-[2rem] border border-white/10 bg-[#11141A] p-4 shadow-sm backdrop-blur sm:p-6">
      <p className="text-xs font-bold tracking-[0.3em] text-[#C4A25D] uppercase">
        Configuration summary
      </p>

      <h2 className="mt-2 font-heading text-2xl text-[#F4F1EA]">
        Your selected build
      </h2>

      <div className="mt-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#F4F1EA]/50 uppercase tracking-wider">Frame</span>
            <span className="font-medium text-[#F4F1EA] text-right">
              {frame?.name ?? "—"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-[#F4F1EA]/50 uppercase tracking-wider">Lens</span>
            <span className="font-medium text-[#F4F1EA] text-right">
              {lens?.name ?? "—"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-[#F4F1EA]/50 uppercase tracking-wider">Headlight</span>
            <span className="font-medium text-[#F4F1EA] text-right">
              {headlight?.name ?? "Optional"}
            </span>
          </div>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-[#F4F1EA]/80">Total</span>
            <span className="font-display text-2xl text-[#C4A25D]">₹{total}</span>
          </div>
          <p className="mt-1 text-[10px] text-[#F4F1EA]/30 uppercase tracking-widest text-right">
            Excl. Taxes & Shipping
          </p>
        </div>
      </div>

      <div className="mt-6">
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
          const { toast } = await import("sonner");
          toast.error("Failed to save draft");
        } finally {
          setSaving(false);
        }
      }}
      className="w-full rounded-full bg-[#C4A25D] py-6 text-sm font-bold text-[#0B0D10] transition-all hover:bg-[#D8BD80] hover:shadow-[0_0_20px_rgba(196,162,93,0.3)] disabled:opacity-30"
    >
      {saving ? "Saving..." : "Save Draft"}
    </Button>


  );
}
