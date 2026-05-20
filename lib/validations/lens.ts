import { z } from "zod";

import { ProductStatus } from "@/lib/generated/prisma";

export const lensSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required"),

  slug: z
    .string()
    .min(2, "Slug is required"),

  description: z.string().optional(),

  thumbnailUrl: z.string().optional(),

  modelUrl: z.string().optional(),

  magnification: z
    .string()
    .min(1, "Magnification is required"),

  price: z.coerce
    .number()
    .min(1, "Price required"),

  status: z.nativeEnum(ProductStatus),
});

export type LensInput =
  z.infer<typeof lensSchema>;
