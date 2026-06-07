import { z } from "zod";

import { ProductStatus } from "@/lib/generated/prisma";

export const frameSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required"),

  slug: z
    .string()
    .min(2, "Slug is required"),

  description: z.string().optional(),

  thumbnailUrl: z.string().optional(),

  modelUrl: z
    .string()
    .min(1, "Model URL required"),

  price: z.coerce
    .number()
    .min(1, "Price required"),

  status: z.nativeEnum(ProductStatus),
});

export type FrameInput =
  z.infer<typeof frameSchema>;
