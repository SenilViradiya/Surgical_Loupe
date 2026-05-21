"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { resetPassword } from "@/actions/auth/reset-password";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

interface Props {
  token: string;
  mode?: string;
}

export default function ResetPasswordForm({
  token,
  mode,
}: Props) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const heading =
    mode === "invite"
      ? "Activate Account"
      : "Reset Password";

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!token) {
      toast.error("Missing reset token");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({
        token,
        password,
      });

      if (!response.success) {
        toast.error(
          response.message ??
            "Unable to reset password"
        );

        return;
      }

      toast.success(
        mode === "invite"
          ? "Account activated"
          : "Password updated"
      );

      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-2xl border bg-white p-8 shadow-sm"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            {heading}
          </h1>

          <p className="text-muted-foreground text-sm">
            Set a secure password to continue
          </p>
        </div>

        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
        />

        <Input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(event.target.value)
          }
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Updating..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}