import { z } from "zod";
export const productFormSchema = z.object({
  name: z.string().min(1, "Required").max(200),
  price: z.coerce.number().nonnegative("Must be ≥ 0"),
  description: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  rating: z.coerce.number().min(0).max(5),
  supply: z.coerce.number().int().nonnegative(),
});
export type ProductFormValues = z.infer<typeof productFormSchema>;
