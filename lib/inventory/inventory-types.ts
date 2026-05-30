import type { FrameInventory, LensInventory, HeadlightInventory } from "@/lib/generated/prisma";

export type InventoryStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "DISCONTINUED";

export interface InventoryRecord {
  id: string;
  productId: string;
  quantity: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
  status: InventoryStatus;
  updatedAt: string;
}

export interface InventorySnapshot {
  frames: InventoryRecord[];
  lenses: InventoryRecord[];
  headlights: InventoryRecord[];
  generatedAt: string;
}
