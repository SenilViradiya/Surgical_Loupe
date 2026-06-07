"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import {
  loginSchema,
  LoginInput,
} from "@/lib/validations/auth";

import { Button } from "@/components/ui/button";

import { CustomInput } from "@/components/shared/custom-input";

export function LoginForm() {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (
    values: LoginInput
  ) => {
    startTransition(async () => {
      const response = await signIn(
        "credentials",
        {
          ...values,
          redirect: false,
        }
      );

      if (response?.error) {
        toast.error("Invalid credentials");

        return;
      }

      toast.success("Login successful");

      router.push("/");
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <CustomInput
        label="Email"
        type="email"
        placeholder="john@example.com"
        {...register("email")}
        error={errors.email?.message}
      />

      <CustomInput
        label="Password"
        type="password"
        placeholder="******"
        {...register("password")}
        error={errors.password?.message}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending
          ? "Signing in..."
          : "Login"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Continue with Google
      </Button>
    </form>
  );
}
