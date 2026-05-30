import { z } from "zod";

export const configurationSchema = z.object({
  frameId: z.string().min(1, "frameId is required"),
  lensId: z.string().min(1, "lensId is required"),
  headlightId: z.string().nullable().optional(),
});

export type ConfigurationInput = z.infer<typeof configurationSchema>;
