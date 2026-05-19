import { getLeads } from "@/actions/leads/get-leads";

import { LeadsTable } from "@/components/leads/leads-table";

export default async function LeadsPage() {
  const leads =
    await getLeads();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Leads
        </h1>

        <p className="text-muted-foreground">
          Manage incoming quote requests
        </p>
      </div>

      <LeadsTable
        leads={leads}
      />
    </div>
  );
}