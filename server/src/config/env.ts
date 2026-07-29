import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5001),
  MONGODB_URL: z.string().min(1, "MONGODB_URL is required"),
  CLIENT_ORIGIN: z
    .string()
    .default("http://localhost:3000")
    .transform((s) => s.split(",").map((o) => o.trim()).filter(Boolean)),
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL: z.string().default("7d"),
  COOKIE_SECURE: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  COOKIE_SAMESITE: z.enum(["lax", "none", "strict"]).default("lax"),
  COOKIE_DOMAIN: z.string().optional(),
  TRUST_PROXY: z.coerce.number().default(1),
});

export type Env = z.infer<typeof EnvSchema>;

export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const result = EnvSchema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${issues}`);
  }
  return result.data;
}

let _env: Env | undefined;
export const env: Env = new Proxy({} as Env, {
  get(_target, prop) {
    if (!_env) _env = parseEnv(process.env);
    return (_env as Record<string | symbol, unknown>)[prop];
  },
});
