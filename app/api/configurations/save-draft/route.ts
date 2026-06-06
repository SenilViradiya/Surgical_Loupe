import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { configurationSchema } from "@/lib/validations/configuration";
import { validateConfiguration } from "@/lib/compatibility/compatibility-service";
import { validateInventory } from "@/lib/inventory/inventory-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const start = Date.now();
    const parsed = configurationSchema.parse(body);

    const vStart = Date.now();
    const compatibility = await validateConfiguration({
      frameId: parsed.frameId,
      lensId: parsed.lensId,
      headlightId: parsed.headlightId ?? null,
    });
    const vEnd = Date.now();

    if (!compatibility.success) {
      return NextResponse.json(compatibility, { status: 400 });
    }

    const availability = await validateInventory({
      frameId: parsed.frameId,
      lensId: parsed.lensId,
      headlightId: parsed.headlightId ?? null,
    });

    if (!availability.success) {
      return NextResponse.json(availability, { status: 400 });
    }

    const rateKey = `save-draft-configuration:${parsed.frameId}:${parsed.lensId}`;

    const rateLimit = enforceRateLimit(rateKey, {
      limit: 50,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const configuration = await prisma.configuration.create({
      data: {
        frameId: parsed.frameId,
        lensId: parsed.lensId,
        headlightId: parsed.headlightId ?? null,
      },
    });

    const end = Date.now();

    return NextResponse.json({ success: true, configurationId: configuration.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save draft";
    return NextResponse.json({ success: false, code: "INCOMPATIBLE_PRODUCTS", message }, { status: 500 });
  }
}
