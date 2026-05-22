import { z } from "zod";

export const leadSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(6, "Phone is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().min(3, "Pincode is required"),
  configurationId: z.string().min(1, "configurationId is required"),
});

export type LeadInput = z.infer<typeof leadSchema>;
