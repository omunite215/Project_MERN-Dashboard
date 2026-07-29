import { describe, it, expect } from "vitest";
import { productFormSchema } from "./product";

describe("productFormSchema", () => {
  it("accepts valid input and coerces numbers", () => {
    const r = productFormSchema.safeParse({ name: "W", price: "9.99", description: "d", category: "c", rating: "4", supply: "3" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.price).toBe(9.99);
  });
  it("rejects empty name and negative price", () => {
    expect(productFormSchema.safeParse({ name: "", price: -1, description: "d", category: "c", rating: 1, supply: 1 }).success).toBe(false);
  });
});
