import { ProductStatus } from "@/lib/generated/prisma";

export interface FrameFormValues {
  name: string;

  slug: string;

  description?: string;

  thumbnailUrl?: string;

  modelUrl: string;

  price: number;

  status: ProductStatus;
}