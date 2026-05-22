import { z } from "zod";

export const settingsSchema = z.object({
  siteTitle: z.string().min(1).optional(),
  supportEmail: z.string().email().optional(),
  supportPhone: z.string().optional(),
  defaultFromName: z.string().optional(),
  enableRegistration: z.boolean().optional(),
});

export type Settings = z.infer<typeof settingsSchema>;
