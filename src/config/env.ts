import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(5000),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required"),

  // Better Auth
  BETTER_AUTH_SECRET: z
    .string()
    .min(1, "BETTER_AUTH_SECRET is required"),

  BETTER_AUTH_URL: z
    .url("BETTER_AUTH_URL must be a valid URL"),

  // JWT
  ACCESS_TOKEN_SECRET: z
    .string()
    .min(1, "ACCESS_TOKEN_SECRET is required"),

  REFRESH_TOKEN_SECRET: z
    .string()
    .min(1, "REFRESH_TOKEN_SECRET is required"),

  ACCESS_TOKEN_EXPIRES_IN: z.string().min(1),
  REFRESH_TOKEN_EXPIRES_IN: z.string().min(1),
  //-------------- SMTP Configuration --------------
  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().min(1, "SMTP_USER is required"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),

  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  FRONTEND_URL: z.string().url("FRONTEND_URL must be a valid URL"),

});

const parsedEnv = envSchema.safeParse(process.env);


if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:");

  console.error(parsedEnv.error.flatten().fieldErrors);

  process.exit(1);
}

export const env = parsedEnv.data;