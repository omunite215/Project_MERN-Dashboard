import { describe, it, expect } from "bun:test";
import Product from "../src/models/Product.js";
import Transaction from "../src/models/Transaction.js";

describe("models", () => {
  it("Product model has expected schema paths", () => {
    expect(Product.schema.path("name")).toBeDefined();
    expect(Product.schema.path("price")).toBeDefined();
  });
  it("Transaction.products is an array path", () => {
    expect(Transaction.schema.path("products")).toBeDefined();
  });
});
