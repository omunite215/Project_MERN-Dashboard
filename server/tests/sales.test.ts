import { describe, it, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import request from "supertest";
import { connectTestDB, closeTestDB, makeApp } from "./helpers/testApp.js";
import { signAccessToken } from "../src/utils/tokens.js";
import OverallStat from "../src/models/OverallStat.js";

let token: string;

beforeAll(async () => {
  await connectTestDB();
  token = await signAccessToken({ sub: "u1", role: "user", tokenVersion: 0 });
});
afterAll(closeTestDB);
beforeEach(async () => { await OverallStat.deleteMany({}); });

describe("GET /sales/sales", () => {
  it("404s when there are no overall stats", async () => {
    const res = await request(makeApp()).get("/sales/sales").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
  it("returns the first overall stat document", async () => {
    await OverallStat.create({ year: 2021, totalCustomers: 10, yearlySalesTotal: 100, yearlyTotalSoldUnits: 5 });
    const res = await request(makeApp()).get("/sales/sales").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.year).toBe(2021);
  });
});
