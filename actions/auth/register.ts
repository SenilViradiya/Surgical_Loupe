"use server";

import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

import {
  registerSchema,
  RegisterInput,
} from "@/lib/validations/auth";

export async function registerUser(
  values: RegisterInput
) {
  try {
    const validatedFields =
      registerSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid fields",
      };
    }

    const { name, email, password } =
      validatedFields.data;

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}