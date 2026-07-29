import { z } from "zod";

const schema = z.object({
  VITE_BASE_URL: z.string().url().default("http://localhost:5001"),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error(
    `Invalid frontend env: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
  );
}

export const env = { BASE_URL: parsed.data.VITE_BASE_URL };
