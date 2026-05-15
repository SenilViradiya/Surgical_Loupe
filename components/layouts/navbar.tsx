"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";

import { logoutUser } from "@/actions/auth/logout";

export function Navbar() {
  const [isPending, startTransition] =
    useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser();
    });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <h1 className="text-xl font-semibold">
        Dashboard
      </h1>

      <Button
        variant="destructive"
        onClick={handleLogout}
        disabled={isPending}
      >
        {isPending
          ? "Logging out..."
          : "Logout"}
      </Button>
    </header>
  );
}