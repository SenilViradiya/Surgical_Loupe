import { prisma } from "@/lib/prisma";
import { invalidateInventoryCache } from "./inventory-cache";
import type { InventorySnapshot, InventoryRecord } from "./inventory-types";
import { createNotification } from "@/src/lib/notifications/notification-service";
import { NotificationType, UserRole } from "@/lib/generated/prisma";

function mapFrameInventory(rows: any[]): InventoryRecord[] {
  return rows.map((r) => ({
    id: r.id,
    productId: r.frameId,
    quantity: r.quantity,
    reserved: r.reserved,
    available: Math.max(0, r.quantity - r.reserved),
    lowStockThreshold: r.lowStockThreshold,
    status: r.status,
    updatedAt: r.updatedAt.toISOString(),
  }));
}

function mapLensInventory(rows: any[]): InventoryRecord[] {
  return rows.map((r) => ({
    id: r.id,
    productId: r.lensId,
    quantity: r.quantity,
    reserved: r.reserved,
    available: Math.max(0, r.quantity - r.reserved),
    lowStockThreshold: r.lowStockThreshold,
    status: r.status,
    updatedAt: r.updatedAt.toISOString(),
  }));
}

function mapHeadlightInventory(rows: any[]): InventoryRecord[] {
  return rows.map((r) => ({
    id: r.id,
    productId: r.headlightId,
    quantity: r.quantity,
    reserved: r.reserved,
    available: Math.max(0, r.quantity - r.reserved),
    lowStockThreshold: r.lowStockThreshold,
    status: r.status,
    updatedAt: r.updatedAt.toISOString(),
  }));
}

async function emitInventoryThresholdNotification(product: { type: "FRAME" | "LENS" | "HEADLIGHT"; id: string }) {
  const [frame, lens, headlight] = await Promise.all([
    product.type === "FRAME" ? prisma.frame.findUnique({ where: { id: product.id }, select: { name: true } }) : Promise.resolve(null),
    product.type === "LENS" ? prisma.lens.findUnique({ where: { id: product.id }, select: { name: true } }) : Promise.resolve(null),
    product.type === "HEADLIGHT" ? prisma.headlight.findUnique({ where: { id: product.id }, select: { name: true } }) : Promise.resolve(null),
  ]);

  const name = frame?.name ?? lens?.name ?? headlight?.name ?? product.id;
  const record =
    product.type === "FRAME"
      ? await prisma.frameInventory.findUnique({ where: { frameId: product.id } })
      : product.type === "LENS"
        ? await prisma.lensInventory.findUnique({ where: { lensId: product.id } })
        : await prisma.headlightInventory.findUnique({ where: { headlightId: product.id } });

  if (!record) {
    return;
  }

  const available = Math.max(0, record.quantity - record.reserved);

  if (available > record.lowStockThreshold) {
    return;
  }

  const isOutOfStock = available <= 0;

  await createNotification({
    recipientRoles: [UserRole.ADMIN],
    title: isOutOfStock ? "Inventory out of stock" : "Inventory low",
    message: isOutOfStock
      ? `${name} is out of stock.`
      : `${name} is running low with ${available} units available.`,
    type: NotificationType.INVENTORY,
    entityType: product.type,
    entityId: product.id,
    metadata: {
      productType: product.type,
      productId: product.id,
      productName: name,
      available,
      lowStockThreshold: record.lowStockThreshold,
      status: record.status,
    },
    eventKey: `${isOutOfStock ? "INVENTORY_OUT_OF_STOCK" : "INVENTORY_LOW"}:${product.type}:${product.id}`,
    deliveryChannels: ["IN_APP", "EMAIL"],
    ctaLabel: "Open inventory",
    ctaUrl: "/admin/inventory",
  }).catch((error) => console.error(error));
}

export async function getInventorySnapshot(): Promise<InventorySnapshot> {
  const [frames, lenses, headlights] = await Promise.all([
    prisma.frameInventory.findMany({}),
    prisma.lensInventory.findMany({}),
    prisma.headlightInventory.findMany({}),
  ]);

  return {
    frames: mapFrameInventory(frames),
    lenses: mapLensInventory(lenses),
    headlights: mapHeadlightInventory(headlights),
    generatedAt: new Date().toISOString(),
  };
}

