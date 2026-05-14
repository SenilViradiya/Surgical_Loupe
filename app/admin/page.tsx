import { DashboardShell } from "@/components/layouts/dashboard-shell";

import { Sidebar } from "@/components/layouts/sidebar";

import { Navbar } from "@/components/layouts/navbar";

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  {
    label: "Products",
    href: "/admin/products",
  },
  {
    label: "Dealers",
    href: "/admin/dealers",
  },
  {
    label: "Leads",
    href: "/admin/leads",
  },
];

export default function AdminPage() {
  return (
    <DashboardShell
      sidebar={
        <Sidebar items={sidebarItems} />
      }
      navbar={<Navbar />}
    >
      <div>
        <h2 className="text-2xl font-bold">
          Admin Dashboard
        </h2>
      </div>
    </DashboardShell>
  );
}