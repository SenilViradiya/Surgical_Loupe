import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().min(2, "Title is required"),
    slug: z.string().min(2, "Slug is required"),
    description: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    location: z.string().min(2, "Location is required"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type EventInput = z.infer<typeof eventSchema>;
