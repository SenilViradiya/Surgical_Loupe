"use client";

import { useState } from "react";

import { toast } from "sonner";

import { forgotPassword } from "@/actions/auth/forgot-password";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        setLoading(true);

        const response =
          await forgotPassword(
            email
          );

        if (
          response.success
        ) {
          toast.success(
            "Reset email sent"
          );

          setEmail("");
        } else {
          toast.error(
            "Something went wrong"
          );
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={
          handleSubmit
        }
        className="w-full max-w-md space-y-6 rounded-2xl border bg-white p-8"
      >
        <div>
          <h1 className="text-3xl font-bold">
            Forgot Password
          </h1>

          <p className="text-muted-foreground mt-2">
            Enter your email to receive a reset link
          </p>
        </div>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <Button
          disabled={loading}
          type="submit"
          className="w-full"
        >
          {loading
            ? "Sending..."
            : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
}