export async function getFrameAvailability(frameId: string) {
  const row = await prisma.frameInventory.findUnique({ where: { frameId } });

  if (!row) return null;

  return {
    quantity: row.quantity,
    reserved: row.reserved,
    available: Math.max(0, row.quantity - row.reserved),
    status: row.status,
    lowStockThreshold: row.lowStockThreshold,
  };
}

export async function getLensAvailability(lensId: string) {
  const row = await prisma.lensInventory.findUnique({ where: { lensId } });

  if (!row) return null;

  return {
    quantity: row.quantity,
    reserved: row.reserved,
    available: Math.max(0, row.quantity - row.reserved),
    status: row.status,
    lowStockThreshold: row.lowStockThreshold,
  };
}

export async function getHeadlightAvailability(headlightId: string) {
  const row = await prisma.headlightInventory.findUnique({ where: { headlightId } });

  if (!row) return null;

  return {
    quantity: row.quantity,
    reserved: row.reserved,
    available: Math.max(0, row.quantity - row.reserved),
    status: row.status,
    lowStockThreshold: row.lowStockThreshold,
  };
}

export async function reserveInventory(product: { type: "FRAME" | "LENS" | "HEADLIGHT"; id: string }, qty = 1) {
  if (qty <= 0) return { success: false, message: "Invalid quantity" };

  const result = await prisma.$transaction(async (tx) => {
    if (product.type === "FRAME") {
      const row = await tx.frameInventory.findUnique({ where: { frameId: product.id } });
      if (!row) return { success: false, message: "Inventory record not found" };
      const available = row.quantity - row.reserved;
      if (available < qty) return { success: false, message: "Insufficient stock" };
      await tx.frameInventory.update({ where: { frameId: product.id }, data: { reserved: { increment: qty } } });
      return { success: true };
    }

    if (product.type === "LENS") {
      const row = await tx.lensInventory.findUnique({ where: { lensId: product.id } });
      if (!row) return { success: false, message: "Inventory record not found" };
      const available = row.quantity - row.reserved;
      if (available < qty) return { success: false, message: "Insufficient stock" };
      await tx.lensInventory.update({ where: { lensId: product.id }, data: { reserved: { increment: qty } } });
      return { success: true };
    }

    const row = await tx.headlightInventory.findUnique({ where: { headlightId: product.id } });
    if (!row) return { success: false, message: "Inventory record not found" };
    const available = row.quantity - row.reserved;
    if (available < qty) return { success: false, message: "Insufficient stock" };
    await tx.headlightInventory.update({ where: { headlightId: product.id }, data: { reserved: { increment: qty } } });
    return { success: true };
  });

  invalidateInventoryCache("inventory:snapshot:v1");

  if (result.success) {
    await emitInventoryThresholdNotification(product);
  }

  return result;
}

export async function releaseInventory(product: { type: "FRAME" | "LENS" | "HEADLIGHT"; id: string }, qty = 1) {
  if (qty <= 0) return { success: false, message: "Invalid quantity" };

  const result = await prisma.$transaction(async (tx) => {
    if (product.type === "FRAME") {
      const row = await tx.frameInventory.findUnique({ where: { frameId: product.id } });
      if (!row) return { success: false, message: "Inventory record not found" };
      await tx.frameInventory.update({ where: { frameId: product.id }, data: { reserved: Math.max(0, row.reserved - qty) } });
      return { success: true };
    }

    if (product.type === "LENS") {
      const row = await tx.lensInventory.findUnique({ where: { lensId: product.id } });
      if (!row) return { success: false, message: "Inventory record not found" };
      await tx.lensInventory.update({ where: { lensId: product.id }, data: { reserved: Math.max(0, row.reserved - qty) } });
      return { success: true };
    }

    const row = await tx.headlightInventory.findUnique({ where: { headlightId: product.id } });
    if (!row) return { success: false, message: "Inventory record not found" };
    await tx.headlightInventory.update({ where: { headlightId: product.id }, data: { reserved: Math.max(0, row.reserved - qty) } });
    return { success: true };
  });

  invalidateInventoryCache("inventory:snapshot:v1");

  if (result.success) {
    await emitInventoryThresholdNotification(product);
  }

  return result;
}

