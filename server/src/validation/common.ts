import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const objectIdParam = z.object({
  id: z.string().refine((v) => isValidObjectId(v), { message: "Invalid id" }),
});
