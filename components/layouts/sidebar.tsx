"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  href: string;
}

interface Props {
  items: SidebarItem[];
}

export function Sidebar({
  items,
}: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white">
      <div className="border-b p-6">
        <h2 className="text-xl font-bold">
          Dashboard
        </h2>
      </div>

      <nav className="space-y-2 p-4">
        {items.map((item) => {
          const isActive =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-lg px-4 py-2 transition",
                isActive
                  ? "bg-black text-white"
                  : "hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}