export async function updateInventory(product: { type: "FRAME" | "LENS" | "HEADLIGHT"; id: string }, data: { quantity?: number; reserved?: number; lowStockThreshold?: number; status?: any }) {
  if (product.type === "FRAME") {
    const updateData = {
      ...(data.quantity != null ? { quantity: data.quantity } : {}),
      ...(data.reserved != null ? { reserved: data.reserved } : {}),
      ...(data.lowStockThreshold != null ? { lowStockThreshold: data.lowStockThreshold } : {}),
      ...(data.status != null ? { status: data.status } : {}),
    };

    const result = await prisma.frameInventory.upsert({
      where: { frameId: product.id },
      create: {
        frameId: product.id,
        quantity: data.quantity ?? 0,
        reserved: data.reserved ?? 0,
        lowStockThreshold: data.lowStockThreshold ?? 5,
        status: data.status ?? "IN_STOCK",
      },
      update: updateData,
    });

    invalidateInventoryCache("inventory:snapshot:v1");
    await emitInventoryThresholdNotification(product);
    return result;
  }

  if (product.type === "LENS") {
    const updateData = {
      ...(data.quantity != null ? { quantity: data.quantity } : {}),
      ...(data.reserved != null ? { reserved: data.reserved } : {}),
      ...(data.lowStockThreshold != null ? { lowStockThreshold: data.lowStockThreshold } : {}),
      ...(data.status != null ? { status: data.status } : {}),
    };

    const result = await prisma.lensInventory.upsert({
      where: { lensId: product.id },
      create: {
        lensId: product.id,
        quantity: data.quantity ?? 0,
        reserved: data.reserved ?? 0,
        lowStockThreshold: data.lowStockThreshold ?? 5,
        status: data.status ?? "IN_STOCK",
      },
      update: updateData,
    });

    invalidateInventoryCache("inventory:snapshot:v1");
    await emitInventoryThresholdNotification(product);
    return result;
  }

  const updateData = {
    ...(data.quantity != null ? { quantity: data.quantity } : {}),
    ...(data.reserved != null ? { reserved: data.reserved } : {}),
    ...(data.lowStockThreshold != null ? { lowStockThreshold: data.lowStockThreshold } : {}),
    ...(data.status != null ? { status: data.status } : {}),
  };

  const result = await prisma.headlightInventory.upsert({
    where: { headlightId: product.id },
    create: {
      headlightId: product.id,
      quantity: data.quantity ?? 0,
      reserved: data.reserved ?? 0,
      lowStockThreshold: data.lowStockThreshold ?? 5,
      status: data.status ?? "IN_STOCK",
    },
    update: updateData,
  });

  invalidateInventoryCache("inventory:snapshot:v1");
  await emitInventoryThresholdNotification(product);
  return result;
}

export async function validateInventory({ frameId, lensId, headlightId }: { frameId: string; lensId: string; headlightId?: string | null }) {
  const [f, l, h] = await Promise.all([
    getFrameAvailability(frameId),
    getLensAvailability(lensId),
    headlightId ? getHeadlightAvailability(headlightId) : Promise.resolve(null),
  ]);

  if (!f) return { success: false, code: "INVENTORY_MISSING", message: "Frame inventory record missing", field: "frameId" } as any;
  if (!l) return { success: false, code: "INVENTORY_MISSING", message: "Lens inventory record missing", field: "lensId" } as any;
  if (f.available <= 0) return { success: false, code: "OUT_OF_STOCK", message: "Selected frame is out of stock", field: "frameId" } as any;
  if (l.available <= 0) return { success: false, code: "OUT_OF_STOCK", message: "Selected lens is out of stock", field: "lensId" } as any;
  if (headlightId && (!h || h.available <= 0)) return { success: false, code: "OUT_OF_STOCK", message: "Selected headlight is out of stock", field: "headlightId" } as any;

  return { success: true };
}
