"use server";

import { prisma } from "@/lib/prisma";

import { refreshCompatibilityCache } from "@/lib/compatibility/compatibility-service";

export async function updateCompatibility(values: {
  sourceType: "FRAME" | "LENS";
  sourceId: string;
  targetType: "LENS" | "HEADLIGHT";
  targetIds: string[];
}) {
  try {
    const uniqueTargetIds = Array.from(new Set(values.targetIds.filter(Boolean)));

    if (values.sourceType === "FRAME" && values.targetType === "LENS") {
      await prisma.$transaction([
        prisma.frameLensCompatibility.deleteMany({
          where: { frameId: values.sourceId },
        }),
        prisma.frameLensCompatibility.createMany({
          data: uniqueTargetIds.map((lensId) => ({
            frameId: values.sourceId,
            lensId,
          })),
          skipDuplicates: true,
        }),
      ]);
    } else if (values.sourceType === "FRAME" && values.targetType === "HEADLIGHT") {
      await prisma.$transaction([
        prisma.frameHeadlightCompatibility.deleteMany({
          where: { frameId: values.sourceId },
        }),
        prisma.frameHeadlightCompatibility.createMany({
          data: uniqueTargetIds.map((headlightId) => ({
            frameId: values.sourceId,
            headlightId,
          })),
          skipDuplicates: true,
        }),
      ]);
    } else if (values.sourceType === "LENS" && values.targetType === "HEADLIGHT") {
      await prisma.$transaction([
        prisma.lensHeadlightCompatibility.deleteMany({
          where: { lensId: values.sourceId },
        }),
        prisma.lensHeadlightCompatibility.createMany({
          data: uniqueTargetIds.map((headlightId) => ({
            lensId: values.sourceId,
            headlightId,
          })),
          skipDuplicates: true,
        }),
      ]);
    } else {
      return {
        success: false,
        code: "INCOMPATIBLE_PRODUCTS",
        message: "Unsupported compatibility pair.",
      };
    }

    await refreshCompatibilityCache();

    return { success: true };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      code: "INCOMPATIBLE_PRODUCTS",
      message: "Failed to update compatibility rules.",
    };
  }
}
