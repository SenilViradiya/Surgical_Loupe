"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

interface Props {
  name: string;

  email: string;

  phone: string;

  city: string;

  state: string;
}

export async function createDealer(
  values: Props
) {
  try {
    await prisma.dealer.create({
      data: values,
    });

    revalidatePath(
      "/admin/dealers"
    );

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
    };
  }
}