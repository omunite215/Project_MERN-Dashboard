import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().nonnegative(),
  description: z.string().min(1),
  category: z.string().min(1),
  rating: z.number().min(0).max(5),
  supply: z.number().int().nonnegative(),
});
export const updateProductSchema = createProductSchema.partial();
