"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";

import { logoutUser } from "@/actions/auth/logout";
import { NotificationBell } from "@/components/notifications/notification-bell";

export function Navbar() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser();
    });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white/50 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <button className="-ml-2 rounded-md p-2 hover:bg-slate-100">
          <svg className="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="text-lg font-semibold">Dashboard</div>
      </div>

      <div className="flex items-center gap-3">
        <input
          placeholder="Search leads, dealers..."
          className="hidden md:block w-[340px] rounded-full border bg-white/80 px-4 py-2 text-sm placeholder:text-slate-400"
        />

        <div className="flex items-center gap-3">
          <NotificationBell />
          <div className="h-9 w-9 rounded-full bg-slate-200" />
          <Button variant="ghost" onClick={handleLogout} disabled={isPending}>
            {isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
}
