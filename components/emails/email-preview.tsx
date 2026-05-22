"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LeadCreatedEmail } from "@/emails/lead-created-email";

export function EmailPreview({
  customerName = "Jane Doe",
  frameName = "Classic Frame",
  lensName = "Standard Lens",
}: Partial<{ customerName: string; frameName: string; lensName: string }>) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!email) {
      toast.error("Enter an email to send a test");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/emails/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: email,
          customerName,
          frameName,
          lensName,
        }),
      });

      const json = await res.json();

      if (json?.success) {
        toast.success("Test email sent");
      } else {
        toast.error(json?.message ?? "Failed to send test email");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send test email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          placeholder="test@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2"
        />

        <button
          onClick={handleSend}
          disabled={sending}
          className="rounded-md bg-slate-700 px-3 py-2 text-white disabled:opacity-60"
        >
          {sending ? "Sending..." : "Send Test Email"}
        </button>
      </div>

      <div className="rounded-md border p-4">
        <LeadCreatedEmail
          customerName={customerName}
          frameName={frameName}
          lensName={lensName}
        />
      </div>
    </div>
  );
}
