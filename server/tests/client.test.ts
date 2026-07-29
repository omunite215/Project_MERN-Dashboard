import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { connectTestDB, closeTestDB, makeApp } from "./helpers/testApp.js";
import User from "../src/models/User.js";
import Transaction from "../src/models/Transaction.js";

beforeAll(connectTestDB);
afterAll(closeTestDB);
beforeEach(async () => {
  await User.deleteMany({});
  await Transaction.deleteMany({});
});

describe("GET /client/customers", () => {
  it("returns only role:user and omits password", async () => {
    await User.create({ name: "U", email: "u@x.co", password: "secret", role: "user", country: "US" });
    await User.create({ name: "A", email: "a@x.co", password: "secret", role: "admin", country: "US" });
    const res = await request(makeApp()).get("/client/customers");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].password).toBeUndefined();
  });
});

describe("GET /client/transactions", () => {
  it("paginates from page 1 correctly and reports total for the same filter", async () => {
    for (let i = 0; i < 25; i++) {
      await Transaction.create({ userId: `user${i}`, cost: `${i}` });
    }
    const res = await request(makeApp()).get("/client/transactions?page=1&pageSize=20");
    expect(res.status).toBe(200);
    expect(res.body.transactions).toHaveLength(20); // page 1 shows first 20, not skipped past all
    expect(res.body.total).toBe(25);               // total uses the same $or filter, not a wrong field
  });

  it("400s on malformed sort instead of crashing", async () => {
    const res = await request(makeApp()).get("/client/transactions?sort=not-json");
    expect(res.status).toBe(400);
  });
});

describe("GET /client/geography", () => {
  it("maps ISO2 countries to ISO3 counts", async () => {
    await User.create({ name: "U1", email: "u1@x.co", password: "secret", country: "US" });
    await User.create({ name: "U2", email: "u2@x.co", password: "secret", country: "US" });
    const res = await request(makeApp()).get("/client/geography");
    expect(res.status).toBe(200);
    expect(res.body).toContainEqual({ id: "USA", value: 2 });
  });
});
