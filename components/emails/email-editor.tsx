"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LeadCreatedEmail } from "@/emails/lead-created-email";

export function EmailEditor({ templateId = "lead-created" }: { templateId?: string }) {
  const [subject, setSubject] = useState("");
  const [customerName, setCustomerName] = useState("Jane Doe");
  const [frameName, setFrameName] = useState("Classic Frame");
  const [lensName, setLensName] = useState("Standard Lens");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/emails/templates?templateId=${templateId}`);
        if (res.ok) {
          const json = await res.json();
          if (json?.template?.subject) setSubject(json.template.subject);
        }
      } catch (err) {
        // ignore
      }
    })();
  }, [templateId]);

  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/emails/templates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, subject }),
      });

      const json = await res.json();

      if (json?.success) {
        toast.success("Template saved");
      } else {
        toast.error(json?.message ?? "Failed to save template");
      }
    } catch (err) {

      toast.error("Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Subject</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-md border px-3 py-2" />
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="rounded-md border px-3 py-2" />
        <input value={frameName} onChange={(e) => setFrameName(e.target.value)} className="rounded-md border px-3 py-2" />
        <input value={lensName} onChange={(e) => setLensName(e.target.value)} className="rounded-md border px-3 py-2" />
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={loading} className="rounded-md bg-slate-700 px-3 py-2 text-white disabled:opacity-60">
          {loading ? "Saving..." : "Save Template"}
        </button>
      </div>

      <div className="rounded-md border p-4">
        <h4 className="mb-2 font-semibold">Preview</h4>
        <div className="bg-white p-4">
          <LeadCreatedEmail customerName={customerName} frameName={frameName} lensName={lensName} />
        </div>
      </div>
    </div>
  );
}
