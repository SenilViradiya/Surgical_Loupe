import { z } from "zod";

import process from "process";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),

  AUTH_SECRET: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
