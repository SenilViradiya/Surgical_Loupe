"use server";

import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { configurationSchema } from "@/lib/validations/configuration";

export async function createConfiguration(values: any) {
  try {
    const parsed = configurationSchema.parse(values);

    const rateKey = `create-configuration:${parsed.frameId}:${parsed.lensId}`;

    const rateLimit = enforceRateLimit(rateKey, {
      limit: 50,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return {
        success: false,
        message: "Too many configuration saves. Try again later.",
      };
    }

    const configuration = await prisma.configuration.create({
      data: {
        frameId: parsed.frameId,
        lensId: parsed.lensId,
        headlightId: parsed.headlightId ?? null,
      },
    });

    return {
      success: true,
      configurationId: configuration.id,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Failed to save configuration",
    };
  }
}