import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().default('8000'),
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string().optional(),
  API_KEY: z.string().optional(),
  JWT_SECRET: z.string().default('default-secret-change-in-production'),
});

export type AppEnvVariables = z.infer<typeof envSchema>;
