"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

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
  const [tokenStatus, setTokenStatus] = useState<"checking" | "valid" | "missing" | "invalid" | "expired">("checking");

  // Validate token on mount
  useEffect(() => {
    let cancelled = false;


    async function validate() {

      if (!token) {
        setTokenStatus("missing");
        return;
      }

      try {
        const res = await fetch(`/api/validate-token?token=${encodeURIComponent(token)}`);


        if (cancelled) return;

        if (res.status === 200) {

          setTokenStatus("valid");
        } else if (res.status === 410) {
          setTokenStatus("expired");
        } else {
          setTokenStatus("invalid");
        }
      } catch (e) {
        if (!cancelled) {
          setTokenStatus("invalid");
        }
      }
    }

    validate();

    return () => {
      cancelled = true;
    };
  }, [token]);

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

      if (mode === "invite") {
        const loginResponse = await signIn(
          "credentials",
          {
            email: response.email ?? "",
            password,
            redirect: false,
          }
        );

        if (loginResponse?.error) {
          toast.error("Unable to sign in after activation");
          return;
        }

        router.push("/dealer/onboarding/profile");
      } else {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (tokenStatus === "checking") {
    return <div className="flex min-h-screen items-center justify-center">Checking token…</div>;
  }

  if (tokenStatus === "missing") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Missing token</h1>
          <p className="text-muted-foreground">It looks like you opened this page without an invite link. If you were expecting an invitation, ask the administrator to resend it.</p>
        </div>
      </div>
    );
  }

  if (tokenStatus === "invalid" || tokenStatus === "expired") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold">{tokenStatus === "expired" ? "Invite expired" : "Invalid token"}</h1>
          <p className="text-muted-foreground">{tokenStatus === "expired" ? "This invitation link has expired." : "This link is invalid."} You can request a new invite from the administrator or contact support at <a href="mailto:hello@example.com" className="text-primary underline">hello@example.com</a>.</p>
        </div>
      </div>
    );
  }

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
