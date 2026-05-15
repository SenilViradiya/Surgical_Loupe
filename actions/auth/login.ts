"use server";

import { signIn } from "@/auth";

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
    console.log(error);

    return {
      success: false,
      message: "Invalid credentials",
    };
  }
}