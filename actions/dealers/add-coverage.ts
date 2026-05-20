"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

interface Props {
  dealerId: string;

  pincode: string;
}

export async function addCoverage({
  dealerId,
  pincode,
}: Props) {
  try {
    const exists =
      await prisma.dealerCoverage.findFirst({
        where: {
          dealerId,
          pincode,
        },
      });

    if (exists) {
      return {
        success: false,

        message:
          "Coverage already exists",
      };
    }

    await prisma.dealerCoverage.create({
      data: {
        dealerId,
        pincode,
      },
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