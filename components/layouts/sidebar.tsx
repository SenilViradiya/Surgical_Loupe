"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Home } from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
}

interface Props {
  items: SidebarItem[];
}

export function Sidebar({ items }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r bg-slate-900 text-white">
      <div className="flex items-center gap-3 border-b px-6 py-5">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-400" />
        <h2 className="text-sm font-semibold tracking-wide">
          Admin Console
        </h2>
      </div>

      <nav className="space-y-1 p-3">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                isActive
                  ? "bg-gradient-to-r from-cyan-600 to-blue-500 text-white shadow-md"
                  : "text-white/85 hover:bg-white/5"
              )}
            >
              <Home className="h-4 w-4 opacity-80" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}