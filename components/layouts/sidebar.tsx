"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Boxes,
  CalendarDays,
  FileText,
  GitBranch,
  Gauge,
  Bell,
  Settings2,
  ShieldAlert,
  Shapes,
  Users,
  Workflow,
} from "lucide-react";


type IconKey = string;

interface SidebarItem {
  label: string;
  href: string;
  // accept string keys so server components can pass plain data
  icon?: string | null;
}

interface Props {
  items: SidebarItem[];
  title?: string;
  subtitle?: string;
}

export function Sidebar({
  items,
  title = "Dashboard",
  subtitle = "Navigation",
}: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-72 shrink-0 border-r border-white/10 bg-slate-950 text-white">
      <div className="flex items-center gap-3 border-b px-6 py-5">
        <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-cyan-400 to-fuchsia-400 shadow-lg shadow-cyan-500/20" />
        <div>
          <h2 className="text-sm font-semibold tracking-wide">
            {title}
          </h2>

          <p className="text-xs text-white/55">
            {subtitle}
          </p>
        </div>
      </div>

      <nav className="space-y-1 p-3">
        {items.map((item) => {
          const isDashboardItem = item.href === "/admin";
          const isActive = isDashboardItem
            ? pathname === item.href
            : pathname === item.href ||
              pathname.startsWith(`${item.href}/`);
          const iconMap: Record<string, any> = {
            BarChart3,
            Boxes,
            CalendarDays,
            Bell,
            FileText,
            GitBranch,
            Gauge,
            Settings2,
            ShieldAlert,
            Shapes,
            Users,
            Workflow,
          };

          const Icon = item.icon ? iconMap[item.icon as string] ?? null : null;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                isActive
                  ? "bg-linear-to-r from-cyan-600 to-blue-500 text-white shadow-md"
                  : "text-white/85 hover:bg-white/5"
              )}
            >
              {Icon ? (
                <Icon className="h-4 w-4 opacity-80" />
              ) : (
                <span className="h-4 w-4 rounded-full border border-white/20" />
              )}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}