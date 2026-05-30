import { prisma } from "../../lib/prisma";
import type { InventoryStatus } from "../../lib/generated/prisma";

export type InventoryProductType = "FRAME" | "LENS" | "HEADLIGHT";

export async function setInventoryBySlug(
  type: InventoryProductType,
  slug: string,
  patch: {
    quantity: number;
    reserved?: number;
    lowStockThreshold?: number;
    status: InventoryStatus;
  }
) {
  if (type === "FRAME") {
    const product = await prisma.frame.findUnique({ where: { slug } });
    if (!product) throw new Error(`Frame not found for slug ${slug}`);

    return prisma.frameInventory.upsert({
      where: { frameId: product.id },
      create: {
        frameId: product.id,
        quantity: patch.quantity,
        reserved: patch.reserved ?? 0,
        lowStockThreshold: patch.lowStockThreshold ?? 5,
        status: patch.status,
      },
      update: {
        quantity: patch.quantity,
        reserved: patch.reserved,
        lowStockThreshold: patch.lowStockThreshold,
        status: patch.status,
      },
    });
  }

  if (type === "LENS") {
    const product = await prisma.lens.findUnique({ where: { slug } });
    if (!product) throw new Error(`Lens not found for slug ${slug}`);

    return prisma.lensInventory.upsert({
      where: { lensId: product.id },
      create: {
        lensId: product.id,
        quantity: patch.quantity,
        reserved: patch.reserved ?? 0,
        lowStockThreshold: patch.lowStockThreshold ?? 5,
        status: patch.status,
      },
      update: {
        quantity: patch.quantity,
        reserved: patch.reserved,
        lowStockThreshold: patch.lowStockThreshold,
        status: patch.status,
      },
    });
  }

  const product = await prisma.headlight.findUnique({ where: { slug } });
  if (!product) throw new Error(`Headlight not found for slug ${slug}`);

  return prisma.headlightInventory.upsert({
    where: { headlightId: product.id },
    create: {
      headlightId: product.id,
      quantity: patch.quantity,
      reserved: patch.reserved ?? 0,
      lowStockThreshold: patch.lowStockThreshold ?? 5,
      status: patch.status,
    },
    update: {
      quantity: patch.quantity,
      reserved: patch.reserved,
      lowStockThreshold: patch.lowStockThreshold,
      status: patch.status,
    },
  });
}

export async function getInventoryBySlug(type: InventoryProductType, slug: string) {
  if (type === "FRAME") {
    const product = await prisma.frame.findUnique({ where: { slug } });
    if (!product) return null;
    return prisma.frameInventory.findUnique({ where: { frameId: product.id } });
  }

  if (type === "LENS") {
    const product = await prisma.lens.findUnique({ where: { slug } });
    if (!product) return null;
    return prisma.lensInventory.findUnique({ where: { lensId: product.id } });
  }

  const product = await prisma.headlight.findUnique({ where: { slug } });
  if (!product) return null;
  return prisma.headlightInventory.findUnique({ where: { headlightId: product.id } });
}
