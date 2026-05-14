"use client";

import { Button } from "@/components/ui/button";

import { logoutUser } from "@/actions/auth/logout";

export function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <h1 className="text-xl font-semibold">
        Dashboard
      </h1>

      <Button
        variant="destructive"
        onClick={() => logoutUser()}
      >
        Logout
      </Button>
    </header>
  );
}