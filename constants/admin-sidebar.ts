import {
  BarChart3,
  Boxes,
  CalendarDays,
  Gauge,
  Settings2,
  ShieldAlert,
  Shapes,
  Users,
  Workflow,
} from "lucide-react";

export const adminSidebarItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: Gauge,
  },

  {
    label: "Leads",
    href: "/admin/leads",
    icon: Workflow,
  },

  {
    label: "Unassigned Leads",
    href: "/admin/unassigned-leads",
    icon: ShieldAlert,
  },

  {
    label: "Frames",
    href: "/admin/frames",
    icon: Boxes,
  },

  {
    label: "Lenses",
    href: "/admin/lenses",
    icon: Shapes,
  },

  {
    label: "Headlights",
    href: "/admin/headlights",
    icon: BarChart3,
  },

  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },

  {
    label: "Dealers",
    href: "/admin/dealers",
    icon: Users,
  },

  {
    label: "Events",
    href: "/admin/events",
    icon: CalendarDays,
  },

  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings2,
  },
];