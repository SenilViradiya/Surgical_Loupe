"use server";

import { signIn } from "@/auth";

import { enforceRateLimit } from "@/lib/rate-limit";

import {
  loginSchema,
  LoginInput,
} from "@/lib/validations/auth";

export async function loginUser(
  values: LoginInput
) {
  try {
    const validatedFields =
      loginSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
      };
    }

    const { email, password } =
      validatedFields.data;

    const rateLimit = enforceRateLimit(
      `login:${email}`,
      {
        limit: 5,
        windowMs: 15 * 60 * 1000,
      }
    );

    if (!rateLimit.success) {
      return {
        success: false,
        message:
          "Too many login attempts. Try again later.",
      };
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {


    return {
      success: false,
      message: "Invalid credentials",
    };
  }
}
