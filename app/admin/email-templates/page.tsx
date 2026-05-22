"use client";

import { Toaster } from "@/components/ui/sonner";
import { EmailEditor } from "@/components/emails/email-editor";

export default function EmailTemplatesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">Email Templates</h1>

      <p className="text-muted-foreground mt-2">Preview, edit and send test emails</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Lead Created</h3>
          <EmailEditor templateId="lead-created" />
        </div>
      </div>

      <Toaster />
    </div>
  );
}
