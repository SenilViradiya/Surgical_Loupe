"use server";

import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { configurationSchema } from "@/lib/validations/configuration";
import { validateConfiguration } from "@/lib/compatibility/compatibility-service";
import { validateInventory } from "@/lib/inventory/inventory-service";

export async function createConfiguration(values: any) {
  const requestId = crypto.randomUUID();

  try {
    const parsed = configurationSchema.parse(values);


    const compatibility = await validateConfiguration({
      frameId: parsed.frameId,
      lensId: parsed.lensId,
      headlightId: parsed.headlightId ?? null,
    }, requestId);

    if (!compatibility.success) {
      return compatibility;
    }


    const availability = await validateInventory({
      frameId: parsed.frameId,
      lensId: parsed.lensId,
      headlightId: parsed.headlightId ?? null,
    }, requestId);

    if (!availability.success) {
      return availability;
    }

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


    return {
      success: false,
      code: "INCOMPATIBLE_PRODUCTS",
      message: "Failed to save configuration",
    };
  }
}
