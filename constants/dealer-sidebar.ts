import {
  BarChart3,
  Gauge,
  Settings2,
  Workflow,
} from "lucide-react";

export const dealerSidebarItems = [
  {
    label: "Dashboard",
    href: "/dealer",
    icon: Gauge,
  },

  {
    label: "My Leads",
    href: "/dealer/leads",
    icon: Workflow,
  },

  {
    label: "Analytics",
    href: "/dealer/analytics",
    icon: BarChart3,
  },

  {
    label: "Profile",
    href: "/dealer/profile",
    icon: Settings2,
  },
];