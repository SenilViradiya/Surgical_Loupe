import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateInventory } from "@/lib/inventory/inventory-service";

export async function POST(req: Request) {
  try {
    let type: string | undefined;
    let id: string | undefined;
    let quantity: any;
    let reserved: any;
    let lowStockThreshold: any;
    let status: any;
    const contentType = req.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (isJson) {
      const body = await req.json();
      type = body.type;
      id = body.id;
      quantity = body.quantity;
      reserved = body.reserved;
      lowStockThreshold = body.lowStockThreshold;
      status = body.status;
    } else {
      const form = await req.formData();
      type = form.get("type") as string | undefined;
      id = form.get("id") as string | undefined;
      quantity = form.get("quantity");
      reserved = form.get("reserved");
      lowStockThreshold = form.get("lowStockThreshold");
      status = form.get("status");
    }

    if (!type || !id) {
      if (!isJson) {
        return NextResponse.redirect(new URL("/admin/inventory?error=missing-fields", req.url), 303);
      }

      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    await updateInventory({ type: type as any, id }, { quantity: quantity ? Number(quantity) : undefined, reserved: reserved ? Number(reserved) : undefined, lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : undefined, status });

    if (!isJson) {
      return NextResponse.redirect(new URL("/admin/inventory?updated=1", req.url), 303);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(new URL("/admin/inventory?error=failed", req.url), 303);
    }

    return NextResponse.json({ success: false, message: "Failed to update inventory" }, { status: 500 });
  }
}
