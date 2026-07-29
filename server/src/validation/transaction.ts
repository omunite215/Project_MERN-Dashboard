import { z } from "zod";

export const transactionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().default(""),
  sort: z
    .string()
    .optional()
    .transform((raw, ctx) => {
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw) as { field: string; sort: "asc" | "desc" };
        return parsed;
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "sort must be valid JSON" });
        return z.NEVER;
      }
    }),
});

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
