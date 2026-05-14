"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import {
  registerSchema,
  RegisterInput,
} from "@/lib/validations/auth";

import { registerUser } from "@/actions/auth/register";

import { Button } from "@/components/ui/button";

import { CustomInput } from "@/components/ui/shared/custom-input";

export function RegisterForm() {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (
    values: RegisterInput
  ) => {
    startTransition(async () => {
      const response =
        await registerUser(values);

      if (!response.success) {
        toast.error(response.message);

        return;
      }

      toast.success(response.message);

      router.push("/login");
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <CustomInput
        label="Name"
        placeholder="John Doe"
        {...register("name")}
        error={errors.name?.message}
      />

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
          ? "Creating account..."
          : "Create Account"}
      </Button>
    </form>
  );
}