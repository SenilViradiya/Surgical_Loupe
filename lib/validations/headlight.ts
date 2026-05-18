import { z } from "zod";

import { ProductStatus } from "@/lib/generated/prisma";

export const headlightSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required"),

  slug: z
    .string()
    .min(2, "Slug is required"),

  description: z.string().optional(),

  thumbnailUrl: z.string().optional(),

  modelUrl: z.string().optional(),

  price: z.coerce
    .number()
    .min(1, "Price required"),

  status: z.nativeEnum(ProductStatus),
});

export type HeadlightInput =
  z.infer<typeof headlightSchema>;
