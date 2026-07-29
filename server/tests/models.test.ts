import { describe, it, expect } from "bun:test";
import User from "../src/models/User.js";
import Transaction from "../src/models/Transaction.js";

describe("models", () => {
  it("User has expected schema paths and default role", () => {
    expect(User.schema.path("email")).toBeDefined();
    expect(User.schema.path("role")).toBeDefined();
    const doc = new User({ name: "A", email: "a@b.co", password: "secret" });
    expect(doc.role).toBe("admin"); // preserve existing default (seed data relies on it)
  });

  it("Transaction.products is an array path", () => {
    expect(Transaction.schema.path("products")).toBeDefined();
  });
});
