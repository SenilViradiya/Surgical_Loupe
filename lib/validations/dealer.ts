import { z } from "zod";

export const dealerProfileSchema = z.object({
  companyName: z.string().optional(),

  businessDetails: z.string().optional(),

  address: z.string().optional(),

  serviceRegions: z.string().optional(),

  phone: z.string().optional(),

  city: z.string().optional(),

  state: z.string().optional(),
  photoUrl: z.string().optional(),
  
});

export type DealerProfileInput = z.infer<typeof dealerProfileSchema>;
